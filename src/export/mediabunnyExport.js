import {
  AudioBufferSource,
  BufferTarget,
  CanvasSource,
  canEncodeAudio,
  canEncodeVideo,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
} from "mediabunny";
import { computeTimelineDuration, getClipAtPlayhead, getMusicAsset } from "../editor/timeline.js";

export class ExportCanceledError extends Error {
  constructor() {
    super("Export canceled");
    this.name = "ExportCanceledError";
  }
}

function throwIfCanceled(signal) {
  if (signal?.aborted) {
    throw new ExportCanceledError();
  }
}

function defaultCanvasFactory(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function fillRoundedRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    return;
  }

  ctx.fillRect(x, y, width, height);
}

function drawCover(ctx, image, width, height) {
  const sourceWidth = image.videoWidth || image.naturalWidth || image.width || width;
  const sourceHeight = image.videoHeight || image.naturalHeight || image.height || height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = (height - drawHeight) / 2;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function createImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve({ kind: "image", element: image });
    image.onerror = reject;
    image.src = src;
  });
}

function createVideo(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "auto";
    video.playsInline = true;
    video.onloadedmetadata = () => resolve({ kind: "video", element: video });
    video.onerror = reject;
    video.src = src;
  });
}

async function defaultLoadVisual(asset) {
  if (asset?.objectUrl && asset.kind === "video" && !asset.reselectRequired) {
    return createVideo(asset.objectUrl);
  }

  if (asset?.posterSrc) {
    return createImage(asset.posterSrc);
  }

  return { kind: "placeholder", title: asset?.name || "Missing media" };
}

function seekVideo(video, seconds) {
  return new Promise((resolve) => {
    const target = Math.min(Math.max(0, seconds), Math.max(0, video.duration || seconds));
    const done = () => {
      video.removeEventListener("seeked", done);
      resolve();
    };
    video.addEventListener("seeked", done, { once: true });
    video.currentTime = target;
  });
}

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.OfflineAudioContext || window.webkitOfflineAudioContext || null;
}

function createSyntheticMusicBuffer(durationSeconds, volume) {
  const OfflineContext = getAudioContext();
  if (!OfflineContext) {
    return null;
  }

  const sampleRate = 44100;
  const length = Math.max(1, Math.ceil(durationSeconds * sampleRate));
  const context = new OfflineContext(2, length, sampleRate);
  const buffer = context.createBuffer(2, length, sampleRate);
  const frequency = 104;

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      const t = index / sampleRate;
      const envelope = Math.min(1, t / 0.35, (durationSeconds - t) / 0.35);
      data[index] = Math.sin(t * frequency * Math.PI * 2) * 0.08 * volume * Math.max(0, envelope);
    }
  }

  return buffer;
}

function drawPlaceholder(ctx, width, height, title) {
  const gradient = ctx.createLinearGradient?.(0, 0, 0, height);
  if (gradient) {
    gradient.addColorStop(0, "#243140");
    gradient.addColorStop(1, "#0d1118");
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = "#111820";
  }
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "700 54px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, height / 2);
}

async function drawVisual(ctx, visual, width, height, localSeconds) {
  if (visual?.kind === "video") {
    await seekVideo(visual.element, localSeconds);
    drawCover(ctx, visual.element, width, height);
    return;
  }

  if (visual?.kind === "image") {
    drawCover(ctx, visual.element, width, height);
    return;
  }

  drawPlaceholder(ctx, width, height, visual?.title || "Missing media");
}

function drawOverlay(ctx, overlay, width, height) {
  const text = overlay.text.trim();
  if (!text) {
    return;
  }

  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "700 56px Inter, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const boxWidth = Math.min(width - 96, metrics.width + 96);
  const boxHeight = 116;
  const x = (width - boxWidth) / 2;
  const y = overlay.position === "top" ? 132 : overlay.position === "center" ? (height - boxHeight) / 2 : height - 260;

  ctx.fillStyle = "rgba(7, 10, 14, 0.76)";
  fillRoundedRect(ctx, x, y, boxWidth, boxHeight, 28);
  ctx.fillStyle = "#f7fbff";
  ctx.fillText(text, width / 2, y + 72);
  ctx.restore();
}

function drawSafeZones(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 3;
  if (ctx.strokeRect) {
    ctx.strokeRect(64, 132, width - 128, height - 264);
  }
  ctx.restore();
}

