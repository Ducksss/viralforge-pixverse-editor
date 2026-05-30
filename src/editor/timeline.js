export const TIMELINE_STORAGE_VERSION = 1;
export const OUTPUT_WIDTH = 1080;
export const OUTPUT_HEIGHT = 1920;
export const OUTPUT_FPS = 30;

/**
 * @typedef {Object} MediaAsset
 * @property {string} id
 * @property {"video" | "audio" | "image" | "text"} kind
 * @property {"sample" | "upload" | "generated"} sourceType
 * @property {string} name
 * @property {number} durationSeconds
 * @property {string=} assetKey
 * @property {string=} posterSrc
 * @property {string=} objectUrl
 * @property {File=} file
 * @property {boolean=} reselectRequired
 * @property {string=} unavailableReason
 */

/**
 * @typedef {Object} TimelineClip
 * @property {string} id
 * @property {string} assetId
 * @property {string} trackId
 * @property {string} title
 * @property {number} startSeconds
 * @property {number} sourceInSeconds
 * @property {number} sourceOutSeconds
 * @property {number} durationSeconds
 */

/**
 * @typedef {Object} MusicTrack
 * @property {string} assetId
 * @property {boolean} enabled
 * @property {number} trimStartSeconds
 * @property {number} volume
 */

/**
 * @typedef {Object} TextOverlay
 * @property {string} id
 * @property {string} text
 * @property {number} startSeconds
 * @property {number} durationSeconds
 * @property {"bottom" | "center" | "top"} position
 */

/**
 * @typedef {Object} TimelineProject
 * @property {string} id
 * @property {string} title
 * @property {"9:16" | "16:9" | "1:1"} aspectRatio
 * @property {number} width
 * @property {number} height
 * @property {number} fps
 * @property {MediaAsset[]} mediaAssets
 * @property {TimelineClip[]} timelineClips
 * @property {MusicTrack} musicTrack
 * @property {TextOverlay[]} textOverlays
 * @property {Array<{id: string, atSeconds: number, label: string, kind: string}>} commerceMarkers
 * @property {string} selectedClipId
 * @property {number} playheadSeconds
 */

export const sampleMediaAssets = [
  {
    id: "sample-citrus-hook",
    kind: "video",
    sourceType: "sample",
    name: "Citrus Hook",
    assetKey: "shotProduct",
    durationSeconds: 5,
    width: 1080,
    height: 1920,
    tags: ["hook", "product"],
  },
  {
    id: "sample-dropper-texture",
    kind: "video",
    sourceType: "sample",
    name: "Dropper Texture",
    assetKey: "shotDropper",
    durationSeconds: 6,
    width: 1080,
    height: 1920,
    tags: ["texture", "macro"],
  },
  {
    id: "sample-creator-proof",
    kind: "video",
    sourceType: "sample",
    name: "Creator Proof",
    assetKey: "shotModel",
    durationSeconds: 6,
    width: 1080,
    height: 1920,
    tags: ["creator", "proof"],
  },
  {
    id: "sample-ingredient-bridge",
    kind: "video",
    sourceType: "sample",
    name: "Ingredient Bridge",
    assetKey: "shotBubbles",
    durationSeconds: 6,
    width: 1080,
    height: 1920,
    tags: ["ingredient", "benefit"],
  },
  {
    id: "sample-social-proof",
    kind: "video",
    sourceType: "sample",
    name: "Social Proof",
    assetKey: "shotSocial",
    durationSeconds: 6,
    width: 1080,
    height: 1920,
    tags: ["ugc", "result"],
  },
  {
    id: "sample-final-bottle",
    kind: "video",
    sourceType: "sample",
    name: "Final Bottle CTA",
    assetKey: "shotBottle",
    durationSeconds: 7,
    width: 1080,
    height: 1920,
    tags: ["cta", "product"],
  },
  {
    id: "music-glass-skin",
    kind: "audio",
    sourceType: "sample",
    name: "Glass Skin Pulse",
    durationSeconds: 45,
    bpm: 104,
    mood: "clean pop",
  },
  {
    id: "music-clean-glow",
    kind: "audio",
    sourceType: "sample",
    name: "Clean Glow Loop",
    durationSeconds: 60,
    bpm: 96,
    mood: "soft house",
  },
];

const initialClipSpecs = [
  ["clip-citrus-hook", "sample-citrus-hook"],
  ["clip-dropper-texture", "sample-dropper-texture"],
  ["clip-creator-proof", "sample-creator-proof"],
  ["clip-ingredient-bridge", "sample-ingredient-bridge"],
];

