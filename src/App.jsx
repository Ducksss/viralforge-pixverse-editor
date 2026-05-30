import { useMemo, useState } from "react";
import {
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
  ClipboardList,
  Copy,
  Download,
  Edit3,
  FileImage,
  Film,
  Home,
  Image,
  Inbox,
  Layers,
  Maximize2,
  Monitor,
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
  Upload,
  UserRound,
  Users,
  Volume2,
  VolumeX,
  WandSparkles,
} from "lucide-react";
import { assets } from "./assetMap.js";
import {
  buildTimelineMarkers,
  createGeneratedShot,
  createHotspot,
  createTimelineEvent,
  editorSnapshot,
  formatSeconds,
  getChecklistProgress,
  getPeopleReadiness,
  getShotAtTime,
  getVideoDuration,
} from "./editorData.js";
import SetupWizard from "./SetupWizard.jsx";

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "test" || process.env.VITEST === "true");


const navIcons = {
  trend: CircleDot,
  research: ClipboardList,
  storyboard: Image,
  scheduler: CalendarDays,
  props: Store,
  people: Users,
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

function Sidebar({ activePage, balance, onNavigate, selectedProduct }) {
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
          <img src={selectedProduct ? assets[selectedProduct.asset] : assets.projectThumb} alt={selectedProduct ? selectedProduct.name : "Summer Glow serum bottle"} />
          <div>
            <strong>{selectedProduct ? selectedProduct.name : <>Summer Glow<br />Vitamin C Serum</>}</strong>
            <small>{editorSnapshot.project.channels}</small>
          </div>
        </div>
        <button className="dark-outline-button" type="button">Change</button>
      </div>


      <div className="sidebar-card balance-card">
        <p className="card-kicker">PixVerse Balance</p>
        <div className="balance-line">
          <strong>{balance.toLocaleString()}</strong>
          <button type="button">Top up</button>
        </div>
        <small>Resets in 12 days - Pro Plan</small>
      </div>

      <button className="settings-row" type="button">
        <Settings size={18} />
        <span>Settings</span>
        <ChevronRight size={16} />
      </button>
    </aside>
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
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <IconButton label="Back to all projects" className="ghost-icon">
          <ChevronLeft size={20} />
        </IconButton>
        <span className="all-projects">All Projects</span>
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
        <span className={`saved-state ${statusMessage === "Saved" ? "" : "is-working"}`} role="status" aria-live="polite">
          <span />
          {statusMessage}
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
}) {
  const progress = duration > 0 ? Math.min(100, (currentSeconds / duration) * 100) : 0;

  return (
    <Panel className={`video-panel ${fullscreen ? "is-fullscreen" : ""}`}>
      <div className="preview-stage">
        <img src={assets.mainFrame} alt="PixVerse skincare campaign preview frame" />
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

function SocialPreview({ aspectRatio }) {
  return (
    <Panel className="social-preview-panel">
      <div className="section-title-line" data-testid="social-preview-title">
        <h2>Social Preview</h2>
        <span>({aspectRatio === "16:9" ? "9:16" : aspectRatio})</span>
      </div>
      <div className="phone-frame">
        <img src={assets.socialPhoneFrame} alt="Vertical social cut of the skincare video" />
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
            <img src={assets[shot.asset]} alt={shot.title} />
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
  generationPrompt,
  onGenerate,
  setActivePresetId,
  setGenerationPrompt,
}) {
  const activePreset = editorSnapshot.generationPresets.find((preset) => preset.id === activePresetId);

  return (
    <Panel className="ai-studio-panel">
      <div className="ai-studio-heading">
        <div>
          <h2>AI Generate Studio</h2>
          <p>Build a new shot from a prompt, trend preset, and AI Safe checks.</p>
        </div>
        <div className="cost-chip">
          <WandSparkles size={15} />
          {activePreset.cost} credits
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
            {preset.label}
            <small>{preset.prompt}</small>
          </button>
        ))}
      </div>

      <label className="prompt-field">
        <span>Generation prompt</span>
        <textarea
          onChange={(event) => setGenerationPrompt(event.target.value)}
          placeholder="Describe the product shot, camera motion, overlay, and CTA."
          value={generationPrompt}
        />
      </label>

      <div className="ai-safe-checks">
        {editorSnapshot.aiSafeChecks.items.map((item) => (
          <span key={item}><Check size={13} />{item}</span>
        ))}
      </div>

      <div className="ai-studio-actions">
        <span>{balance.toLocaleString()} credits available</span>
        <button onClick={onGenerate} type="button"><Sparkles size={15} />Generate shot</button>
      </div>
    </Panel>
  );
}