async function renderFrame({ canvas, ctx, frameTime, project, visuals }) {
  const clip = getClipAtPlayhead(project, frameTime);
  const asset = project.mediaAssets.find((item) => item.id === clip?.assetId);
  const localSeconds = clip ? clip.sourceInSeconds + (frameTime - clip.startSeconds) : 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await drawVisual(ctx, visuals.get(asset?.id), canvas.width, canvas.height, localSeconds);
  drawSafeZones(ctx, canvas.width, canvas.height);

  project.textOverlays
    .filter((overlay) => frameTime >= overlay.startSeconds && frameTime < overlay.startSeconds + overlay.durationSeconds)
    .forEach((overlay) => drawOverlay(ctx, overlay, canvas.width, canvas.height));
}

export function buildExportPlan(project) {
  const durationSeconds = computeTimelineDuration(project);
  const frameCount = Math.ceil(durationSeconds * project.fps);

  return {
    width: project.width,
    height: project.height,
    fps: project.fps,
    durationSeconds,
    frameCount,
    music: project.musicTrack.enabled ? project.musicTrack : null,
    overlays: project.textOverlays,
    clips: project.timelineClips,
  };
}

export async function exportTimelineProject(project, options = {}) {
  const deps = {
    AudioBufferSource,
    BufferTarget,
    CanvasSource,
    Mp4OutputFormat,
    Output,
    QUALITY_HIGH,
    canEncodeAudio,
    canEncodeVideo,
    createAudioBuffer: createSyntheticMusicBuffer,
    createCanvas: defaultCanvasFactory,
    loadVisual: defaultLoadVisual,
    ...options.deps,
  };
  const { onProgress, signal } = options;
  throwIfCanceled(signal);

  const plan = buildExportPlan(project);
  const [videoSupported, audioSupported] = await Promise.all([
    deps.canEncodeVideo("avc", {
      width: plan.width,
      height: plan.height,
      bitrate: deps.QUALITY_HIGH,
    }),
    deps.canEncodeAudio("aac", {
      numberOfChannels: 2,
      sampleRate: 44100,
      bitrate: deps.QUALITY_HIGH,
    }),
  ]);

  if (!videoSupported || !audioSupported) {
    throw new Error("This browser cannot encode the required MP4 video/audio tracks.");
  }

  const canvas = deps.createCanvas(plan.width, plan.height);
  canvas.width = plan.width;
  canvas.height = plan.height;
  const ctx = canvas.getContext("2d");
  const target = new deps.BufferTarget();
  const output = new deps.Output({
    format: new deps.Mp4OutputFormat({ fastStart: "in-memory" }),
    target,
  });
  const videoSource = new deps.CanvasSource(canvas, {
    codec: "avc",
    bitrate: deps.QUALITY_HIGH,
  });
  const audioSource = new deps.AudioBufferSource({
    codec: "aac",
    bitrate: deps.QUALITY_HIGH,
    numberOfChannels: 2,
    sampleRate: 44100,
  });

  output.addVideoTrack(videoSource, { frameRate: project.fps });
  output.addAudioTrack(audioSource);
  await output.start();

  const visuals = new Map();
  for (const clip of project.timelineClips) {
    const asset = project.mediaAssets.find((item) => item.id === clip.assetId);
    if (asset && !visuals.has(asset.id)) {
      visuals.set(asset.id, await deps.loadVisual(asset));
    }
  }

  onProgress?.({ stage: "rendering", progress: 0 });
  for (let frame = 0; frame < plan.frameCount; frame += 1) {
    throwIfCanceled(signal);
    const timestamp = frame / project.fps;
    const frameDuration = 1 / project.fps;
    await renderFrame({ canvas, ctx, frameTime: timestamp, project, visuals });
    await videoSource.add(timestamp, frameDuration);

    if (frame % Math.max(1, Math.floor(plan.frameCount / 20)) === 0) {
      onProgress?.({ stage: "rendering", progress: frame / plan.frameCount });
    }
  }

  const musicAsset = getMusicAsset(project);
  if (plan.music && musicAsset) {
    const audioBuffer = deps.createAudioBuffer(plan.durationSeconds, plan.music.volume, musicAsset, project);
    if (audioBuffer) {
      await audioSource.add(audioBuffer);
    }
  }

  onProgress?.({ stage: "encoding", progress: 0.96 });
  await output.finalize();
  const mimeType = await output.getMimeType();
  const blob = new Blob([target.buffer], { type: mimeType });
  const result = {
    blob,
    durationSeconds: plan.durationSeconds,
    fileName: "viralforge-summer-glow-9x16.mp4",
    mimeType,
    width: plan.width,
    height: plan.height,
  };

  onProgress?.({ stage: "complete", progress: 1, result });
  return result;
}
