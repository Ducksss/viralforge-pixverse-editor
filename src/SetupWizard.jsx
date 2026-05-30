import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Check, Info } from "lucide-react";
import { assets } from "./assetMap.js";

const PRODUCTS = [
  { id: "prod-1", name: "Summer Glow Vitamin C Serum", price: "$19.99", category: "Skincare", asset: "projectThumb" },
  { id: "prod-2", name: "Hydrating Hyaluronic Gel", price: "$24.50", category: "Skincare", asset: "shotDropper" },
  { id: "prod-3", name: "Matte Finish Setting Spray", price: "$15.00", category: "Cosmetics", asset: "shotSocial" },
  { id: "prod-4", name: "Rosewater Facial Mist", price: "$12.00", category: "Skincare", asset: "shotProduct" },
  { id: "prod-5", name: "Organic Avocado Eye Cream", price: "$29.99", category: "Skincare", asset: "shotBottle" },
  { id: "prod-6", name: "Ultra-Defending Daily Sunscreen", price: "$18.50", category: "Skincare", asset: "shotBubbles" }
];

const TONES = ["Authentic", "Funny", "Urgent", "Soft Sell"];

const HOOKS = [
  "POV: you finally found the serum that works",
  "Skincare gatekeepers are going to be so mad at this",
  "Adding this to my morning routine was the best decision ever"
];

const AVATARS = [
  // 10 Female
  { id: "sarah", name: "Sarah", gender: "Female", style: "Relatable", initials: "SA", gradient: "linear-gradient(135deg, #4f46e5, #06b6d4)" },
  { id: "chloe", name: "Chloe", gender: "Female", style: "Aspirational", initials: "CH", gradient: "linear-gradient(135deg, #f43f5e, #fb7185)" },
  { id: "elena", name: "Elena", gender: "Female", style: "Edgy", initials: "EL", gradient: "linear-gradient(135deg, #ec4899, #f472b6)" },
  { id: "mia", name: "Mia", gender: "Female", style: "Minimal", initials: "MI", gradient: "linear-gradient(135deg, #64748b, #94a3b8)" },
  { id: "jessica", name: "Jessica", gender: "Female", style: "Relatable", initials: "JE", gradient: "linear-gradient(135deg, #0d9488, #2dd4bf)" },
  { id: "sophia", name: "Sophia", gender: "Female", style: "Aspirational", initials: "SO", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)" },
  { id: "zoe", name: "Zoe", gender: "Female", style: "Edgy", initials: "ZO", gradient: "linear-gradient(135deg, #d97706, #fbbf24)" },
  { id: "lily", name: "Lily", gender: "Female", style: "Minimal", initials: "LI", gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
  { id: "grace", name: "Grace", gender: "Female", style: "Relatable", initials: "GR", gradient: "linear-gradient(135deg, #4f46e5, #818cf8)" },
  { id: "emma", name: "Emma", gender: "Female", style: "Aspirational", initials: "EM", gradient: "linear-gradient(135deg, #db2777, #f472b6)" },
  // 10 Male
  { id: "alex", name: "Alex", gender: "Male", style: "Relatable", initials: "AL", gradient: "linear-gradient(135deg, #2563eb, #60a5fa)" },
  { id: "marcus", name: "Marcus", gender: "Male", style: "Aspirational", initials: "MA", gradient: "linear-gradient(135deg, #ea580c, #f97316)" },
  { id: "jordan", name: "Jordan", gender: "Male", style: "Edgy", initials: "JO", gradient: "linear-gradient(135deg, #dc2626, #f87171)" },
  { id: "leo", name: "Leo", gender: "Male", style: "Minimal", initials: "LE", gradient: "linear-gradient(135deg, #475569, #64748b)" },
  { id: "ethan", name: "Ethan", gender: "Male", style: "Relatable", initials: "ET", gradient: "linear-gradient(135deg, #16a34a, #4ade80)" },
  { id: "tyler", name: "Tyler", gender: "Male", style: "Aspirational", initials: "TY", gradient: "linear-gradient(135deg, #ca8a04, #fde047)" },
  { id: "ryan", name: "Ryan", gender: "Male", style: "Edgy", initials: "RY", gradient: "linear-gradient(135deg, #be185d, #f472b6)" },
  { id: "cole", name: "Cole", gender: "Male", style: "Minimal", initials: "CO", gradient: "linear-gradient(135deg, #3f3f46, #71717a)" },
  { id: "justin", name: "Justin", gender: "Male", style: "Relatable", initials: "JU", gradient: "linear-gradient(135deg, #0284c7, #38bdf8)" },
  { id: "david", name: "David", gender: "Male", style: "Aspirational", initials: "DA", gradient: "linear-gradient(135deg, #6366f1, #c7d2fe)" }
];

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState("login"); // login, connecting, query, story, character
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [productStory, setProductStory] = useState("");
  const [selectedTone, setSelectedTone] = useState("Authentic");
  const [selectedCharacter, setSelectedCharacter] = useState(AVATARS[0]);
  const [genderFilter, setGenderFilter] = useState("All");

  // Step 2 Connection Loader side effect
  useEffect(() => {
    if (step === "connecting") {
      const timer = setTimeout(() => {
        setStep("query");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
            <button className="btn-back" onClick={() => setStep("login")} type="button">
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
                <div className="avatar-circle" style={{ background: char.gradient }}>
                  {char.initials}
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
