import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Check, Globe, Search, Palette, Users, Target, Crosshair, Plus, X } from "lucide-react";
import { assets } from "./assetMap.js";

// Female portraits
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

// Male portraits
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

const PRODUCTS = [
  { id: "prod-7", name: "Sunbyme Miracle Serum", price: "$22.00", category: "Skincare", asset: "sunbymeSerum" },
  { id: "prod-1", name: "Summer Glow Vitamin C Serum", price: "$19.99", category: "Skincare", asset: "neutrogenaBoost" },
  { id: "prod-2", name: "Hydrating Hyaluronic Gel", price: "$24.50", category: "Skincare", asset: "centellaAmpoule" },
  { id: "prod-3", name: "Matte Finish Setting Spray", price: "$15.00", category: "Cosmetics", asset: "lrpHyaluB5" },
  { id: "prod-4", name: "Rosewater Facial Mist", price: "$12.00", category: "Skincare", asset: "vichyMineral89" },
  { id: "prod-5", name: "Organic Avocado Eye Cream", price: "$29.99", category: "Skincare", asset: "centellaAmpoule" }
];

const DEFAULT_PRODUCT_NAME = "Summer Glow Vitamin C Serum";
const DEFAULT_PRODUCT = PRODUCTS.find((product) => product.name === DEFAULT_PRODUCT_NAME) ?? PRODUCTS[0];

export const DEFAULT_PRODUCT_STORY = [
  "Shot 1: Opening Hook - Create a 15-second vertical UGC skincare ad that continues from the previous video. Use the same Korean on-camera person, face, hairstyle, outfit, bathroom vanity setting, and warm summer lighting. Use the uploaded image as the exact product reference for Summer Glow Vitamin C Serum.",
  "Shot 2: Texture Proof - Focus on demonstrating the premium product texture and skin absorption. The creator holds the glass dropper close to their face, dispensing a single glossy, translucent drop of the Miracle Serum onto their cheek. Capture the slow glide of the serum drop and the creator gently patting it into the skin, revealing a healthy, hydrated, and radiant dewy glow under warm bathroom vanity lighting. The skin must look realistic, natural, and highly polished, avoiding any artificial or heavy filter effects.",
  "Shot 3: Product Context & Spokesperson Intro - Establish the creator's space and clear brand presence. The spokesperson smiles warmly at the camera, introducing their daily skincare routine. In a smooth motion, the creator places the green Summer Glow Vitamin C Serum bottle onto a pristine white marble vanity tray. The bottle must remain perfectly consistent in shape, with its distinctive green label and cap, surrounded by clean aesthetics like a folded white hand towel and fresh green leaves to accentuate the natural formula.",
  "Shot 4: Label Macro Lock - Add fresh leaves, a clean towel, and minimal citrus accents to the tray. Keep the same bottle shape, green label, cap, logo placement, proportions, and packaging design from the uploaded image.",
  "Shot 5: Ingredient Close Read - The camera slowly pushes in on the product like a Shopee/TikTok Shop listing hero shot. Product should be centered, front-facing, sharp, and label-visible with a premium commerce-ready look.",
  "Shot 6: Final Recommendation - End with the creator holding the serum next to her face and giving a natural final recommendation. Add English voiceover audio with a natural Korean female beauty influencer accent, friendly TikTok skincare tone, clear pronunciation, soft confident delivery.",
].join("\n\n");

const TONES = ["Authentic", "Funny", "Urgent", "Soft Sell"];

const HOOKS = [
  "POV: you finally found the serum that works",
  "Skincare gatekeepers are going to be so mad at this",
  "Adding this to my morning routine was the best decision ever"
];

