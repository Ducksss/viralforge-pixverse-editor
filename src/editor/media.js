import { ALL_FORMATS, BlobSource, Input } from "mediabunny";

let uploadId = 0;

function nextUploadId(file) {
  uploadId += 1;
  const stem = file.name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `upload-${stem || "media"}-${uploadId}`;
}

function inferKind(file) {
  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  return "video";
}

function safeObjectUrl(file, createObjectURL) {
  if (createObjectURL) {
    return createObjectURL(file);
  }

  if (typeof URL !== "undefined" && URL.createObjectURL) {
    return URL.createObjectURL(file);
  }

  return "";
}

function fallbackAsset(file, deps, warning) {
  const kind = inferKind(file);
  return {
    id: deps.idFactory?.(file) || nextUploadId(file),
    kind,
    sourceType: "upload",
    name: file.name,
    durationSeconds: kind === "audio" ? 30 : 6,
    width: kind === "video" ? 1080 : undefined,
    height: kind === "video" ? 1920 : undefined,
    frameRate: kind === "video" ? 30 : undefined,
    objectUrl: safeObjectUrl(file, deps.createObjectURL),
    file,
    size: file.size,
    mimeType: file.type,
    warning,
  };
}

export async function inspectMediaFile(file, deps = {}) {
  const MediabunnyInput = deps.Input || Input;
  const MediabunnyBlobSource = deps.BlobSource || BlobSource;
  const formats = deps.formats || ALL_FORMATS;

  try {
    const input = new MediabunnyInput({
      source: new MediabunnyBlobSource(file),
      formats,
    });
    const canRead = await input.canRead();

    if (!canRead) {
      return fallbackAsset(
        file,
        deps,
        "Metadata could not be parsed; using a safe editable placeholder.",
      );
    }

    const [duration, videoTrack, audioTrack] = await Promise.all([
      input.computeDuration(),
      input.getPrimaryVideoTrack?.() || null,
      input.getPrimaryAudioTrack?.() || null,
    ]);
    const kind = videoTrack ? "video" : "audio";
    const metadata = {
      id: deps.idFactory?.(file) || nextUploadId(file),
      kind,
      sourceType: "upload",
      name: file.name,
      durationSeconds: Math.max(0.5, Math.round(duration * 100) / 100),
      objectUrl: safeObjectUrl(file, deps.createObjectURL),
      file,
      size: file.size,
      mimeType: file.type,
    };

    if (videoTrack) {
      const [width, height, rotation, stats] = await Promise.all([
        videoTrack.getDisplayWidth(),
        videoTrack.getDisplayHeight(),
        videoTrack.getRotation(),
        videoTrack.computePacketStats?.(100) || null,
      ]);
      return {
        ...metadata,
        width,
        height,
        rotation,
        frameRate: stats?.averagePacketRate || 30,
      };
    }

    if (audioTrack) {
      const [sampleRate, channels] = await Promise.all([
        audioTrack.getSampleRate?.() || 44100,
        audioTrack.getNumberOfChannels?.() || 2,
      ]);
      return {
        ...metadata,
        sampleRate,
        channels,
      };
    }

    return fallbackAsset(
      file,
      deps,
      "Metadata could not be parsed; using a safe editable placeholder.",
    );
  } catch {
    return fallbackAsset(
      file,
      deps,
      "Metadata could not be parsed; using a safe editable placeholder.",
    );
  }
}