function TrendTranslator({ onTrendSignal, trendIndex, setTrendIndex }) {
  const trendCards = editorSnapshot.trendCards;
  const trend = trendCards[trendIndex];

  function moveTrend(delta) {
    setTrendIndex((index) => (index + delta + trendCards.length) % trendCards.length);
  }

  return (
    <Panel className="right-panel trend-panel">
      <div className="right-heading">
        <h2><span className="plain-heading">Gen Z Trend Translator</span> <span>Beta</span></h2>
        <ChevronDown size={16} />
      </div>
      <p className="micro-label">What&apos;s the vibe?</p>
      <div className="chip-row">
        {trend.chips.map((chip) => (
          <button key={chip} onClick={() => onTrendSignal(chip)} type="button">{chip}</button>
        ))}
      </div>
      <div className="translation-block">
        <strong>{trend.title}</strong>
        <p>{trend.translation}</p>
        <small>{trend.example}</small>
      </div>
      <ul className="check-list">
        {trend.checklist.map((item) => (
          <li key={item}><Check size={14} />{item}</li>
        ))}
      </ul>
      <div className="panel-footer-row">
        <button className="see-examples" onClick={() => onTrendSignal(trend.example)} type="button">See examples</button>
        <span>{trendIndex + 1}/{trendCards.length}</span>
        <button aria-label="Previous trend" onClick={() => moveTrend(-1)} type="button"><ChevronLeft size={14} /></button>
        <button aria-label="Next trend" onClick={() => moveTrend(1)} type="button"><ChevronRight size={14} /></button>
      </div>
    </Panel>
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
    <Panel className="right-panel top-videos-panel">
      <div className="right-heading compact">
        <h2>Top Performing Videos <span>(Skincare)</span></h2>
        <button onClick={() => setShowAll((value) => !value)} type="button">{showAll ? "Show less" : "View all"}</button>
      </div>
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
    </Panel>
  );
}

