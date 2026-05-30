import { useEffect, useId, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Player } from "@remotion/player";
import {
  AlertTriangle,
  BadgeCheck,
  Captions,
  ChevronDown,
  CheckCircle2,
  CircleDot,
  Download,
  Film,
  Gauge,
  GripHorizontal,
  Layers,
  Library,
  ListChecks,
  MoveLeft,
  MoveRight,
  Music2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Scissors,
  Settings2,
  ShieldCheck,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Volume2,
  WandSparkles,
  X,
} from "lucide-react";
import { assets } from "./assetMap.js";
import { editorSnapshot } from "./editorData.js";
import { inspectMediaFile } from "./editor/media.js";
import {
  addAssetToTimeline,
  addMediaAsset,
  computeTimelineDuration,
  createInitialTimelineProject,
  getMusicAsset,
  getSelectedClip,
  reorderTimelineClip,
  selectTimelineClip,
  setPlayhead,
  trimTimelineClip,
  updateMusicTrack,
  updateTextOverlay,
} from "./editor/timeline.js";
import {
  clearTimelineProject,
  loadTimelineProject,
  saveTimelineProject,
} from "./editor/persistence.js";
import { exportTimelineProject } from "./export/mediabunnyExport.js";
import { EditorComposition } from "./remotion/EditorComposition.jsx";
import CampaignWorkspaceApp from "./CampaignWorkspaceApp.jsx";
import DemoFlow from "./DemoFlow.jsx";
import SetupWizard from "./SetupWizard.jsx";

const seededProject = createInitialTimelineProject();
const seededAssetById = new Map(seededProject.mediaAssets.map((asset) => [asset.id, asset]));
const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "test" || process.env.VITEST === "true");

