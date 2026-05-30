import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Check, Info } from "lucide-react";
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

const TONES = ["Authentic", "Funny", "Urgent", "Soft Sell"];

const HOOKS = [
  "POV: you finally found the serum that works",
  "Skincare gatekeepers are going to be so mad at this",
  "Adding this to my morning routine was the best decision ever"
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
  const [step, setStep] = useState("query"); // Start on query; login, connecting, query, story, character
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
            <div style={{ width: "80px" }} /> {/* Hidden Back spacer to maintain layout balance */}
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
              onClick={() =>
                onComplete({
                  product: selectedProduct,
                  story: productStory,
                  tone: selectedTone,
                })
              }
              type="button"
            >
              Cast influencers <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