function roundSeconds(value) {
  return Math.round(value * 100) / 100;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cloneAsset(asset) {
  return { ...asset };
}

function getAsset(project, assetId) {
  return project.mediaAssets.find((asset) => asset.id === assetId);
}

function sequenceClips(clips) {
  let cursor = 0;
  return clips.map((clip) => {
    const sequenced = {
      ...clip,
      startSeconds: roundSeconds(cursor),
      durationSeconds: roundSeconds(clip.sourceOutSeconds - clip.sourceInSeconds),
    };
    cursor += sequenced.durationSeconds;
    return sequenced;
  });
}

function createClipFromAsset(asset, existingClips, overrides = {}) {
  const sourceInSeconds = Math.max(0, overrides.sourceInSeconds ?? 0);
  const sourceOutSeconds = Math.max(
    sourceInSeconds + 0.5,
    Math.min(asset.durationSeconds || 6, overrides.sourceOutSeconds ?? asset.durationSeconds ?? 6),
  );
  const baseId = `clip-${slugify(asset.name)}`;
  const existingIds = new Set(existingClips.map((clip) => clip.id));
  let id = overrides.id || baseId;
  let copy = 2;

  while (existingIds.has(id)) {
    id = `${baseId}-${copy}`;
    copy += 1;
  }

  return {
    id,
    assetId: asset.id,
    trackId: "V1",
    title: asset.name,
    startSeconds: 0,
    sourceInSeconds: roundSeconds(sourceInSeconds),
    sourceOutSeconds: roundSeconds(sourceOutSeconds),
    durationSeconds: roundSeconds(sourceOutSeconds - sourceInSeconds),
    commerceRole: asset.tags?.[0] || "clip",
  };
}

export function createInitialTimelineProject() {
  const mediaAssets = sampleMediaAssets.map(cloneAsset);
  const clips = initialClipSpecs.map(([id, assetId]) => {
    const asset = mediaAssets.find((item) => item.id === assetId);
    return createClipFromAsset(asset, [], { id });
  });

  return {
    id: "viralforge-summer-glow-edit",
    title: "Summer Glow Social Edit",
    storageVersion: TIMELINE_STORAGE_VERSION,
    aspectRatio: "9:16",
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    fps: OUTPUT_FPS,
    mediaAssets,
    timelineClips: sequenceClips(clips),
    musicTrack: {
      assetId: "music-glass-skin",
      enabled: true,
      trimStartSeconds: 0,
      volume: 0.42,
    },
    textOverlays: [
      {
        id: "overlay-main-cta",
        text: "bundle drop + real texture proof",
        startSeconds: 3,
        durationSeconds: 8,
        position: "bottom",
      },
    ],
    commerceMarkers: [
      { id: "marker-hook", atSeconds: 0, kind: "hook", label: "Hook" },
      { id: "marker-texture", atSeconds: 5, kind: "product", label: "Texture proof" },
      { id: "marker-cta", atSeconds: 17, kind: "cta", label: "Shopee CTA" },
    ],
    selectedClipId: "clip-citrus-hook",
    selectedOverlayId: "overlay-main-cta",
    playheadSeconds: 0,
  };
}

export function computeTimelineDuration(project) {
  const clipEnd = project.timelineClips.reduce(
    (max, clip) => Math.max(max, clip.startSeconds + clip.durationSeconds),
    0,
  );
  const overlayEnd = project.textOverlays.reduce(
    (max, overlay) => Math.max(max, overlay.startSeconds + overlay.durationSeconds),
    0,
  );
  return roundSeconds(Math.max(clipEnd, overlayEnd));
}

export function addAssetToTimeline(project, assetId) {
  const asset = getAsset(project, assetId);
  if (!asset || asset.kind === "audio") {
    return project;
  }

  const nextClip = createClipFromAsset(asset, project.timelineClips);
  const timelineClips = sequenceClips([...project.timelineClips, nextClip]);

  return {
    ...project,
    timelineClips,
    selectedClipId: nextClip.id,
    playheadSeconds: timelineClips.at(-1).startSeconds,
  };
}

export function reorderTimelineClip(project, activeClipId, overClipId) {
  if (activeClipId === overClipId) {
    return project;
  }

  const fromIndex = project.timelineClips.findIndex((clip) => clip.id === activeClipId);
  const toIndex = project.timelineClips.findIndex((clip) => clip.id === overClipId);
  if (fromIndex < 0 || toIndex < 0) {
    return project;
  }

  const clips = [...project.timelineClips];
  const [active] = clips.splice(fromIndex, 1);
  clips.splice(toIndex, 0, active);
  const timelineClips = sequenceClips(clips);
  const selected = timelineClips.find((clip) => clip.id === activeClipId);

  return {
    ...project,
    timelineClips,
    selectedClipId: activeClipId,
    playheadSeconds: selected?.startSeconds ?? project.playheadSeconds,
  };
}

export function trimTimelineClip(project, clipId, nextTrim) {
  const timelineClips = project.timelineClips.map((clip) => {
    if (clip.id !== clipId) {
      return clip;
    }

    const asset = getAsset(project, clip.assetId);
    const assetDuration = asset?.durationSeconds || clip.sourceOutSeconds;
    const requestedIn = nextTrim.sourceInSeconds ?? clip.sourceInSeconds;
    const requestedOut = nextTrim.sourceOutSeconds ?? clip.sourceOutSeconds;
    const sourceInSeconds = roundSeconds(Math.min(Math.max(0, requestedIn), Math.max(0, assetDuration - 0.5)));
    const sourceOutSeconds = roundSeconds(Math.min(assetDuration, Math.max(sourceInSeconds + 0.5, requestedOut)));

    return {
      ...clip,
      sourceInSeconds,
      sourceOutSeconds,
      durationSeconds: roundSeconds(sourceOutSeconds - sourceInSeconds),
    };
  });
  const sequenced = sequenceClips(timelineClips);
  const selected = sequenced.find((clip) => clip.id === clipId);

  return {
    ...project,
    timelineClips: sequenced,
    selectedClipId: clipId,
    playheadSeconds: selected?.startSeconds ?? project.playheadSeconds,
  };
}

export function getClipAtPlayhead(project, seconds) {
  if (project.timelineClips.length === 0) {
    return null;
  }

  const safeSeconds = Math.max(0, seconds);
  return (
    project.timelineClips.find((clip) => (
      safeSeconds >= clip.startSeconds &&
      safeSeconds < clip.startSeconds + clip.durationSeconds
    )) || project.timelineClips.at(-1)
  );
}

export function updateMusicTrack(project, changes) {
  return {
    ...project,
    musicTrack: {
      ...project.musicTrack,
      ...changes,
      enabled: changes.enabled ?? true,
      trimStartSeconds: roundSeconds(Math.max(0, changes.trimStartSeconds ?? project.musicTrack.trimStartSeconds)),
      volume: Math.min(1, Math.max(0, changes.volume ?? project.musicTrack.volume)),
    },
  };
}

export function updateTextOverlay(project, overlayId, changes) {
  const duration = computeTimelineDuration(project);
  return {
    ...project,
    textOverlays: project.textOverlays.map((overlay) => {
      if (overlay.id !== overlayId) {
        return overlay;
      }

      const startSeconds = roundSeconds(Math.max(0, changes.startSeconds ?? overlay.startSeconds));
      const maxDuration = Math.max(0.5, duration - startSeconds);
      const durationSeconds = roundSeconds(Math.min(maxDuration, Math.max(0.5, changes.durationSeconds ?? overlay.durationSeconds)));

      return {
        ...overlay,
        ...changes,
        text: changes.text ?? overlay.text,
        startSeconds,
        durationSeconds,
      };
    }),
  };
}

export function addMediaAsset(project, asset) {
  if (project.mediaAssets.some((item) => item.id === asset.id)) {
    return project;
  }

  return {
    ...project,
    mediaAssets: [...project.mediaAssets, asset],
  };
}

export function selectTimelineClip(project, clipId) {
  const clip = project.timelineClips.find((item) => item.id === clipId);
  if (!clip) {
    return project;
  }

  return {
    ...project,
    selectedClipId: clipId,
    playheadSeconds: clip.startSeconds,
  };
}

export function setPlayhead(project, seconds) {
  const duration = computeTimelineDuration(project);
  const playheadSeconds = roundSeconds(Math.min(duration, Math.max(0, seconds)));
  const clip = getClipAtPlayhead(project, playheadSeconds);
  return {
    ...project,
    playheadSeconds,
    selectedClipId: clip?.id ?? project.selectedClipId,
  };
}

export function serializeTimelineProject(project) {
  return {
    ...project,
    storageVersion: TIMELINE_STORAGE_VERSION,
    mediaAssets: project.mediaAssets.map((asset) => {
      const { file, objectUrl, ...serializable } = asset;
      if (asset.sourceType !== "upload") {
        return serializable;
      }

      return {
        ...serializable,
        reselectRequired: true,
      };
    }),
  };
}

export function deserializeTimelineProject(value) {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  const fallback = createInitialTimelineProject();
  if (!parsed || parsed.storageVersion !== TIMELINE_STORAGE_VERSION) {
    return fallback;
  }

  const sampleById = new Map(fallback.mediaAssets.map((asset) => [asset.id, asset]));
  const mediaAssets = parsed.mediaAssets.map((asset) => {
    if (asset.sourceType === "sample") {
      return { ...sampleById.get(asset.id), ...asset };
    }

    if (asset.sourceType === "upload" && asset.reselectRequired) {
      return {
        ...asset,
        unavailableReason: "Reselect this local file to preview or export it.",
      };
    }

    return asset;
  });

  return {
    ...fallback,
    ...parsed,
    mediaAssets,
    timelineClips: sequenceClips(parsed.timelineClips || fallback.timelineClips),
  };
}

export function getSelectedClip(project) {
  return project.timelineClips.find((clip) => clip.id === project.selectedClipId) || project.timelineClips[0] || null;
}

export function getMusicAsset(project) {
  return project.mediaAssets.find((asset) => asset.id === project.musicTrack.assetId) || null;
}
