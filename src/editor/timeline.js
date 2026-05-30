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
 * @property {string=} srcKey
 * @property {string=} posterSrc
 * @property {string=} src
 * @property {string=} objectUrl
 * @property {File=} file
 * @property {number=} sourceDurationSeconds
 * @property {number=} defaultSourceInSeconds
 * @property {number=} defaultSourceOutSeconds
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
 * @typedef {Object} AudioClip
 * @property {string} id
 * @property {string} assetId
 * @property {string} trackId
 * @property {string} title
 * @property {boolean} enabled
 * @property {number} startSeconds
 * @property {number} trimStartSeconds
 * @property {number} durationSeconds
 * @property {number} volume
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
 * @property {AudioClip[]} audioClips
 * @property {MusicTrack} musicTrack
 * @property {TextOverlay[]} textOverlays
 * @property {Array<{id: string, atSeconds: number, label: string, kind: string}>} commerceMarkers
 * @property {string} selectedClipId
 * @property {string} selectedAudioClipId
 * @property {number} playheadSeconds
 */

export const sampleMediaAssets = [
  {
    id: "sample-citrus-hook",
    kind: "video",
    sourceType: "sample",
    name: "Bottle Reveal Hook",
    assetKey: "actualShot1",
    srcKey: "actualVideo1",
    durationSeconds: 5,
    sourceDurationSeconds: 15.04,
    defaultSourceInSeconds: 0,
    defaultSourceOutSeconds: 5,
    width: 624,
    height: 1280,
    tags: ["hook", "real-footage"],
  },
  {
    id: "sample-dropper-texture",
    kind: "video",
    sourceType: "sample",
    name: "Bathroom Shelf Proof",
    assetKey: "actualShot2",
    srcKey: "actualVideo1",
    durationSeconds: 5,
    sourceDurationSeconds: 15.04,
    defaultSourceInSeconds: 5,
    defaultSourceOutSeconds: 10,
    width: 624,
    height: 1280,
    tags: ["routine", "real-footage"],
  },
  {
    id: "sample-creator-proof",
    kind: "video",
    sourceType: "sample",
    name: "Handheld Serum Hold",
    assetKey: "actualShot3",
    srcKey: "actualVideo1",
    durationSeconds: 5,
    sourceDurationSeconds: 15.04,
    defaultSourceInSeconds: 10,
    defaultSourceOutSeconds: 15,
    width: 624,
    height: 1280,
    tags: ["handheld", "product"],
  },
  {
    id: "sample-ingredient-bridge",
    kind: "video",
    sourceType: "sample",
    name: "Label Macro Lock",
    assetKey: "actualShot4",
    srcKey: "actualVideo2",
    durationSeconds: 5,
    sourceDurationSeconds: 15.04,
    defaultSourceInSeconds: 0,
    defaultSourceOutSeconds: 5,
    width: 624,
    height: 1280,
    tags: ["label", "macro"],
  },
  {
    id: "sample-social-proof",
    kind: "video",
    sourceType: "sample",
    name: "Ingredient Close Read",
    assetKey: "actualShot5",
    srcKey: "actualVideo2",
    durationSeconds: 5,
    sourceDurationSeconds: 15.04,
    defaultSourceInSeconds: 5,
    defaultSourceOutSeconds: 10,
    width: 624,
    height: 1280,
    tags: ["ingredient", "label"],
  },
  {
    id: "sample-final-bottle",
    kind: "video",
    sourceType: "sample",
    name: "Bottle CTA Close",
    assetKey: "actualShot6",
    srcKey: "actualVideo2",
    durationSeconds: 5,
    sourceDurationSeconds: 15.04,
    defaultSourceInSeconds: 10,
    defaultSourceOutSeconds: 15,
    width: 624,
    height: 1280,
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

function computePlacedClipEnd(clips) {
  return clips.reduce(
    (max, clip) => Math.max(max, (clip.startSeconds || 0) + (clip.durationSeconds || 0)),
    0,
  );
}

function computeVisualTimelineDuration(project) {
  const clipEnd = computePlacedClipEnd(project.timelineClips || []);
  const overlayEnd = (project.textOverlays || []).reduce(
    (max, overlay) => Math.max(max, (overlay.startSeconds || 0) + (overlay.durationSeconds || 0)),
    0,
  );
  return roundSeconds(Math.max(clipEnd, overlayEnd));
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
  const sourceDurationSeconds = asset.sourceDurationSeconds || asset.durationSeconds || 6;
  const defaultSourceInSeconds = Math.min(
    Math.max(0, asset.defaultSourceInSeconds ?? 0),
    Math.max(0, sourceDurationSeconds - 0.5),
  );
  const defaultSourceOutSeconds = Math.min(
    sourceDurationSeconds,
    Math.max(
      defaultSourceInSeconds + 0.5,
      asset.defaultSourceOutSeconds ?? defaultSourceInSeconds + (asset.durationSeconds || sourceDurationSeconds),
    ),
  );
  const sourceInSeconds = Math.max(0, overrides.sourceInSeconds ?? defaultSourceInSeconds);
  const sourceOutSeconds = Math.max(
    sourceInSeconds + 0.5,
    Math.min(sourceDurationSeconds, overrides.sourceOutSeconds ?? defaultSourceOutSeconds),
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

function createAudioClipFromAsset(asset, existingAudioClips, project, overrides = {}) {
  const sourceDurationSeconds = Math.max(0.5, asset.durationSeconds || 20);
  const visualDuration = Math.max(0.5, computeVisualTimelineDuration(project) || 20);
  const latestAudioEnd = computePlacedClipEnd(existingAudioClips);
  const startSeconds = roundSeconds(Math.max(0, overrides.startSeconds ?? latestAudioEnd));
  const trimStartSeconds = roundSeconds(Math.min(
    Math.max(0, overrides.trimStartSeconds ?? asset.defaultSourceInSeconds ?? 0),
    Math.max(0, sourceDurationSeconds - 0.5),
  ));
  const defaultDuration = startSeconds < visualDuration
    ? Math.max(0.5, visualDuration - startSeconds)
    : visualDuration;
  const durationSeconds = roundSeconds(Math.min(
    Math.max(0.5, overrides.durationSeconds ?? defaultDuration),
    Math.max(0.5, sourceDurationSeconds - trimStartSeconds),
  ));
  const baseId = `audio-${slugify(asset.name)}`;
  const existingIds = new Set(existingAudioClips.map((clip) => clip.id));
  let id = overrides.id || baseId;
  let copy = 2;

  while (existingIds.has(id)) {
    id = `${baseId}-${copy}`;
    copy += 1;
  }

  return {
    id,
    assetId: asset.id,
    trackId: "A1",
    title: asset.name,
    enabled: overrides.enabled ?? true,
    startSeconds,
    trimStartSeconds,
    durationSeconds,
    volume: Math.min(1, Math.max(0, overrides.volume ?? project.musicTrack?.volume ?? 0.42)),
  };
}

function createLegacyAudioClip(project) {
  const musicTrack = project.musicTrack;
  const asset = musicTrack?.assetId ? getAsset(project, musicTrack.assetId) : null;
  if (!asset || asset.kind !== "audio" || musicTrack.enabled === false) {
    return [];
  }

  return [
    createAudioClipFromAsset(asset, [], project, {
      id: `audio-${slugify(asset.name)}`,
      durationSeconds: computeVisualTimelineDuration(project) || asset.durationSeconds || 20,
      enabled: musicTrack.enabled,
      startSeconds: 0,
      trimStartSeconds: musicTrack.trimStartSeconds || 0,
      volume: musicTrack.volume,
    }),
  ];
}

function normalizeAudioClip(project, clip) {
  const asset = getAsset(project, clip.assetId);
  if (!asset || asset.kind !== "audio") {
    return null;
  }

  const sourceDurationSeconds = Math.max(0.5, asset.durationSeconds || clip.durationSeconds || 20);
  const trimStartSeconds = roundSeconds(Math.min(
    Math.max(0, clip.trimStartSeconds ?? 0),
    Math.max(0, sourceDurationSeconds - 0.5),
  ));
  const durationSeconds = roundSeconds(Math.min(
    Math.max(0.5, clip.durationSeconds ?? sourceDurationSeconds - trimStartSeconds),
    Math.max(0.5, sourceDurationSeconds - trimStartSeconds),
  ));

  return {
    id: clip.id || `audio-${slugify(asset.name)}`,
    assetId: asset.id,
    trackId: clip.trackId || "A1",
    title: clip.title || asset.name,
    enabled: clip.enabled ?? true,
    startSeconds: roundSeconds(Math.max(0, clip.startSeconds ?? 0)),
    trimStartSeconds,
    durationSeconds,
    volume: Math.min(1, Math.max(0, clip.volume ?? project.musicTrack?.volume ?? 0.42)),
  };
}

function uniqueAudioClipIds(audioClips) {
  const seen = new Map();
  return audioClips.map((clip) => {
    const count = seen.get(clip.id) || 0;
    seen.set(clip.id, count + 1);
    return count === 0 ? clip : { ...clip, id: `${clip.id}-${count + 1}` };
  });
}

function getPrimaryAudioClip(project, audioClips = getAudioTrackClips(project)) {
  return (
    audioClips.find((clip) => clip.id === project.selectedAudioClipId) ||
    audioClips.find((clip) => clip.enabled !== false) ||
    audioClips[0] ||
    null
  );
}

function syncLegacyMusicTrack(project, audioClips) {
  const primaryAudioClip = getPrimaryAudioClip(project, audioClips);
  if (!primaryAudioClip) {
    return {
      ...project.musicTrack,
      enabled: false,
    };
  }

  return {
    assetId: primaryAudioClip.assetId,
    enabled: primaryAudioClip.enabled,
    trimStartSeconds: primaryAudioClip.trimStartSeconds,
    volume: primaryAudioClip.volume,
  };
}

function withAudioState(project, audioClips, selectedAudioClipId = project.selectedAudioClipId) {
  const normalizedAudioClips = uniqueAudioClipIds(
    audioClips
      .map((clip) => normalizeAudioClip(project, clip))
      .filter(Boolean)
      .sort((a, b) => a.startSeconds - b.startSeconds),
  );
  const selectedExists = normalizedAudioClips.some((clip) => clip.id === selectedAudioClipId);
  const nextProject = {
    ...project,
    audioClips: normalizedAudioClips,
    selectedAudioClipId: selectedExists ? selectedAudioClipId : normalizedAudioClips[0]?.id,
  };

  return {
    ...nextProject,
    musicTrack: syncLegacyMusicTrack(nextProject, normalizedAudioClips),
  };
}

export function createInitialTimelineProject() {
  const mediaAssets = sampleMediaAssets.map(cloneAsset);
  const clips = initialClipSpecs.map(([id, assetId]) => {
    const asset = mediaAssets.find((item) => item.id === assetId);
    return createClipFromAsset(asset, [], { id });
  });
  const timelineClips = sequenceClips(clips);
  const musicTrack = {
    assetId: "music-glass-skin",
    enabled: true,
    trimStartSeconds: 0,
    volume: 0.42,
  };
  const musicAsset = mediaAssets.find((asset) => asset.id === musicTrack.assetId);
  const audioClips = [
    {
      id: "audio-glass-skin-pulse",
      assetId: musicAsset.id,
      trackId: "A1",
      title: musicAsset.name,
      enabled: true,
      startSeconds: 0,
      trimStartSeconds: 0,
      durationSeconds: computePlacedClipEnd(timelineClips),
      volume: musicTrack.volume,
    },
  ];

  return {
    id: "viralforge-summer-glow-edit",
    title: "Summer Glow Social Edit",
    storageVersion: TIMELINE_STORAGE_VERSION,
    aspectRatio: "9:16",
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    fps: OUTPUT_FPS,
    mediaAssets,
    timelineClips,
    audioClips,
    musicTrack,
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
    selectedAudioClipId: "audio-glass-skin-pulse",
    selectedOverlayId: "overlay-main-cta",
    playheadSeconds: 0,
  };
}

export function computeTimelineDuration(project) {
  const visualEnd = computeVisualTimelineDuration(project);
  const audioEnd = computePlacedClipEnd(getAudioTrackClips(project));
  return roundSeconds(Math.max(visualEnd, audioEnd));
}

export function addAssetToTimeline(project, assetId) {
  const asset = getAsset(project, assetId);
  if (!asset) {
    return project;
  }

  if (asset.kind === "audio") {
    return addAudioAssetToTimeline(project, assetId);
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

export function getAudioTrackClips(project) {
  const audioClips = Array.isArray(project.audioClips) && project.audioClips.length > 0
    ? project.audioClips
    : createLegacyAudioClip(project);

  return uniqueAudioClipIds(
    audioClips
      .map((clip) => normalizeAudioClip(project, clip))
      .filter(Boolean)
      .sort((a, b) => a.startSeconds - b.startSeconds),
  );
}

export function addAudioAssetToTimeline(project, assetId, overrides = {}) {
  const asset = getAsset(project, assetId);
  if (!asset || asset.kind !== "audio") {
    return project;
  }

  const existingAudioClips = getAudioTrackClips(project);
  const nextAudioClip = createAudioClipFromAsset(asset, existingAudioClips, project, overrides);

  return withAudioState(project, [...existingAudioClips, nextAudioClip], nextAudioClip.id);
}

export function selectAudioClip(project, audioClipId) {
  const audioClip = getAudioTrackClips(project).find((clip) => clip.id === audioClipId);
  if (!audioClip) {
    return project;
  }

  return withAudioState(project, getAudioTrackClips(project), audioClipId);
}

export function updateAudioClip(project, audioClipId, changes) {
  const audioClips = getAudioTrackClips(project);
  if (!audioClips.some((clip) => clip.id === audioClipId)) {
    return project;
  }

  const nextAudioClips = audioClips.map((clip) => {
    if (clip.id !== audioClipId) {
      return clip;
    }

    const requestedAsset = changes.assetId ? getAsset(project, changes.assetId) : getAsset(project, clip.assetId);
    const asset = requestedAsset?.kind === "audio" ? requestedAsset : getAsset(project, clip.assetId);
    const sourceDurationSeconds = Math.max(0.5, asset.durationSeconds || clip.durationSeconds || 20);
    const trimStartSeconds = roundSeconds(Math.min(
      Math.max(0, changes.trimStartSeconds ?? clip.trimStartSeconds),
      Math.max(0, sourceDurationSeconds - 0.5),
    ));
    const durationSeconds = roundSeconds(Math.min(
      Math.max(0.5, changes.durationSeconds ?? clip.durationSeconds),
      Math.max(0.5, sourceDurationSeconds - trimStartSeconds),
    ));

    return {
      ...clip,
      ...changes,
      assetId: asset.id,
      title: asset.name,
      enabled: changes.enabled ?? clip.enabled,
      startSeconds: roundSeconds(Math.max(0, changes.startSeconds ?? clip.startSeconds)),
      trimStartSeconds,
      durationSeconds,
      volume: Math.min(1, Math.max(0, changes.volume ?? clip.volume)),
    };
  });

  return withAudioState(project, nextAudioClips, audioClipId);
}

export function removeAudioClip(project, audioClipId) {
  const nextAudioClips = getAudioTrackClips(project).filter((clip) => clip.id !== audioClipId);
  return withAudioState(project, nextAudioClips);
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
    const assetDuration = asset?.sourceDurationSeconds || asset?.durationSeconds || clip.sourceOutSeconds;
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
  const audioClips = getAudioTrackClips(project);
  const selectedAudioClip = getPrimaryAudioClip(project, audioClips);

  if (!selectedAudioClip && changes.assetId) {
    return addAudioAssetToTimeline(project, changes.assetId, {
      enabled: changes.enabled ?? true,
      trimStartSeconds: changes.trimStartSeconds ?? 0,
      volume: changes.volume ?? project.musicTrack?.volume ?? 0.42,
    });
  }

  if (!selectedAudioClip) {
    return {
      ...project,
      musicTrack: {
        ...project.musicTrack,
        ...changes,
        enabled: changes.enabled ?? project.musicTrack?.enabled ?? false,
        trimStartSeconds: roundSeconds(Math.max(0, changes.trimStartSeconds ?? project.musicTrack?.trimStartSeconds ?? 0)),
        volume: Math.min(1, Math.max(0, changes.volume ?? project.musicTrack?.volume ?? 0.42)),
      },
    };
  }

  return updateAudioClip(project, selectedAudioClip.id, {
    assetId: changes.assetId ?? selectedAudioClip.assetId,
    enabled: changes.enabled ?? true,
    trimStartSeconds: changes.trimStartSeconds ?? selectedAudioClip.trimStartSeconds,
    volume: changes.volume ?? selectedAudioClip.volume,
  });
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
  const timelineClips = sequenceClips(parsed.timelineClips || fallback.timelineClips);
  const restored = {
    ...fallback,
    ...parsed,
    mediaAssets,
    timelineClips,
  };
  const audioClips = Array.isArray(parsed.audioClips)
    ? parsed.audioClips
    : createLegacyAudioClip({
      ...restored,
      audioClips: [],
      musicTrack: parsed.musicTrack || fallback.musicTrack,
    });

  return withAudioState(
    {
      ...restored,
      audioClips,
    },
    audioClips,
    parsed.selectedAudioClipId,
  );
}

export function getSelectedClip(project) {
  return project.timelineClips.find((clip) => clip.id === project.selectedClipId) || project.timelineClips[0] || null;
}

export function getMusicAsset(project) {
  const primaryAudioClip = getPrimaryAudioClip(project);
  return project.mediaAssets.find((asset) => asset.id === primaryAudioClip?.assetId) ||
    project.mediaAssets.find((asset) => asset.id === project.musicTrack?.assetId) ||
    null;
}