function formatSeconds(value) {
  const safeValue = Math.max(0, Number(value) || 0);
  const minutes = Math.floor(safeValue / 60);
  const seconds = Math.floor(safeValue % 60);
  const frames = Math.floor((safeValue % 1) * 30);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(frames).padStart(2, "0")}`;
}

function formatDuration(value) {
  return `${Number(value || 0).toFixed(value % 1 === 0 ? 0 : 1)}s`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createAuditionMediaAsset(person, existingAssets) {
  const existingIds = new Set(existingAssets.map((asset) => asset.id));
  const baseId = `generated-audition-${person.id}`;
  let id = baseId;
  let copy = 2;

  while (existingIds.has(id)) {
    id = `${baseId}-${copy}`;
    copy += 1;
  }

  return {
    id,
    kind: "video",
    sourceType: "generated",
    name: `${person.name} Audition`,
    assetKey: person.asset,
    durationSeconds: 12,
    width: 1080,
    height: 1920,
    tags: ["audition", "ai-people", slugify(person.gender)],
  };
}

function getOutputDimensions(aspectRatio) {
  if (aspectRatio === "16:9") {
    return { width: 1920, height: 1080 };
  }

  if (aspectRatio === "1:1") {
    return { width: 1080, height: 1080 };
  }

  return { width: 1080, height: 1920 };
}

function hydrateProjectMedia(project) {
  return {
    ...project,
    mediaAssets: project.mediaAssets.map((asset) => {
      const seededAsset = seededAssetById.get(asset.id);
      const assetKey = asset.assetKey || seededAsset?.assetKey;
      const srcKey = asset.srcKey || seededAsset?.srcKey;
      return {
        ...seededAsset,
        ...asset,
        assetKey,
        srcKey,
        posterSrc: asset.posterSrc || (assetKey ? assets[assetKey] : undefined),
        src: asset.src || (srcKey ? assets[srcKey] : undefined),
      };
    }),
  };
}

function Sidebar({ project, durationSeconds, onReset }) {
  const projectMeta = editorSnapshot.project;

  return (
    <aside className="editor-sidebar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          VF
        </div>
        <div>
          <h1>ViralForge Edit</h1>
          <p>Local NLE</p>
        </div>
      </div>

      <nav className="workspace-nav" aria-label="Editor workspaces">
        {[
          ["Media", Library],
          ["Edit", Film],
          ["Color", SlidersHorizontal],
          ["Fairlight", Music2],
          ["Deliver", Download],
        ].map(([label, Icon]) => (
          <button className={label === "Edit" ? "is-active" : ""} key={label} type="button">
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="project-brief">
        <p className="eyebrow">Active campaign</p>
        <h2>{projectMeta.product}</h2>
        <dl>
          <div>
            <dt>Timeline</dt>
            <dd>{formatDuration(durationSeconds)}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{project.aspectRatio}</dd>
          </div>
          <div>
            <dt>Channel</dt>
            <dd>{projectMeta.channels}</dd>
          </div>
        </dl>
      </div>

      <div className="guardrail-pill">
        <ShieldCheck size={16} />
        <span>AI Safe</span>
      </div>

      <button className="sidebar-reset" onClick={onReset} type="button">
        <Settings2 size={16} />
        Reset local edit
      </button>
    </aside>
  );
}

function Topbar({ project, durationSeconds, exportResult, onExport }) {
  return (
    <header className="editor-topbar">
      <div>
        <p className="eyebrow">Browser-local editor</p>
        <h2>{project.title}</h2>
      </div>

      <div className="topbar-meta" aria-label="Project metadata">
        <span>{project.fps} fps</span>
        <span>{project.width} x {project.height}</span>
        <span>{formatDuration(durationSeconds)}</span>
      </div>

      <div className="topbar-actions">
        {exportResult?.url ? (
          <a className="download-link" download={exportResult.fileName} href={exportResult.url}>
            <Download size={16} />
            Download MP4
          </a>
        ) : null}
        <button className="primary-action" onClick={onExport} type="button">
          <Download size={16} />
          Export 9:16 MP4
        </button>
      </div>
    </header>
  );
}

function DraggableAssetCard({ asset, onAdd, onUseMusic }) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: `asset:${asset.id}`,
    data: {
      assetId: asset.id,
      label: asset.name,
      type: "asset",
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  const isAudio = asset.kind === "audio";

  return (
    <article
      className={`media-asset ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("application/x-viralforge-asset", asset.id);
      }}
      ref={setNodeRef}
      style={style}
    >
      <button
        aria-label={isAudio ? `Use ${asset.name} as music` : `Add ${asset.name} to timeline`}
        className="media-thumb"
        onClick={() => (isAudio ? onUseMusic(asset.id) : onAdd(asset.id))}
        type="button"
      >
        {asset.posterSrc ? (
          <img alt="" src={asset.posterSrc} />
        ) : (
          <span className="media-placeholder">
            {isAudio ? <Music2 size={22} /> : <Film size={22} />}
          </span>
        )}
        <span className="media-kind">{asset.kind}</span>
      </button>
      <div className="media-asset-meta">
        <button
          className="drag-handle"
          type="button"
          {...listeners}
          {...attributes}
        >
          <GripHorizontal size={15} />
          <span>{asset.name}</span>
        </button>
        <div>
          <span>{formatDuration(asset.durationSeconds)}</span>
          {asset.reselectRequired ? <strong>Reselect required</strong> : null}
        </div>
      </div>
      <button
        className="compact-command"
        onClick={() => (isAudio ? onUseMusic(asset.id) : onAdd(asset.id))}
        type="button"
      >
        {isAudio ? <Volume2 size={15} /> : <Plus size={15} />}
        {isAudio ? "Use" : "Add"}
      </button>
    </article>
  );
}

