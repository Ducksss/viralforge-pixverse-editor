import React, { useState, useEffect, useMemo, useRef } from "react";
import { Sparkles, Check, ChevronRight, Play, RefreshCw, Send, ArrowRight, X, Calendar, Pause, Volume2, VolumeX, Film } from "lucide-react";
import { assets } from "./assetMap.js";
import { CampaignNleBay } from "./CampaignNleBay.jsx";
import video1 from "./assets/video/video-1.mp4";
import video2 from "./assets/video/video-2.mp4";

const SHOT_THUMBS = [
  { label: "Shot 1: Product Close-up", asset: "actualShot1" },
  { label: "Shot 2: Texture dropper", asset: "actualShot2" },
  { label: "Shot 3: Spokesperson hold", asset: "actualShot3" },
  { label: "Shot 4: Science bubbles", asset: "actualShot4" },
  { label: "Shot 5: Before / After glow", asset: "actualShot5" },
  { label: "Shot 6: Bottle CTA close", asset: "actualShot6" },
];

const NLE_SOURCE_WINDOWS = [
  { videoAsset: "actualVideo1", startSeconds: 0, endSeconds: 5 },
  { videoAsset: "actualVideo1", startSeconds: 5, endSeconds: 10 },
  { videoAsset: "actualVideo1", startSeconds: 10, endSeconds: 15 },
  { videoAsset: "actualVideo2", startSeconds: 0, endSeconds: 5 },
  { videoAsset: "actualVideo2", startSeconds: 5, endSeconds: 10 },
  { videoAsset: "actualVideo2", startSeconds: 10, endSeconds: 15 },
];

function getShotTitle(label) {
  return label.replace(/^Shot\s+\d+:\s*/i, "");
}

