import React, { useState, useEffect } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Import,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { assets } from "./assetMap.js";

// ─── Portrait imports ────────────────────────────────────────────────────────

import f01 from "./assets/ugc/female/f01-young-east-asian.png";
import f02 from "./assets/ugc/female/f02-young-black.png";
import f03 from "./assets/ugc/female/f03-young-white.png";
import f04 from "./assets/ugc/female/f04-middle-south-asian.png";
import f05 from "./assets/ugc/female/f05-middle-latina.png";
import f06 from "./assets/ugc/female/f06-middle-middle-eastern.png";
import f07 from "./assets/ugc/female/f07-old-white.png";
import f08 from "./assets/ugc/female/f08-old-east-asian.png";
import f09 from "./assets/ugc/female/f09-old-black.png";
import f10 from "./assets/ugc/female/f10-young-southeast-asian.png";
import f15 from "./assets/ugc/female/f15-korean.png";
import f16 from "./assets/ugc/female/f16-korean.png";
import f17 from "./assets/ugc/female/f17-korean.png";
import f18 from "./assets/ugc/female/f18-korean-young-wavy.png";
import f19 from "./assets/ugc/female/f19-korean-young-bob.png";
import f20 from "./assets/ugc/female/f20-korean-young-bangs.png";
import f21 from "./assets/ugc/female/f21-korean-young-sporty.png";
import f22 from "./assets/ugc/female/f22-korean-young-elegant.png";
import m01 from "./assets/ugc/male/m01-young-east-asian.png";
import m02 from "./assets/ugc/male/m02-young-black.png";
import m03 from "./assets/ugc/male/m03-young-south-asian.png";
import m04 from "./assets/ugc/male/m04-middle-white.png";
import m05 from "./assets/ugc/male/m05-middle-latino.png";
import m06 from "./assets/ugc/male/m06-middle-middle-eastern.png";
import m07 from "./assets/ugc/male/m07-old-white.png";
import m08 from "./assets/ugc/male/m08-old-east-asian.png";
import m09 from "./assets/ugc/male/m09-old-black.png";
import m10 from "./assets/ugc/male/m10-young-southeast-asian.png";
import m15 from "./assets/ugc/male/m15-korean.png";
import m16 from "./assets/ugc/male/m16-korean.png";
import m17 from "./assets/ugc/male/m17-korean.png";

// ─── Static data ─────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: "prod-7", name: "Sunbyme Miracle Serum", price: "$22.00", category: "Skincare", asset: "sunbymeSerum" },
  { id: "prod-1", name: "Summer Glow Vitamin C Serum", price: "$19.99", category: "Skincare", asset: "neutrogenaBoost" },
  { id: "prod-2", name: "Hydrating Hyaluronic Gel", price: "$24.50", category: "Skincare", asset: "centellaAmpoule" },
  { id: "prod-3", name: "Matte Finish Setting Spray", price: "$15.00", category: "Cosmetics", asset: "lrpHyaluB5" },
  { id: "prod-4", name: "Rosewater Facial Mist", price: "$12.00", category: "Skincare", asset: "vichyMineral89" },
  { id: "prod-5", name: "Organic Avocado Eye Cream", price: "$29.99", category: "Skincare", asset: "centellaAmpoule" },
];

const INDUSTRIES = ["Beauty", "Fashion", "Health", "Food & Drink", "Tech", "Lifestyle"];
const AUDIENCES = ["Gen Z", "Millennials", "Parents", "Professionals", "All Ages"];
const TONES = ["Authentic", "Funny", "Urgent", "Soft Sell"];