function MediaPool({ project, onAddAssetToTimeline, onImportFiles, onUseMusic }) {
  const videoAssets = project.mediaAssets.filter((asset) => asset.kind !== "audio");
  const audioAssets = project.mediaAssets.filter((asset) => asset.kind === "audio");

  return (
    <section className="media-pool">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Source bin</p>
          <h2>Media Pool</h2>
        </div>
        <label className="icon-label-button">
          <Upload size={16} />
          <span>Import</span>
          <input
            accept="video/*,audio/*"
            aria-label="Import local media"
            multiple
            onChange={onImportFiles}
            type="file"
          />
        </label>
      </div>

      <div className="media-section">
        <h3>Video clips</h3>
        <div className="media-grid">
          {videoAssets.map((asset) => (
            <DraggableAssetCard
              asset={asset}
              key={asset.id}
              onAdd={onAddAssetToTimeline}
              onUseMusic={onUseMusic}
            />
          ))}
        </div>
      </div>

      <div className="media-section">
        <h3>Music beds</h3>
        <div className="music-list">
          {audioAssets.map((asset) => (
            <DraggableAssetCard
              asset={asset}
              key={asset.id}
              onAdd={onAddAssetToTimeline}
              onUseMusic={onUseMusic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Viewer({ durationSeconds, isPlaying, onPlayheadChange, onTogglePlay, project, selectedClip }) {
  const playerDuration = Math.max(1, Math.ceil(durationSeconds * project.fps));

  return (
    <section className="viewer-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Remotion preview</p>
          <h2>Program Monitor</h2>
        </div>
        <div className="viewer-badges">
          <span>{project.aspectRatio}</span>
          <span>Safe zones</span>
        </div>
      </div>

      <div className="viewer-stage">
        <Player
          acknowledgeRemotionLicense
          className="remotion-player"
          component={EditorComposition}
          compositionHeight={project.height}
          compositionWidth={project.width}
          controls
          durationInFrames={playerDuration}
          fps={project.fps}
          inputProps={{ project }}
          loop
          style={{
            aspectRatio: `${project.width} / ${project.height}`,
            height: "auto",
            maxHeight: "100%",
            maxWidth: "100%",
            width: "min(320px, 100%)",
          }}
        />
      </div>

      <div className="transport-bar">
        <button aria-label={isPlaying ? "Pause preview" : "Play preview"} onClick={onTogglePlay} type="button">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          aria-label="Skip to next edit"
          onClick={() => {
            const nextClip = project.timelineClips.find((clip) => clip.startSeconds > project.playheadSeconds);
            onPlayheadChange(nextClip?.startSeconds ?? 0);
          }}
          type="button"
        >
          <SkipForward size={16} />
        </button>
        <input
          aria-label="Timeline playhead"
          max={durationSeconds}
          min="0"
          onChange={(event) => onPlayheadChange(Number(event.target.value))}
          step="0.1"
          type="range"
          value={Math.min(project.playheadSeconds, durationSeconds)}
        />
        <span>{formatSeconds(project.playheadSeconds)} / {formatSeconds(durationSeconds)}</span>
      </div>

      <div className="viewer-selection">
        <CircleDot size={15} />
        <span>{selectedClip?.title || "No clip selected"}</span>
      </div>
    </section>
  );
}

function SortableTimelineClip({ asset, clip, durationSeconds, isSelected, onSelect }) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: clip.id,
    data: {
      clipId: clip.id,
      label: clip.title,
      type: "clip",
    },
  });
  const style = {
    flexBasis: `${Math.max(130, (clip.durationSeconds / Math.max(durationSeconds, 1)) * 860)}px`,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      className={`timeline-clip ${isSelected ? "is-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("application/x-viralforge-clip", clip.id);
      }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <button
        aria-label={`Timeline clip ${clip.title}`}
        onClick={() => onSelect(clip.id)}
        type="button"
      >
        {asset?.posterSrc ? <img alt="" src={asset.posterSrc} /> : <span>{clip.title.slice(0, 2)}</span>}
        <strong>{clip.title}</strong>
        <small>{formatSeconds(clip.startSeconds)} - {formatDuration(clip.durationSeconds)}</small>
      </button>
    </article>
  );
}

function Timeline({
  durationSeconds,
  musicAsset,
  onAddAssetToTimeline,
  onDropClip,
  onPlayheadChange,
  onSelectClip,
  project,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "timeline-drop",
    data: { type: "timeline" },
  });
  const ticks = Array.from({ length: Math.max(2, Math.ceil(durationSeconds / 5) + 1) }, (_, index) => index * 5);

  return (
    <section
      className={`timeline-panel ${isOver ? "is-over" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const assetId = event.dataTransfer.getData("application/x-viralforge-asset");
        const clipId = event.dataTransfer.getData("application/x-viralforge-clip");
        if (assetId) {
          onAddAssetToTimeline(assetId);
        } else if (clipId) {
          onDropClip(clipId);
        }
      }}
      ref={setNodeRef}
    >
      <div className="panel-header timeline-header">
        <div>
          <p className="eyebrow">Custom timeline</p>
          <h2>Timeline</h2>
        </div>
        <div className="timeline-summary">
          <span>{project.timelineClips.length} clips</span>
          <span>{formatDuration(durationSeconds)}</span>
        </div>
      </div>

      <div className="time-ruler">
        {ticks.map((tick) => (
          <button key={tick} onClick={() => onPlayheadChange(tick)} type="button">
            {formatSeconds(tick)}
          </button>
        ))}
      </div>

      <div className="track-row">
        <div className="track-label">V1</div>
        <SortableContext
          items={project.timelineClips.map((clip) => clip.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="timeline-track-items" data-testid="video-track">
            {project.timelineClips.map((clip) => {
              const asset = project.mediaAssets.find((item) => item.id === clip.assetId);
              return (
                <SortableTimelineClip
                  asset={asset}
                  clip={clip}
                  durationSeconds={durationSeconds}
                  isSelected={project.selectedClipId === clip.id}
                  key={clip.id}
                  onSelect={onSelectClip}
                />
              );
            })}
          </div>
        </SortableContext>
      </div>

      <div className="track-row audio-row">
        <div className="track-label">A1</div>
        <div className="music-bed">
          <Music2 size={16} />
          <span>Music: {musicAsset?.name || "None"} at {Math.round(project.musicTrack.volume * 100)}%</span>
        </div>
      </div>

      <div className="track-row overlay-row">
        <div className="track-label">T1</div>
        <div className="overlay-bed">
          <Captions size={16} />
          <span>{project.textOverlays[0]?.text || "No CTA overlay"}</span>
        </div>
      </div>
    </section>
  );
}

function AspectControl({ project, onChangeAspect }) {
  return (
    <div className="segmented-control" aria-label="Aspect ratio">
      {["9:16", "16:9", "1:1"].map((ratio) => (
        <button
          aria-pressed={project.aspectRatio === ratio}
          className={project.aspectRatio === ratio ? "is-active" : ""}
          key={ratio}
          onClick={() => onChangeAspect(ratio)}
          type="button"
        >
          {ratio}
        </button>
      ))}
    </div>
  );
}

function Inspector({
  mediaAssets,
  musicAsset,
  onChangeAspect,
  onMoveSelected,
  onTrimSelected,
  onUpdateMusic,
  onUpdateOverlay,
  project,
  selectedClip,
}) {
  const overlay = project.textOverlays[0];
  const [trimDraft, setTrimDraft] = useState({ in: "", out: "" });
  const [volumeDraft, setVolumeDraft] = useState(String(Math.round(project.musicTrack.volume * 100)));

  useEffect(() => {
    if (selectedClip) {
      setTrimDraft({
        in: String(selectedClip.sourceInSeconds),
        out: String(selectedClip.sourceOutSeconds),
      });
    }
  }, [selectedClip?.id]);

  useEffect(() => {
    setVolumeDraft(String(Math.round(project.musicTrack.volume * 100)));
  }, [project.musicTrack.assetId]);

  function handleTrimDraft(field, value) {
    setTrimDraft((current) => ({ ...current, [field]: value }));
    if (value.trim() === "") {
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return;
    }

    onTrimSelected({
      [field === "in" ? "sourceInSeconds" : "sourceOutSeconds"]: numericValue,
    });
  }

  function handleVolumeDraft(value) {
    setVolumeDraft(value);
    if (value.trim() === "") {
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return;
    }

    onUpdateMusic({ volume: numericValue / 100 });
  }

  return (
    <aside className="inspector-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Clip controls</p>
          <h2>Inspector</h2>
        </div>
        <BadgeCheck size={18} />
      </div>

      <section className="inspector-section">
        <h3>Project</h3>
        <AspectControl onChangeAspect={onChangeAspect} project={project} />
        <div className="setting-row">
          <span>Primary export</span>
          <strong>9:16 MP4</strong>
        </div>
      </section>

      <section className="inspector-section">
        <h3>Selected clip</h3>
        {selectedClip ? (
          <>
            <div className="selected-clip-card">
              <strong>{selectedClip.title}</strong>
              <span>Selected duration: {formatDuration(selectedClip.durationSeconds)}</span>
            </div>
            <div className="inspector-grid">
              <label>
                Source in
                <input
                  aria-label="Source in"
                  min="0"
                  onChange={(event) => handleTrimDraft("in", event.target.value)}
                  step="0.1"
                  type="number"
                  value={trimDraft.in}
                />
              </label>
              <label>
                Source out
                <input
                  aria-label="Source out"
                  min="0.5"
                  onChange={(event) => handleTrimDraft("out", event.target.value)}
                  step="0.1"
                  type="number"
                  value={trimDraft.out}
                />
              </label>
            </div>
            <div className="move-controls">
              <button aria-label="Move selected clip earlier" onClick={() => onMoveSelected("left")} type="button">
                <MoveLeft size={16} />
                Earlier
              </button>
              <button aria-label="Move selected clip later" onClick={() => onMoveSelected("right")} type="button">
                Later
                <MoveRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <p className="muted-copy">Drop a video clip into the timeline to inspect it.</p>
        )}
      </section>

      <section className="inspector-section">
        <h3>Music</h3>
        <label>
          Music track
          <select
            aria-label="Music track"
            onChange={(event) => onUpdateMusic({ assetId: event.target.value, enabled: true })}
            value={project.musicTrack.assetId}
          >
            {mediaAssets.filter((asset) => asset.kind === "audio").map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.name}</option>
            ))}
          </select>
        </label>
        <div className="inspector-grid">
          <label>
            Music volume
            <input
              aria-label="Music volume"
              max="100"
              min="0"
              onChange={(event) => handleVolumeDraft(event.target.value)}
              step="1"
              type="number"
              value={volumeDraft}
            />
          </label>
          <label>
            Music start
            <input
              aria-label="Music start"
              min="0"
              onChange={(event) => onUpdateMusic({ trimStartSeconds: Number(event.target.value) || 0 })}
              step="0.5"
              type="number"
              value={project.musicTrack.trimStartSeconds}
            />
          </label>
        </div>
        <p className="muted-copy">{musicAsset?.mood || "Select a music bed"} - source clip audio muted in v1.</p>
      </section>

      <section className="inspector-section">
        <h3>CTA overlay</h3>
        <label>
          CTA text
          <textarea
            aria-label="CTA text"
            onChange={(event) => onUpdateOverlay({ text: event.target.value })}
            rows="3"
            value={overlay?.text || ""}
          />
        </label>
        <div className="inspector-grid">
          <label>
            Starts
            <input
              aria-label="CTA start"
              min="0"
              onChange={(event) => onUpdateOverlay({ startSeconds: Number(event.target.value) || 0 })}
              step="0.5"
              type="number"
              value={overlay?.startSeconds || 0}
            />
          </label>
          <label>
            Duration
            <input
              aria-label="CTA duration"
              min="0.5"
              onChange={(event) => onUpdateOverlay({ durationSeconds: Number(event.target.value) || 0.5 })}
              step="0.5"
              type="number"
              value={overlay?.durationSeconds || 0.5}
            />
          </label>
        </div>
      </section>
    </aside>
  );
}

function CollapsibleAssistantBlock({ children, className = "", icon, title }) {
  const [isOpen, setIsOpen] = useState(true);
  const contentId = useId();

  return (
    <div className={`assistant-block collapsible-assistant-block ${isOpen ? "is-open" : "is-collapsed"} ${className}`}>
      <div className="assistant-title">
        {icon}
        <h2>{title}</h2>
        <button
          aria-controls={contentId}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${title}`}
          className="assistant-collapse-toggle"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          <ChevronDown size={15} />
        </button>
      </div>
      {isOpen ? (
        <div className="assistant-block-content" id={contentId}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function CommerceAssistant({ durationSeconds, onGenerateAudition, onSelectPerson, project, selectedPersonId }) {
  const markerLabels = project.commerceMarkers.map((marker) => marker.label).join(" / ");
  const selectedPerson = editorSnapshot.aiPeople.creatorProfiles.find((person) => person.id === selectedPersonId)
    || editorSnapshot.aiPeople.creatorProfiles[0];

  return (
    <section className="assistant-panel">
      <CollapsibleAssistantBlock
        className="creator-casting-block"
        icon={<Sparkles size={17} />}
        title="Creator Casting"
      >
        <div className="audition-casting-summary">
          <strong>{selectedPerson.name}</strong>
          <span>{selectedPerson.gender} - {selectedPerson.language}</span>
        </div>
        <div className="audition-person-list">
          {editorSnapshot.aiPeople.creatorProfiles.map((person) => (
            <button
              aria-pressed={person.id === selectedPersonId}
              className={person.id === selectedPersonId ? "is-selected" : ""}
              key={person.id}
              onClick={() => onSelectPerson(person.id)}
              type="button"
            >
              <strong>{person.name}</strong>
              <span>{person.fitScore}% fit</span>
            </button>
          ))}
        </div>
        <button className="generate-audition-button" onClick={onGenerateAudition} type="button">
          <WandSparkles size={15} />Generate audition
        </button>
      </CollapsibleAssistantBlock>

      <CollapsibleAssistantBlock
        className="trend-block"
        icon={<Sparkles size={17} />}
        title="Trend Beats"
      >
        <ol>
          <li>0s hook needs product in hand before the scroll decision.</li>
          <li>5s texture proof should stay under two cuts.</li>
          <li>17s CTA aligns with marketplace save behavior.</li>
        </ol>
      </CollapsibleAssistantBlock>

      <CollapsibleAssistantBlock
        icon={<ListChecks size={17} />}
        title="Filming Review"
      >
        <div className="metric-row">
          <span>Coverage</span>
          <strong>{project.timelineClips.length}/6 clips</strong>
        </div>
        <div className="metric-row">
          <span>Runtime</span>
          <strong>{formatDuration(durationSeconds)}</strong>
        </div>
        <p>{markerLabels}</p>
      </CollapsibleAssistantBlock>

      <CollapsibleAssistantBlock
        icon={<ShieldCheck size={17} />}
        title="Compliance"
      >
        <div className="compliance-list">
          <span><CheckCircle2 size={15} /> AI Safe</span>
          <span><CheckCircle2 size={15} /> No medical claim</span>
          <span><AlertTriangle size={15} /> Add platform disclosure on publish</span>
        </div>
      </CollapsibleAssistantBlock>
    </section>
  );
}

function ExportStatus({ exportJob, exportResult }) {
  return (
    <section className="deliver-panel">
      <div className="assistant-title">
        <Gauge size={17} />
        <h2>Deliver</h2>
      </div>
      <div aria-label="Export status" className="export-status" role="status">
        <strong>{exportJob.message}</strong>
        <span>{Math.round(exportJob.progress * 100)}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${Math.round(exportJob.progress * 100)}%` }} />
      </div>
      {exportResult ? (
        <div className="export-result">
          <Download size={16} />
          <span>{exportResult.fileName}</span>
        </div>
      ) : (
        <p>Exports are written in-browser with Mediabunny. Uploaded files stay on this device.</p>
      )}
    </section>
  );
}