export default function DemoFlow({ data, initialView = "generating", onReset }) {
  const cast = Array.isArray(data.characters) && data.characters.length > 0
    ? data.characters
    : data.character
      ? [data.character]
      : [];
  const [variantIndex, setVariantIndex] = useState(0);
  const activeCharacter = cast[variantIndex] || data.character || cast[0];
  const characterForDisplay = activeCharacter || { name: "Spokesperson", image: undefined, style: "Relatable" };
  const [view, setView] = useState(initialView); // generating, editor, videoEditor, publish, success
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Analysing your product…");
  const [selectedShotIndex, setSelectedShotIndex] = useState(0);
  const [repromptOpen, setRepromptOpen] = useState(false);
  const [nleStatus, setNleStatus] = useState("Ready to edit");

  // States initialized from wizard choice
  const [productStory, setProductStory] = useState(data.story || "");
  const [selectedTone, setSelectedTone] = useState(data.tone || "Authentic");
  const [postingTime, setPostingTime] = useState("Now");

  // New video control states
  const [isExtended, setIsExtended] = useState(false);
  const [hasReprompted, setHasReprompted] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(video1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef(null);
  const socialVideoRef = useRef(null);

  // Screen 5: Generating progress timer
  useEffect(() => {
    if (view !== "generating") return;

    setProgress(0);
    setLoadingText("Analysing your product…");

    const duration = 9000; // 9 seconds total
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (hasReprompted) {
        if (pct < 12.5) {
          setLoadingText("Analysing your product…");
        } else if (pct < 25.0) {
          setLoadingText("Writing the shot list…");
        } else if (pct < 37.5) {
          setLoadingText("Generating shot 1 of 5…");
        } else if (pct < 50.0) {
          setLoadingText("Generating shot 2 of 5…");
        } else if (pct < 62.5) {
          setLoadingText("Generating shot 3 of 5…");
        } else if (pct < 75.0) {
          setLoadingText("Generating shot 4 of 5…");
        } else if (pct < 87.5) {
          setLoadingText("Generating shot 5 of 5…");
        } else {
          setLoadingText("Finishing up…");
        }
      } else {
        if (pct < 16.6) {
          setLoadingText("Analysing your product…");
        } else if (pct < 33.3) {
          setLoadingText("Writing the shot list…");
        } else if (pct < 50.0) {
          setLoadingText("Generating shot 1 of 3…");
        } else if (pct < 66.6) {
          setLoadingText("Generating shot 2 of 3…");
        } else if (pct < 83.3) {
          setLoadingText("Generating shot 3 of 3…");
        } else {
          setLoadingText("Finishing up…");
        }
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setView("editor");
          if (hasReprompted) {
            setIsExtended(true);
            setCurrentVideoSrc(video1);
            setSelectedShotIndex(0);
          }
        }, 400);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [view, hasReprompted]);

  // Synchronize playing and muted states to elements
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
    if (socialVideoRef.current) {
      if (isPlaying) {
        socialVideoRef.current.play().catch(() => {});
      } else {
        socialVideoRef.current.pause();
      }
    }
  }, [currentVideoSrc, isPlaying]);

  const skipGenerating = () => {
    setProgress(100);
    setView("editor");
    if (hasReprompted) {
      setIsExtended(true);
      setCurrentVideoSrc(video1);
      setSelectedShotIndex(0);
    }
  };

  const handleRegenerate = (e) => {
    e.preventDefault();
    setRepromptOpen(false);
    setView("generating");
  };

  const handleExtend = (e) => {
    e.preventDefault();
    setRepromptOpen(false);
    setHasReprompted(true);
    setView("generating");
  };

  const handlePublishSubmit = () => {
    setView("success");
  };

  const handleVideoEnded = () => {
    if (currentVideoSrc === video1) {
      setCurrentVideoSrc(video2);
      setSelectedShotIndex(3);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
      if (socialVideoRef.current) {
        socialVideoRef.current.currentTime = 0;
        socialVideoRef.current.play().catch(() => {});
      }
    } else {
      setCurrentVideoSrc(video1);
      setSelectedShotIndex(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
      if (socialVideoRef.current) {
        socialVideoRef.current.currentTime = 0;
        socialVideoRef.current.play().catch(() => {});
      }
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => {
      const nextPlay = !prev;
      if (videoRef.current) {
        if (nextPlay) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      if (socialVideoRef.current) {
        if (nextPlay) socialVideoRef.current.play().catch(() => {});
        else socialVideoRef.current.pause();
      }
      return nextPlay;
    });
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const nextMute = !prev;
      if (videoRef.current) videoRef.current.muted = nextMute;
      if (socialVideoRef.current) socialVideoRef.current.muted = nextMute;
      return nextMute;
    });
  };

  const getShotVideoAndStart = (idx) => {
    const video = idx < 3 ? video1 : video2;
    const time = idx < 3 ? [0, 5, 10][idx] : [0, 5, 10][idx - 3];
    return { video, time };
  };

  const handleShotCardClick = (idx) => {
    setSelectedShotIndex(idx);

    // Seek logic to make it feel like a real editor
    const { video: targetVideo, time: targetTime } = getShotVideoAndStart(idx);

    if (currentVideoSrc !== targetVideo) {
      setCurrentVideoSrc(targetVideo);
    }
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = targetTime;
        videoRef.current.play().catch(() => {});
      }
      if (socialVideoRef.current) {
        socialVideoRef.current.currentTime = targetTime;
        socialVideoRef.current.play().catch(() => {});
      }
    }, 50);
    setIsPlaying(true);
  };

  const handleTimeUpdate = (e) => {
    const time = e.target.currentTime;
    if (currentVideoSrc === video1) {
      if (time >= 15) {
        setCurrentVideoSrc(video2);
        setSelectedShotIndex(3);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
        if (socialVideoRef.current) {
          socialVideoRef.current.currentTime = 0;
          socialVideoRef.current.play().catch(() => {});
        }
        return;
      }
      // Determine active index in video1
      let activeIdx = 0;
      if (time >= 10) {
        activeIdx = 2;
      } else if (time >= 5) {
        activeIdx = 1;
      } else {
        activeIdx = 0;
      }
      setSelectedShotIndex(activeIdx);
    } else if (currentVideoSrc === video2) {
      if (time >= 15) {
        setCurrentVideoSrc(video1);
        setSelectedShotIndex(0);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
        if (socialVideoRef.current) {
          socialVideoRef.current.currentTime = 0;
          socialVideoRef.current.play().catch(() => {});
        }
        return;
      }
      // Determine active index in video2
      let activeIdx = 3;
      if (time >= 10) {
        activeIdx = 5;
      } else if (time >= 5) {
        activeIdx = 4;
      } else {
        activeIdx = 3;
      }
      setSelectedShotIndex(activeIdx);
    }
  };

  // Get active hook
  const activeHook = productStory.trim() || "POV: you finally found the serum that works";

  const getOverlayText = (index) => {
    switch (index) {
      case 0:
        return `Shot 1: Opening Hook - "${activeHook}"`;
      case 1:
        return `Shot 2: Texture Close-up - Sinks in fast, zero sticky residue`;
      case 2:
        return `Shot 3: Spokesperson Intro - "${characterForDisplay.name} sharing her skincare routine"`;
      case 3:
        return `Shot 4: Core Ingredients - Formulated with 10% Pure Vitamin C`;
      case 4:
        if (currentVideoSrc === video2) {
          return `Shot 5: Extended CTA - Limited time discount, buy one get one free!`;
        }
        return `Shot 5: Before / After Glow - Visible brightness in 5 seconds`;
      case 5:
        return `Shot 6: Bottle CTA close - "Click the shop link to buy yours today!"`;
      default:
        return "";
    }
  };

  const activeShots = useMemo(() => SHOT_THUMBS, []);
  const nleShots = useMemo(() => activeShots.map((shot, index) => {
    const sourceWindow = NLE_SOURCE_WINDOWS[index] || NLE_SOURCE_WINDOWS[0];

    return {
      id: `demo-generated-shot-${index + 1}`,
      title: getShotTitle(shot.label),
      asset: shot.asset,
      aiGenerated: true,
      durationSeconds: sourceWindow.endSeconds - sourceWindow.startSeconds,
      startSeconds: index * 5,
      videoAsset: sourceWindow.videoAsset,
      videoStartSeconds: sourceWindow.startSeconds,
      videoEndSeconds: sourceWindow.endSeconds,
    };
  }), [activeShots]);
  const nleTimelineEvents = useMemo(() => {
    const totalDuration = nleShots.reduce((duration, shot) => duration + shot.durationSeconds, 0);

    return [
      { id: "demo-hook", atSeconds: 0, kind: "hook" },
      { id: "demo-proof", atSeconds: Math.min(5, totalDuration), kind: "proof" },
      { id: "demo-cta", atSeconds: Math.max(0, totalDuration - 4), kind: "cta" },
    ];
  }, [nleShots]);
  const campaignTitle = `${data.product.name} - ${isExtended ? "Extended Campaign" : "PixVerse Campaign"}`;

  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box" }}>
      {/* SCREEN 5: Generating */}
      {view === "generating" && (
        <div className="generating-screen" onClick={skipGenerating} style={{ cursor: "pointer" }}>
          <div className="generating-card">
            <div className="wizard-logo-area" style={{ marginBottom: "20px" }}>
              <div className="wizard-logo-mark" />
              <div className="wizard-logo-text">
                <h1 style={{ color: "#ffffff" }}>ViralForge</h1>
                <p>Commerce</p>
              </div>
            </div>
            <p className="loader-text" style={{ color: "#ffffff", fontSize: "20px", marginBottom: "8px" }}>
              {loadingText}
            </p>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "16px" }}>
              Click anywhere to skip generation
            </p>
          </div>
        </div>
      )}

      {/* SCREEN 6: Editor */}
      {(view === "editor" || view === "reprompt") && (
        <div className="demo-editor-container">
          <header className="demo-editor-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "20px", display: "flex", alignItems: "center", overflow: "visible" }}>
                <div className="wizard-logo-mark" style={{ transform: "scale(0.7)", transformOrigin: "left center" }} />
              </div>
              <strong style={{ fontSize: "16px", color: "var(--ink)" }}>ViralForge Campaign Studio</strong>
            </div>
            <div className="demo-editor-title">
              <strong>{data.product.name} - {isExtended ? "Extended Campaign" : "PixVerse Campaign"}</strong>
            </div>
            {cast.length > 1 ? (
              <div className="variant-switcher" aria-label="Cast variant">
                <button
                  className="variant-switcher-btn"
                  onClick={() => setVariantIndex((i) => (i - 1 + cast.length) % cast.length)}
                  type="button"
                  aria-label="Previous variant"
                >
                  ‹
                </button>
                <div className="variant-switcher-label">
                  {characterForDisplay.image ? (
                    <img src={characterForDisplay.image} alt="" />
                  ) : null}
                  <span>
                    <strong>{characterForDisplay.name}</strong> · Variant {variantIndex + 1} of {cast.length}
                  </span>
                </div>
                <button
                  className="variant-switcher-btn"
                  onClick={() => setVariantIndex((i) => (i + 1) % cast.length)}
                  type="button"
                  aria-label="Next variant"
                >
                  ›
                </button>
              </div>
            ) : (
              <div style={{ width: "120px" }} />
            )}
          </header>

          <div className="demo-editor-body">
            {/* Left 65%: Video preview & Shot strip */}
            <div className="demo-editor-left">
              <div className="demo-video-preview" style={{ position: "relative", minHeight: "280px" }}>
                <video
                  ref={videoRef}
                  src={currentVideoSrc}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={handleVideoEnded}
                  onClick={handleTogglePlay}
                  onTimeUpdate={handleTimeUpdate}
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />

                {/* Control Badge */}
                <div className="video-player-badge" style={{ pointerEvents: "none" }}>
                  <Play size={10} fill="currentColor" style={{ marginRight: "4px" }} />
                  {isExtended
                    ? `Previewing Extended Campaign (${currentVideoSrc === video1 ? "Video 1" : "Video 2"})`
                    : "Previewing Campaign"}
                </div>

                {/* Control Overlay Buttons */}
                <div style={{ position: "absolute", bottom: "16px", right: "16px", zIndex: 20, display: "flex", gap: "8px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay();
                    }}
                    style={{
                      background: "rgba(18, 24, 30, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                    type="button"
                  >
                    {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMute();
                    }}
                    style={{
                      background: "rgba(18, 24, 30, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                    type="button"
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                </div>

                <div className="video-overlay-text" style={{ pointerEvents: "none" }}>
                  <strong>{characterForDisplay.name}</strong>
                  <p>{getOverlayText(selectedShotIndex)}</p>
                </div>
              </div>

              <div className="demo-shot-strip-container">
                <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", margin: "0 0 10px" }}>
                  Shots ({activeShots.length}) • {`${(activeShots.length * 5).toFixed(1)}s`}
                </p>
                <div className="demo-shot-strip" style={{ gridTemplateColumns: `repeat(${activeShots.length}, 1fr)` }}>
                  {activeShots.map((thumb, idx) => (
                    <button
                      key={idx}
                      className={`demo-shot-card ${selectedShotIndex === idx ? "active" : ""}`}
                      onClick={() => handleShotCardClick(idx)}
                      type="button"
                    >
                      <div className="demo-shot-thumb">
                        <img
                          src={assets[thumb.asset]}
                          alt={thumb.label}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <span className="demo-shot-num">{idx + 1}</span>
                      </div>
                      <span className="demo-shot-title">Shot {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 35%: Settings & Info */}
            <div className="demo-editor-right">
              {/* Social Preview */}
              <div className="social-preview-section">
                <span className="section-kicker">Social Preview (9:16)</span>
                <div className="demo-phone-frame">
                  <video
                    ref={socialVideoRef}
                    src={currentVideoSrc}
                    autoPlay
                    muted
                    playsInline
                    loop={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                  />
                  <div className="phone-overlay-caption">
                    <strong>@{characterForDisplay.name.toLowerCase()}</strong>
                    <p style={{ margin: "4px 0" }}>{activeHook} #skincare #tiktokshop #viralforge</p>
                    <span className="phone-cta-button">Shop Link Below</span>
                  </div>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="campaign-metadata-section">
                <div className="ai-score-badge">
                  <Sparkles size={14} />
                  <span>AI Score: <strong>{isExtended ? "95 — Excellent" : "89 — Good"}</strong></span>
                </div>
                <div className="campaign-info-row">
                  <small>Selected Product</small>
                  <strong>{data.product.name}</strong>
                </div>
                <div className="campaign-info-row">
                  <small>Tone Setting</small>
                  <strong>{selectedTone}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="demo-editor-actions">
                <button className="btn-secondary" onClick={() => setRepromptOpen(true)} type="button">
                  Not happy? Re-prompt →
                </button>
                <button
                  aria-label="Edit video in drag and drop timeline"
                  className="btn-secondary btn-editor"
                  onClick={() => setView("videoEditor")}
                  type="button"
                >
                  <Film size={16} />
                  Edit video →
                </button>
                <button className="btn-primary btn-teal" onClick={() => setView("publish")} type="button">
                  Looks good → Publish
                </button>
              </div>
            </div>
          </div>

          {/* SCREEN 7: Re-prompt Modal */}
          {repromptOpen && (
            <div className="reprompt-modal-overlay">
              <div className="reprompt-modal">
                <div className="reprompt-modal-header">
                  <h3>Edit Campaign Prompts</h3>
                  <button className="close-modal" onClick={() => setRepromptOpen(false)} type="button">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleRegenerate} className="reprompt-form">
                  <div className="form-group">
                    <label htmlFor="modal-story">Adjust Product Story</label>
                    <textarea
                      id="modal-story"
                      value={productStory}
                      onChange={(e) => setProductStory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="tone-selector" style={{ margin: "16px 0 24px" }}>
                    <span className="tone-label">Tone</span>
                    <div className="tone-pills">
                      {["Authentic", "Funny", "Urgent", "Soft Sell"].map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          className={`tone-pill ${selectedTone === tone ? "selected" : ""}`}
                          onClick={() => setSelectedTone(tone)}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="modal-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button className="btn-secondary" onClick={() => setRepromptOpen(false)} type="button">
                      Cancel
                    </button>
                    <button className="btn-secondary" onClick={handleExtend} type="button">
                      Extend
                    </button>
                    <button className="btn-primary btn-teal" type="submit">
                      Regenerate <RefreshCw size={14} style={{ marginLeft: "6px" }} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 7: Drag/drop video editor */}
      {view === "videoEditor" && (
        <div className="demo-nle-container">
          <header className="demo-editor-header demo-nle-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "20px", display: "flex", alignItems: "center", overflow: "visible" }}>
                <div className="wizard-logo-mark" style={{ transform: "scale(0.7)", transformOrigin: "left center" }} />
              </div>
              <strong style={{ fontSize: "16px", color: "var(--ink)" }}>ViralForge Campaign Studio</strong>
            </div>
            <div className="demo-editor-title">
              <strong>{campaignTitle}</strong>
            </div>
            <div className="demo-nle-header-actions">
              <button className="btn-secondary" onClick={() => setView("editor")} type="button">
                Back to review
              </button>
              <button className="btn-primary btn-teal" onClick={() => setView("publish")} type="button">
                Looks good → Publish
              </button>
            </div>
          </header>

          <main className="demo-nle-main">
            <CampaignNleBay
              onStatus={setNleStatus}
              onSelectShot={(shotId) => {
                const nextIndex = nleShots.findIndex((shot) => shot.id === shotId);
                if (nextIndex >= 0) {
                  setSelectedShotIndex(nextIndex);
                }
              }}
              projectTitle={campaignTitle}
              selectedShotId={nleShots[Math.min(selectedShotIndex, nleShots.length - 1)]?.id}
              shots={nleShots}
              storageKey="viralforge.demoCampaignNleProject.v1"
              timelineEvents={nleTimelineEvents}
            />
            <aside className="demo-nle-sidecar">
              <span className="section-kicker">Local timeline</span>
              <strong>{nleStatus}</strong>
              <dl>
                <div>
                  <dt>Shots</dt>
                  <dd>{nleShots.length}</dd>
                </div>
                <div>
                  <dt>Runtime</dt>
                  <dd>{`${nleShots.reduce((total, shot) => total + shot.durationSeconds, 0).toFixed(1)}s`}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>9:16</dd>
                </div>
              </dl>
              <button className="btn-secondary" onClick={() => setView("editor")} type="button">
                Back to review
              </button>
              <button className="btn-primary btn-teal" onClick={() => setView("publish")} type="button">
                Looks good → Publish
              </button>
            </aside>
          </main>
        </div>
      )}

      {/* SCREEN 8: Publish & Success */}
      {(view === "publish" || view === "success") && (
        <div className="publish-screen-container">
          {view === "publish" ? (
            <div className="wizard-card wide" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", textAlign: "left" }}>
              <div style={{ borderRight: "1px solid var(--line)", paddingRight: "32px" }}>
                <h2 className="wizard-title" style={{ textAlign: "left" }}>Publish Campaign</h2>
                <p className="wizard-subtitle" style={{ textAlign: "left", marginBottom: "24px" }}>
                  Confirm your video package options before pushing to TikTok Shop.
                </p>

                {/* Summary Card */}
                <div className="publish-summary-card">
                  <img src={characterForDisplay.image} alt="Spokesperson summary" />
                  <div>
                    <span className="product-category" style={{ margin: 0 }}>Active Spokesperson</span>
                    <strong style={{ fontSize: "16px", color: "var(--ink)", display: "block" }}>
                      {characterForDisplay.name}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      Role: {characterForDisplay.style} Spokesperson
                    </span>
                  </div>
                </div>

                <div className="campaign-info-row" style={{ marginTop: "16px" }}>
                  <small>Connected Product</small>
                  <strong style={{ fontSize: "14px" }}>{data.product.name}</strong>
                </div>

                <div className="form-group" style={{ marginTop: "20px" }}>
                  <label htmlFor="publish-caption">Video Caption</label>
                  <textarea
                    id="publish-caption"
                    style={{ height: "80px", fontSize: "13px", resize: "none" }}
                    defaultValue={`Get ready with me using my absolute favorite skincare secret! ✨ The glow is real. Get your own ${data.product.name} on TikTok Shop now! 👇`}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label>Hashtags</label>
                    <div className="publish-hashtags">
                      {["skincare", "tiktokshop", "glowskin", "ugccreator", "viralforge"].map((tag) => (
                        <span key={tag} className="hashtag-chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="post-time">Posting Schedule</label>
                    <div style={{ position: "relative" }}>
                      <select
                        id="post-time"
                        value={postingTime}
                        onChange={(e) => setPostingTime(e.target.value)}
                        style={{
                          width: "100%",
                          height: "44px",
                          padding: "0 12px",
                          border: "1px solid var(--line-strong)",
                          borderRadius: "8px",
                          background: "#ffffff",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      >
                        <option value="Now">Post Now (Instant)</option>
                        <option value="Tomorrow 9am">Tomorrow @ 9:00 AM</option>
                        <option value="Tomorrow 6pm">Tomorrow @ 6:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "32px" }}>
                  <button className="btn-primary btn-tiktok" onClick={handlePublishSubmit} type="button">
                    Publish to TikTok Shop ✓
                  </button>
                  <button
                    className="btn-back"
                    style={{ marginTop: "12px", justifyContent: "center", width: "100%" }}
                    onClick={() => setView("editor")}
                    type="button"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Success State
            <div className="wizard-card" style={{ padding: "48px 32px", textAlign: "center" }}>
              <div className="success-icon-circle">
                <Check size={48} />
              </div>
              <h2 className="wizard-title" style={{ fontSize: "28px", marginTop: "24px" }}>
                Your video is live!
              </h2>
              <p className="wizard-subtitle" style={{ fontSize: "15px", marginBottom: "32px" }}>
                The video has been successfully pushed and linked to your product listing on TikTok Shop.
              </p>

              <button className="btn-primary btn-teal" onClick={() => { window.location.href = "/editor"; }} type="button">
                Start new campaign
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
