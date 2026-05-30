import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clapperboard,
  ClipboardList,
  Copy,
  Download,
  Edit3,
  FileImage,
  Film,
  Globe,
  Home,
  Image,
  ImagePlus,
  Inbox,
  Layers,
  Maximize2,
  Monitor,
  Package,
  Palette,
  Pause,
  PenLine,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Trash2,
  Type,
  Upload,
  UserRound,
  Users,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
} from "lucide-react";
import { assets } from "./assetMap.js";
import CastPage from "./CastPage.jsx";
import { CampaignNleBay } from "./CampaignNleBay.jsx";
import { getClipAtPlayhead } from "./editor/timeline.js";
import {
  buildTimelineMarkers,
  createAuditionShot,
  createGeneratedShots,
  createHotspot,
  createTimelineEvent,
  editorSnapshot,
  formatSeconds,
  getGenerationEstimate,
  getChecklistProgress,
  getPeopleReadiness,
  getShotAtTime,
  getVideoDuration,
} from "./editorData.js";
import { fetchPixVerseBalanceSnapshot } from "./pixverseBalanceClient.js";

const navIcons = {
  trend: CircleDot,
  research: ClipboardList,
  storyboard: Image,
  scheduler: CalendarDays,
  props: Store,
  people: Users,
  cast: Clapperboard,
  editor: Film,
  listings: ShoppingBag,
  ugc: Inbox,
  analytics: BarChart3,
};

function IconButton({ children, className = "", label, type = "button", ...props }) {
  return (
    <button aria-label={label} className={`icon-button ${className}`} type={type} {...props}>
      {children}
    </button>
  );
}