function LocalNleEditorApp() {
  const [project, setProject] = useState(() => hydrateProjectMedia(loadTimelineProject()));
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDrag, setActiveDrag] = useState(null);
  const [exportJob, setExportJob] = useState({ message: "Ready to export", progress: 0, state: "idle" });
  const [exportResult, setExportResult] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(editorSnapshot.aiPeople.defaultPersonId);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const durationSeconds = computeTimelineDuration(project);
  const selectedClip = getSelectedClip(project);
  const musicAsset = getMusicAsset(project);

  function commitProject(updater) {
    setProject((currentProject) => {
      const updatedProject = typeof updater === "function" ? updater(currentProject) : updater;
      const hydratedProject = hydrateProjectMedia(updatedProject);
      saveTimelineProject(hydratedProject);
      return hydratedProject;
    });
  }

  function handleAddAssetToTimeline(assetId) {
    commitProject((currentProject) => addAssetToTimeline(currentProject, assetId));
  }

  async function handleImportFiles(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const importedAssets = await Promise.all(files.map((file) => inspectMediaFile(file)));
    commitProject((currentProject) => importedAssets.reduce(
      (nextProject, asset) => addMediaAsset(nextProject, asset),
      currentProject,
    ));
    event.target.value = "";
  }

  function handleUseMusic(assetId) {
    commitProject((currentProject) => updateMusicTrack(currentProject, { assetId, enabled: true }));
  }

  function handleSelectClip(clipId) {
    commitProject((currentProject) => selectTimelineClip(currentProject, clipId));
  }

  function handleTrimSelected(changes) {
    if (!selectedClip) {
      return;
    }

    commitProject((currentProject) => trimTimelineClip(currentProject, selectedClip.id, changes));
  }

  function handleMoveSelected(direction) {
    if (!selectedClip) {
      return;
    }

    commitProject((currentProject) => {
      const index = currentProject.timelineClips.findIndex((clip) => clip.id === selectedClip.id);
      const targetIndex = direction === "left" ? Math.max(0, index - 1) : Math.min(currentProject.timelineClips.length - 1, index + 1);
      const targetClip = currentProject.timelineClips[targetIndex];
      return targetClip ? reorderTimelineClip(currentProject, selectedClip.id, targetClip.id) : currentProject;
    });
  }

  function handleDropClip(clipId) {
    commitProject((currentProject) => {
      const lastClip = currentProject.timelineClips.at(-1);
      return lastClip ? reorderTimelineClip(currentProject, clipId, lastClip.id) : currentProject;
    });
  }

  function handlePlayheadChange(seconds) {
    commitProject((currentProject) => setPlayhead(currentProject, seconds));
  }

  function handleChangeAspect(aspectRatio) {
    commitProject((currentProject) => ({
      ...currentProject,
      ...getOutputDimensions(aspectRatio),
      aspectRatio,
    }));
  }

  function handleUpdateOverlay(changes) {
    commitProject((currentProject) => updateTextOverlay(
      currentProject,
      currentProject.selectedOverlayId || currentProject.textOverlays[0]?.id,
      changes,
    ));
  }

  function handleGenerateAudition() {
    const selectedPerson = editorSnapshot.aiPeople.creatorProfiles.find((person) => person.id === selectedPersonId)
      || editorSnapshot.aiPeople.creatorProfiles[0];

    let auditionAsset;
    commitProject((currentProject) => {
      auditionAsset = createAuditionMediaAsset(selectedPerson, currentProject.mediaAssets);
      return addAssetToTimeline(addMediaAsset(currentProject, auditionAsset), auditionAsset.id);
    });
    setExportJob({
      message: `Audition generated: ${selectedPerson.name} (${auditionAsset.durationSeconds}s)`,
      progress: 0,
      state: "idle",
    });
    setExportResult(null);
  }

  async function handleExport() {
    setExportJob({ message: "Preparing Mediabunny export", progress: 0.02, state: "running" });
    setExportResult(null);

    try {
      const result = await exportTimelineProject(project, {
        onProgress: (progressEvent) => {
          const stageLabel = progressEvent.stage === "complete" ? "Export complete" : `Export ${progressEvent.stage}`;
          setExportJob({
            message: stageLabel,
            progress: progressEvent.progress,
            state: progressEvent.stage === "complete" ? "complete" : "running",
          });
        },
      });
      const url = URL.createObjectURL ? URL.createObjectURL(result.blob) : "";
      setExportResult({ ...result, url });
    } catch (error) {
      setExportJob({
        message: error.message || "Export failed",
        progress: 0,
        state: "error",
      });
    }
  }

  function handleResetProject() {
    clearTimelineProject();
    const initialProject = hydrateProjectMedia(createInitialTimelineProject());
    saveTimelineProject(initialProject);
    setProject(initialProject);
    setExportJob({ message: "Ready to export", progress: 0, state: "idle" });
    setExportResult(null);
  }

  function handleDragEnd(event) {
    const active = event.active;
    const over = event.over;
    const activeType = active.data.current?.type;

    setActiveDrag(null);

    if (!over) {
      return;
    }

    if (activeType === "asset") {
      const assetId = active.data.current?.assetId;
      const overType = over.data.current?.type;
      if (assetId && (over.id === "timeline-drop" || overType === "clip")) {
        handleAddAssetToTimeline(assetId);
      }
      return;
    }

    if (activeType === "clip" && active.id !== over.id) {
      commitProject((currentProject) => reorderTimelineClip(currentProject, active.id, over.id));
    }
  }

  const dragLabel = useMemo(() => activeDrag?.label || "", [activeDrag]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragCancel={() => setActiveDrag(null)}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveDrag(event.active.data.current)}
      sensors={sensors}
    >
      <div className="davinci-shell">
        <Sidebar durationSeconds={durationSeconds} onReset={handleResetProject} project={project} />
        <main className="editor-workspace">
          <Topbar
            durationSeconds={durationSeconds}
            exportResult={exportResult}
            onExport={handleExport}
            project={project}
          />
          <div className="davinci-editor-grid">
            <MediaPool
              onAddAssetToTimeline={handleAddAssetToTimeline}
              onImportFiles={handleImportFiles}
              onUseMusic={handleUseMusic}
              project={project}
            />
            <Viewer
              durationSeconds={durationSeconds}
              isPlaying={isPlaying}
              onPlayheadChange={handlePlayheadChange}
              onTogglePlay={() => setIsPlaying((current) => !current)}
              project={project}
              selectedClip={selectedClip}
            />
            <Inspector
              mediaAssets={project.mediaAssets}
              musicAsset={musicAsset}
              onChangeAspect={handleChangeAspect}
              onMoveSelected={handleMoveSelected}
              onTrimSelected={handleTrimSelected}
              onUpdateMusic={(changes) => commitProject((currentProject) => updateMusicTrack(currentProject, changes))}
              onUpdateOverlay={handleUpdateOverlay}
              project={project}
              selectedClip={selectedClip}
            />
            <Timeline
              durationSeconds={durationSeconds}
              musicAsset={musicAsset}
              onAddAssetToTimeline={handleAddAssetToTimeline}
              onDropClip={handleDropClip}
              onPlayheadChange={handlePlayheadChange}
              onSelectClip={handleSelectClip}
              project={project}
            />
            <div className="right-assistant-stack">
              <CommerceAssistant
                durationSeconds={durationSeconds}
                onGenerateAudition={handleGenerateAudition}
                onSelectPerson={setSelectedPersonId}
                project={project}
                selectedPersonId={selectedPersonId}
              />
              <ExportStatus exportJob={exportJob} exportResult={exportResult} />
            </div>
          </div>
        </main>
      </div>

      <DragOverlay>
        {dragLabel ? <div className="davinci-drag-overlay">{dragLabel}</div> : null}
      </DragOverlay>
    </DndContext>
  );
}