function FilmingTips({ selectedShot }) {
  return (
    <Panel className="right-panel tips-panel">
      <div className="right-heading">
        <h2>Filming Tips <span>(From Current Frame)</span></h2>
        <ChevronDown size={16} />
      </div>
      <p className="tip-context">Current frame: {selectedShot.title}</p>
      <div className="tips-content">
        <img src={assets.filmingTips} alt="Grid overlay for current frame" />
        <div className="tips-list">
          {editorSnapshot.filmingTips.map((tip) => (
            <div className="tip-row" key={tip.title}>
              <span className={`tip-dot ${tip.type}`}><Check size={11} /></span>
              <div>
                <strong>{tip.title}</strong>
                {tip.detail ? <small>{tip.detail}</small> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function PropsChecklist({ items, onSource, onToggle }) {
  const progress = getChecklistProgress(items);

  return (
    <Panel className="right-panel props-panel">
      <div className="right-heading compact">
        <h2>Props Sourcing Checklist</h2>
        <span>{progress.label}</span>
      </div>
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
    </Panel>
  );
}

function ListingAssets({ listingTab, listingVersion, onCopy, onRegenerate, setListingTab }) {
  const images = editorSnapshot.listingAssets.images;

  return (
    <Panel className="right-panel listing-panel">
      <div className="right-heading compact">
        <h2>Listing Assets <span>(Auto-Generated)</span></h2>
        <button aria-label="Regenerate listing assets" onClick={onRegenerate} type="button"><RefreshCw size={13} />Regenerate</button>
      </div>
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
    </Panel>
  );
}

function PeopleHero({ selectedPerson, selectedGender }) {
  return (
    <Panel className="people-hero-panel">
      <div className="people-hero-copy">
        <h2>UGC AI People</h2>
        <p>
          Build a licensed creator for the Summer Glow campaign, then carry that person into
          PixVerse testimonial shots, social cuts, and listing assets.
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
  const ready = Boolean(uploadedModelName);

  return (
    <Panel className="people-upload-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Model Reference</h3>
          <p>{ready ? "Reference ready" : "Waiting for people reference"}</p>
        </div>
        <span className={`reference-pill ${ready ? "is-ready" : ""}`}>
          <FileImage size={14} />
          {ready ? "Uploaded" : "Needed"}
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
        <strong>{uploadedModelName || "Upload model reference"}</strong>
        <small>PNG, JPG, WEBP - clear face, natural light, release on file</small>
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

function CreatorCasting({ selectedPersonId, onSelectPerson, creatorProfiles }) {
  return (
    <Panel className="creator-casting-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Creator Casting</h3>
          <p>Reusable AI people for UGC campaign variants</p>
        </div>
        <button className="compact-action" type="button"><Sparkles size={14} />Generate audition</button>
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

function GenerationSettingsPanel() {
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
        {editorSnapshot.aiPeople.generationSettings.map((setting) => (
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
  selectedGender,
  selectedPersonId,
  uploadedModelName,
  onSelectGender,
  onSelectPerson,
  onUploadReference,
  creatorProfiles,
}) {
  const selectedPerson = useMemo(
    () =>
      creatorProfiles.find((person) => person.id === selectedPersonId) ||
      creatorProfiles[0],
    [selectedPersonId, creatorProfiles],
  );

  return (
    <main className="people-page">
      <section className="people-main">
        <PeopleHero selectedPerson={selectedPerson} selectedGender={selectedGender} />
        <div className="people-builder-grid">
          <ModelUploadPanel
            onUploadReference={onUploadReference}
            selectedPerson={selectedPerson}
            uploadedModelName={uploadedModelName}
          />
          <GenderPanel selectedGender={selectedGender} onSelectGender={onSelectGender} />
        </div>
        <CreatorCasting selectedPersonId={selectedPersonId} onSelectPerson={onSelectPerson} creatorProfiles={creatorProfiles} />
        <GenerationSettingsPanel />
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

function RightRail({
  checklist,
  listingTab,
  listingVersion,
  onCopyListing,
  onRegenerateListing,
  onSelectVideo,
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
      <TrendTranslator onTrendSignal={onTrendSignal} trendIndex={trendIndex} setTrendIndex={setTrendIndex} />
      <TopVideos onSelectVideo={onSelectVideo} />
      <FilmingTips selectedShot={selectedShot} />
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
  activePresetId,
  activeTab,
  aspectRatio,
  balance,
  captionsEnabled,
  compareEnabled,
  currentSeconds,
  duration,
  editingHotspotId,
  fullscreen,
  generationPrompt,
  hotspotDraft,
  hotspots,
  isMuted,
  isPlaying,
  loopEnabled,
  model,
  onAddHotspot,
  onAddTimelineEvent,
  onDeleteHotspot,
  onEditHotspot,
  onGenerate,
  onModelChange,
  onQualityChange,
  onSafeToggle,
  onSaveHotspot,
  onScrub,
  onSelectShot,
  onSkip,
  onToggleCaptions,
  onToggleCompare,
  onToggleFullscreen,
  onToggleLoop,
  onToggleMute,
  onTogglePlay,
  openMenu,
  quality,
  safeEnabled,
  selectedShot,
  selectedShotId,
  setActivePresetId,
  setActiveTab,
  setGenerationPrompt,
  setHotspotDraft,
  setOpenMenu,
  shots,
  timelineEvents,
}) {
  return (
    <main className="editor-grid">
      <section className="left-canvas">
        <EditorToolbar
          activeTab={activeTab}
          model={model}
          onModelChange={onModelChange}
          onQualityChange={onQualityChange}
          onSafeToggle={onSafeToggle}
          openMenu={openMenu}
          quality={quality}
          safeEnabled={safeEnabled}
          setActiveTab={setActiveTab}
          setOpenMenu={setOpenMenu}
        />
        {activeTab === "generate" ? (
          <AIGenerateStudio
            activePresetId={activePresetId}
            balance={balance}
            generationPrompt={generationPrompt}
            onGenerate={onGenerate}
            setActivePresetId={setActivePresetId}
            setGenerationPrompt={setGenerationPrompt}
          />
        ) : (
          <VideoPreview
            aspectRatio={aspectRatio}
            captionsEnabled={captionsEnabled}
            currentSeconds={currentSeconds}
            duration={duration}
            fullscreen={fullscreen}
            isMuted={isMuted}
            isPlaying={isPlaying}
            loopEnabled={loopEnabled}
            onScrub={onScrub}
            onSkip={onSkip}
            onToggleCaptions={onToggleCaptions}
            onToggleFullscreen={onToggleFullscreen}
            onToggleLoop={onToggleLoop}
            onToggleMute={onToggleMute}
            onTogglePlay={onTogglePlay}
          />
        )}
        <ShotStrip
          currentSeconds={currentSeconds}
          duration={duration}
          onAddTimelineEvent={onAddTimelineEvent}
          onSelectShot={onSelectShot}
          selectedShotId={selectedShotId}
          shots={shots}
          timelineEvents={timelineEvents}
        />
        <div className="lower-grid">
          <ProductHotspots
            editingHotspotId={editingHotspotId}
            hotspotDraft={hotspotDraft}
            hotspots={hotspots}
            onAddHotspot={onAddHotspot}
            onDeleteHotspot={onDeleteHotspot}
            onEditHotspot={onEditHotspot}
            onSaveHotspot={onSaveHotspot}
            setHotspotDraft={setHotspotDraft}
          />
          <FrameFeedback
            compareEnabled={compareEnabled}
            onToggleCompare={onToggleCompare}
            selectedShot={selectedShot}
          />
        </div>
      </section>
      <section className="middle-column">
        <div className="middle-spacer" />
        <SocialPreview aspectRatio={aspectRatio} />
      </section>
    </main>
  );
}

export default function App() {
  const [wizardComplete, setWizardComplete] = useState(isTestEnv);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [creatorProfiles, setCreatorProfiles] = useState(editorSnapshot.aiPeople.creatorProfiles);
  
  const [activePresetId, setActivePresetId] = useState(editorSnapshot.generationPresets[0].id);
  const [activePage, setActivePage] = useState(editorSnapshot.defaultPage);
  const [activeTab, setActiveTab] = useState("editor");
  const [aspectRatio, setAspectRatio] = useState(editorSnapshot.video.aspectRatio);
  const [balance, setBalance] = useState(editorSnapshot.video.balance);

  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [checklist, setChecklist] = useState(editorSnapshot.propsChecklist);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(editorSnapshot.video.currentSeconds);
  const [editingHotspotId, setEditingHotspotId] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
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
  const [openMenu, setOpenMenu] = useState(null);
  const [projectTitle, setProjectTitle] = useState(editorSnapshot.project.title);
  const [quality, setQuality] = useState(editorSnapshot.video.quality);
  const [safeEnabled, setSafeEnabled] = useState(true);
  const [selectedGender, setSelectedGender] = useState(editorSnapshot.aiPeople.defaultGender);
  const [selectedPersonId, setSelectedPersonId] = useState(editorSnapshot.aiPeople.defaultPersonId);
  const [selectedShotId, setSelectedShotId] = useState(editorSnapshot.selectedShotId);
  const [shots, setShots] = useState(editorSnapshot.shots);
  const [statusMessage, setStatusMessage] = useState("Saved");
  const [timelineEvents, setTimelineEvents] = useState(editorSnapshot.timelineEvents);
  const [titleDraft, setTitleDraft] = useState(editorSnapshot.project.title);
  const [trendIndex, setTrendIndex] = useState(0);
  const [uploadedModelName, setUploadedModelName] = useState("");

  const duration = getVideoDuration(shots);
  const selectedShot = useMemo(
    () => shots.find((shot) => shot.id === selectedShotId) || getShotAtTime(shots, currentSeconds) || shots[0],
    [currentSeconds, selectedShotId, shots],
  );

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
    const preset = editorSnapshot.generationPresets.find((item) => item.id === activePresetId);
    const prompt = generationPrompt.trim() || preset.prompt;
    const shot = createGeneratedShot(shots, prompt);
    setShots((items) => [...items, shot]);
    setSelectedShotId(shot.id);
    setCurrentSeconds(shot.startSeconds);
    setGenerationPrompt("");
    setBalance((value) => Math.max(0, value - preset.cost));
    setActiveTab("editor");
    setSavedMessage(`Generation queued: ${shot.title}`);
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
    if (id === "editor" || id === "people") {
      setActivePage(id);
      setOpenMenu(null);
    }
  }

  if (!wizardComplete) {
    return (
      <SetupWizard
        onComplete={(data) => {
          setSelectedProduct(data.product);
          setProjectTitle(`${data.product.name} - PixVerse Campaign`);
          
          const newProfile = {
            id: data.character.id,
            name: data.character.name,
            gender: data.character.gender === "Female" ? "Woman" : "Man",
            role: `${data.character.style} Spokesperson`,
            locale: "Singapore",
            language: "English",
            fitScore: 95,
            consent: "Model release signed",
            asset: data.character.gender === "Female" ? "shotModel" : "shotSocial",
            look: `${data.character.style} style, natural window light`,
            voice: `${data.character.style} UGC voice`
          };

          setCreatorProfiles([newProfile, ...editorSnapshot.aiPeople.creatorProfiles]);
          setSelectedPersonId(newProfile.id);
          setSelectedGender(newProfile.gender);
          setWizardComplete(true);
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} balance={balance} onNavigate={navigateWorkspace} selectedProduct={selectedProduct} />
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
        />
        <div className={`content-shell ${activePage === "people" ? "people-content-shell" : ""}`}>
          {activePage === "people" ? (
            <PeopleWorkspace
              onSelectGender={setSelectedGender}
              onSelectPerson={setSelectedPersonId}
              onUploadReference={setUploadedModelName}
              selectedGender={selectedGender}
              selectedPersonId={selectedPersonId}
              uploadedModelName={uploadedModelName}
              creatorProfiles={creatorProfiles}
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
                generationPrompt={generationPrompt}
                hotspotDraft={hotspotDraft}
                hotspots={hotspots}
                isMuted={isMuted}
                isPlaying={isPlaying}
                loopEnabled={loopEnabled}
                model={model}
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
                onSelectShot={selectShot}
                onSkip={skipToNextShot}
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
                quality={quality}
                safeEnabled={safeEnabled}
                selectedShot={selectedShot}
                selectedShotId={selectedShotId}
                setActivePresetId={setActivePresetId}
                setActiveTab={setActiveTab}
                setGenerationPrompt={setGenerationPrompt}
                setHotspotDraft={setHotspotDraft}
                setOpenMenu={setOpenMenu}
                shots={shots}
                timelineEvents={timelineEvents}
              />
              <RightRail
                checklist={checklist}
                listingTab={listingTab}
                listingVersion={listingVersion}
                onCopyListing={() => setSavedMessage("Listing assets copied")}
                onRegenerateListing={() => {
                  setListingVersion((value) => value + 1);
                  setSavedMessage("Listing assets regenerated");
                }}
                onSelectVideo={(video) => setSavedMessage(`${video.title} used as reference`)}
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
    </div>
  );
}