// ── Brand palette generator: deterministic from URL ──
const BRAND_PALETTE_PRESETS = {
  somebymi: {
    name: "SOME BY MI",
    tagline: "Miracle skincare for sensitive skin",
    colors: [
      { hex: "#1B8C78", name: "Miracle Green" },
      { hex: "#2EC4A9", name: "Fresh Mint" },
      { hex: "#F5F0E8", name: "Soft Cream" },
      { hex: "#1A1A2E", name: "Deep Navy" },
      { hex: "#E8505B", name: "Accent Coral" },
    ],
    fonts: ["Pretendard", "Noto Sans KR"],
    industry: "K-Beauty & Skincare",
  },
  default: {
    name: "Your Brand",
    tagline: "Your brand identity",
    colors: [
      { hex: "#6366F1", name: "Primary Indigo" },
      { hex: "#8B5CF6", name: "Accent Violet" },
      { hex: "#F8FAFC", name: "Light Surface" },
      { hex: "#0F172A", name: "Dark Ink" },
      { hex: "#F59E0B", name: "Warm Amber" },
    ],
    fonts: ["Inter", "System UI"],
    industry: "E-Commerce",
  },
};

function getBrandFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const key of Object.keys(BRAND_PALETTE_PRESETS)) {
      if (key !== "default" && hostname.includes(key)) {
        return BRAND_PALETTE_PRESETS[key];
      }
    }
    // Generate deterministic colors from the hostname
    let hash = 0;
    for (let i = 0; i < hostname.length; i++) {
      hash = hostname.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    const brandName = hostname.replace(/^(www\.|en\.)/i, "").split(".")[0];
    return {
      name: brandName.charAt(0).toUpperCase() + brandName.slice(1),
      tagline: `Discovered from ${hostname}`,
      colors: [
        { hex: `hsl(${hue}, 72%, 42%)`, name: "Primary" },
        { hex: `hsl(${(hue + 30) % 360}, 65%, 55%)`, name: "Secondary" },
        { hex: `hsl(${hue}, 15%, 96%)`, name: "Surface" },
        { hex: `hsl(${hue}, 40%, 12%)`, name: "Dark" },
        { hex: `hsl(${(hue + 180) % 360}, 70%, 58%)`, name: "Accent" },
      ],
      fonts: ["Inter", "System UI"],
      industry: "E-Commerce",
    };
  } catch {
    return BRAND_PALETTE_PRESETS.default;
  }
}

const TARGET_AUDIENCES = [
  "Gen Z (18–24)",
  "Millennials (25–34)",
  "Young Professionals (25–40)",
  "Parents & Families",
  "Beauty Enthusiasts",
  "Health & Wellness",
  "Tech-Savvy Shoppers",
  "Budget-Conscious Buyers",
];

const CAMPAIGN_GOALS = [
  "Brand Awareness",
  "Product Launch",
  "Drive Sales / Conversions",
  "Grow Social Following",
  "Build Community Trust",
  "Seasonal Promotion",
  "Influencer Collaboration",
  "Retarget Existing Customers",
];