function CampaignAppShell() {
  const [wizardData, setWizardData] = useState(null);
  const [activeDemoStep, setActiveDemoStep] = useState("editor");
  const [repromptOpen, setRepromptOpen] = useState(false);
  const [productStory, setProductStory] = useState("");
  const [selectedTone, setSelectedTone] = useState("Authentic");

  if (!isTestEnv) {
    if (!wizardData) {
      return (
        <SetupWizard
          onComplete={(data) => {
            setWizardData(data);
            setProductStory(data.story || "");
            setSelectedTone(data.tone || "Authentic");
            setActiveDemoStep("generating");
          }}
        />
      );
    }

    if (activeDemoStep === "generating") {
      return (
        <DemoFlow
          data={wizardData}
          setView={(view) => setActiveDemoStep(view === "editor" ? "editor" : view)}
          view="generating"
        />
      );
    }

    if (activeDemoStep === "publish" || activeDemoStep === "success") {
      return (
        <DemoFlow
          data={wizardData}
          onBackToEditor={() => setActiveDemoStep("editor")}
          onReset={() => setActiveDemoStep("editor")}
          setView={(view) => setActiveDemoStep(view)}
          view={activeDemoStep}
        />
      );
    }
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <CampaignWorkspaceApp
        activeDemoStep={activeDemoStep}
        onPublishClick={() => setActiveDemoStep("publish")}
        onRepromptClick={() => setRepromptOpen(true)}
        wizardData={wizardData}
      />

      {repromptOpen ? (
        <div className="reprompt-modal-overlay">
          <div className="reprompt-modal">
            <div className="reprompt-modal-header">
              <h3>Edit Campaign Prompts</h3>
              <button className="close-modal" onClick={() => setRepromptOpen(false)} type="button">
                <X size={18} />
              </button>
            </div>
            <form
              className="reprompt-form"
              onSubmit={(event) => {
                event.preventDefault();
                setRepromptOpen(false);
                setWizardData((current) => ({
                  ...current,
                  story: productStory,
                  tone: selectedTone,
                }));
                setActiveDemoStep("generating");
              }}
            >
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                <label htmlFor="modal-story" style={{ fontSize: "13px", fontWeight: "700" }}>Adjust Product Story</label>
                <textarea
                  id="modal-story"
                  onChange={(event) => setProductStory(event.target.value)}
                  required
                  style={{
                    border: "1px solid var(--line-strong)",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                    height: "120px",
                    outline: "none",
                    padding: "12px",
                  }}
                  value={productStory}
                />
              </div>
              <div className="tone-selector" style={{ margin: "16px 0 24px", textAlign: "left" }}>
                <span className="tone-label" style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px" }}>Tone</span>
                <div className="tone-pills" style={{ display: "flex", gap: "8px" }}>
                  {["Authentic", "Funny", "Urgent", "Soft Sell"].map((tone) => (
                    <button
                      className={`tone-pill ${selectedTone === tone ? "selected" : ""}`}
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      type="button"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button className="btn-secondary" onClick={() => setRepromptOpen(false)} style={{ padding: "0 20px", width: "auto" }} type="button">
                  Cancel
                </button>
                <button className="btn-primary btn-teal" style={{ padding: "0 20px", width: "auto" }} type="submit">
                  Regenerate <RefreshCw size={14} style={{ marginLeft: "6px" }} />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const standaloneEditorRequested =
    typeof window !== "undefined" &&
    (
      window.location.pathname === "/local-editor" ||
      new URLSearchParams(window.location.search).get("workspace") === "local-nle"
    );

  return standaloneEditorRequested ? <LocalNleEditorApp /> : <CampaignAppShell />;
}
