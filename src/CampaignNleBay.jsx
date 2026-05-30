import { useEffect, useMemo, useState } from "react";
import { Player } from "@remotion/player";
import {
  Download,
  GripHorizontal,
  Music2,
  Plus,
  Scissors,
  Upload,
} from "lucide-react";
import { assets, campaignVideoSources } from "./assetMap.js";
import { inspectMediaFile } from "./editor/media.js";
import {
  OUTPUT_FPS,
  addAssetToTimeline,
  addMediaAsset,
  computeTimelineDuration,
  getMusicAsset,
  getSelectedClip,
  reorderTimelineClip,
  sampleMediaAssets,
  selectTimelineClip,
  setPlayhead,
  trimTimelineClip,
  updateMusicTrack,
  updateTextOverlay,
} from "./editor/timeline.js";
import { exportTimelineProject } from "./export/mediabunnyExport.js";
import { EditorComposition } from "./remotion/EditorComposition.jsx";

const STORAGE_KEY = "viralforge.campaignNleProject.v1";

function formatDuration(value) {
  return `${Number(value || 0).toFixed(value % 1 === 0 ? 0 : 1)}s`;
}

function formatTime(value) {
  const safeValue = Math.max(0, Number(value) || 0);
  const minutes = Math.floor(safeValue / 60);
  const seconds = Math.floor(safeValue % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getOutputDimensions() {
  return { width: 1080, height: 1920 };
}

function getShotAssetId(shot) {
  return `campaign-asset-${shot.id}`;
}

function getShotClipId(shot) {
  return `campaign-clip-${shot.id}`;
}

function sequenceClips(clips) {
  let cursor = 0;

  return clips.map((clip) => {
    const durationSeconds = Math.max(0.5, clip.sourceOutSeconds - clip.sourceInSeconds);
    const nextClip = {
      ...clip,
      startSeconds: Math.round(cursor * 100) / 100,
      durationSeconds: Math.round(durationSeconds * 100) / 100,
    };
    cursor += durationSeconds;
    return nextClip;
  });
}

function createCampaignProject({ projectTitle, selectedShotId, shots, timelineEvents }) {
  const { width, height } = getOutputDimensions();
  const shotAssets = shots.map((shot) => {
    const source = shot.videoAsset ? campaignVideoSources[shot.videoAsset] : null;
    return {
      id: getShotAssetId(shot),
      kind: "video",
      sourceType: shot.aiGenerated ? "generated" : "sample",
      name: shot.title,
      durationSeconds: shot.durationSeconds,
      sourceDurationSeconds: source?.durationSeconds || shot.durationSeconds,
      defaultSourceInSeconds: shot.videoStartSeconds || 0,
      defaultSourceOutSeconds: shot.videoEndSeconds || shot.durationSeconds,
      posterSrc: assets[shot.asset],
      shotId: shot.id,
      src: source?.src,
      tags: shot.aiGenerated ? ["generated", "campaign"] : ["campaign", "real-footage"],
      width: source?.width || width,
      height: source?.height || height,
    };
  });
  const musicAssets = sampleMediaAssets.filter((asset) => asset.kind === "audio");
  const timelineClips = sequenceClips(shots.map((shot) => ({
    id: getShotClipId(shot),
    assetId: getShotAssetId(shot),
    trackId: "V1",
    title: shot.title,
    startSeconds: shot.startSeconds,
    sourceInSeconds: shot.videoStartSeconds || 0,
    sourceOutSeconds: shot.videoEndSeconds || shot.durationSeconds,
    durationSeconds: shot.durationSeconds,
    commerceRole: shot.aiGenerated ? "generated" : "campaign",
  })));
  const selectedClipId = getShotClipId(shots.find((shot) => shot.id === selectedShotId) || shots[0]);

  return {
    id: "viralforge-campaign-embedded-nle",
    title: projectTitle,
    storageVersion: 1,
    aspectRatio: "9:16",
    width,
    height,
    fps: OUTPUT_FPS,
    mediaAssets: [...shotAssets, ...musicAssets],
    timelineClips,
    musicTrack: {
      assetId: "music-glass-skin",
      enabled: true,
      trimStartSeconds: 0,
      volume: 0.42,
    },
    textOverlays: [
      {
        id: "campaign-overlay-main",
        text: "Glow that sells - shop the bundle",
        startSeconds: 3,
        durationSeconds: 8,
        position: "bottom",
      },
    ],
    commerceMarkers: timelineEvents.map((event) => ({
      id: `campaign-marker-${event.id}`,
      atSeconds: event.atSeconds,
      kind: event.kind,
      label: event.kind,
    })),
    selectedClipId,
    selectedOverlayId: "campaign-overlay-main",
    playheadSeconds: 0,
  };
}

function restoreProject(fallbackProject) {
  if (typeof window === "undefined") {
    return fallbackProject;
  }

  try {
    const rawProject = window.localStorage.getItem(STORAGE_KEY);
    if (!rawProject) {
      return fallbackProject;
    }

    const savedProject = JSON.parse(rawProject);
    if (savedProject?.id !== fallbackProject.id) {
      return fallbackProject;
    }

    const fallbackAssets = new Map(fallbackProject.mediaAssets.map((asset) => [asset.id, asset]));
    const savedAssets = (savedProject.mediaAssets || []).map((asset) => ({
      ...fallbackAssets.get(asset.id),
      ...asset,
    }));
    const mergedAssets = [
      ...savedAssets,
      ...fallbackProject.mediaAssets.filter((asset) => !savedAssets.some((item) => item.id === asset.id)),
    ];
    const validAssetIds = new Set(mergedAssets.map((asset) => asset.id));
    const timelineClips = sequenceClips(
      (savedProject.timelineClips || fallbackProject.timelineClips)
        .filter((clip) => validAssetIds.has(clip.assetId)),
    );

    return {
      ...fallbackProject,
      ...savedProject,
      mediaAssets: mergedAssets,
      timelineClips: timelineClips.length ? timelineClips : fallbackProject.timelineClips,
      commerceMarkers: fallbackProject.commerceMarkers,
    };
  } catch {
    return fallbackProject;
  }
}

function persistProject(project) {
  if (typeof window === "undefined") {
    return;
  }

  const serializableProject = {
    ...project,
    mediaAssets: project.mediaAssets.map((asset) => {
      const { file, objectUrl, ...serializableAsset } = asset;
      if (asset.sourceType !== "upload") {
        return serializableAsset;
      }

      return {
        ...serializableAsset,
        reselectRequired: true,
      };
    }),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableProject));
}

function mergeCampaignShots(project, fallbackProject) {
  const assetById = new Map(project.mediaAssets.map((asset) => [asset.id, asset]));
  const clipById = new Map(project.timelineClips.map((clip) => [clip.id, clip]));
  const fallbackClipIds = new Set(fallbackProject.timelineClips.map((clip) => clip.id));
  const mediaAssets = [
    ...project.mediaAssets.filter((asset) => !asset.id.startsWith("campaign-asset-")),
    ...fallbackProject.mediaAssets.filter((asset) => asset.id.startsWith("campaign-asset-")),
  ];
  const timelineClips = sequenceClips(
    [
      ...fallbackProject.timelineClips.map((fallbackClip) => ({
        ...fallbackClip,
        ...clipById.get(fallbackClip.id),
        title: fallbackClip.title,
        assetId: fallbackClip.assetId,
      })),
      ...project.timelineClips.filter((clip) => !fallbackClipIds.has(clip.id)),
    ],
  );
  const selectedClipId = clipById.has(project.selectedClipId)
    ? project.selectedClipId
    : fallbackProject.selectedClipId;

  for (const asset of mediaAssets) {
    assetById.set(asset.id, asset);
  }

  return {
    ...project,
    title: fallbackProject.title,
    mediaAssets: [...assetById.values()].filter((asset) => (
      asset.sourceType === "upload" || mediaAssets.some((item) => item.id === asset.id)
    )),
    timelineClips,
    commerceMarkers: fallbackProject.commerceMarkers,
    selectedClipId,
  };
}

function MediaAssetCard({ asset, isDragging, onAdd, onDragStart }) {
  return (
    <article
      className={`campaign-nle-asset ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragEnd={() => onDragStart(null, null)}
      onDragStart={(event) => onDragStart(event, { type: "asset", assetId: asset.id, label: asset.name })}
    >
      <button className="campaign-nle-thumb" onClick={() => onAdd(asset.id)} type="button">
        {asset.posterSrc ? <img src={asset.posterSrc} alt="" /> : <Music2 size={18} />}
      </button>
      <button className="campaign-nle-drag" type="button">
        <GripHorizontal size={14} />
        <span>{asset.name}</span>
      </button>
      <small>{asset.kind === "audio" ? asset.mood : `${formatDuration(asset.durationSeconds)} clip`}</small>
    </article>
  );
}

function TimelineClipCard({ asset, clip, isDragging, isSelected, onDropPayload, onDragStart, onSelect }) {
  const style = {
    width: `${Math.max(96, clip.durationSeconds * 28)}px`,
  };

  return (
    <div
      className={`campaign-nle-clip ${isSelected ? "is-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragEnd={() => onDragStart(null, null)}
      onDragOver={(event) => event.preventDefault()}
      onDragStart={(event) => onDragStart(event, { type: "clip", clipId: clip.id, label: clip.title })}
      onDrop={(event) => onDropPayload(event, clip.id)}
      style={style}
    >
      <button onClick={() => onSelect(clip)} type="button">
        {asset?.posterSrc ? <img src={asset.posterSrc} alt="" /> : <span>{clip.title.slice(0, 1)}</span>}
        <strong>{clip.title}</strong>
        <small>{formatDuration(clip.durationSeconds)}</small>
      </button>
    </div>
  );
}

function TimelineDropTrack({ children, isOver, onDropPayload }) {
  return (
    <div
      className={`campaign-nle-track ${isOver ? "is-over" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDropPayload}
    >
      {children}
    </div>
  );
}

export function CampaignNleBay({
  currentSeconds,
  onSelectShot,
  onStatus,
  projectTitle,
  selectedShotId,
  shots,
  timelineEvents,
}) {
  const fallbackProject = useMemo(
    () => createCampaignProject({ projectTitle, selectedShotId, shots, timelineEvents }),
    [projectTitle, selectedShotId, shots, timelineEvents],
  );
  const [project, setProject] = useState(() => restoreProject(fallbackProject));
  const [activeDrag, setActiveDrag] = useState(null);
  const [exportJob, setExportJob] = useState({ status: "idle", progress: 0, message: "Ready" });
  const [exportResult, setExportResult] = useState(null);
  const durationSeconds = computeTimelineDuration(project);
  const selectedClip = getSelectedClip(project);
  const selectedAsset = project.mediaAssets.find((asset) => asset.id === selectedClip?.assetId);
  const musicAsset = getMusicAsset(project);
  const musicAssets = project.mediaAssets.filter((asset) => asset.kind === "audio");
  const videoAssets = project.mediaAssets.filter((asset) => asset.kind === "video");
  const selectedOverlay = project.textOverlays[0];

  useEffect(() => {
    setProject((currentProject) => mergeCampaignShots(currentProject, fallbackProject));
  }, [fallbackProject]);

  useEffect(() => {
    persistProject(project);
  }, [project]);

  useEffect(() => {
    setProject((currentProject) => setPlayhead(currentProject, Math.min(currentSeconds, computeTimelineDuration(currentProject))));
  }, [currentSeconds]);

  function commitProject(updater) {
    setProject((currentProject) => {
      const nextProject = typeof updater === "function" ? updater(currentProject) : updater;
      return {
        ...nextProject,
        timelineClips: sequenceClips(nextProject.timelineClips),
      };
    });
  }

  async function handleImportFiles(files) {
    for (const file of files) {
      if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
        continue;
      }

      const metadata = await inspectMediaFile(file);
      const objectUrl = URL.createObjectURL(file);
      commitProject((currentProject) => addMediaAsset(currentProject, {
        ...metadata,
        id: `upload-${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        kind: file.type.startsWith("audio/") ? "audio" : "video",
        sourceType: "upload",
        name: file.name,
        objectUrl,
        file,
      }));
      onStatus?.(`Imported ${file.name} into local media pool`);
    }
  }

  function handleAddAsset(assetId) {
    if (!assetId) {
      return;
    }

    commitProject((currentProject) => addAssetToTimeline(currentProject, assetId));
    const asset = project.mediaAssets.find((item) => item.id === assetId);
    onStatus?.(`${asset?.name || "Clip"} added to local timeline`);
  }

  function handleSelectClip(clip) {
    commitProject((currentProject) => selectTimelineClip(currentProject, clip.id));
    const asset = project.mediaAssets.find((item) => item.id === clip.assetId);
    if (asset?.shotId) {
      onSelectShot?.(asset.shotId);
    }
  }

  function handleNativeDragStart(event, payload) {
    setActiveDrag(payload);

    if (!event || !payload) {
      return;
    }

    event.dataTransfer.effectAllowed = payload.type === "asset" ? "copy" : "move";
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
  }

  function getDropPayload(event) {
    try {
      return JSON.parse(event.dataTransfer.getData("application/json"));
    } catch {
      return activeDrag;
    }
  }

  function handleDropPayload(event, overClipId = null) {
    event.preventDefault();
    const payload = getDropPayload(event);
    setActiveDrag(null);

    if (payload?.type === "asset" && payload.assetId) {
      handleAddAsset(payload.assetId);
      return;
    }

    if (payload?.type === "clip" && overClipId && payload.clipId !== overClipId) {
      commitProject((currentProject) => reorderTimelineClip(currentProject, payload.clipId, overClipId));
      onStatus?.("Local timeline reordered");
    }
  }

  async function handleExport() {
    setExportJob({ status: "running", progress: 0.02, message: "Preparing MP4" });
    onStatus?.("Local timeline export started");

    try {
      const result = await exportTimelineProject(project, {
        onProgress: (event) => {
          setExportJob({
            status: event.stage === "complete" ? "complete" : "running",
            progress: event.progress,
            message: event.stage,
          });
        },
      });
      const url = URL.createObjectURL(result.blob);
      setExportResult({ ...result, url });
      setExportJob({ status: "complete", progress: 1, message: "MP4 ready" });
      onStatus?.("Local 9:16 MP4 export ready");
    } catch (error) {
      setExportJob({
        status: "error",
        progress: 0,
        message: error?.message || "Export failed",
      });
      onStatus?.("Local export failed");
    }
  }

  return (
    <section className="panel campaign-nle-bay" data-testid="campaign-nle-bay">
        <div className="campaign-nle-head">
          <div>
            <p>Local NLE</p>
            <h2>Remotion Timeline</h2>
          </div>
          <div className="campaign-nle-actions">
            {exportResult ? (
              <a download={exportResult.fileName} href={exportResult.url}>
                <Download size={14} />MP4
              </a>
            ) : null}
            <button onClick={handleExport} type="button">
              <Download size={14} />Export 9:16
            </button>
          </div>
        </div>

        <div className="campaign-nle-grid">
          <aside className="campaign-nle-bin" aria-label="Local media pool">
            <div className="campaign-nle-bin-head">
              <strong>Media Pool</strong>
              <label>
                <Upload size={13} />
                <span>Import</span>
                <input
                  accept="video/*,audio/*"
                  multiple
                  onChange={(event) => handleImportFiles([...event.target.files])}
                  type="file"
                />
              </label>
            </div>
            <div className="campaign-nle-assets">
              {videoAssets.slice(0, 8).map((asset) => (
                <MediaAssetCard
                  asset={asset}
                  isDragging={activeDrag?.assetId === asset.id}
                  key={asset.id}
                  onAdd={handleAddAsset}
                  onDragStart={handleNativeDragStart}
                />
              ))}
            </div>
          </aside>

          <div className="campaign-nle-program">
            <div className="campaign-nle-player-wrap">
              <Player
                acknowledgeRemotionLicense
                className="campaign-nle-player"
                component={EditorComposition}
                compositionHeight={project.height}
                compositionWidth={project.width}
                controls
                durationInFrames={Math.max(1, Math.ceil(durationSeconds * project.fps))}
                fps={project.fps}
                inputProps={{ project }}
                loop
                style={{
                  aspectRatio: `${project.width} / ${project.height}`,
                  height: "auto",
                  maxHeight: "100%",
                  maxWidth: "100%",
                  width: "min(220px, 100%)",
                }}
              />
            </div>
            <div className="campaign-nle-inspector">
              <div>
                <small>Selected clip</small>
                <strong>{selectedClip?.title || "Drop clips below"}</strong>
                <span>{selectedAsset?.sourceType || "campaign"} · {formatDuration(selectedClip?.durationSeconds || 0)}</span>
              </div>
              <label>
                <span>CTA overlay</span>
                <input
                  onChange={(event) => commitProject((currentProject) => updateTextOverlay(currentProject, selectedOverlay.id, { text: event.target.value }))}
                  value={selectedOverlay.text}
                />
              </label>
              <label>
                <span>Music bed</span>
                <select
                  onChange={(event) => commitProject((currentProject) => updateMusicTrack(currentProject, { assetId: event.target.value }))}
                  value={project.musicTrack.assetId}
                >
                  {musicAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Music volume</span>
                <input
                  max="1"
                  min="0"
                  onChange={(event) => commitProject((currentProject) => updateMusicTrack(currentProject, { volume: Number(event.target.value) }))}
                  step="0.05"
                  type="range"
                  value={project.musicTrack.volume}
                />
              </label>
              {selectedClip ? (
                <div className="campaign-nle-trim">
                  <span><Scissors size={13} />Trim</span>
                  <input
                    aria-label="Clip in"
                    max={Math.max(0, selectedClip.sourceOutSeconds - 0.5)}
                    min="0"
                    onChange={(event) => commitProject((currentProject) => trimTimelineClip(currentProject, selectedClip.id, { sourceInSeconds: Number(event.target.value) }))}
                    step="0.5"
                    type="number"
                    value={selectedClip.sourceInSeconds}
                  />
                  <input
                    aria-label="Clip out"
                    max={selectedAsset?.durationSeconds || selectedClip.sourceOutSeconds}
                    min={selectedClip.sourceInSeconds + 0.5}
                    onChange={(event) => commitProject((currentProject) => trimTimelineClip(currentProject, selectedClip.id, { sourceOutSeconds: Number(event.target.value) }))}
                    step="0.5"
                    type="number"
                    value={selectedClip.sourceOutSeconds}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="campaign-nle-timeline">
            <div className="campaign-nle-ruler">
              <span>{formatTime(0)}</span>
              <span>{formatTime(Math.max(0, durationSeconds / 2))}</span>
              <span>{formatTime(durationSeconds)}</span>
              <em>{musicAsset?.name || "No music"} · source audio muted</em>
            </div>
            <TimelineDropTrack isOver={activeDrag?.type === "asset"} onDropPayload={handleDropPayload}>
              {project.timelineClips.map((clip) => (
                <TimelineClipCard
                  asset={project.mediaAssets.find((asset) => asset.id === clip.assetId)}
                  clip={clip}
                  isDragging={activeDrag?.clipId === clip.id}
                  isSelected={clip.id === project.selectedClipId}
                  key={clip.id}
                  onDragStart={handleNativeDragStart}
                  onDropPayload={handleDropPayload}
                  onSelect={handleSelectClip}
                />
              ))}
              <button className="campaign-nle-add" onClick={() => handleAddAsset(videoAssets[0]?.id)} type="button">
                <Plus size={16} />
              </button>
            </TimelineDropTrack>
            <div className="campaign-nle-progress" aria-live="polite">
              <span style={{ width: `${Math.max(2, exportJob.progress * 100)}%` }} />
              <strong>{exportJob.message}</strong>
            </div>
          </div>
        </div>
      </section>
  );
}
