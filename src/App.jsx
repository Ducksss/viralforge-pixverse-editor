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
  Edit3,
  FileImage,
  Film,
  Home,
  Image,
  Inbox,
  Layers,
  Maximize2,
  Monitor,
  PenLine,
  Play,
  Plus,
  RefreshCw,
  Search,
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
} from "lucide-react";
import { assets } from "./assetMap.js";
import {
  buildTimelineMarkers,
  editorSnapshot,
  getChecklistProgress,
  getPeopleReadiness,
} from "./editorData.js";

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

function IconButton({ children, className = "", label }) {
  return (
    <button aria-label={label} className={`icon-button ${className}`}>
      {children}
    </button>
  );
}

function Panel({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function Sidebar({ activePage, onNavigate }) {
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
          <img src={assets.projectThumb} alt="Summer Glow serum bottle" />
          <div>
            <strong>Summer Glow<br />Vitamin C Serum</strong>
            <small>{editorSnapshot.project.channels}</small>
          </div>
        </div>
        <button className="dark-outline-button">Change</button>
      </div>

      <div className="sidebar-card balance-card">
        <p className="card-kicker">PixVerse Balance</p>
        <div className="balance-line">
          <strong>2,450</strong>
          <button>Top up</button>
        </div>
        <small>Resets in 12 days - Pro Plan</small>
      </div>

      <button className="settings-row">
        <Settings size={18} />
        <span>Settings</span>
        <ChevronRight size={16} />
      </button>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <IconButton label="Back to all projects" className="ghost-icon">
          <ChevronLeft size={20} />
        </IconButton>
        <span className="all-projects">All Projects</span>
      </div>

      <div className="project-title">
        <span>{editorSnapshot.project.title}</span>
        <PenLine size={15} />
      </div>

      <div className="topbar-actions">
        <span className="saved-state"><span />Saved</span>
        <button className="select-button"><Monitor size={16} />16:9<ChevronDown size={15} /></button>
        <button className="select-button">Export<ChevronDown size={15} /></button>
        <button className="select-button">Share<ChevronDown size={15} /></button>
        <button className="bell-button" aria-label="Notifications">
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

function EditorToolbar() {
  return (
    <div className="editor-toolbar">
      <div className="tabs">
        <button className="tab is-active">Editor</button>
        <button className="tab">AI Generate</button>
      </div>
      <div className="generation-controls">
        <button className="control-pill"><Sparkles size={14} />{editorSnapshot.video.model}<ChevronDown size={14} /></button>
        <button className="control-pill">{editorSnapshot.video.quality}<ChevronDown size={14} /></button>
        <button className="safe-pill"><span />AI Safe</button>
      </div>
    </div>
  );
}

function VideoPreview() {
  return (
    <Panel className="video-panel">
      <div className="preview-stage">
        <img src={assets.mainFrame} alt="PixVerse skincare campaign preview frame" />
        <span className="sr-only">Preview 36s</span>
      </div>
      <div className="player-controls" aria-label="Video preview controls">
        <div className="playback-buttons">
          <button aria-label="Play video"><Play size={18} fill="currentColor" /></button>
          <button aria-label="Skip forward"><SkipForward size={17} fill="currentColor" /></button>
          <button aria-label="Volume"><Volume2 size={18} /></button>
        </div>
        <div className="scrub-track" aria-hidden="true">
          <span className="scrub-fill" />
          <span className="scrub-thumb" />
          <span className="timeline-dot dot-a" />
          <span className="timeline-dot dot-b" />
        </div>
        <div className="view-buttons">
          <button aria-label="Loop preview"><RefreshCw size={17} /></button>
          <button aria-label="Open captions"><SlidersHorizontal size={17} /></button>
          <button aria-label="Fullscreen"><Maximize2 size={17} /></button>
        </div>
      </div>
    </Panel>
  );
}

function SocialPreview() {
  return (
    <Panel className="social-preview-panel">
      <div className="section-title-line">
        <h2>Social Preview</h2>
        <span>(9:16)</span>
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

function ShotStrip({ selectedShotId, onSelectShot }) {
  return (
    <Panel className="shots-panel">
      <div className="shots-header">
        <strong>Shots <span>(6)</span></strong>
        <small>36.0s</small>
      </div>
      <div className="shot-list">
        {editorSnapshot.shots.map((shot) => (
          <button
            aria-label={`Select shot ${shot.number}`}
            aria-pressed={selectedShotId === shot.id}
            className={`shot-card ${selectedShotId === shot.id ? "is-selected" : ""}`}
            key={shot.id}
            onClick={() => onSelectShot(shot.id)}
          >
            <img src={assets[shot.asset]} alt={shot.title} />
            <span className="shot-number">{shot.number}</span>
            <span className="shot-start">{shot.start}</span>
            <span className="shot-duration">{shot.durationSeconds.toFixed(1)}s</span>
          </button>
        ))}
      </div>
      <Timeline />
    </Panel>
  );
}

function Timeline() {
  const markers = buildTimelineMarkers(editorSnapshot.timelineEvents);

  return (
    <div className="timeline">
      <div className="waveform" aria-hidden="true">
        {Array.from({ length: 112 }, (_, index) => (
          <span key={index} style={{ height: `${10 + ((index * 17) % 30)}px` }} />
        ))}
      </div>
      <div className="timeline-playhead" />
      {markers.map((marker) => (
        <span key={marker.id} className={`timeline-marker ${marker.kind}`} style={{ left: marker.left }}>
          <Star size={10} fill="currentColor" />
        </span>
      ))}
      <button className="timeline-add" aria-label="Add timeline event"><Plus size={22} /></button>
    </div>
  );
}

function ProductHotspots() {
  return (
    <Panel className="hotspots-panel">
      <div className="panel-heading">
        <h2>Product Hotspots</h2>
      </div>
      <div className="hotspot-layout">
        <div className="hotspot-image">
          <img src={assets.hotspotMap} alt="Product hotspot map on creator frame" />
        </div>
        <div className="hotspot-list">
          <div className="section-title-line">
            <h2>Hotspots</h2>
            <span>(3)</span>
          </div>
          {editorSnapshot.hotspots.map((hotspot) => (
            <div className="hotspot-row" key={hotspot.id}>
              <span className="hotspot-index">{hotspot.number}</span>
              <div>
                <strong>{hotspot.name}</strong>
                <small>{hotspot.range}</small>
              </div>
              <button aria-label={`Edit ${hotspot.name}`}><Edit3 size={13} /></button>
              <button aria-label={`Delete ${hotspot.name}`}><Trash2 size={13} /></button>
            </div>
          ))}
          <button className="add-hotspot"><Plus size={15} />Add Hotspot</button>
        </div>
      </div>
    </Panel>
  );
}

function FrameFeedback({ selectedShot }) {
  const feedback = editorSnapshot.feedbackByShot[selectedShot.id];

  return (
    <Panel className="feedback-panel">
      <div className="panel-heading">
        <h2 data-testid="frame-feedback-title">Frame Feedback <span>(Shot {selectedShot.number} - {selectedShot.start.padStart(5, "0")})</span></h2>
        <button className="compare-button">Compare</button>
      </div>
      <div className="feedback-layout">
        <img src={assets.frameFeedback} alt="Current frame feedback still" />
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
        </div>
      </div>
    </Panel>
  );
}

function TrendTranslator() {
  return (
    <Panel className="right-panel trend-panel">
      <div className="right-heading">
        <h2>Gen Z Trend Translator <span>Beta</span></h2>
        <ChevronDown size={16} />
      </div>
      <p className="micro-label">What&apos;s the vibe?</p>
      <div className="chip-row">
        {editorSnapshot.trendChips.map((chip) => <button key={chip}>{chip}</button>)}
      </div>
      <div className="translation-block">
        <strong>Translation for older sellers</strong>
        <p>Gen Z loves simple, real routines that feel authentic and result-driven.</p>
      </div>
      <ul className="check-list">
        {editorSnapshot.trendTranslation.map((item) => (
          <li key={item}><Check size={14} />{item}</li>
        ))}
      </ul>
      <div className="panel-footer-row">
        <button className="see-examples">See examples</button>
        <span>2/5</span>
        <button aria-label="Previous trend"><ChevronLeft size={14} /></button>
        <button aria-label="Next trend"><ChevronRight size={14} /></button>
      </div>
    </Panel>
  );
}

function TopVideos() {
  return (
    <Panel className="right-panel top-videos-panel">
      <div className="right-heading compact">
        <h2>Top Performing Videos <span>(Skincare)</span></h2>
        <button>View all</button>
      </div>
      <div className="video-rank-list">
        {editorSnapshot.topVideos.map((video) => (
          <div className="video-rank-row" key={video.rank}>
            <span className="rank-number">{video.rank}</span>
            <img src={assets[video.asset]} alt="" />
            <div className="rank-copy">
              <strong>{video.title}</strong>
              <small>{video.duration} - {video.channel}</small>
            </div>
            <div className="rank-metrics">
              <b>{video.reach}</b>
              <small>^^ {video.trend}</small>
              <small>+ {video.lift}</small>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FilmingTips() {
  return (
    <Panel className="right-panel tips-panel">
      <div className="right-heading">
        <h2>Filming Tips <span>(From Current Frame)</span></h2>
        <ChevronDown size={16} />
      </div>
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

function PropsChecklist({ items, onToggle }) {
  const progress = getChecklistProgress(items);

  return (
    <Panel className="right-panel props-panel">
      <div className="right-heading compact">
        <h2>Props Sourcing Checklist</h2>
        <span>{progress.label}</span>
      </div>
      <div className="props-list">
        {items.map((item) => (
          <label className="prop-row" key={item.id}>
            <input checked={item.done} onChange={() => onToggle(item.id)} type="checkbox" />
            <span className="fake-check"><Check size={11} /></span>
            <strong>{item.label}</strong>
            <small>{item.source}</small>
            <button aria-label={`Source ${item.label}`} type="button"><ShoppingCart size={14} /></button>
          </label>
        ))}
      </div>
    </Panel>
  );
}

function ListingAssets() {
  const images = ["shotProduct", "shotDropper", "shotBottle", "shotSocial", "shotModel"];

  return (
    <Panel className="right-panel listing-panel">
      <div className="right-heading compact">
        <h2>Listing Assets <span>(Auto-Generated)</span></h2>
        <button><RefreshCw size={13} />Regenerate</button>
      </div>
      <div className="listing-tabs">
        <button className="is-active">Images (6)</button>
        <button>Description</button>
        <button>SEO Keywords</button>
      </div>
      <div className="asset-strip">
        {images.map((image, index) => (
          <div className="asset-tile" key={image}>
            <img src={assets[image]} alt="" />
            {index === 3 ? <span><Play size={12} fill="currentColor" /></span> : null}
          </div>
        ))}
      </div>
      <div className="asset-copy-block">
        <strong>Description</strong>
        <p>{editorSnapshot.listingAssets.description}</p>
      </div>
      <div className="asset-keywords">
        <strong>SEO Keywords</strong>
        <div>
          {editorSnapshot.listingAssets.seo.map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      </div>
      <button className="copy-all">Copy All</button>
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

function CreatorCasting({ selectedPersonId, onSelectPerson }) {
  return (
    <Panel className="creator-casting-panel">
      <div className="people-panel-heading">
        <div>
          <h3>Creator Casting</h3>
          <p>Reusable AI people for UGC campaign variants</p>
        </div>
        <button className="compact-action"><Sparkles size={14} />Generate audition</button>
      </div>
      <div className="creator-grid">
        {editorSnapshot.aiPeople.creatorProfiles.map((person) => {
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
}) {
  const selectedPerson = useMemo(
    () =>
      editorSnapshot.aiPeople.creatorProfiles.find((person) => person.id === selectedPersonId) ||
      editorSnapshot.aiPeople.creatorProfiles[0],
    [selectedPersonId],
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
        <CreatorCasting selectedPersonId={selectedPersonId} onSelectPerson={onSelectPerson} />
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

function RightRail({ checklist, onToggleProp }) {
  return (
    <aside className="right-rail">
      <TrendTranslator />
      <TopVideos />
      <FilmingTips />
      <PropsChecklist items={checklist} onToggle={onToggleProp} />
      <ListingAssets />
    </aside>
  );
}

function MainEditor({ selectedShotId, setSelectedShotId }) {
  const selectedShot = useMemo(
    () => editorSnapshot.shots.find((shot) => shot.id === selectedShotId) || editorSnapshot.shots[2],
    [selectedShotId],
  );

  return (
    <main className="editor-grid">
      <section className="left-canvas">
        <EditorToolbar />
        <VideoPreview />
        <ShotStrip selectedShotId={selectedShotId} onSelectShot={setSelectedShotId} />
        <div className="lower-grid">
          <ProductHotspots />
          <FrameFeedback selectedShot={selectedShot} />
        </div>
      </section>
      <section className="middle-column">
        <div className="middle-spacer" />
        <SocialPreview />
      </section>
    </main>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(editorSnapshot.defaultPage);
  const [selectedShotId, setSelectedShotId] = useState(editorSnapshot.selectedShotId);
  const [checklist, setChecklist] = useState(editorSnapshot.propsChecklist);
  const [selectedGender, setSelectedGender] = useState(editorSnapshot.aiPeople.defaultGender);
  const [selectedPersonId, setSelectedPersonId] = useState(editorSnapshot.aiPeople.defaultPersonId);
  const [uploadedModelName, setUploadedModelName] = useState("");

  function toggleProp(id) {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  }

  function navigateWorkspace(id) {
    if (id === "editor" || id === "people") {
      setActivePage(id);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={navigateWorkspace} />
      <div className="workspace">
        <Topbar />
        <div className={`content-shell ${activePage === "people" ? "people-content-shell" : ""}`}>
          {activePage === "people" ? (
            <PeopleWorkspace
              onSelectGender={setSelectedGender}
              onSelectPerson={setSelectedPersonId}
              onUploadReference={setUploadedModelName}
              selectedGender={selectedGender}
              selectedPersonId={selectedPersonId}
              uploadedModelName={uploadedModelName}
            />
          ) : (
            <>
              <MainEditor selectedShotId={selectedShotId} setSelectedShotId={setSelectedShotId} />
              <RightRail checklist={checklist} onToggleProp={toggleProp} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
