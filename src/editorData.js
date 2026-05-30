export const editorSnapshot = {
  project: {
    title: "Summer Glow Skincare - PixVerse Campaign",
    product: "Summer Glow Vitamin C Serum",
    channels: "Shopee - TikTok Shop",
    owner: "Michael Tan",
    role: "Seller Pro",
  },
  video: {
    durationSeconds: 36,
    currentSeconds: 12,
    currentTime: "00:12",
    totalTime: "00:36",
    aspectRatio: "16:9",
    aspectRatios: [
      { id: "16:9", label: "16:9 Landscape" },
      { id: "9:16", label: "9:16 Vertical" },
      { id: "1:1", label: "1:1 Square" },
    ],
    model: "PixVerse: V6",
    models: ["PixVerse: V6", "PixVerse: V5 Turbo", "PixVerse: Character"],
    quality: "720p",
    qualities: ["720p", "1080p", "4K"],
    balance: 2450,
    generationCost: 120,
  },
  exportOptions: ["Publish package", "Download MP4", "Listing image pack", "Creator brief PDF"],
  shareOptions: ["Copy review link", "Invite collaborator", "Send to Shopee team"],
  selectedShotId: "shot-3",
  navItems: [
    { id: "trend", label: "Trend Radar", caption: "Live trends & alerts", badge: "NEW" },
    { id: "research", label: "Product Research", caption: "Validate & win" },
    { id: "storyboard", label: "Storyboard", caption: "Plan your shots" },
    { id: "scheduler", label: "Shoot Scheduler", caption: "Calendar & call sheets" },
    { id: "props", label: "Props", caption: "Find & source props" },
    { id: "editor", label: "Editor", caption: "Edit & generate", active: true },
    { id: "listings", label: "Listings", caption: "Auto content & SEO" },
    { id: "ugc", label: "UGC Inbox", caption: "Reviews & clips", badge: "12" },
    { id: "analytics", label: "Analytics", caption: "Track & optimize" },
  ],
  shots: [
    { id: "shot-1", number: 1, start: "0:00", startSeconds: 0, durationSeconds: 5, title: "Citrus product hook", asset: "shotProduct" },
    { id: "shot-2", number: 2, start: "0:05", startSeconds: 5, durationSeconds: 6, title: "Dropper texture", asset: "shotDropper" },
    { id: "shot-3", number: 3, start: "0:11", startSeconds: 11, durationSeconds: 6, title: "Creator proof frame", asset: "shotModel" },
    { id: "shot-4", number: 4, start: "0:17", startSeconds: 17, durationSeconds: 6, title: "Skin barrier science", asset: "shotBubbles" },
    { id: "shot-5", number: 5, start: "0:23", startSeconds: 23, durationSeconds: 6, title: "Before-after glow", asset: "shotSocial" },
    { id: "shot-6", number: 6, start: "0:29", startSeconds: 29, durationSeconds: 7, title: "Bottle shelf close", asset: "shotBottle" },
  ],
  timelineEvents: [
    { id: "m-1", atSeconds: 0, kind: "hook" },
    { id: "m-2", atSeconds: 2, kind: "product" },
    { id: "m-3", atSeconds: 6, kind: "benefit" },
    { id: "m-4", atSeconds: 11, kind: "creator" },
    { id: "m-5", atSeconds: 16, kind: "warning" },
    { id: "m-6", atSeconds: 17, kind: "warning" },
    { id: "m-7", atSeconds: 19, kind: "texture" },
    { id: "m-8", atSeconds: 24, kind: "product" },
    { id: "m-9", atSeconds: 26, kind: "creator" },
    { id: "m-10", atSeconds: 31, kind: "product" },
  ],
  hotspots: [
    { id: "hotspot-1", number: 1, name: "Vitamin C Serum", range: "00:03 - 00:14", x: 39, y: 61 },
    { id: "hotspot-2", number: 2, name: "Dropper Detail", range: "00:10 - 00:17", x: 28, y: 54 },
    { id: "hotspot-3", number: 3, name: "Glow Result", range: "00:18 - 00:28", x: 61, y: 38 },
  ],
  feedbackByShot: {
    "shot-1": [
      { score: 84, status: "Good", note: "Bright product cue opens the story clearly." },
      { score: 70, status: "Consider", note: "Add a faster first-second hook." },
      { score: 67, status: "Consider", note: "Keep the citrus crop less busy." },
    ],
    "shot-2": [
      { score: 86, status: "Good", note: "Texture read is strong for product trust." },
      { score: 74, status: "Consider", note: "Reduce reflection on the dropper glass." },
      { score: 69, status: "Consider", note: "Use a tighter macro transition." },
    ],
    "shot-3": [
      { score: 89, status: "Good", note: "Lighting is soft and flattering." },
      { score: 72, status: "Consider", note: "Slightly tight on the forehead." },
      { score: 69, status: "Consider", note: "Try a touch more headroom." },
    ],
    "shot-4": [
      { score: 81, status: "Good", note: "Ingredient visual supports the claim." },
      { score: 73, status: "Consider", note: "Make bubbles feel less clinical." },
      { score: 68, status: "Consider", note: "Warm the transition into skin result." },
    ],
    "shot-5": [
      { score: 88, status: "Good", note: "Creator expression feels authentic." },
      { score: 71, status: "Consider", note: "Keep text lower for TikTok UI." },
      { score: 66, status: "Consider", note: "Add product label clarity." },
    ],
    "shot-6": [
      { score: 85, status: "Good", note: "Final product frame is purchase-ready." },
      { score: 76, status: "Consider", note: "Hold the CTA one second longer." },
      { score: 70, status: "Consider", note: "Keep the bottle closer to center." },
    ],
  },
  trendChips: ["clean girl", "glass skin", "self care", "morning routine"],
  trendCards: [
    {
      id: "glass-skin",
      title: "Glass skin proof",
      chips: ["clean girl", "glass skin", "self care", "morning routine"],
      translation: "Gen Z loves simple, real routines that feel authentic and result-driven.",
      example: "Cut from bare skin to one serum drop, then show the real glow in window light.",
      checklist: [
        "Show real skin, not perfect skin",
        "Fast cuts + satisfying textures",
        "Before/after moments build trust",
        "Text on screen > long talking",
      ],
    },
    {
      id: "morning-routine",
      title: "Morning routine angle",
      chips: ["POV", "GRWM", "quick routine", "soft light"],
      translation: "Frame the serum as the one step that makes a rushed morning feel put together.",
      example: "Start with a bathroom shelf grab, then a 3-step routine ending on the Shopee CTA.",
      checklist: [
        "Open with a relatable morning cue",
        "Keep each routine step under two seconds",
        "Show texture before claims",
        "End on a product-in-hand CTA",
      ],
    },
    {
      id: "deal-proof",
      title: "Deal proof angle",
      chips: ["TikTok Shop", "bundle", "price drop", "review proof"],
      translation: "Make the value obvious while keeping the skincare result as the main reason to buy.",
      example: "Use a split frame: product texture left, bundle price and review count right.",
      checklist: [
        "Show the exact bundle visually",
        "Use one price message only",
        "Pair discount with proof",
        "Avoid cluttering the face frame",
      ],
    },
  ],
  trendTranslation: [
    "Show real skin, not perfect skin",
    "Fast cuts + satisfying textures",
    "Before/after moments build trust",
    "Text on screen > long talking",
  ],
  topVideos: [
    { rank: 1, title: "Glass Skin in 3 Steps", duration: "36.2s", channel: "TikTok", reach: "9.6M", trend: "14.2%", lift: "3.1%", asset: "shotSocial" },
    { rank: 2, title: "POV: Morning Routine", duration: "28.7s", channel: "TikTok", reach: "7.8M", trend: "12.7%", lift: "2.6%", asset: "shotDropper" },
    { rank: 3, title: "This Serum Changed My Skin", duration: "31.0s", channel: "Reels", reach: "6.3M", trend: "11.3%", lift: "2.1%", asset: "shotModel" },
  ],
  filmingTips: [
    { type: "good", title: "Good lighting direction", detail: "" },
    { type: "warn", title: "Camera slightly high", detail: "Lower by ~10-15deg" },
    { type: "warn", title: "Too tight", detail: "Add a bit more headroom" },
    { type: "good", title: "Great eye line", detail: "" },
  ],
  propsChecklist: [
    { id: "amber-bottle", label: "Amber glass serum bottle", source: "Found on Shopee", vendor: "Shopee", status: "Found", done: true },
    { id: "citrus-slices", label: "Citrus slices (fresh)", source: "Local market / Cold storage", vendor: "Cold Storage", status: "Found", done: true },
    { id: "white-tray", label: "White marble tray", source: "IKEA / Shopee", vendor: "IKEA", status: "To source", done: false },
    { id: "greenery", label: "Greenery / Eucalyptus", source: "Flower market / Shopee", vendor: "Flower market", status: "To source", done: false },
    { id: "softbox", label: "Softbox lighting", source: "Aputure / Godox", vendor: "Godox", status: "Found", done: true },
    { id: "tripod", label: "Tripod / Phone mount", source: "Ulanzi / Shopee", vendor: "Ulanzi", status: "To source", done: false },
  ],
  listingAssets: {
    images: ["shotProduct", "shotDropper", "shotBottle", "shotSocial", "shotModel", "shotBubbles"],
    description: "Brighten and even your skin with our Vitamin C Serum. Lightweight, fast-absorbing formula with powerful antioxidants for daily glow.",
    seo: ["vitamin c serum", "brightening serum", "glow skin", "anti dullness", "skincare", "for all skin types"],
    captions: [
      "Glow that sells in one serum drop.",
      "Fast morning routine, real glass-skin finish.",
      "Vitamin C texture shot built for TikTok Shop.",
    ],
  },
  generationPresets: [
    { id: "ugc-proof", label: "UGC Proof", prompt: "creator applies serum in window light", cost: 120 },
    { id: "macro-texture", label: "Macro Texture", prompt: "gold serum texture macro pour", cost: 140 },
    { id: "shop-cta", label: "Shop CTA", prompt: "product bottle with bundle callout", cost: 100 },
  ],
  aiSafeChecks: {
    status: "AI Safe",
    items: ["No medical cure claims", "No impossible skin results", "Commerce CTA is compliant"],
  },
};