const AVATARS = [
  // 18 Female
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
  // 13 Male
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
  { id: "m17", name: "Sangwoo", gender: "Male", style: "Relatable", image: m17 }
];

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState("branding"); // branding, scanning, brand-profile, query, story, character
  const [websiteUrl, setWebsiteUrl] = useState("https://en.somebymi.com/");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLines, setScanLines] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(DEFAULT_PRODUCT);
  const [productStory, setProductStory] = useState(DEFAULT_PRODUCT_STORY);
  const [selectedTone, setSelectedTone] = useState("Authentic");
  const [selectedCharacter, setSelectedCharacter] = useState(AVATARS[0]);
  const [genderFilter, setGenderFilter] = useState("All");

  // Brand profile state – pre-filled for demo
  const [brandPeople, setBrandPeople] = useState([
    "Bae Suzy (Ambassador)",
    "Dr. Park Jihye (Dermatologist)",
    "@glowwithme (Beauty KOL)",
  ]);
  const [brandPersonInput, setBrandPersonInput] = useState("");
  const [selectedTargets, setSelectedTargets] = useState([
    "Gen Z (18–24)",
    "Millennials (25–34)",
    "Beauty Enthusiasts",
  ]);
  const [selectedGoals, setSelectedGoals] = useState([
    "Brand Awareness",
    "Drive Sales / Conversions",
    "Influencer Collaboration",
  ]);
  const [brandNotes, setBrandNotes] = useState(
    "SOME BY MI is a Korean skincare brand known for the 30-day Miracle line. Focus on clean, clinical-yet-fun visuals that appeal to the K-beauty community worldwide."
  );

  const brandData = useMemo(() => getBrandFromUrl(websiteUrl), [websiteUrl]);

  // Local editable palette colors (initialized from brandData)
  const [paletteColors, setPaletteColors] = useState([]);
  useEffect(() => {
    setPaletteColors(brandData.colors);
  }, [brandData]);

  const handleRemoveColor = (idx) => {
    setPaletteColors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddColor = () => {
    const hue = Math.floor(Math.random() * 360);
    setPaletteColors((prev) => [
      ...prev,
      { hex: `hsl(${hue}, 65%, 50%)`, name: `Custom ${prev.length + 1}` },
    ]);
  };

  // Scanning animation side effect
  useEffect(() => {
    if (step === "scanning") {
      setScanProgress(0);
      setScanLines([]);
      const messages = [
        "Fetching homepage…",
        "Parsing product catalogue…",
        "Extracting brand colours…",
        "Detecting product images…",
        `Found ${PRODUCTS.length} products ✓`,
      ];
      let i = 0;
      const interval = setInterval(() => {
        i++;
        const pct = Math.min(Math.round((i / messages.length) * 100), 100);
        setScanProgress(pct);
        if (messages[i - 1]) setScanLines((prev) => [...prev, messages[i - 1]]);
        if (i >= messages.length) {
          clearInterval(interval);
          setTimeout(() => setStep("brand-profile"), 700);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Step 2 Connection Loader side effect
  useEffect(() => {
    if (step === "connecting") {
      const timer = setTimeout(() => {
        setStep("query");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBrandingSubmit = (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    setStep("scanning");
  };

  const handleAddBrandPerson = () => {
    const trimmed = brandPersonInput.trim();
    if (trimmed && !brandPeople.includes(trimmed)) {
      setBrandPeople((prev) => [...prev, trimmed]);
    }
    setBrandPersonInput("");
  };

  const handleRemoveBrandPerson = (person) => {
    setBrandPeople((prev) => prev.filter((p) => p !== person));
  };

  const handleToggleTarget = (target) => {
    setSelectedTargets((prev) =>
      prev.includes(target) ? prev.filter((t) => t !== target) : [...prev, target]
    );
  };

  const handleToggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setStep("connecting");
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setTimeout(() => {
      setStep("story");
    }, 450);
  };

  const handleHookClick = (hook) => {
    if (productStory) {
      setProductStory((story) => `${story}\n${hook}`);
    } else {
      setProductStory(hook);
    }
  };

  const handleCharacterSelect = (char) => {
    setSelectedCharacter(char);
    setTimeout(() => {
      onComplete({
        product: selectedProduct,
        story: productStory,
        tone: selectedTone,
        character: char
      });
    }, 450);
  };

  const handleFinish = () => {
    onComplete({
      product: selectedProduct,
      story: productStory,
      tone: selectedTone,
      character: selectedCharacter
    });
  };

  const filteredAvatars = AVATARS.filter((avatar) => {
    if (genderFilter === "All") return true;
    return avatar.gender === genderFilter;
  });

  return (
    <div className="wizard-container">

      {/* ── Step 0: Branding ── */}
      {step === "branding" && (
        <div className="wizard-card">
          <div className="wizard-logo-area">
            <div className="wizard-logo-mark" />
            <div className="wizard-logo-text">
              <h1>ViralForge</h1>
              <p>Commerce</p>
            </div>
          </div>

          <h2 className="wizard-title">Find your brand</h2>
          <p className="wizard-subtitle">
            Enter your company website and we'll automatically discover your products and brand identity.
          </p>

          <form className="branding-form" onSubmit={handleBrandingSubmit}>
            <div className="branding-url-field">
              <span className="branding-url-icon"><Globe size={18} /></span>
              <input
                id="website-url"
                type="url"
                placeholder="https://yourstore.com"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                autoComplete="url"
                autoFocus
              />
            </div>

            <div className="branding-trusted">
              <span className="branding-trusted-dot" />
              Secure · We only read publicly available data
            </div>

            <button type="submit" className="btn-primary btn-teal" style={{ marginTop: "8px" }}>
              <Search size={16} /> Scan for products
            </button>
          </form>
        </div>
      )}

      {/* ── Scanning animation ── */}
      {step === "scanning" && (
        <div className="wizard-card">
          <div className="scanning-header">
            <div className="scanning-globe-ring">
              <Globe size={28} className="scanning-globe-icon" />
            </div>
            <h2 className="wizard-title" style={{ marginTop: "20px" }}>Scanning your store…</h2>
            <p className="wizard-subtitle" style={{ marginBottom: "24px" }}>
              {websiteUrl}
            </p>
          </div>

          <div className="scanning-bar-track">
            <div className="scanning-bar-fill" style={{ width: `${scanProgress}%` }} />
          </div>
          <div className="scanning-pct">{scanProgress}%</div>

          <div className="scanning-log">
            {scanLines.map((line, i) => (
              <div key={i} className="scanning-log-line">
                <Check size={12} className="scanning-check" />
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Brand Profile step ── */}
      {step === "brand-profile" && (
        <div className="wizard-card wide">
          <div className="wizard-steps">
            <span className="wizard-step-dot active" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
          </div>

          <h2 className="wizard-title">Your brand identity</h2>
          <p className="wizard-subtitle">
            We've extracted your brand palette and identity. Tell us more about your brand to create the perfect campaign.
          </p>

          {/* ── Brand Palette ── */}
          <div className="brand-profile-section">
            <div className="brand-profile-header">
              <div className="brand-profile-icon-circle">
                <Palette size={18} />
              </div>
              <div>
                <h3 className="brand-profile-section-title">Brand Palette</h3>
                <p className="brand-profile-section-sub">Extracted from {brandData.name}</p>
              </div>
            </div>

            <div className="brand-palette-card">
              <div className="brand-palette-swatches">
                {paletteColors.map((color, idx) => (
                  <div key={idx} className="brand-swatch">
                    <div className="brand-swatch-color" style={{ background: color.hex }}>
                      {paletteColors.length > 1 && (
                        <button
                          type="button"
                          className="brand-swatch-remove"
                          onClick={() => handleRemoveColor(idx)}
                          aria-label={`Remove ${color.name}`}
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                    <span className="brand-swatch-name">{color.name}</span>
                    <span className="brand-swatch-hex">{color.hex}</span>
                  </div>
                ))}
                <button
                  type="button"
                  className="brand-swatch brand-swatch-add"
                  onClick={handleAddColor}
                >
                  <div className="brand-swatch-color brand-swatch-add-color">
                    <Plus size={18} />
                  </div>
                  <span className="brand-swatch-name">Add Color</span>
                </button>
              </div>
              <div className="brand-palette-meta">
                <div className="brand-meta-item">
                  <span className="brand-meta-label">Typography</span>
                  <span className="brand-meta-value">{brandData.fonts.join(" / ")}</span>
                </div>
                <div className="brand-meta-item">
                  <span className="brand-meta-label">Industry</span>
                  <span className="brand-meta-value">{brandData.industry}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Brand People ── */}
          <div className="brand-profile-section">
            <div className="brand-profile-header">
              <div className="brand-profile-icon-circle">
                <Users size={18} />
              </div>
              <div>
                <h3 className="brand-profile-section-title">Brand People</h3>
                <p className="brand-profile-section-sub">Who represents your brand? Spokespeople, founders, influencers…</p>
              </div>
            </div>

            <div className="brand-people-input-row">
              <input
                id="brand-person-input"
                type="text"
                placeholder="e.g. Kim Taeri, CEO Name, @influencer"
                value={brandPersonInput}
                onChange={(e) => setBrandPersonInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddBrandPerson();
                  }
                }}
              />
              <button
                type="button"
                className="brand-people-add-btn"
                onClick={handleAddBrandPerson}
                disabled={!brandPersonInput.trim()}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {brandPeople.length > 0 && (
              <div className="brand-people-tags">
                {brandPeople.map((person) => (
                  <span key={person} className="brand-person-tag">
                    {person}
                    <button
                      type="button"
                      className="brand-person-tag-remove"
                      onClick={() => handleRemoveBrandPerson(person)}
                      aria-label={`Remove ${person}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Target Audience ── */}
          <div className="brand-profile-section">
            <div className="brand-profile-header">
              <div className="brand-profile-icon-circle">
                <Target size={18} />
              </div>
              <div>
                <h3 className="brand-profile-section-title">Target Audience</h3>
                <p className="brand-profile-section-sub">Who are you trying to reach?</p>
              </div>
            </div>

            <div className="brand-chip-grid">
              {TARGET_AUDIENCES.map((audience) => (
                <button
                  key={audience}
                  type="button"
                  className={`brand-chip ${selectedTargets.includes(audience) ? "selected" : ""}`}
                  onClick={() => handleToggleTarget(audience)}
                >
                  {selectedTargets.includes(audience) && <Check size={13} />}
                  {audience}
                </button>
              ))}
            </div>
          </div>

          {/* ── Campaign Goals ── */}
          <div className="brand-profile-section">
            <div className="brand-profile-header">
              <div className="brand-profile-icon-circle">
                <Crosshair size={18} />
              </div>
              <div>
                <h3 className="brand-profile-section-title">Campaign Goals</h3>
                <p className="brand-profile-section-sub">What do you want to achieve?</p>
              </div>
            </div>

            <div className="brand-chip-grid">
              {CAMPAIGN_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`brand-chip ${selectedGoals.includes(goal) ? "selected" : ""}`}
                  onClick={() => handleToggleGoal(goal)}
                >
                  {selectedGoals.includes(goal) && <Check size={13} />}
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* ── Additional Notes ── */}
          <div className="brand-profile-section">
            <textarea
              id="brand-notes"
              className="brand-notes-textarea"
              placeholder="Anything else we should know about your brand? (optional)"
              value={brandNotes}
              onChange={(e) => setBrandNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="wizard-footer">
            <button className="btn-back" onClick={() => setStep("branding")} type="button">
              <ChevronLeft size={16} /> Back
            </button>
            <button
              className="btn-primary btn-teal"
              style={{ width: "auto", padding: "0 24px" }}
              onClick={() => setStep("query")}
              type="button"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === "login" && (
        <div className="wizard-card">
          <div className="wizard-logo-area">
            <div className="wizard-logo-mark" />
            <div className="wizard-logo-text">
              <h1>ViralForge</h1>
              <p>Commerce</p>
            </div>
          </div>
          <h2 className="wizard-title">Welcome to ViralForge</h2>
          <p className="wizard-subtitle">Generate high-converting TikTok Shop videos in seconds.</p>

          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="seller@brand.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary btn-tiktok" style={{ marginTop: "12px" }}>
              Sign in with TikTok Shop
            </button>
          </form>
        </div>
      )}

      {step === "connecting" && (
        <div className="wizard-card">
          <div className="loader-container">
            <div className="spinner" />
            <p className="loader-text">Connecting to TikTok Shop…</p>
          </div>
        </div>
      )}

      {step === "query" && (
        <div className="wizard-card wide">
          <div className="wizard-steps">
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot active" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
          </div>

          <h2 className="wizard-title">Select your product</h2>
          <p className="wizard-subtitle">Choose which product from TikTok Shop to build a campaign for.</p>

          <div className="product-grid">
            {PRODUCTS.map((prod) => (
              <button
                key={prod.id}
                className={`product-card ${selectedProduct?.id === prod.id ? "selected" : ""}`}
                onClick={() => handleProductSelect(prod)}
                type="button"
              >
                <div className="product-image-container">
                  {assets[prod.asset] ? (
                    <img src={assets[prod.asset]} alt={prod.name} />
                  ) : (
                    <div className="product-image-placeholder">{prod.name.charAt(0)}</div>
                  )}
                </div>
                <span className="product-category">{prod.category}</span>
                <h3 className="product-name">{prod.name}</h3>
                <span className="product-price">{prod.price}</span>
              </button>
            ))}
          </div>

          <div className="wizard-footer">
            <button className="btn-back" onClick={() => setStep("brand-profile")} type="button">
              <ChevronLeft size={16} /> Back
            </button>
            <button
              className="btn-primary btn-teal"
              style={{ width: "auto", padding: "0 24px" }}
              disabled={!selectedProduct}
              onClick={() => setStep("story")}
              type="button"
            >
              Create Campaign <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === "story" && (
        <div className="wizard-card">
          <div className="wizard-steps">
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot active" />
            <span className="wizard-step-dot" />
          </div>

          <h2 className="wizard-title">What's your product story?</h2>
          <p className="wizard-subtitle">Describe your product and choose a tone to generate optimized video hooks.</p>

          {selectedProduct && (
            <div className="selected-product-preview">
              <img src={assets[selectedProduct.asset]} alt={selectedProduct.name} />
              <div className="selected-product-preview-info">
                <strong>{selectedProduct.name}</strong>
                <span>{selectedProduct.price} • {selectedProduct.category}</span>
              </div>
            </div>
          )}

          <div className="story-section">
            <div className="story-textarea-container">
              <label htmlFor="product-story">Product Description</label>
              <textarea
                id="product-story"
                placeholder="Describe what makes this product special (e.g. formulated with 10% pure Vitamin C to instantly brighten dull skin, lightweight, absorbs in 5 seconds without sticky residue)..."
                value={productStory}
                onChange={(e) => setProductStory(e.target.value)}
              />
            </div>

            <div className="tone-selector">
              <span className="tone-label">Tone</span>
              <div className="tone-pills">
                {TONES.map((tone) => (
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

            <div className="hooks-selector">
              <span className="hooks-label">Trending Hook Suggestions</span>
              <div className="hooks-chips">
                {HOOKS.map((hook, index) => (
                  <button
                    key={index}
                    type="button"
                    className="hook-chip"
                    onClick={() => handleHookClick(hook)}
                  >
                    💡 {hook}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="wizard-footer">
            <button className="btn-back" onClick={() => setStep("query")} type="button">
              <ChevronLeft size={16} /> Back
            </button>
            <button
              className="btn-primary btn-teal"
              style={{ width: "auto", padding: "0 24px" }}
              disabled={!productStory.trim()}
              onClick={() => setStep("character")}
              type="button"
            >
              Build my video <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === "character" && (
        <div className="wizard-card wide">
          <div className="wizard-steps">
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot" />
            <span className="wizard-step-dot active" />
          </div>

          <h2 className="wizard-title">Who's telling your story?</h2>
          <p className="wizard-subtitle">Select an AI avatar model to act as the face of your campaign.</p>

          <div className="character-gender-tabs">
            {["All", "Female", "Male"].map((g) => (
              <button
                key={g}
                type="button"
                className={`gender-tab ${genderFilter === g ? "active" : ""}`}
                onClick={() => setGenderFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="character-grid">
            {filteredAvatars.map((char) => (
              <button
                key={char.id}
                className={`character-card ${selectedCharacter?.id === char.id ? "selected" : ""}`}
                onClick={() => handleCharacterSelect(char)}
                type="button"
              >
                <div className="avatar-circle" style={{ overflow: "hidden", background: "#f0f0f0" }}>
                  {char.image ? (
                    <img
                      src={char.image}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      alt={char.name}
                    />
                  ) : (
                    <span>{char.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="character-name">{char.name}</h3>
                <span className="character-tag">{char.style}</span>
              </button>
            ))}
          </div>

          <div className="wizard-footer">
            <button className="btn-back" onClick={() => setStep("story")} type="button">
              <ChevronLeft size={16} /> Back
            </button>
            <button
              className="btn-primary btn-teal"
              style={{ width: "auto", padding: "0 24px" }}
              disabled={!selectedCharacter}
              onClick={handleFinish}
              type="button"
            >
              Generate video <Sparkles size={16} style={{ marginLeft: "4px" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
