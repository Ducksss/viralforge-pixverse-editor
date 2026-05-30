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
    model: "PixVerse: V6",
    quality: "720p",
  },
  defaultPage: "people",
  selectedShotId: "shot-3",
  navItems: [
    { id: "trend", label: "Trend Radar", caption: "Live trends & alerts", badge: "NEW" },
    { id: "research", label: "Product Research", caption: "Validate & win" },
    { id: "storyboard", label: "Storyboard", caption: "Plan your shots" },
    { id: "scheduler", label: "Shoot Scheduler", caption: "Calendar & call sheets" },
    { id: "props", label: "Props", caption: "Find & source props" },
    { id: "people", label: "AI People", caption: "Models & consent", badge: "UGC" },
    { id: "editor", label: "Editor", caption: "Edit & generate" },
    { id: "listings", label: "Listings", caption: "Auto content & SEO" },
    { id: "ugc", label: "UGC Inbox", caption: "Reviews & clips", badge: "12" },
    { id: "analytics", label: "Analytics", caption: "Track & optimize" },
  ],
  aiPeople: {
    defaultPersonId: "maya-chen",
    defaultGender: "Woman",
    uploadRequirements: [
      "Clear face reference",
      "Signed model release",
      "Neutral expression pass",
      "No minors or private identity",
    ],
    genderOptions: [
      {
        id: "woman",
        label: "Woman",
        tone: "Soft authority, skincare routine host",
      },
      {
        id: "man",
        label: "Man",
        tone: "Direct demo, practical buyer confidence",
      },
      {
        id: "non-binary",
        label: "Non-binary",
        tone: "Inclusive creator voice, candid product proof",
      },
    ],
    creatorProfiles: [
      {
        id: "maya-chen",
        name: "Maya Chen",
        gender: "Woman",
        role: "Skincare creator",
        locale: "Singapore",
        language: "English + Mandarin",
        fitScore: 94,
        consent: "Model release signed",
        asset: "shotModel",
        look: "Natural glow, warm bathroom light",
        voice: "Calm routine walkthrough",
      },
      {
        id: "daniel-ong",
        name: "Daniel Ong",
        gender: "Man",
        role: "Commerce reviewer",
        locale: "Malaysia",
        language: "English + Malay",
        fitScore: 91,
        consent: "Licensed marketplace talent",
        asset: "shotSocial",
        look: "Clean studio, direct-to-camera proof",
        voice: "Fast, practical product verdict",
      },
      {
        id: "jordan-lee",
        name: "Jordan Lee",
        gender: "Non-binary",
        role: "Routine storyteller",
        locale: "Singapore",
        language: "English",
        fitScore: 89,
        consent: "Creator likeness approved",
        asset: "shotModel",
        look: "Candid shelfie setup, soft daylight",
        voice: "Friendly myth-busting explainer",
      },
    ],
    readinessChecklist: [
      { id: "reference", label: "People reference uploaded", done: false },
      { id: "release", label: "Usage release attached", done: true },
      { id: "gender", label: "Gender intent selected", done: true },
      { id: "voice", label: "Voice and language locked", done: true },
      { id: "disclosure", label: "AI creator disclosure enabled", done: true },
    ],
    generationSettings: [
      { label: "Face lock", value: "86%", detail: "Stable across all six shots" },
      { label: "Wardrobe", value: "Cream tank + robe", detail: "Matches clean skincare routine" },
      { label: "Shot mode", value: "UGC testimonial", detail: "Phone-native framing with product holds" },
    ],
    auditionScripts: [
      {
        id: "hook",
        title: "First-second hook",
        duration: "0:00 - 0:05",
        line: "I tested this vitamin C serum before my morning commute.",
      },
      {
        id: "texture",
        title: "Texture proof",
        duration: "0:05 - 0:14",
        line: "It sinks in fast, so makeup does not slide around after.",
      },
      {
        id: "conversion",
        title: "Commerce close",
        duration: "0:29 - 0:36",
        line: "Save the listing if dullness is your main skin concern.",
      },
    ],
    guardrails: [
      "Use only uploaded or licensed likeness references.",
      "Keep AI creator disclosure on every exported UGC cut.",
      "Block age-down prompts and private-person impersonation.",
      "Require brand-safe wardrobe before PixVerse generation.",
    ],
  },
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
    { id: "hotspot-1", number: 1, name: "Vitamin C Serum", range: "00:03 - 00:14" },
    { id: "hotspot-2", number: 2, name: "Dropper Detail", range: "00:10 - 00:17" },
    { id: "hotspot-3", number: 3, name: "Glow Result", range: "00:18 - 00:28" },
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
    { id: "amber-bottle", label: "Amber glass serum bottle", source: "Found on Shopee", done: true },
    { id: "citrus-slices", label: "Citrus slices (fresh)", source: "Local market / Cold storage", done: true },
    { id: "white-tray", label: "White marble tray", source: "IKEA / Shopee", done: false },
    { id: "greenery", label: "Greenery / Eucalyptus", source: "Flower market / Shopee", done: false },
    { id: "softbox", label: "Softbox lighting", source: "Aputure / Godox", done: true },
    { id: "tripod", label: "Tripod / Phone mount", source: "Ulanzi / Shopee", done: false },
  ],
  listingAssets: {
    description: "Brighten and even your skin with our Vitamin C Serum. Lightweight, fast-absorbing formula with powerful antioxidants for daily glow.",
    seo: ["vitamin c serum", "brightening serum", "glow skin", "anti dullness", "skincare", "for all skin types"],
  },
};

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

export function getPeopleReadiness(aiPeople, options = {}) {
  const completed = aiPeople.readinessChecklist.filter((item) => {
    if (item.id === "reference") {
      return Boolean(options.referenceUploaded) || item.done;
    }

    return item.done;
  }).length;
  const total = aiPeople.readinessChecklist.length;

  return {
    completed,
    total,
    label: `${completed}/${total}`,
  };
}