function Panel({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function CollapsiblePanel({
  actions = null,
  children,
  className = "",
  headingClassName = "",
  label,
  title,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const contentId = useId();

  return (
    <Panel className={`right-panel collapsible-panel ${isOpen ? "is-open" : "is-collapsed"} ${className}`}>
      <div className={`right-heading ${headingClassName}`}>
        <h2>{title}</h2>
        <div className="right-heading-actions">
          {actions}
          <button
            aria-controls={contentId}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
            className="collapse-toggle"
            onClick={() => setIsOpen((value) => !value)}
            type="button"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      {isOpen ? (
        <div className="collapsible-panel-content" id={contentId}>
          {children}
        </div>
      ) : null}
    </Panel>
  );
}

function DropdownMenu({ children, open }) {
  if (!open) {
    return null;
  }

  return (
    <div className="dropdown-menu" role="menu">
      {children}
    </div>
  );
}

function Sidebar({
  activePage,
  balance,
  balanceDetails,
  balanceStatus,
  onNavigate,
  onOpenProjectSwitcher,
  onRefreshBalance,
  project,
}) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <div className="brand-copy">
          <h1>ViralForge</h1>
          <p>Commerce</p>
        </div>
        <ChevronRight size={15} className="brand-chevron" />
      </div>

      <nav className="nav-stack" aria-label="ViralForge workspace navigation">
        {editorSnapshot.navItems.map((item) => {
          const NavIcon = navIcons[item.id] || Layers;
          const active = activePage === item.id;

          return (
            <button
              aria-current={active ? "page" : undefined}
              aria-label={`${item.label} ${item.caption}`}
              key={item.id}
              className={`nav-item ${active ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <NavIcon size={19} />
              <span className="nav-copy">
                <strong>{item.label}</strong>
                <small>{item.caption}</small>
              </span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-card current-project">
        <p className="card-kicker">Current Project</p>
        <div className="project-row">
          <img src={assets[project.thumb]} alt={`${project.product} preview`} />
          <div>
            <span className="product-category">{project.category}</span>
            <strong>{project.product}</strong>
            <small>{project.channels}</small>
          </div>
        </div>
        <button aria-label="Change current project" className="dark-outline-button" onClick={onOpenProjectSwitcher} type="button">Change</button>
      </div>

      <div className="sidebar-card balance-card">
        <p className="card-kicker">PixVerse Balance</p>
        <div className="balance-line">
          <strong>{balance.toLocaleString()}</strong>
          <button onClick={onRefreshBalance} type="button">Refresh</button>
        </div>
        <small>
          {balanceDetails
            ? `${balanceDetails.creditMonthly.toLocaleString()} monthly + ${balanceDetails.creditPackage.toLocaleString()} package`
            : "Demo fallback balance"}
        </small>
        <small className={balanceStatus === "error" ? "balance-warning" : ""}>
          {balanceStatus === "synced"
            ? "Synced PixVerse API"
            : balanceStatus === "loading"
              ? "Syncing PixVerse API"
              : balanceStatus === "error"
                ? "Using demo fallback"
                : "Waiting for PixVerse API"}
        </small>
      </div>

      <button className="settings-row" type="button">
        <Settings size={18} />
        <span>Settings</span>
        <ChevronRight size={16} />
      </button>
    </aside>
  );
}

function ProjectSwitchDialog({ currentProjectId, onClose, onSelectProject }) {
  return (
    <div className="modal-scrim">
      <section aria-labelledby="project-switch-title" aria-modal="true" className="project-switch-dialog" role="dialog">
        <div className="project-switch-heading">
          <div>
            <p className="card-kicker">Workspace</p>
            <h2 id="project-switch-title">Switch Project</h2>
          </div>
          <button aria-label="Close project switcher" onClick={onClose} type="button">
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="project-option-list">
          {editorSnapshot.projects.map((project) => (
            <button
              aria-pressed={project.id === currentProjectId}
              className={project.id === currentProjectId ? "is-active" : ""}
              key={project.id}
              onClick={() => onSelectProject(project)}
              type="button"
            >
              <img src={assets[project.thumb]} alt="" />
              <span>
                <em>{project.category}</em>
                <strong>{project.title}</strong>
                <small>{project.product}</small>
                <small>{project.brief}</small>
                <small>{project.channels}</small>
              </span>
              <b>{project.status}</b>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Topbar({
  aspectRatio,
  isEditingTitle,
  onAspectRatioChange,
  onCancelTitleEdit,
  onExport,
  onSaveTitle,
  onShare,
  onStartTitleEdit,
  openMenu,
  projectTitle,
  setOpenMenu,
  setTitleDraft,
  statusMessage,
  titleDraft,
  activeDemoStep,
  onRepromptClick,
  onPublishClick,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <IconButton label="Back to all projects" className="ghost-icon">
          <ChevronLeft size={20} />
        </IconButton>
      </div>

      {isEditingTitle ? (
        <form className="project-title title-editor" onSubmit={onSaveTitle}>
          <label className="sr-only" htmlFor="project-title-input">Project title</label>
          <input
            id="project-title-input"
            onChange={(event) => setTitleDraft(event.target.value)}
            value={titleDraft}
          />
          <button className="mini-action" type="submit">
            <span className="sr-only">Save project title</span>
            <Check size={14} />
          </button>
          <button className="mini-action" type="button" onClick={onCancelTitleEdit}>
            <span className="sr-only">Cancel project title edit</span>
            <ChevronLeft size={14} />
          </button>
        </form>
      ) : (
        <div className="project-title">
          <span>{projectTitle}</span>
          <IconButton label="Rename project" className="title-edit-button" onClick={onStartTitleEdit}>
            <PenLine size={15} />
          </IconButton>
        </div>
      )}

      <div className="topbar-actions">
        {activeDemoStep === "editor" && (
          <div className="campaign-quick-actions" aria-label="Campaign publishing actions">
            <button className="campaign-header-action is-secondary" onClick={onRepromptClick} type="button">
              <WandSparkles size={14} />
              <span>Re-prompt AI</span>
            </button>
            <button className="campaign-header-action is-primary" onClick={onPublishClick} type="button">
              <span>Publish Campaign</span>
              <Check size={14} />
            </button>
          </div>
        )}

        <span className={`saved-state ${statusMessage === "Saved" ? "" : "is-working"}`} role="status" aria-live="polite">
          <span />
          <strong>{statusMessage}</strong>
        </span>

        <div className="menu-wrap">
          <button
            aria-expanded={openMenu === "aspect"}
            aria-label="Aspect ratio"
            className="select-button"
            onClick={() => setOpenMenu(openMenu === "aspect" ? null : "aspect")}
            type="button"
          >
            <Monitor size={16} />{aspectRatio}<ChevronDown size={15} />
          </button>
          <DropdownMenu open={openMenu === "aspect"}>
            {editorSnapshot.video.aspectRatios.map((option) => (
              <button key={option.id} onClick={() => onAspectRatioChange(option.id)} role="menuitem" type="button">
                {option.label}
              </button>
            ))}
          </DropdownMenu>
        </div>

        <div className="menu-wrap">
          <button
            aria-expanded={openMenu === "export"}
            aria-label="Export campaign"
            className="select-button"
            onClick={() => setOpenMenu(openMenu === "export" ? null : "export")}
            type="button"
          >
            <Download size={16} />Export<ChevronDown size={15} />
          </button>
          <DropdownMenu open={openMenu === "export"}>
            {editorSnapshot.exportOptions.map((option) => (
              <button key={option} onClick={() => onExport(option)} role="menuitem" type="button">
                {option}
              </button>
            ))}
          </DropdownMenu>
        </div>

        <div className="menu-wrap">
          <button
            aria-expanded={openMenu === "share"}
            aria-label="Share campaign"
            className="select-button"
            onClick={() => setOpenMenu(openMenu === "share" ? null : "share")}
            type="button"
          >
            <Send size={16} />Share<ChevronDown size={15} />
          </button>
          <DropdownMenu open={openMenu === "share"}>
            {editorSnapshot.shareOptions.map((option) => (
              <button key={option} onClick={() => onShare(option)} role="menuitem" type="button">
                {option}
              </button>
            ))}
          </DropdownMenu>
        </div>

        <button className="bell-button" aria-label="Notifications" type="button">
          <Bell size={20} />
          <span>3</span>
        </button>
        <div className="profile-chip">
          <div className="avatar">MT</div>
          <div>
            <strong>{editorSnapshot.project.owner}</strong>
            <small>{editorSnapshot.project.role}</small>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}

function EditorToolbar({
  activeTab,
  model,
  onModelChange,
  onQualityChange,
  onSafeToggle,
  openMenu,
  quality,
  safeEnabled,
  setActiveTab,
  setOpenMenu,
}) {
  return (
    <div className="editor-toolbar">
      <div className="tabs" role="group" aria-label="Editor modes">
        <button
          aria-pressed={activeTab === "editor"}
          className={`tab ${activeTab === "editor" ? "is-active" : ""}`}
          onClick={() => setActiveTab("editor")}
          type="button"
        >
          Editor
        </button>
        <button
          aria-pressed={activeTab === "generate"}
          className={`tab ${activeTab === "generate" ? "is-active" : ""}`}
          onClick={() => setActiveTab("generate")}
          type="button"
        >
          AI Generate
        </button>
      </div>
      <div className="generation-controls">
        <div className="menu-wrap">
          <button
            aria-expanded={openMenu === "model"}
            className="control-pill"
            onClick={() => setOpenMenu(openMenu === "model" ? null : "model")}
            type="button"
          >
            <Sparkles size={14} />{model}<ChevronDown size={14} />
          </button>
          <DropdownMenu open={openMenu === "model"}>
            {editorSnapshot.video.models.map((option) => (
              <button key={option} onClick={() => onModelChange(option)} role="menuitem" type="button">
                {option}
              </button>
            ))}
          </DropdownMenu>
        </div>

        <div className="menu-wrap">
          <button
            aria-expanded={openMenu === "quality"}
            className="control-pill"
            onClick={() => setOpenMenu(openMenu === "quality" ? null : "quality")}
            type="button"
          >
            {quality}<ChevronDown size={14} />
          </button>
          <DropdownMenu open={openMenu === "quality"}>
            {editorSnapshot.video.qualities.map((option) => (
              <button key={option} onClick={() => onQualityChange(option)} role="menuitem" type="button">
                {option}
              </button>
            ))}
          </DropdownMenu>
        </div>

        <button
          aria-pressed={safeEnabled}
          className={`safe-pill ${safeEnabled ? "" : "is-off"}`}
          onClick={onSafeToggle}
          type="button"
        >
          <span />{safeEnabled ? "AI Safe" : "Manual Review"}
        </button>
      </div>
    </div>
  );
}

function VideoPreview({
  aspectRatio,
  captionsEnabled,
  currentSeconds,
  duration,
  fullscreen,
  isMuted,
  isPlaying,
  loopEnabled,
  onScrub,
  onSkip,
  onToggleCaptions,
  onToggleFullscreen,
  onToggleLoop,
  onToggleMute,
  onTogglePlay,
  shots,
}) {
  const progress = duration > 0 ? Math.min(100, (currentSeconds / duration) * 100) : 0;
  const activeShot = getShotAtTime(shots, currentSeconds);

  return (
    <Panel className={`video-panel ${fullscreen ? "is-fullscreen" : ""}`}>
      <div className="preview-stage">
        <CampaignVideoFrame
          activeShot={activeShot}
          currentSeconds={currentSeconds}
          isMuted={isMuted}
          isPlaying={isPlaying}
          loopEnabled={loopEnabled}
        />
        <div className="preview-badge">
          <span className={isPlaying ? "is-live" : ""} />
          {isPlaying ? "Playing" : "Preview"} {duration}s
        </div>
        <div className="timecode">{formatSeconds(currentSeconds)} / {formatSeconds(duration)}</div>
        <div className="preview-meta">
          <span>{aspectRatio}</span>
          {captionsEnabled ? <span>Captions on</span> : null}
          {loopEnabled ? <span>Loop</span> : null}
          {fullscreen ? <span>Fullscreen preview</span> : null}
        </div>
        {captionsEnabled ? <p className="caption-overlay">Glow that sells with one real serum drop.</p> : null}
      </div>
      <div className="player-controls" aria-label="Video preview controls">
        <div className="playback-buttons">
          <button aria-label={isPlaying ? "Pause video" : "Play video"} onClick={onTogglePlay} type="button">
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button aria-label="Skip to next shot" onClick={onSkip} type="button">
            <SkipForward size={17} fill="currentColor" />
          </button>
          <button aria-label={isMuted ? "Unmute video" : "Mute video"} onClick={onToggleMute} type="button">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
        <div className="scrub-track">
          <span className="scrub-fill" style={{ width: `${progress}%` }} />
          <span className="scrub-thumb" style={{ left: `${progress}%` }} />
          <span className="timeline-dot dot-a" />
          <span className="timeline-dot dot-b" />
          <input
            aria-label="Scrub timeline"
            max={duration}
            min="0"
            onChange={(event) => onScrub(Number(event.target.value))}
            type="range"
            value={currentSeconds}
          />
        </div>
        <div className="view-buttons">
          <button aria-label={loopEnabled ? "Turn loop off" : "Turn loop on"} onClick={onToggleLoop} type="button">
            <RefreshCw size={17} />
          </button>
          <button aria-label={captionsEnabled ? "Turn captions off" : "Turn captions on"} onClick={onToggleCaptions} type="button">
            <SlidersHorizontal size={17} />
          </button>
          <button aria-label={fullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"} onClick={onToggleFullscreen} type="button">
            <Maximize2 size={17} />
          </button>
        </div>
      </div>
    </Panel>
  );
}

function CampaignVideoFrame({ activeShot, currentSeconds, isMuted, isPlaying, loopEnabled }) {
  const videoRef = useRef(null);
  const videoSrc = activeShot?.videoAsset ? assets[activeShot.videoAsset] : null;
  const posterSrc = activeShot?.asset ? assets[activeShot.asset] : assets.mainFrame;
  const sourceSeconds = Math.max(
    0,
    (activeShot?.videoStartSeconds || 0) + (currentSeconds - (activeShot?.startSeconds || 0)),
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      const allowedDriftSeconds = isPlaying ? 0.5 : 0.08;
      if (Number.isFinite(sourceSeconds) && Math.abs((video.currentTime || 0) - sourceSeconds) > allowedDriftSeconds) {
        video.currentTime = sourceSeconds;
      }
    } catch {
      // Browser media seeking can be temporarily unavailable before metadata loads.
    }
  }, [isPlaying, sourceSeconds, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      if (isPlaying) {
        const playResult = video.play?.();
        playResult?.catch?.(() => {});
      } else {
        video.pause?.();
      }
    } catch {
      // jsdom and some autoplay policies reject media methods; the visible frame still renders.
    }
  }, [isPlaying, videoSrc]);

  if (!videoSrc) {
    return <img src={posterSrc} alt="PixVerse skincare campaign preview frame" />;
  }

  return (
    <video
      key={videoSrc}
      ref={videoRef}
      aria-label={`${activeShot?.title || "Campaign"} source video`}
      loop={loopEnabled}
      muted={isMuted}
      playsInline
      poster={posterSrc}
      preload="auto"
      src={videoSrc}
    />
  );
}

function TimelineProjectFrame({ currentSeconds, isMuted, isPlaying, project }) {
  const videoRef = useRef(null);
  const clip = getClipAtPlayhead(project, currentSeconds);
  const asset = project.mediaAssets.find((item) => item.id === clip?.assetId);
  const mediaSrc = asset?.objectUrl || asset?.src;
  const posterSrc = asset?.posterSrc || (asset?.assetKey ? assets[asset.assetKey] : assets.mainFrame);
  const sourceSeconds = Math.max(
    0,
    (clip?.sourceInSeconds || 0) + (currentSeconds - (clip?.startSeconds || 0)),
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      const allowedDriftSeconds = isPlaying ? 0.5 : 0.08;
      if (Number.isFinite(sourceSeconds) && Math.abs((video.currentTime || 0) - sourceSeconds) > allowedDriftSeconds) {
        video.currentTime = sourceSeconds;
      }
    } catch {
      // Browser media seeking can be temporarily unavailable before metadata loads.
    }
  }, [isPlaying, sourceSeconds, mediaSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      if (isPlaying) {
        const playResult = video.play?.();
        playResult?.catch?.(() => {});
      } else {
        video.pause?.();
      }
    } catch {
      // jsdom and autoplay policies may reject media methods; the current frame still renders.
    }
  }, [isPlaying, mediaSrc]);

  if (mediaSrc && asset?.kind === "video" && clip) {
    return (
      <video
        key={`${clip.id}-${mediaSrc}`}
        ref={videoRef}
        aria-label={`${clip.title} TikTok synced preview video`}
        loop={false}
        muted={isMuted}
        playsInline
        poster={posterSrc}
        preload="auto"
        src={mediaSrc}
      />
    );
  }

  return <img src={posterSrc} alt={`${clip?.title || "Timeline"} TikTok synced preview frame`} />;
}

function ShotMedia({ shot }) {
  const posterSrc = assets[shot.asset];
  const videoSrc = shot.videoAsset ? assets[shot.videoAsset] : null;

  if (!videoSrc) {
    return <img src={posterSrc} alt={shot.title} />;
  }

  return (
    <video
      aria-label={`${shot.title} source video`}
      muted
      playsInline
      poster={posterSrc}
      preload="auto"
      src={videoSrc}
    />
  );
}

function SocialPreview({ aspectRatio, currentSeconds, isMuted, isPlaying, loopEnabled, shots, timelineProject }) {
  const activeShot = getShotAtTime(shots, currentSeconds);

  return (
    <Panel className="social-preview-panel">
      <div className="section-title-line" data-testid="social-preview-title">
        <h2>Social Preview</h2>
        <span>({aspectRatio === "16:9" ? "9:16" : aspectRatio})</span>
      </div>
      <div className="phone-frame">
        {timelineProject ? (
          <TimelineProjectFrame
            currentSeconds={timelineProject.playheadSeconds}
            isMuted={isMuted}
            isPlaying={isPlaying}
            project={timelineProject}
          />
        ) : (
          <CampaignVideoFrame
            activeShot={activeShot}
            currentSeconds={currentSeconds}
            isMuted={isMuted}
            isPlaying={isPlaying}
            loopEnabled={loopEnabled}
          />
        )}
        <div className="phone-nav">
          <span><Home size={11} />Home</span>
          <span><Search size={11} />Discover</span>
          <span className="phone-plus"><Plus size={14} /></span>
          <span>Inbox</span>
          <span>Profile</span>
        </div>
      </div>
    </Panel>
  );
}

function ShotStrip({ currentSeconds, duration, onAddTimelineEvent, onSelectShot, selectedShotId, shots, timelineEvents }) {
  return (
    <Panel className="shots-panel">
      <div className="shots-header">
        <strong>{`Shots (${shots.length})`}</strong>
        <small>{duration.toFixed(1)}s</small>
      </div>
      <div className="shot-list">
        {shots.map((shot) => (
          <button
            aria-label={`Select shot ${shot.number}`}
            aria-pressed={selectedShotId === shot.id}
            className={`shot-card ${selectedShotId === shot.id ? "is-selected" : ""} ${shot.aiGenerated ? "is-generated" : ""}`}
            key={shot.id}
            onClick={() => onSelectShot(shot.id)}
            type="button"
          >
            <ShotMedia shot={shot} />
            <span className="shot-number">{shot.number}</span>
            <span className="shot-start">{shot.start}</span>
            <span className="shot-duration">{shot.durationSeconds.toFixed(1)}s</span>
            <span className="shot-title">{shot.title}</span>
          </button>
        ))}
      </div>
      <Timeline
        currentSeconds={currentSeconds}
        duration={duration}
        onAddTimelineEvent={onAddTimelineEvent}
        timelineEvents={timelineEvents}
      />
    </Panel>
  );
}

function Timeline({ currentSeconds, duration, onAddTimelineEvent, timelineEvents }) {
  const markers = buildTimelineMarkers(timelineEvents, duration);
  const playheadLeft = duration > 0 ? Math.min(100, (currentSeconds / duration) * 100) : 0;

  return (
    <div className="timeline">
      <div className="waveform" aria-hidden="true">
        {Array.from({ length: 112 }, (_, index) => (
          <span key={index} style={{ height: `${10 + ((index * 17) % 30)}px` }} />
        ))}
      </div>
      <div className="timeline-playhead" style={{ left: `${playheadLeft}%` }} />
      {markers.map((marker) => (
        <span key={marker.id} className={`timeline-marker ${marker.kind}`} style={{ left: marker.left }}>
          <Star size={10} fill="currentColor" />
        </span>
      ))}
      <button className="timeline-add" aria-label="Add timeline event" onClick={onAddTimelineEvent} type="button">
        <Plus size={22} />
      </button>
    </div>
  );
}

function ProductHotspots({
  editingHotspotId,
  hotspotDraft,
  hotspots,
  onAddHotspot,
  onDeleteHotspot,
  onEditHotspot,
  onSaveHotspot,
  setHotspotDraft,
}) {
  return (
    <Panel className="hotspots-panel">
      <div className="panel-heading">
        <h2>Product Hotspots</h2>
      </div>
      <div className="hotspot-layout">
        <div className="hotspot-image">
          <img src={assets.hotspotMap} alt="Product hotspot map on creator frame" />
          {hotspots.map((hotspot) => (
            <button
              aria-label={`Select ${hotspot.name}`}
              className="hotspot-pin"
              key={hotspot.id}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              type="button"
            >
              {hotspot.number}
            </button>
          ))}
        </div>
        <div className="hotspot-list">
          <div className="section-title-line">
            <h2>Hotspots</h2>
            <span>({hotspots.length})</span>
          </div>
          {hotspots.map((hotspot) => (
            <div className="hotspot-row" key={hotspot.id}>
              <span className="hotspot-index">{hotspot.number}</span>
              {editingHotspotId === hotspot.id ? (
                <form className="hotspot-edit-form" onSubmit={(event) => onSaveHotspot(event, hotspot.id)}>
                  <label className="sr-only" htmlFor={`hotspot-name-${hotspot.id}`}>Hotspot name</label>
                  <input
                    id={`hotspot-name-${hotspot.id}`}
                    onChange={(event) => setHotspotDraft(event.target.value)}
                    value={hotspotDraft}
                  />
                  <button aria-label="Save hotspot" type="submit"><Check size={13} /></button>
                </form>
              ) : (
                <>
                  <div>
                    <strong>{hotspot.name}</strong>
                    <small>{hotspot.range}</small>
                  </div>
                  <button aria-label={`Edit ${hotspot.name}`} onClick={() => onEditHotspot(hotspot)} type="button">
                    <Edit3 size={13} />
                  </button>
                  <button aria-label={`Delete ${hotspot.name}`} onClick={() => onDeleteHotspot(hotspot.id)} type="button">
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          ))}
          <button className="add-hotspot" onClick={onAddHotspot} type="button"><Plus size={15} />Add Hotspot</button>
        </div>
      </div>
    </Panel>
  );
}

function FrameFeedback({ compareEnabled, onToggleCompare, selectedShot }) {
  const feedback = editorSnapshot.feedbackByShot[selectedShot.id] || [
    { score: 87, status: "Good", note: "Generated shot follows the selected prompt and product framing." },
    { score: 78, status: "Consider", note: "Review the final overlay for platform-safe claims." },
    { score: 73, status: "Consider", note: "Use one more product close-up before the CTA." },
  ];

  return (
    <Panel className={`feedback-panel ${compareEnabled ? "is-comparing" : ""}`}>
      <div className="panel-heading">
        <h2 data-testid="frame-feedback-title">Frame Feedback <span>(Shot {selectedShot.number} - {formatSeconds(selectedShot.startSeconds)})</span></h2>
        <button className="compare-button" onClick={onToggleCompare} type="button">Compare</button>
      </div>
      <div className="feedback-layout">
        <div className="feedback-image-stack">
          <img src={assets.frameFeedback} alt="Current frame feedback still" />
          {compareEnabled ? <span>Before / After</span> : null}
        </div>
        <div className="feedback-list">
          {feedback.map((item) => (
            <div className="feedback-row" key={`${item.score}-${item.note}`}>
              <span className={`score-ring ${item.score >= 80 ? "good" : "warn"}`}>{item.score}</span>
              <div>
                <strong>{item.status}</strong>
                <small>{item.note}</small>
              </div>
            </div>
          ))}
          {compareEnabled ? (
            <div className="compare-note">
              <strong>Compare lift</strong>
              <small>Predicted +8.4% hold rate after headroom and CTA timing fixes.</small>
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

function AIGenerateStudio({
  activePresetId,
  balance,
  generationDuration,
  generationEstimate,
  generationPrompt,
  onGenerate,
  sampleCount,
  setActivePresetId,
  setGenerationDuration,
  setGenerationPrompt,
  setSampleCount,
  safeEnabled,
}) {
  const activePreset = editorSnapshot.generationPresets.find((preset) => preset.id === activePresetId) || editorSnapshot.generationPresets[0];
  const activeDuration = editorSnapshot.generationDurations.find((duration) => duration.seconds === generationDuration) || editorSnapshot.generationDurations[1];
  const hasEnoughCredits = balance >= generationEstimate.totalCredits;

  function appendPromptChip(chip) {
    setGenerationPrompt((value) => {
      const cleanValue = value.trim();
      return cleanValue ? `${cleanValue}, ${chip}` : chip;
    });
  }

  return (
    <Panel className="ai-studio-panel">
      <div className="ai-studio-heading">
        <div>
          <h2>AI Generate Studio</h2>
          <p>Build guided PixVerse sample clips from a trend preset, prompt brief, duration, and AI Safe checks.</p>
        </div>
        <div className="cost-chip">
          <WandSparkles size={15} />
          <span>
            <strong>{generationEstimate.totalCredits.toLocaleString()} credits total</strong>
            <small>{generationEstimate.label}</small>
          </span>
        </div>
      </div>

      <div className="studio-step">
        <div className="studio-step-heading">
          <span>1</span>
          <div>
            <strong>Pick a trend preset</strong>
            <small>{activePreset.outcome}</small>
          </div>
        </div>
        <div className="preset-row" role="group" aria-label="Generation presets">
          {editorSnapshot.generationPresets.map((preset) => (
            <button
              aria-pressed={preset.id === activePresetId}
              className={preset.id === activePresetId ? "is-active" : ""}
              key={preset.id}
              onClick={() => setActivePresetId(preset.id)}
              type="button"
            >
              <strong>{preset.label}</strong>
              <small>{preset.angle}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="generation-plan-grid">
        <div className="studio-step compact">
          <div className="studio-step-heading">
            <span>2</span>
            <div>
              <strong>Sample count</strong>
              <small>Spin up candidates before choosing one for the cut.</small>
            </div>
          </div>
          <div className="segmented-options" role="group" aria-label="Sample count">
            {editorSnapshot.generationSampleCounts.map((count) => (
              <button
                aria-pressed={sampleCount === count}
                className={sampleCount === count ? "is-active" : ""}
                key={count}
                onClick={() => setSampleCount(count)}
                type="button"
              >
                {count} {count === 1 ? "sample" : "samples"}
              </button>
            ))}
          </div>
        </div>

        <div className="studio-step compact">
          <div className="studio-step-heading">
            <span>3</span>
            <div>
              <strong>Clip duration</strong>
              <small>{activeDuration.note}</small>
            </div>
          </div>
          <div className="segmented-options" role="group" aria-label="Clip duration">
            {editorSnapshot.generationDurations.map((duration) => (
              <button
                aria-pressed={duration.seconds === generationDuration}
                className={duration.seconds === generationDuration ? "is-active" : ""}
                key={duration.seconds}
                onClick={() => setGenerationDuration(duration.seconds)}
                type="button"
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="guided-prompt-grid">
        <div className="studio-step prompt-step">
          <div className="studio-step-heading">
            <span>4</span>
            <div>
              <strong>Write the brief</strong>
              <small>Prompt chips add concrete camera, proof, and commerce cues.</small>
            </div>
          </div>
          <label className="prompt-field">
            <span>Generation prompt</span>
            <textarea
              onChange={(event) => setGenerationPrompt(event.target.value)}
              placeholder="Describe the product shot, camera motion, overlay, safe-zone, and CTA."
              value={generationPrompt}
            />
          </label>
          <div className="prompt-chip-row" aria-label="Prompt helpers">
            {editorSnapshot.generationPromptChips.map((chip) => (
              <button key={chip} onClick={() => appendPromptChip(chip)} type="button">
                <Plus size={12} />{chip}
              </button>
            ))}
          </div>
        </div>

        <div className="studio-step coach-step">
          <div className="studio-step-heading">
            <span>5</span>
            <div>
              <strong>Preset coach</strong>
              <small>Use this structure to keep the generated clip shoppable.</small>
            </div>
          </div>
          <div className="coach-list">
            {activePreset.guide.map((item) => (
              <div key={item.label}>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ai-safe-bar">
        <div>
          <strong>{safeEnabled ? editorSnapshot.aiSafeChecks.status : "Manual Review"}</strong>
          <small>
            {safeEnabled
              ? "Checks run before each sample enters the shot strip."
              : "Generated samples stay flagged for human review before export."}
          </small>
        </div>
        <div className="ai-safe-checks">
          {editorSnapshot.aiSafeChecks.items.map((item) => (
            <span key={item}><Check size={13} />{item}</span>
          ))}
        </div>
      </div>

      <div className="ai-studio-actions">
        <span>
          {balance.toLocaleString()} credits available
          <small>{generationEstimate.creditsPerSample.toLocaleString()} credits per sample - {generationEstimate.totalDurationSeconds}s total generated media</small>
        </span>
        <button disabled={!hasEnoughCredits} onClick={onGenerate} type="button">
          <Sparkles size={15} />{hasEnoughCredits ? "Generate samples" : "Add credits"}
        </button>
      </div>
    </Panel>
  );
}

function TrendTranslator({
  onApplyTrendBeat,
  onSaveTrendAngle,
  onTrendSignal,
  trendIndex,
  setTrendIndex,
}) {
  const trendCards = editorSnapshot.trendCards;
  const trend = trendCards[trendIndex];

  function moveTrend(delta) {
    setTrendIndex((index) => (index + delta + trendCards.length) % trendCards.length);
  }

  return (
    <CollapsiblePanel
      className="trend-panel"
      label="Trend Brief"
      title={<><span className="plain-heading">Trend Brief</span> <span>Beta</span></>}
    >
      <p className="micro-label">What&apos;s the vibe?</p>
      <div className="chip-row">
        {trend.chips.map((chip) => (
          <button key={chip} onClick={() => onTrendSignal(chip)} type="button">{chip}</button>
        ))}
      </div>
      <div className="trend-score-grid">
        <div className="trend-score-card">
          <small>Trend Fit</small>
          <strong>{trend.fitScore}</strong>
          <span>{trend.platform}</span>
        </div>
        <div className="trend-signal-card">
          <small>Why now</small>
          <strong>{trend.signal}</strong>
          <span>{trend.shopperIntent}</span>
        </div>
      </div>
      <div className="translation-block">
        <strong>{trend.title}</strong>
        <p>{trend.translation}</p>
        <small>{trend.example}</small>
      </div>
      <div className="trend-hook">
        <small>Hook</small>
        <strong>{trend.hook}</strong>
      </div>
      <div className="trend-plan-heading">
        <strong>15s plan</strong>
        <small>{trend.guardrail}</small>
      </div>
      <ol className="trend-shot-plan">
        {trend.shotPlan.map((step) => (
          <li key={`${trend.id}-${step.time}`}>
            <span>{step.time}</span>
            <div>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </div>
          </li>
        ))}
      </ol>
      <div className="trend-copy-grid">
        <div>
          <small>Overlay copy</small>
          <strong>{trend.overlayCopy}</strong>
        </div>
        <div>
          <small>CTA</small>
          <strong>{trend.cta}</strong>
        </div>
      </div>
      <ul className="check-list">
        {trend.checklist.map((item) => (
          <li key={item}><Check size={14} />{item}</li>
        ))}
      </ul>
      <div className="panel-footer-row">
        <button aria-label="Add trend beat" className="see-examples is-primary" onClick={() => onApplyTrendBeat(trend)} type="button">
          <Plus size={13} />Add beat
        </button>
        <button aria-label="Save trend angle" className="see-examples" onClick={() => onSaveTrendAngle(trend)} type="button">
          <Check size={13} />Save
        </button>
        <span>{trendIndex + 1}/{trendCards.length}</span>
        <button aria-label="Previous trend" onClick={() => moveTrend(-1)} type="button"><ChevronLeft size={14} /></button>
        <button aria-label="Next trend" onClick={() => moveTrend(1)} type="button"><ChevronRight size={14} /></button>
      </div>
    </CollapsiblePanel>
  );
}

function TopVideos({ onSelectVideo }) {
  const [showAll, setShowAll] = useState(false);
  const videos = showAll
    ? [
      ...editorSnapshot.topVideos,
      { rank: 4, title: "Serum Texture Loop", duration: "24.4s", channel: "TikTok", reach: "5.9M", trend: "9.8%", lift: "1.9%", asset: "shotBubbles" },
      { rank: 5, title: "Shopee Bundle Hook", duration: "18.8s", channel: "Reels", reach: "4.4M", trend: "8.1%", lift: "1.4%", asset: "shotBottle" },
    ]
    : editorSnapshot.topVideos;

  return (
    <CollapsiblePanel
      actions={<button onClick={() => setShowAll((value) => !value)} type="button">{showAll ? "Show less" : "View all"}</button>}
      className="top-videos-panel"
      headingClassName="compact"
      label="Top Performing Videos"
      title={<>Top Performing Videos <span>(Skincare)</span></>}
    >
      <div className="video-rank-list">
        {videos.map((video) => (
          <button className="video-rank-row" key={video.rank} onClick={() => onSelectVideo(video)} type="button">
            <span className="rank-number">{video.rank}</span>
            <img src={assets[video.asset]} alt="" />
            <span className="rank-copy">
              <strong>{video.title}</strong>
              <small>{video.duration} - {video.channel}</small>
            </span>
            <span className="rank-metrics">
              <b>{video.reach}</b>
              <small>^^ {video.trend}</small>
              <small>+ {video.lift}</small>
            </span>
          </button>
        ))}
      </div>
    </CollapsiblePanel>
  );
}

function FilmingTips({ onAddNotes, selectedShot }) {
  const review = editorSnapshot.filmingReviews[selectedShot.id] || editorSnapshot.filmingReviewFallback;
  const frameSrc = assets[selectedShot.asset] || assets.filmingTips;
  const shotEnd = selectedShot.startSeconds + selectedShot.durationSeconds;
  const priorityTone = review.priority.toLowerCase();

  return (
    <CollapsiblePanel
      actions={(
        <button className="tip-brief-button" aria-label="Add filming notes to shot brief" onClick={() => onAddNotes(selectedShot)} type="button">
          <Plus size={13} />Brief
        </button>
      )}
      className="tips-panel"
      label="Filming Tips"
      title={<>Filming Tips <span>(From Current Frame)</span></>}
    >
      <div className="tip-context-row">
        <div>
          <p className="tip-context">Current frame: {selectedShot.title}</p>
          <strong>Shot {selectedShot.number} - {formatSeconds(selectedShot.startSeconds)} to {formatSeconds(shotEnd)}</strong>
        </div>
        <span className={`priority-pill ${priorityTone}`}>{review.priority} priority</span>
      </div>

      <div className="tips-review-hero">
        <div className="tips-frame">
          <img src={frameSrc} alt={`${selectedShot.title} framing analysis`} />
          <div className="frame-badges" aria-hidden="true">
            <span>9:16 safe</span>
            <span>Rule of thirds</span>
          </div>
          <span className="frame-line horizontal top" />
          <span className="frame-line horizontal bottom" />
          <span className="frame-line vertical left" />
          <span className="frame-line vertical right" />
          <span className="frame-target" />
          <b><Camera size={11} />Safe crop</b>
        </div>
        <div className="readiness-card">
          <div className="readiness-score" style={{ "--score": `${review.score}%` }}>
            <strong>{review.score}</strong>
            <span>/100</span>
          </div>
          <div className="readiness-copy">
            <small>Shot readiness</small>
            <span>{review.verdict}</span>
          </div>
          <div className="readiness-priority">
            <small>Decision</small>
            <b>{review.priority === "Low" ? "Keep with notes" : "Adjust before export"}</b>
          </div>
        </div>
      </div>

      <p className="tip-summary">{review.summary}</p>

      <div className="tips-metrics" aria-label="Filming review metrics">
        {review.metrics.map((metric) => (
          <div className={metric.status === "Good" ? "is-good" : "is-tune"} key={metric.label}>
            <div className="metric-label-row">
              <small>{metric.label}</small>
              <span>{metric.status}</span>
            </div>
            <strong>{metric.score}</strong>
            <div className="metric-bar" aria-hidden="true">
              <i style={{ width: `${metric.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="tips-fix-header">
        <strong>Priority fixes</strong>
        <span>{review.priorityFixes.length} notes</span>
      </div>
      <div className="tips-list">
        {review.priorityFixes.map((fix) => (
          <div className={`tip-row ${fix.type}`} key={fix.title}>
            <span className={`tip-dot ${fix.type}`}>
              {fix.type === "warn" ? <AlertTriangle size={11} /> : <Check size={11} />}
            </span>
            <div>
              <strong>{fix.title}</strong>
              <small>{fix.detail}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="next-setup">
        <span><ShieldCheck size={13} />Next setup</span>
        <strong>{review.nextSetup}</strong>
      </div>

      <div className="tips-strengths" aria-label="Frame strengths">
        {review.strengths.map((strength) => (
          <span key={strength}><Check size={11} />{strength}</span>
        ))}
      </div>
    </CollapsiblePanel>
  );
}

function PropsChecklist({ items, onSource, onToggle }) {
  const progress = getChecklistProgress(items);

  return (
    <CollapsiblePanel
      actions={<span>{progress.label}</span>}
      className="props-panel"
      headingClassName="compact"
      label="Props Sourcing Checklist"
      title="Props Sourcing Checklist"
    >
      <div className="props-list">
        {items.map((item) => (
          <div className="prop-row" key={item.id}>
            <label className="prop-check">
              <input checked={item.done} onChange={() => onToggle(item.id)} type="checkbox" aria-label={`${item.label} ${item.source}`} />
              <span className="fake-check"><Check size={11} /></span>
              <strong>{item.label}</strong>
            </label>
            <small>{item.source}</small>
            <button aria-label={`Source ${item.label}`} onClick={() => onSource(item)} type="button"><ShoppingCart size={14} /></button>
          </div>
        ))}
      </div>
    </CollapsiblePanel>
  );
}

function ListingAssets({ listingTab, listingVersion, onCopy, onRegenerate, setListingTab }) {
  const images = editorSnapshot.listingAssets.images;

  return (
    <CollapsiblePanel
      actions={<button aria-label="Regenerate listing assets" onClick={onRegenerate} type="button"><RefreshCw size={13} />Regenerate</button>}
      className="listing-panel"
      headingClassName="compact"
      label="Listing Assets"
      title={<>Listing Assets <span>(Auto-Generated)</span></>}
    >
      <div className="listing-tabs">
        <button
          aria-label="Images tab"
          className={listingTab === "images" ? "is-active" : ""}
          onClick={() => setListingTab("images")}
          type="button"
        >
          Images ({images.length})
        </button>
        <button
          aria-label="Description tab"
          className={listingTab === "description" ? "is-active" : ""}
          onClick={() => setListingTab("description")}
          type="button"
        >
          Description
        </button>
        <button
          aria-label="SEO keywords tab"
          className={listingTab === "seo" ? "is-active" : ""}
          onClick={() => setListingTab("seo")}
          type="button"
        >
          SEO Keywords
        </button>
      </div>

      {listingTab === "images" ? (
        <div className="asset-strip">
          {images.map((image, index) => (
            <div className="asset-tile" key={image}>
              <img src={assets[image]} alt="" />
              {index === 3 ? <span><Play size={12} fill="currentColor" /></span> : null}
            </div>
          ))}
        </div>
      ) : null}

      {listingTab === "description" ? (
        <div className="asset-copy-block is-full">
          <strong>Description v{listingVersion}</strong>
          <p>{editorSnapshot.listingAssets.description}</p>
          {editorSnapshot.listingAssets.captions.map((caption) => <small key={caption}>{caption}</small>)}
        </div>
      ) : null}

      {listingTab === "seo" ? (
        <div className="asset-keywords is-full">
          <strong>SEO Keywords</strong>
          <div>
            {editorSnapshot.listingAssets.seo.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
        </div>
      ) : null}

      <button aria-label="Copy listing assets" className="copy-all" onClick={onCopy} type="button">
        <Copy size={12} />Copy All
      </button>
    </CollapsiblePanel>
  );
}

function PeopleHero({ selectedPerson, selectedGender }) {
  return (
    <Panel className="people-hero-panel">
      <div className="people-hero-copy">
        <h2>UGC AI People</h2>
        <p>
          Pick a licensed AI creator for the Summer Glow campaign, then carry the same approved
          reference into PixVerse testimonial shots, social cuts, and listing assets.
        </p>
        <div className="people-stepper" aria-label="AI People workflow">
          {editorSnapshot.aiPeople.uploadRequirements.map((requirement, index) => (
            <span key={requirement}>
              <b>{index + 1}</b>
              {requirement}
            </span>
          ))}
        </div>
      </div>
      <div className="people-hero-card">
        <img src={assets[selectedPerson.asset]} alt={`${selectedPerson.name} campaign reference`} />
        <div>
          <strong data-testid="selected-person-name">{selectedPerson.name}</strong>
          <small>{selectedPerson.role} - {selectedPerson.locale}</small>
          <span>Creator gender: {selectedGender}</span>
        </div>
      </div>
    </Panel>
  );
}

function ModelUploadPanel({ uploadedModelName, onUploadReference, selectedPerson }) {
  const hasCustomReference = Boolean(uploadedModelName);

  return (
    <Panel className="people-upload-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Model Reference</h3>
          <p>{hasCustomReference ? "Custom reference ready" : "Using selected creator reference"}</p>
        </div>
        <span className="reference-pill is-ready">
          <FileImage size={14} />
          {hasCustomReference ? "Uploaded" : "Profile ready"}
        </span>
      </div>
      <label className="people-dropzone" htmlFor="people-reference-upload">
        <input
          accept="image/png,image/jpeg,image/webp"
          aria-label="Upload model reference"
          className="sr-only"
          id="people-reference-upload"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onUploadReference(file.name);
            }
          }}
          type="file"
        />
        <span className="upload-glyph"><Upload size={22} /></span>
        <strong>{uploadedModelName || "Upload custom reference"}</strong>
        <small>Optional PNG, JPG, WEBP - clear face, natural light, release on file</small>
      </label>
      <div className="reference-preview-row">
        <img src={assets[selectedPerson.asset]} alt={`${selectedPerson.name} reference preview`} />
        <div>
          <strong>{selectedPerson.look}</strong>
          <small>{selectedPerson.consent}</small>
        </div>
      </div>
    </Panel>
  );
}

function GenderPanel({ selectedGender, onSelectGender }) {
  return (
    <Panel className="gender-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Gender</h3>
          <p>Gender intent: {selectedGender}</p>
        </div>
        <UserRound size={18} />
      </div>
      <div className="gender-segmented" role="group" aria-label="Gender">
        {editorSnapshot.aiPeople.genderOptions.map((option) => (
          <button
            aria-label={option.label}
            aria-pressed={selectedGender === option.label}
            className={selectedGender === option.label ? "is-selected" : ""}
            key={option.id}
            onClick={() => onSelectGender(option.label)}
            type="button"
          >
            <strong>{option.label}</strong>
            <small>{option.tone}</small>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function CreatorCasting({ creatorProfiles, onGenerateAudition, selectedPersonId, onSelectPerson }) {
  return (
    <Panel className="creator-casting-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Creator Casting</h3>
          <p>Reusable licensed AI creators for UGC campaign variants</p>
        </div>
        <button className="compact-action" onClick={onGenerateAudition} type="button">
          <Sparkles size={14} />Generate audition
        </button>
      </div>
      <div className="creator-grid">
        {creatorProfiles.map((person) => {
          const selected = person.id === selectedPersonId;

          return (
            <article className={`creator-card ${selected ? "is-selected" : ""}`} key={person.id}>
              <img src={assets[person.asset]} alt={`${person.name} creator frame`} />
              <div className="creator-card-copy">
                <div>
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                </div>
                <span>{person.gender}</span>
              </div>
              <dl>
                <div>
                  <dt>Fit</dt>
                  <dd>{person.fitScore}%</dd>
                </div>
                <div>
                  <dt>Voice</dt>
                  <dd>{person.voice}</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>{person.language}</dd>
                </div>
              </dl>
              <button
                aria-label={`Use ${person.name}`}
                className="use-person-button"
                onClick={() => onSelectPerson(person.id)}
                type="button"
              >
                {selected ? <Check size={14} /> : <Plus size={14} />}
                {selected ? "Selected" : "Use"}
              </button>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function GenerationSettingsPanel({ selectedPerson }) {
  const generationSettings = selectedPerson.generationSettings || editorSnapshot.aiPeople.generationSettings;

  return (
    <Panel className="generation-settings-panel">
      <div className="people-panel-heading">
        <div>
          <h3>People Generation Controls</h3>
          <p>Locks that keep UGC shots consistent across the campaign</p>
        </div>
        <Camera size={18} />
      </div>
      <div className="settings-grid">
        {generationSettings.map((setting) => (
          <div className="setting-tile" key={setting.label}>
            <span>{setting.label}</span>
            <strong>{setting.value}</strong>
            <small>{setting.detail}</small>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SelectedPersonPanel({ selectedPerson }) {
  return (
    <Panel className="selected-person-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Selected Creator</h3>
          <p>Creator fit: {selectedPerson.fitScore}%</p>
        </div>
        <BadgeCheck size={18} />
      </div>
      <div className="selected-person-card">
        <img src={assets[selectedPerson.asset]} alt={`${selectedPerson.name} selected creator`} />
        <div>
          <strong>{selectedPerson.name}</strong>
          <small>{selectedPerson.gender} - {selectedPerson.language}</small>
          <span>{selectedPerson.consent}</span>
        </div>
      </div>
    </Panel>
  );
}

function ReadinessPanel({ referenceUploaded }) {
  const readiness = getPeopleReadiness(editorSnapshot.aiPeople, { referenceUploaded });

  return (
    <Panel className="readiness-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Generation Readiness</h3>
          <p>PixVerse people setup</p>
        </div>
        <strong className="readiness-score">{readiness.label}</strong>
      </div>
      <div className="readiness-list">
        {editorSnapshot.aiPeople.readinessChecklist.map((item) => {
          const done = item.id === "reference" ? referenceUploaded || item.done : item.done;

          return (
            <div className={`readiness-row ${done ? "is-done" : ""}`} key={item.id}>
              <span><Check size={12} /></span>
              <strong>{item.label}</strong>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function GuardrailsPanel() {
  return (
    <Panel className="guardrails-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Consent & Usage Guardrails</h3>
          <p>Export rules for AI UGC creators</p>
        </div>
        <ShieldCheck size={18} />
      </div>
      <ul>
        {editorSnapshot.aiPeople.guardrails.map((guardrail) => (
          <li key={guardrail}><Check size={13} />{guardrail}</li>
        ))}
      </ul>
    </Panel>
  );
}

function AuditionPlanPanel({ selectedPerson }) {
  return (
    <Panel className="audition-plan-panel">
      <div className="people-panel-heading">
        <div>
          <h3>UGC Audition Plan</h3>
          <p>{selectedPerson.name} mapped to campaign timing</p>
        </div>
      </div>
      <div className="audition-list">
        {editorSnapshot.aiPeople.auditionScripts.map((script) => (
          <div className="audition-row" key={script.id}>
            <span>{script.duration}</span>
            <div>
              <strong>{script.title}</strong>
              <small>{script.line}</small>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PeopleWorkspace({
  creatorProfiles,
  selectedGender,
  selectedPersonId,
  uploadedModelName,
  onGenerateAudition,
  onSelectGender,
  onSelectPerson,
  onUploadReference,
}) {
  const selectedPerson = useMemo(
    () =>
      creatorProfiles.find((person) => person.id === selectedPersonId) ||
      creatorProfiles[0],
    [selectedPersonId, creatorProfiles],
  );
  const selectedCreatorGender = selectedPerson.gender || selectedGender;

  return (
    <main className="people-page">
      <section className="people-main">
        <PeopleHero selectedPerson={selectedPerson} selectedGender={selectedCreatorGender} />
        <div className="people-builder-grid">
          <ModelUploadPanel
            onUploadReference={onUploadReference}
            selectedPerson={selectedPerson}
            uploadedModelName={uploadedModelName}
          />
          <GenderPanel selectedGender={selectedCreatorGender} onSelectGender={onSelectGender} />
        </div>
        <CreatorCasting
          creatorProfiles={creatorProfiles}
          onGenerateAudition={onGenerateAudition}
          selectedPersonId={selectedPersonId}
          onSelectPerson={onSelectPerson}
        />
        <GenerationSettingsPanel selectedPerson={selectedPerson} />
      </section>
      <aside className="people-right-rail">
        <SelectedPersonPanel selectedPerson={selectedPerson} />
        <ReadinessPanel referenceUploaded={Boolean(uploadedModelName)} />
        <GuardrailsPanel />
        <AuditionPlanPanel selectedPerson={selectedPerson} />
      </aside>
    </main>
  );
}

function BrandGuidePanel({ brandGuide }) {
  return (
    <Panel className="brand-guide-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Brand Guide</h3>
          <p>Pulled from {brandGuide.website} during onboarding</p>
        </div>
        <span className="brand-guide-pill">
          <Check size={13} />
          Synced
        </span>
      </div>

      <div className="brand-guide-summary">
        <div className="brand-guide-logo" aria-hidden="true">
          {assets[brandGuide.logoAssetKey] ? (
            <img src={assets[brandGuide.logoAssetKey]} alt="" />
          ) : (
            <Globe size={20} />
          )}
        </div>
        <div>
          <strong>{brandGuide.brandName}</strong>
          <small>{brandGuide.tagline}</small>
        </div>
      </div>

      <div className="brand-guide-section">
        <div className="brand-guide-section-heading">
          <Palette size={14} />
          <strong>Palette</strong>
        </div>
        <div className="brand-swatch-row">
          {brandGuide.palette.map((swatch) => (
            <div className="brand-swatch" key={swatch.hex}>
              <span className="brand-swatch-chip" style={{ background: swatch.hex }} />
              <span className="brand-swatch-meta">
                <strong>{swatch.name}</strong>
                <small>{swatch.hex}</small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="brand-guide-grid">
        <div className="brand-guide-section">
          <div className="brand-guide-section-heading">
            <Type size={14} />
            <strong>Typography</strong>
          </div>
          <div className="brand-guide-type">
            <span>
              <small>Headings</small>
              <strong>{brandGuide.typography.heading}</strong>
            </span>
            <span>
              <small>Body</small>
              <strong>{brandGuide.typography.body}</strong>
            </span>
          </div>
        </div>

        <div className="brand-guide-section">
          <div className="brand-guide-section-heading">
            <Sparkles size={14} />
            <strong>Voice</strong>
          </div>
          <p className="brand-guide-voice">{brandGuide.voice}</p>
        </div>
      </div>

      <div className="brand-guide-section">
        <div className="brand-guide-section-heading">
          <strong>Keywords</strong>
        </div>
        <div className="brand-tag-row">
          {brandGuide.keywords.map((keyword) => (
            <span className="brand-tag" key={keyword}>{keyword}</span>
          ))}
        </div>
      </div>

      <div className="brand-guide-section">
        <div className="brand-guide-section-heading">
          <strong>Avoid</strong>
        </div>
        <div className="brand-tag-row">
          {brandGuide.doNotSay.map((phrase) => (
            <span className="brand-tag is-warning" key={phrase}>{phrase}</span>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ProductUploadPanel({ onUpload, onRemove, productPreview, productName }) {
  return (
    <Panel className="product-upload-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Drop your product</h3>
          <p>Add a clear product photo on a neutral background.</p>
        </div>
        <Package size={18} />
      </div>

      {productPreview ? (
        <div className="product-preview-card">
          <img src={productPreview} alt={productName || "Uploaded product preview"} />
          <div className="product-preview-meta">
            <strong>{productName || "Product image"}</strong>
            <small>Ready to use as the hero reference</small>
            <button className="link-button" onClick={onRemove} type="button">
              <X size={13} />
              Remove and re-upload
            </button>
          </div>
        </div>
      ) : (
        <label className="product-dropzone" htmlFor="props-product-upload">
          <input
            accept="image/png,image/jpeg,image/webp"
            aria-label="Upload product image"
            className="sr-only"
            id="props-product-upload"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                  onUpload({
                    name: file.name,
                    preview: loadEvent.target?.result || "",
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
            type="file"
          />
          <span className="upload-glyph"><ImagePlus size={26} /></span>
          <strong>Upload product photo</strong>
          <small>PNG, JPG, WEBP — single product, even lighting, no clutter</small>
        </label>
      )}
    </Panel>
  );
}

function ProductDescriptionPanel({ description, onChange, productName, onProductNameChange }) {
  const characterCount = description.length;

  return (
    <Panel className="product-description-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Tell us about it</h3>
          <p>What is the product, who is it for, and what should the ad emphasize?</p>
        </div>
      </div>

      <label className="props-input-field">
        <span>Product name</span>
        <input
          aria-label="Product name"
          onChange={(event) => onProductNameChange(event.target.value)}
          placeholder="e.g. Sunbyme Miracle Serum"
          type="text"
          value={productName}
        />
      </label>

      <label className="props-input-field">
        <span>Description</span>
        <textarea
          aria-label="Product description"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Describe what makes it special — ingredients, the texture, who it's for, where it fits in their routine, the proof you'd want shown on screen."
          rows={6}
          value={description}
        />
        <small className={characterCount > 600 ? "is-warning" : ""}>
          {characterCount}/600 characters
        </small>
      </label>
    </Panel>
  );
}

function PropsActionBar({ canContinue, onContinue }) {
  return (
    <Panel className="props-action-bar">
      <div>
        <strong>Generate the ad concept</strong>
        <small>
          {canContinue
            ? "Looks good. Next, pick the AI creator who will appear in the ad."
            : "Upload a product photo and add a description to continue."}
        </small>
      </div>
      <button
        className="props-continue-button"
        disabled={!canContinue}
        onClick={onContinue}
        type="button"
      >
        <Sparkles size={15} />
        Generate ad
        <ArrowRight size={15} />
      </button>
    </Panel>
  );
}

function PropsWorkspace({ brandGuide, onContinue }) {
  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const canContinue = Boolean(product) && description.trim().length > 0;

  return (
    <main className="props-page">
      <section className="props-main">
        <header className="props-hero">
          <div>
            <p className="card-kicker">Step 1 of 2 — Props</p>
            <h2>Bring in your product</h2>
            <p>
              We&apos;ll generate an ad concept using your brand guide, your product, and the
              description you give us — before you pick the AI creator who&apos;ll star in it.
            </p>
          </div>
          <ol className="props-stepper" aria-label="Props workflow">
            <li className="is-active"><b>1</b>Upload product</li>
            <li className="is-active"><b>2</b>Describe it</li>
            <li><b>3</b>Pick AI creator</li>
          </ol>
        </header>

        <div className="props-builder-grid">
          <ProductUploadPanel
            onRemove={() => {
              setProduct(null);
              setProductName("");
            }}
            onUpload={(uploaded) => {
              setProduct(uploaded);
              if (!productName) {
                setProductName(uploaded.name.replace(/\.[^.]+$/, ""));
              }
            }}
            productName={productName}
            productPreview={product?.preview || null}
          />
          <ProductDescriptionPanel
            description={description}
            onChange={setDescription}
            onProductNameChange={setProductName}
            productName={productName}
          />
        </div>

        <PropsActionBar
          canContinue={canContinue}
          onContinue={() => onContinue({ product, productName, description })}
        />
      </section>

      <aside className="props-right-rail">
        <BrandGuidePanel brandGuide={brandGuide} />
      </aside>
    </main>
  );
}

function RightRail({
  checklist,
  listingTab,
  listingVersion,
  onApplyTrendBeat,
  onCopyListing,
  onRegenerateListing,
  onSaveTrendAngle,
  onSelectVideo,
  onAddFilmingNotes,
  onSourceProp,
  onToggleProp,
  onTrendSignal,
  selectedShot,
  setListingTab,
  setTrendIndex,
  trendIndex,
}) {
  return (
    <aside className="right-rail">
      <TrendTranslator
        onApplyTrendBeat={onApplyTrendBeat}
        onSaveTrendAngle={onSaveTrendAngle}
        onTrendSignal={onTrendSignal}
        trendIndex={trendIndex}
        setTrendIndex={setTrendIndex}
      />
      <TopVideos onSelectVideo={onSelectVideo} />
      <FilmingTips onAddNotes={onAddFilmingNotes} selectedShot={selectedShot} />
      <PropsChecklist items={checklist} onSource={onSourceProp} onToggle={onToggleProp} />
      <ListingAssets
        listingTab={listingTab}
        listingVersion={listingVersion}
        onCopy={onCopyListing}
        onRegenerate={onRegenerateListing}
        setListingTab={setListingTab}
      />
    </aside>
  );
}

function MainEditor({
  aspectRatio,
  currentSeconds,
  isMuted,
  isPlaying,
  loopEnabled,
  nlePreviewProject,
  onNlePlaybackChange,
  onNlePlayheadChange,
  onNleProjectChange,
  onSelectShot,
  onNleStatus,
  projectTitle,
  selectedShotId,
  shots,
  timelineEvents,
}) {
  return (
    <main className="editor-grid">
      <section className="left-canvas is-nle-primary">
        <CampaignNleBay
          onPlaybackChange={onNlePlaybackChange}
          onPlayheadChange={onNlePlayheadChange}
          onProjectChange={onNleProjectChange}
          onSelectShot={onSelectShot}
          onStatus={onNleStatus}
          projectTitle={projectTitle}
          selectedShotId={selectedShotId}
          shots={shots}
          timelineEvents={timelineEvents}
        />
      </section>
      <section className="middle-column is-nle-primary">
        <SocialPreview
          aspectRatio={aspectRatio}
          currentSeconds={currentSeconds}
          isMuted={isMuted}
          isPlaying={isPlaying}
          loopEnabled={loopEnabled}
          shots={shots}
          timelineProject={nlePreviewProject}
        />
      </section>
    </main>
  );
}

export default function App({
  activeDemoStep,
  activePage: routedActivePage,
  onGenerateCampaign,
  onNavigateWorkspace,
  onPublishClick,
  onRepromptClick,
  wizardData,
} = {}) {
  const [activePresetId, setActivePresetId] = useState(editorSnapshot.generationPresets[0].id);
  const [internalActivePage, setInternalActivePage] = useState(editorSnapshot.defaultPage);
  const [activeTab, setActiveTab] = useState("editor");
  const [aspectRatio, setAspectRatio] = useState(editorSnapshot.video.aspectRatio);
  const [balance, setBalance] = useState(editorSnapshot.video.balance);
  const [balanceDetails, setBalanceDetails] = useState(null);
  const [balanceStatus, setBalanceStatus] = useState("idle");
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [checklist, setChecklist] = useState(editorSnapshot.propsChecklist);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(editorSnapshot.video.currentSeconds);
  const [editingHotspotId, setEditingHotspotId] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [generationDuration, setGenerationDuration] = useState(editorSnapshot.generationDefaults.durationSeconds);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [hotspotDraft, setHotspotDraft] = useState("");
  const [hotspots, setHotspots] = useState(editorSnapshot.hotspots);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listingTab, setListingTab] = useState("images");
  const [listingVersion, setListingVersion] = useState(1);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [model, setModel] = useState(editorSnapshot.video.model);
  const [nlePreviewProject, setNlePreviewProject] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(editorSnapshot.projects[0].id);
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState(() => {
    if (wizardData && wizardData.product) {
      return `${wizardData.product.name} - PixVerse Campaign`;
    }
    return editorSnapshot.project.title;
  });
  const [quality, setQuality] = useState(editorSnapshot.video.quality);
  const [safeEnabled, setSafeEnabled] = useState(true);
  const [selectedGender, setSelectedGender] = useState(() => {
    if (wizardData && wizardData.character) {
      return wizardData.character.gender === "Female" ? "Woman" : "Man";
    }
    return editorSnapshot.aiPeople.defaultGender;
  });
  const [selectedPersonId, setSelectedPersonId] = useState(() => {
    if (wizardData && wizardData.character) {
      return wizardData.character.id;
    }
    return editorSnapshot.aiPeople.defaultPersonId;
  });
  const [sampleCount, setSampleCount] = useState(editorSnapshot.generationDefaults.sampleCount);
  const [selectedShotId, setSelectedShotId] = useState(editorSnapshot.selectedShotId);
  const [shots, setShots] = useState(editorSnapshot.shots);
  const [statusMessage, setStatusMessage] = useState("Saved");
  const [timelineEvents, setTimelineEvents] = useState(editorSnapshot.timelineEvents);
  const [titleDraft, setTitleDraft] = useState(editorSnapshot.project.title);
  const activePage = routedActivePage || internalActivePage;
  const [trendIndex, setTrendIndex] = useState(0);
  const [uploadedModelName, setUploadedModelName] = useState("");

  const currentProject = useMemo(() => {
    if (wizardData && wizardData.product) {
      return {
        id: "wizard-project",
        category: "Skincare",
        title: projectTitle,
        product: wizardData.product.name,
        thumb: wizardData.product.asset,
        channels: "TikTok Ads / Organic",
        brief: wizardData.story || "",
        status: "Active"
      };
    }
    return editorSnapshot.projects.find((project) => project.id === currentProjectId) || editorSnapshot.projects[0];
  }, [currentProjectId, wizardData, projectTitle]);

  const creatorProfiles = useMemo(() => {
    if (wizardData && wizardData.character) {
      const newProfile = {
        id: wizardData.character.id,
        name: wizardData.character.name,
        gender: wizardData.character.gender === "Female" ? "Woman" : "Man",
        role: `${wizardData.character.style} Spokesperson`,
        locale: "Singapore",
        language: "English",
        fitScore: 95,
        consent: "Model release signed",
        asset: wizardData.character.id,
        look: `${wizardData.character.style} style, natural window light`,
        voice: `${wizardData.character.style} UGC voice`
      };

      // Register character image in assets map dynamically
      assets[wizardData.character.id] = wizardData.character.image;

      return [newProfile, ...editorSnapshot.aiPeople.creatorProfiles];
    }
    return editorSnapshot.aiPeople.creatorProfiles;
  }, [wizardData]);

  const activePreset = useMemo(
    () => editorSnapshot.generationPresets.find((preset) => preset.id === activePresetId) || editorSnapshot.generationPresets[0],
    [activePresetId],
  );
  const generationEstimate = useMemo(
    () => getGenerationEstimate({
      durationSeconds: generationDuration,
      preset: activePreset,
      sampleCount,
    }),
    [activePreset, generationDuration, sampleCount],
  );

  const duration = getVideoDuration(shots);
  const selectedShot = useMemo(
    () => shots.find((shot) => shot.id === selectedShotId) || getShotAtTime(shots, currentSeconds) || shots[0],
    [currentSeconds, selectedShotId, shots],
  );

  async function refreshPixVerseBalance({ cancelled = () => false } = {}) {
    setBalanceStatus("loading");

    try {
      const snapshot = await fetchPixVerseBalanceSnapshot();
      if (cancelled()) {
        return;
      }
      setBalance(snapshot.totalCredits);
      setBalanceDetails(snapshot);
      setBalanceStatus("synced");
    } catch {
      if (!cancelled()) {
        setBalanceStatus("error");
      }
    }
  }

  useEffect(() => {
    let cancelled = false;
    refreshPixVerseBalance({ cancelled: () => cancelled });

    return () => {
      cancelled = true;
    };
  }, []);

  function setSavedMessage(message) {
    setStatusMessage(message);
  }

  function selectShot(id) {
    const shot = shots.find((item) => item.id === id);
    if (!shot) {
      return;
    }

    setSelectedShotId(id);
    setCurrentSeconds(shot.startSeconds);
    setSavedMessage(`Shot ${shot.number} selected`);
  }

  function scrubTo(seconds) {
    const nextSeconds = Math.min(duration, Math.max(0, seconds));
    const shot = getShotAtTime(shots, nextSeconds);
    setCurrentSeconds(nextSeconds);
    if (shot) {
      setSelectedShotId(shot.id);
    }
  }

  function syncFromNlePlayhead(seconds) {
    const nextSeconds = Math.max(0, Number(seconds) || 0);
    const shot = getShotAtTime(shots, nextSeconds);

    setCurrentSeconds(nextSeconds);
    if (shot) {
      setSelectedShotId(shot.id);
    }
  }

  function skipToNextShot() {
    const index = shots.findIndex((shot) => shot.id === selectedShotId);
    const nextShot = shots[(index + 1) % shots.length];
    setSelectedShotId(nextShot.id);
    setCurrentSeconds(nextShot.startSeconds);
    setSavedMessage(`Skipped to shot ${nextShot.number}`);
  }

  function addTimelineEvent() {
    const event = createTimelineEvent(timelineEvents, currentSeconds, "cta");
    setTimelineEvents((items) => [...items, event]);
    setSavedMessage(`Timeline marker added at ${formatSeconds(event.atSeconds)}`);
  }

  function addTrendBeat(trend) {
    const event = createTimelineEvent(timelineEvents, currentSeconds, trend.id);
    setTimelineEvents((items) => [...items, event]);
    setSavedMessage(`Trend beat added at ${formatSeconds(event.atSeconds)}: ${trend.title}`);
  }

  function changeProject(project) {
    setCurrentProjectId(project.id);
    setProjectTitle(project.title);
    setTitleDraft(project.title);
    setProjectSwitcherOpen(false);
    setSavedMessage(`Project changed: ${project.product}`);
  }

  function addHotspot() {
    const hotspot = createHotspot(hotspots, currentSeconds);
    setHotspots((items) => [...items, hotspot]);
    setSavedMessage(`${hotspot.name} hotspot added`);
  }

  function editHotspot(hotspot) {
    setEditingHotspotId(hotspot.id);
    setHotspotDraft(hotspot.name);
  }

  function saveHotspot(event, id) {
    event.preventDefault();
    const nextName = hotspotDraft.trim() || "Untitled hotspot";
    setHotspots((items) => items.map((item) => (item.id === id ? { ...item, name: nextName } : item)));
    setEditingHotspotId(null);
    setHotspotDraft("");
    setSavedMessage(`${nextName} hotspot saved`);
  }

  function deleteHotspot(id) {
    setHotspots((items) => (
      items
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, number: index + 1 }))
    ));
    setSavedMessage("Hotspot deleted");
  }

  function toggleProp(id) {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
    setSavedMessage("Prop checklist updated");
  }

  function saveProjectTitle(event) {
    event.preventDefault();
    const nextTitle = titleDraft.trim() || projectTitle;
    setProjectTitle(nextTitle);
    setTitleDraft(nextTitle);
    setIsEditingTitle(false);
    setSavedMessage("Project title saved");
  }

  function generateShot() {
    const prompt = generationPrompt.trim() || activePreset.prompt;
    if (generationEstimate.totalCredits > balance) {
      setSavedMessage("Not enough PixVerse credits for this generation plan");
      return;
    }

    const generatedShots = createGeneratedShots(shots, prompt, {
      durationSeconds: generationEstimate.durationSeconds,
      preset: activePreset,
      sampleCount: generationEstimate.sampleCount,
    });
    const firstShot = generatedShots[0];

    setShots((items) => [...items, ...generatedShots]);
    setSelectedShotId(firstShot.id);
    setCurrentSeconds(firstShot.startSeconds);
    setGenerationPrompt("");
    setBalance((value) => Math.max(0, value - generationEstimate.totalCredits));
    setActiveTab("editor");
    setSavedMessage(`Generation queued: ${generationEstimate.label}`);
  }

  function selectGenderIntent(gender) {
    const matchingPerson = creatorProfiles.find((person) => person.gender === gender);
    setSelectedGender(gender);
    if (matchingPerson) {
      setSelectedPersonId(matchingPerson.id);
    }
  }

  function selectCreator(personId) {
    const person = creatorProfiles.find((item) => item.id === personId);
    if (!person) {
      return;
    }

    setSelectedPersonId(person.id);
    setSelectedGender(person.gender);
  }

  function generateAudition() {
    const selectedPerson = creatorProfiles.find((person) => person.id === selectedPersonId)
      || creatorProfiles[0];
    const auditionShot = createAuditionShot(shots, selectedPerson, {
      scripts: editorSnapshot.aiPeople.auditionScripts,
    });

    setShots((items) => [...items, auditionShot]);
    setSelectedShotId(auditionShot.id);
    setCurrentSeconds(auditionShot.startSeconds);
    navigateWorkspace("editor");
    setSavedMessage(`Audition generated: ${selectedPerson.name} (${auditionShot.durationSeconds}s)`);
  }

  function handleAspectRatioChange(nextAspectRatio) {
    setAspectRatio(nextAspectRatio);
    setOpenMenu(null);
    setSavedMessage(`Aspect ratio set to ${nextAspectRatio}`);
  }

  function handleExport(option) {
    setOpenMenu(null);
    setSavedMessage(`Export queued: ${option}`);
  }

  function handleShare(option) {
    setOpenMenu(null);
    setSavedMessage(option === "Copy review link" ? "Review link copied" : `${option} ready`);
  }

  function navigateWorkspace(id) {
    if (id === "editor" || id === "people" || id === "props" || id === "cast") {
      if (onNavigateWorkspace) {
        onNavigateWorkspace(id);
      } else {
        setInternalActivePage(id);
      }
      setOpenMenu(null);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        balance={balance}
        balanceDetails={balanceDetails}
        balanceStatus={balanceStatus}
        onNavigate={navigateWorkspace}
        onOpenProjectSwitcher={() => setProjectSwitcherOpen(true)}
        onRefreshBalance={() => refreshPixVerseBalance()}
        project={currentProject}
      />
      <div className="workspace">
        <Topbar
          aspectRatio={aspectRatio}
          isEditingTitle={isEditingTitle}
          onAspectRatioChange={handleAspectRatioChange}
          onCancelTitleEdit={() => {
            setTitleDraft(projectTitle);
            setIsEditingTitle(false);
          }}
          onExport={handleExport}
          onSaveTitle={saveProjectTitle}
          onShare={handleShare}
          onStartTitleEdit={() => {
            setTitleDraft(projectTitle);
            setIsEditingTitle(true);
          }}
          openMenu={openMenu}
          projectTitle={projectTitle}
          setOpenMenu={setOpenMenu}
          setTitleDraft={setTitleDraft}
          statusMessage={statusMessage}
          titleDraft={titleDraft}
          activeDemoStep={activeDemoStep}
          onRepromptClick={onRepromptClick}
          onPublishClick={onPublishClick}
        />
        <div
          className={`content-shell ${activePage === "people" ? "people-content-shell" : ""} ${activePage === "props" ? "props-content-shell" : ""} ${activePage === "cast" ? "cast-content-shell" : ""}`}
        >
          {activePage === "cast" ? (
            <CastPage
              embedded
              initialSelection={wizardData?.characters || []}
              onBack={() => navigateWorkspace("people")}
              onGenerate={(characters) => {
                if (onGenerateCampaign) {
                  onGenerateCampaign({ characters });
                } else {
                  setSavedMessage(`${characters.length} influencer${characters.length === 1 ? "" : "s"} cast`);
                  navigateWorkspace("editor");
                }
              }}
              product={
                wizardData?.product || {
                  id: currentProject?.id || "prod-current",
                  name: currentProject?.product || "Current product",
                  price: currentProject?.price || "",
                  category: currentProject?.category || "Product",
                  asset: currentProject?.thumb,
                }
              }
              story={wizardData?.story || ""}
              tone={wizardData?.tone || "Authentic"}
            />
          ) : activePage === "props" ? (
            <PropsWorkspace
              brandGuide={editorSnapshot.brandGuide}
              onContinue={({ productName }) => {
                if (productName) {
                  setSavedMessage(`${productName} ready — pick an AI creator`);
                }
                navigateWorkspace("people");
              }}
            />
          ) : activePage === "people" ? (
            <PeopleWorkspace
              creatorProfiles={creatorProfiles}
              onGenerateAudition={generateAudition}
              onSelectGender={selectGenderIntent}
              onSelectPerson={selectCreator}
              onUploadReference={setUploadedModelName}
              selectedGender={selectedGender}
              selectedPersonId={selectedPersonId}
              uploadedModelName={uploadedModelName}
            />
          ) : (
            <>
              <MainEditor
                activePresetId={activePresetId}
                activeTab={activeTab}
                aspectRatio={aspectRatio}
                balance={balance}
                captionsEnabled={captionsEnabled}
                compareEnabled={compareEnabled}
                currentSeconds={currentSeconds}
                duration={duration}
                editingHotspotId={editingHotspotId}
                fullscreen={fullscreen}
                generationDuration={generationDuration}
                generationEstimate={generationEstimate}
                generationPrompt={generationPrompt}
                hotspotDraft={hotspotDraft}
                hotspots={hotspots}
                isMuted={isMuted}
                isPlaying={isPlaying}
                loopEnabled={loopEnabled}
                model={model}
                nlePreviewProject={nlePreviewProject}
                onAddHotspot={addHotspot}
                onAddTimelineEvent={addTimelineEvent}
                onDeleteHotspot={deleteHotspot}
                onEditHotspot={editHotspot}
                onGenerate={generateShot}
                onModelChange={(option) => {
                  setModel(option);
                  setOpenMenu(null);
                  setSavedMessage(`${option} selected`);
                }}
                onQualityChange={(option) => {
                  setQuality(option);
                  setOpenMenu(null);
                  setSavedMessage(`${option} output selected`);
                }}
                onSafeToggle={() => {
                  setSafeEnabled((value) => !value);
                  setSavedMessage(safeEnabled ? "Manual review enabled" : "AI Safe checks enabled");
                }}
                onSaveHotspot={saveHotspot}
                onScrub={scrubTo}
                onNlePlaybackChange={setIsPlaying}
                onNlePlayheadChange={syncFromNlePlayhead}
                onNleProjectChange={setNlePreviewProject}
                onSelectShot={selectShot}
                onSkip={skipToNextShot}
                onNleStatus={setSavedMessage}
                onToggleCaptions={() => {
                  setCaptionsEnabled((value) => !value);
                  setSavedMessage(captionsEnabled ? "Captions disabled" : "Captions enabled");
                }}
                onToggleCompare={() => setCompareEnabled((value) => !value)}
                onToggleFullscreen={() => setFullscreen((value) => !value)}
                onToggleLoop={() => setLoopEnabled((value) => !value)}
                onToggleMute={() => setIsMuted((value) => !value)}
                onTogglePlay={() => setIsPlaying((value) => !value)}
                openMenu={openMenu}
                projectTitle={projectTitle}
                quality={quality}
                safeEnabled={safeEnabled}
                sampleCount={sampleCount}
                selectedShot={selectedShot}
                selectedShotId={selectedShotId}
                setActivePresetId={setActivePresetId}
                setActiveTab={setActiveTab}
                setGenerationDuration={setGenerationDuration}
                setGenerationPrompt={setGenerationPrompt}
                setHotspotDraft={setHotspotDraft}
                setOpenMenu={setOpenMenu}
                setSampleCount={setSampleCount}
                shots={shots}
                timelineEvents={timelineEvents}
              />
              <RightRail
                checklist={checklist}
                listingTab={listingTab}
                listingVersion={listingVersion}
                onApplyTrendBeat={addTrendBeat}
                onCopyListing={() => setSavedMessage("Listing assets copied")}
                onRegenerateListing={() => {
                  setListingVersion((value) => value + 1);
                  setSavedMessage("Listing assets regenerated");
                }}
                onSaveTrendAngle={(trend) => setSavedMessage(`Trend angle saved: ${trend.title}`)}
                onSelectVideo={(video) => setSavedMessage(`${video.title} used as reference`)}
                onAddFilmingNotes={(shot) => setSavedMessage(`Filming notes added to shot ${shot.number} brief`)}
                onSourceProp={(item) => setSavedMessage(`Sourcing ${item.label} from ${item.vendor}`)}
                onToggleProp={toggleProp}
                onTrendSignal={(signal) => setSavedMessage(`Trend signal saved: ${signal}`)}
                selectedShot={selectedShot}
                setListingTab={setListingTab}
                setTrendIndex={setTrendIndex}
                trendIndex={trendIndex}
              />
            </>
          )}
        </div>
      </div>
      {projectSwitcherOpen ? (
        <ProjectSwitchDialog
          currentProjectId={currentProjectId}
          onClose={() => setProjectSwitcherOpen(false)}
          onSelectProject={changeProject}
        />
      ) : null}
    </div>
  );
}