const ALL_AVATARS = [
  { id: "f01", name: "Sarah", gender: "Female", style: "Relatable", image: f01 },
  { id: "f02", name: "Chloe", gender: "Female", style: "Aspirational", image: f02 },
  { id: "f03", name: "Elena", gender: "Female", style: "Edgy", image: f03 },
  { id: "f04", name: "Amara", gender: "Female", style: "Minimal", image: f04 },
  { id: "f05", name: "Sofia", gender: "Female", style: "Relatable", image: f05 },
  { id: "f06", name: "Layla", gender: "Female", style: "Aspirational", image: f06 },
  { id: "f07", name: "Zoe", gender: "Female", style: "Edgy", image: f07 },
  { id: "f08", name: "Mei", gender: "Female", style: "Minimal", image: f08 },
  { id: "f09", name: "Evelyn", gender: "Female", style: "Relatable", image: f09 },
  { id: "f10", name: "Jessica", gender: "Female", style: "Aspirational", image: f10 },
  { id: "f15", name: "Minju", gender: "Female", style: "Edgy", image: f15 },
  { id: "f16", name: "Jiwon", gender: "Female", style: "Minimal", image: f16 },
  { id: "f17", name: "Hyeshin", gender: "Female", style: "Relatable", image: f17 },
  { id: "f18", name: "Hana", gender: "Female", style: "Aspirational", image: f18 },
  { id: "f19", name: "Yeji", gender: "Female", style: "Edgy", image: f19 },
  { id: "f20", name: "Chaewon", gender: "Female", style: "Minimal", image: f20 },
  { id: "f21", name: "Yujin", gender: "Female", style: "Relatable", image: f21 },
  { id: "f22", name: "Seoyeon", gender: "Female", style: "Aspirational", image: f22 },
  { id: "m01", name: "Alex", gender: "Male", style: "Relatable", image: m01 },
  { id: "m02", name: "Marcus", gender: "Male", style: "Aspirational", image: m02 },
  { id: "m03", name: "Jordan", gender: "Male", style: "Edgy", image: m03 },
  { id: "m04", name: "Leo", gender: "Male", style: "Minimal", image: m04 },
  { id: "m05", name: "Ethan", gender: "Male", style: "Relatable", image: m05 },
  { id: "m06", name: "Tyler", gender: "Male", style: "Aspirational", image: m06 },
  { id: "m07", name: "Ryan", gender: "Male", style: "Edgy", image: m07 },
  { id: "m08", name: "Cole", gender: "Male", style: "Minimal", image: m08 },
  { id: "m09", name: "Justin", gender: "Male", style: "Relatable", image: m09 },
  { id: "m10", name: "David", gender: "Male", style: "Aspirational", image: m10 },
  { id: "m15", name: "Woojin", gender: "Male", style: "Edgy", image: m15 },
  { id: "m16", name: "Minho", gender: "Male", style: "Minimal", image: m16 },
  { id: "m17", name: "Sangwoo", gender: "Male", style: "Relatable", image: m17 },
];

// Derive AI recommendations based on tone and audience
function getRecommendations(tone, audience) {
  const toneStyleMap = {
    Authentic: ["Relatable", "Minimal"],
    Funny: ["Relatable", "Edgy"],
    Urgent: ["Aspirational", "Edgy"],
    "Soft Sell": ["Aspirational", "Minimal"],
  };
  const preferredStyles = toneStyleMap[tone] || ["Relatable"];
  const audienceGenderBias = audience === "Gen Z" ? "Female" : null;

  const scored = ALL_AVATARS.map((avatar) => {
    let score = 70 + Math.floor(Math.random() * 5); // base + noise
    if (preferredStyles.includes(avatar.style)) score += 15;
    if (audienceGenderBias && avatar.gender === audienceGenderBias) score += 5;
    return { ...avatar, fitScore: Math.min(99, score) };
  });

  return scored
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);
}

function getReasonChips(avatar, tone, audience) {
  const chips = [];
  if (avatar.style === "Relatable" || avatar.style === "Minimal") chips.push("Authentic feel");
  if (avatar.style === "Aspirational") chips.push("High aspirational pull");
  if (avatar.style === "Edgy") chips.push("Pattern-interrupt hook");
  if (tone === "Authentic") chips.push(`Matches ${tone} tone`);
  if (audience && audience !== "All Ages") chips.push(`Strong ${audience} reach`);
  chips.push("Consent cleared");
  return chips.slice(0, 3);
}

// ─── Left panel step progress ─────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: "Pick Products" },
  { num: 2, label: "Brand Context" },
  { num: 3, label: "Choose AI People" },
  { num: 4, label: "Generating" },
];