function formatShotStart(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function getChecklistProgress(items) {
  const completed = items.filter((item) => item.done).length;
  const total = items.length;

  return {
    completed,
    total,
    label: `${completed}/${total}`,
  };
}

export function buildTimelineMarkers(events, durationSeconds = editorSnapshot.video.durationSeconds) {
  return events.map((event) => ({
    id: event.id,
    kind: event.kind,
    left: `${((event.atSeconds / durationSeconds) * 100).toFixed(1)}%`,
  }));
}

export function formatSeconds(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function getShotAtTime(shots, seconds) {
  if (shots.length === 0) {
    return null;
  }

  const safeSeconds = Math.max(0, Math.floor(seconds));
  return (
    shots.find((shot) => (
      safeSeconds >= shot.startSeconds &&
      safeSeconds < shot.startSeconds + shot.durationSeconds
    )) || shots[shots.length - 1]
  );
}

export function getVideoDuration(shots) {
  return shots.reduce((sum, shot) => sum + shot.durationSeconds, 0);
}

export function createGeneratedShot(shots, prompt) {
  const number = shots.length + 1;
  const startSeconds = getVideoDuration(shots);

  return {
    id: `shot-${number}`,
    number,
    start: formatShotStart(startSeconds),
    startSeconds,
    durationSeconds: 4,
    title: "AI generated proof frame",
    asset: "shotSocial",
    aiGenerated: true,
    prompt: prompt.trim(),
  };
}

export function createTimelineEvent(events, currentSeconds, kind = "cta") {
  const idNumber = events.length + 1;
  const normalizedKind = kind.trim().toLowerCase() || "cta";
  const label = normalizedKind === "cta"
    ? "CTA"
    : normalizedKind.charAt(0).toUpperCase() + normalizedKind.slice(1);

  return {
    id: `m-${idNumber}`,
    atSeconds: Math.max(0, Math.floor(currentSeconds)),
    kind: normalizedKind,
    label,
  };
}

export function createHotspot(hotspots, currentSeconds) {
  const number = hotspots.length + 1;
  const startSeconds = Math.max(0, Math.floor(currentSeconds));

  return {
    id: `hotspot-${number}`,
    number,
    name: "Shop CTA",
    range: `${formatSeconds(startSeconds)} - ${formatSeconds(startSeconds + 4)}`,
    x: 67,
    y: 58,
  };
}
