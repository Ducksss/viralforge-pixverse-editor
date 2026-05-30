import React, { useMemo, useState } from "react";
import { ChevronLeft, Sparkles, Check, Users } from "lucide-react";
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

export const CAST_AVATARS = [
  // Female
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
  // Male
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

const MAX_CAST = 6;

export default function CastPage({ product, story, tone, onBack, onGenerate, initialSelection = [] }) {
  const [selectedIds, setSelectedIds] = useState(() => initialSelection.map((c) => c.id));
  const [genderFilter, setGenderFilter] = useState("All");

  const filteredAvatars = useMemo(() => {
    if (genderFilter === "All") return CAST_AVATARS;
    return CAST_AVATARS.filter((a) => a.gender === genderFilter);
  }, [genderFilter]);

  const selectedAvatars = useMemo(
    () => CAST_AVATARS.filter((a) => selectedIds.includes(a.id)),
    [selectedIds],
  );

  const toggleAvatar = (avatar) => {
    setSelectedIds((current) => {
      if (current.includes(avatar.id)) {
        return current.filter((id) => id !== avatar.id);
      }
      if (current.length >= MAX_CAST) {
        return current;
      }
      return [...current, avatar.id];
    });
  };

  const handleGenerate = () => {
    if (!selectedAvatars.length) return;
    onGenerate?.(selectedAvatars);
  };

  const productImage = product?.asset ? assets[product.asset] : null;
  const variantCount = selectedAvatars.length;

  return (
    <div className="cast-page">
      <header className="cast-header">
        <div className="cast-header-brand">
          <div className="wizard-logo-mark" />
          <div className="wizard-logo-text">
            <h1>ViralForge</h1>
            <p>Commerce</p>
          </div>
        </div>
        <div className="cast-breadcrumb" aria-label="Workflow progress">
          <span className="cast-crumb done">Brand</span>
          <span className="cast-crumb-sep">›</span>
          <span className="cast-crumb done">Product</span>
          <span className="cast-crumb-sep">›</span>
          <span className="cast-crumb active">Casting</span>
          <span className="cast-crumb-sep">›</span>
          <span className="cast-crumb">Generate</span>
        </div>
        <button className="btn-back" onClick={onBack} type="button">
          <ChevronLeft size={16} /> Edit story
        </button>
      </header>

      <main className="cast-body">
        <section className="cast-product-summary">
          <div className="cast-product-image">
            {productImage ? (
              <img src={productImage} alt={product?.name || "Product"} />
            ) : (
              <div className="product-image-placeholder">{product?.name?.charAt(0) || "?"}</div>
            )}
          </div>
          <div className="cast-product-meta">
            <span className="product-category">{product?.category || "Product"}</span>
            <h2>{product?.name || "Unnamed product"}</h2>
            <p className="cast-product-price">{product?.price || ""}</p>
            <div className="cast-product-tags">
              <span className="cast-pill cast-pill-tone">Tone · {tone || "Authentic"}</span>
              {story ? (
                <span className="cast-pill cast-pill-story" title={story}>
                  {story.length > 80 ? `${story.slice(0, 80)}…` : story}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="cast-roster">
          <div className="cast-roster-header">
            <div>
              <h2 className="cast-roster-title">
                <Users size={18} /> Cast your AI people
              </h2>
              <p className="cast-roster-subtitle">
                Pick up to {MAX_CAST} influencers — we'll generate a UGC variant for each.
              </p>
            </div>
            <div className="character-gender-tabs">
              {["All", "Female", "Male"].map((g) => (
                <button
                  key={g}
                  className={`gender-tab ${genderFilter === g ? "active" : ""}`}
                  onClick={() => setGenderFilter(g)}
                  type="button"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="cast-grid">
            {filteredAvatars.map((char) => {
              const selectedIndex = selectedIds.indexOf(char.id);
              const isSelected = selectedIndex !== -1;
              const isMaxed = !isSelected && selectedIds.length >= MAX_CAST;
              return (
                <button
                  key={char.id}
                  className={`cast-card ${isSelected ? "selected" : ""} ${isMaxed ? "disabled" : ""}`}
                  disabled={isMaxed}
                  onClick={() => toggleAvatar(char)}
                  type="button"
                >
                  <div className="cast-card-image">
                    <img src={char.image} alt={char.name} />
                    {isSelected ? (
                      <span className="cast-card-badge">
                        <Check size={12} /> {selectedIndex + 1}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="character-name">{char.name}</h3>
                  <span className="character-tag">{char.style}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="cast-footer">
        <div className="cast-footer-summary">
          {selectedAvatars.length === 0 ? (
            <span className="cast-footer-empty">Select at least one influencer to continue.</span>
          ) : (
            <>
              <div className="cast-footer-stack">
                {selectedAvatars.slice(0, 6).map((c) => (
                  <img key={c.id} src={c.image} alt={c.name} className="cast-footer-thumb" />
                ))}
              </div>
              <div className="cast-footer-math">
                <strong>{variantCount}</strong> influencer{variantCount === 1 ? "" : "s"} ×{" "}
                <strong>1</strong> product ={" "}
                <strong>
                  {variantCount} UGC variant{variantCount === 1 ? "" : "s"}
                </strong>
              </div>
            </>
          )}
        </div>
        <button
          className="btn-primary btn-teal cast-generate-btn"
          disabled={!selectedAvatars.length}
          onClick={handleGenerate}
          type="button"
        >
          Generate {variantCount > 0 ? `${variantCount} ` : ""}video{variantCount === 1 ? "" : "s"}{" "}
          <Sparkles size={16} style={{ marginLeft: "6px" }} />
        </button>
      </footer>
    </div>
  );
}