function LeftPanel({ currentStep }) {
  return (
    <aside className="sw-left">
      <div className="sw-left-logo">
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <div>
          <h1>ViralForge</h1>
          <p>Campaign Studio</p>
        </div>
      </div>

      <div className="sw-left-tagline">
        <Sparkles size={14} />
        <span>AI-powered UGC storyboarding</span>
      </div>

      <nav className="sw-step-progress" aria-label="Wizard steps">
        {STEPS.map((step) => {
          const done = currentStep > step.num;
          const active = currentStep === step.num;
          return (
            <div
              key={step.num}
              className={`sw-step-item ${active ? "is-active" : ""} ${done ? "is-done" : ""}`}
            >
              <div className="sw-step-dot">
                {done ? <Check size={12} /> : <span>{step.num}</span>}
              </div>
              <span className="sw-step-label">{step.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sw-left-foot">
        <p>Hackathon Demo Mode</p>
        <p>No real data is stored</p>
      </div>
    </aside>
  );
}

// ─── Step 1: Pick Products ────────────────────────────────────────────────────

function StepProducts({ selected, onToggle, onNext }) {
  const [importOpen, setImportOpen] = useState(false);
  const [importUrl, setImportUrl] = useState("");

  return (
    <div className="sw-step-content">
      <div className="sw-step-header">
        <p className="sw-step-kicker">Step 1 of 3</p>
        <h2>Pick your products</h2>
        <p className="sw-step-sub">
          Select the products you want to create UGC campaigns for. You can add more later.
        </p>
      </div>

      <div className="sw-product-grid">
        {PRODUCTS.map((prod) => {
          const isSelected = selected.some((p) => p.id === prod.id);
          return (
            <button
              key={prod.id}
              type="button"
              className={`sw-product-card ${isSelected ? "is-selected" : ""}`}
              onClick={() => onToggle(prod)}
            >
              {isSelected && (
                <div className="sw-check-badge">
                  <Check size={11} />
                </div>
              )}
              <div className="sw-product-img">
                {assets[prod.asset] ? (
                  <img src={assets[prod.asset]} alt={prod.name} />
                ) : (
                  <div className="sw-product-placeholder">{prod.name.charAt(0)}</div>
                )}
              </div>
              <span className="sw-product-cat">{prod.category}</span>
              <strong className="sw-product-name">{prod.name}</strong>
              <span className="sw-product-price">{prod.price}</span>
            </button>
          );
        })}

        {/* Import card */}
        <button
          type="button"
          className="sw-product-card sw-import-card"
          onClick={() => setImportOpen(true)}
        >
          <div className="sw-import-icon">
            <Import size={22} />
          </div>
          <strong className="sw-product-name">Import from URL</strong>
          <span className="sw-product-cat">Shopee · TikTok Shop · Custom</span>
        </button>
      </div>

      {importOpen && (
        <div className="sw-modal-overlay">
          <div className="sw-modal">
            <div className="sw-modal-header">
              <h3>Import product URL</h3>
              <button type="button" onClick={() => setImportOpen(false)}>
                <X size={17} />
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 16px" }}>
              Paste a Shopee, TikTok Shop, or Lazada product URL to auto-import.
            </p>
            <input
              className="sw-text-input"
              type="url"
              placeholder="https://shopee.sg/product/..."
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
            />
            <div className="sw-modal-actions">
              <button type="button" className="sw-btn-ghost" onClick={() => setImportOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="sw-btn-primary"
                onClick={() => {
                  setImportOpen(false);
                  setImportUrl("");
                }}
              >
                <Sparkles size={14} /> Auto-import
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sw-step-footer">
        {selected.length > 0 && (
          <div className="sw-selected-pill">
            <Check size={13} />
            {selected.length} product{selected.length !== 1 ? "s" : ""} selected
          </div>
        )}
        <button
          type="button"
          className="sw-btn-primary"
          disabled={selected.length === 0}
          onClick={onNext}
        >
          Continue with {selected.length || "0"} product{selected.length !== 1 ? "s" : ""}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Brand Context ────────────────────────────────────────────────────

function StepBrandContext({ brand, onChange, onBack, onNext }) {
  return (
    <div className="sw-step-content">
      <div className="sw-step-header">
        <p className="sw-step-kicker">Step 2 of 3</p>
        <h2>Tell us about your brand</h2>
        <p className="sw-step-sub">
          This context helps us recommend the right AI creators and generate better hooks.
        </p>
      </div>

      <div className="sw-form-body">
        <div className="sw-field">
          <label htmlFor="sw-brand-name">Brand name</label>
          <input
            id="sw-brand-name"
            className="sw-text-input"
            type="text"
            placeholder="e.g. Glow Republic"
            value={brand.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className="sw-field">
          <label>Industry</label>
          <div className="sw-pill-group">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                type="button"
                className={`sw-pill ${brand.industry === ind ? "is-active" : ""}`}
                onClick={() => onChange("industry", ind)}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="sw-field">
          <label>Target audience</label>
          <div className="sw-pill-group">
            {AUDIENCES.map((aud) => (
              <button
                key={aud}
                type="button"
                className={`sw-pill ${brand.audience === aud ? "is-active" : ""}`}
                onClick={() => onChange("audience", aud)}
              >
                {aud}
              </button>
            ))}
          </div>
        </div>

        <div className="sw-field">
          <label>Campaign tone</label>
          <div className="sw-pill-group">
            {TONES.map((tone) => (
              <button
                key={tone}
                type="button"
                className={`sw-pill ${brand.tone === tone ? "is-active" : ""}`}
                onClick={() => onChange("tone", tone)}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="sw-field">
          <label htmlFor="sw-brand-brief">Campaign brief <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <textarea
            id="sw-brand-brief"
            className="sw-textarea"
            placeholder="Describe what makes your product special, your key benefit, or the story you want to tell…"
            value={brand.brief}
            onChange={(e) => onChange("brief", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="sw-step-footer">
        <button type="button" className="sw-btn-ghost" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button
          type="button"
          className="sw-btn-primary"
          disabled={!brand.name.trim() || !brand.tone || !brand.industry}
          onClick={onNext}
        >
          <Sparkles size={14} /> Get AI Recommendations <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: AI People ────────────────────────────────────────────────────────

function StepAIPeople({ brand, selectedCreators, onToggle, onBack, onGenerate }) {
  const [genderFilter, setGenderFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All");
  const recommendations = React.useMemo(
    () => getRecommendations(brand.tone, brand.audience),
    [brand.tone, brand.audience],
  );

  const roster = ALL_AVATARS.filter((av) => {
    const isRecommended = recommendations.some((r) => r.id === av.id);
    if (isRecommended) return false; // already shown in recs section
    if (genderFilter !== "All" && av.gender !== genderFilter) return false;
    if (styleFilter !== "All" && av.style !== styleFilter) return false;
    return true;
  });

  const isSelected = (id) => selectedCreators.some((c) => c.id === id);

  return (
    <div className="sw-step-content sw-step-people">
      <div className="sw-step-header">
        <p className="sw-step-kicker">Step 3 of 3</p>
        <h2>Choose your AI creators</h2>
        <p className="sw-step-sub">
          AI-recommended for your <strong>{brand.tone}</strong> tone and <strong>{brand.audience}</strong> audience. Pick up to 5.
        </p>
      </div>

      {/* AI Recommendations */}
      <div className="sw-rec-section">
        <div className="sw-rec-label">
          <Zap size={13} />
          <span>AI Recommended</span>
        </div>
        <div className="sw-rec-grid">
          {recommendations.map((rec) => {
            const sel = isSelected(rec.id);
            const chips = getReasonChips(rec, brand.tone, brand.audience);
            return (
              <button
                key={rec.id}
                type="button"
                className={`sw-rec-card ${sel ? "is-selected" : ""}`}
                onClick={() => onToggle(rec)}
              >
                {sel && <div className="sw-check-badge"><Check size={11} /></div>}
                <div className="sw-rec-score">
                  <Star size={10} fill="currentColor" /> {rec.fitScore}% fit
                </div>
                <img src={rec.image} alt={rec.name} className="sw-rec-avatar" />
                <strong className="sw-rec-name">{rec.name}</strong>
                <span className="sw-rec-style">{rec.gender} · {rec.style}</span>
                <div className="sw-rec-chips">
                  {chips.map((c) => (
                    <span key={c} className="sw-rec-chip">{c}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full roster */}
      <div className="sw-roster-section">
        <div className="sw-roster-header">
          <strong>All creators</strong>
          <div className="sw-roster-filters">
            <div className="sw-filter-tabs">
              {["All", "Female", "Male"].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`sw-filter-tab ${genderFilter === g ? "is-active" : ""}`}
                  onClick={() => setGenderFilter(g)}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="sw-filter-tabs">
              {["All", "Relatable", "Aspirational", "Edgy", "Minimal"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`sw-filter-tab ${styleFilter === s ? "is-active" : ""}`}
                  onClick={() => setStyleFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sw-avatar-grid">
          {roster.map((av) => {
            const sel = isSelected(av.id);
            return (
              <button
                key={av.id}
                type="button"
                className={`sw-avatar-card ${sel ? "is-selected" : ""}`}
                onClick={() => onToggle(av)}
              >
                {sel && <div className="sw-check-badge"><Check size={10} /></div>}
                <img src={av.image} alt={av.name} />
                <span className="sw-avatar-name">{av.name}</span>
                <span className="sw-avatar-style">{av.style}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky tray */}
      {selectedCreators.length > 0 && (
        <div className="sw-tray">
          <div className="sw-tray-faces">
            {selectedCreators.slice(0, 5).map((c) => (
              <img key={c.id} src={c.image} alt={c.name} className="sw-tray-face" title={c.name} />
            ))}
            <span className="sw-tray-count">
              <Users size={12} /> {selectedCreators.length} selected
            </span>
          </div>
          <div className="sw-tray-actions">
            <button type="button" className="sw-btn-ghost" onClick={onBack}>
              <ChevronLeft size={15} /> Back
            </button>
            <button type="button" className="sw-btn-primary" onClick={onGenerate}>
              <Sparkles size={14} /> Generate Campaign
            </button>
          </div>
        </div>
      )}

      {/* Footer when nothing selected */}
      {selectedCreators.length === 0 && (
        <div className="sw-step-footer">
          <button type="button" className="sw-btn-ghost" onClick={onBack}>
            <ChevronLeft size={16} /> Back
          </button>
          <button type="button" className="sw-btn-primary" disabled>
            Select at least 1 creator
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StoryboardWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState({
    name: "",
    industry: "",
    audience: "Gen Z",
    tone: "Authentic",
    brief: "",
  });
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [slideDir, setSlideDir] = useState("forward");
  const [animKey, setAnimKey] = useState(0);

  function goTo(nextStep, dir = "forward") {
    setSlideDir(dir);
    setAnimKey((k) => k + 1);
    setStep(nextStep);
  }

  function toggleProduct(prod) {
    setProducts((prev) =>
      prev.some((p) => p.id === prod.id)
        ? prev.filter((p) => p.id !== prod.id)
        : [...prev, prod],
    );
  }

  function toggleCreator(creator) {
    setSelectedCreators((prev) => {
      if (prev.some((c) => c.id === creator.id)) {
        return prev.filter((c) => c.id !== creator.id);
      }
      if (prev.length >= 5) return prev; // max 5
      return [...prev, creator];
    });
  }

  function handleBrandChange(field, value) {
    setBrand((b) => ({ ...b, [field]: value }));
  }

  function handleGenerate() {
    onComplete({
      products,
      brand,
      characters: selectedCreators,
      // Provide a single "character" for backwards compat with DemoFlow
      product: products[0] || null,
      character: selectedCreators[0] || null,
      story: brand.brief,
      tone: brand.tone,
    });
  }

  return (
    <div className="sw-shell">
      <LeftPanel currentStep={step} />

      <main className="sw-right">
        <div
          key={animKey}
          className={`sw-slide ${slideDir === "forward" ? "sw-slide-forward" : "sw-slide-back"}`}
        >
          {step === 1 && (
            <StepProducts
              selected={products}
              onToggle={toggleProduct}
              onNext={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <StepBrandContext
              brand={brand}
              onChange={handleBrandChange}
              onBack={() => goTo(1, "back")}
              onNext={() => goTo(3)}
            />
          )}
          {step === 3 && (
            <StepAIPeople
              brand={brand}
              selectedCreators={selectedCreators}
              onToggle={toggleCreator}
              onBack={() => goTo(2, "back")}
              onGenerate={handleGenerate}
            />
          )}
        </div>
      </main>
    </div>
  );
}
