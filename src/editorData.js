export const editorSnapshot = {
  project: {
    title: "AHA BHA PHA 30 Days Miracle Serum Launch",
    product: "AHA BHA PHA 30 Days Miracle Serum",
    category: "Serum",
    channels: "Shopee - TikTok Shop",
    owner: "Michael Tan",
    role: "Seller Pro",
  },
  projects: [
    {
      id: "summer-glow",
      title: "AHA BHA PHA 30 Days Miracle Serum Launch",
      product: "AHA BHA PHA 30 Days Miracle Serum",
      category: "Serum",
      channels: "Shopee - TikTok Shop",
      owner: "Michael Tan",
      role: "Seller Pro",
      thumb: "actualShot1",
      status: "Editing",
      brief: "AHA BHA PHA serum routine cut",
    },
    {
      id: "cloud-bounce",
      title: "Cloud Bounce Moisturizer Campaign",
      product: "Cloud Bounce Gel Moisturizer",
      category: "Moisturizer",
      channels: "Shopee - Instagram Reels",
      owner: "Michael Tan",
      role: "Seller Pro",
      thumb: "shotBubbles",
      status: "Brief ready",
      brief: "Barrier-care gel cream routine",
    },
    {
      id: "fresh-reset",
      title: "Fresh Reset Toner Flash Sale",
      product: "Fresh Reset Pore Toner",
      category: "Toner",
      channels: "TikTok Shop - Reels",
      owner: "Michael Tan",
      role: "Seller Pro",
      thumb: "shotBottle",
      status: "Needs footage",
      brief: "Pore toner wipe-and-glow hook",
    },
  ],
  video: {
    durationSeconds: 30,
    currentSeconds: 12,
    currentTime: "00:12",
    totalTime: "00:30",
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
  defaultPage: "editor",
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
        asset: "creatorMaya",
        look: "Natural glow, warm bathroom light",
        voice: "Calm routine walkthrough",
        generationSettings: [
          { label: "Face lock", value: "91%", detail: "Reference-locked for soft routine close-ups" },
          { label: "Wardrobe", value: "Ivory robe", detail: "Warm bathroom skincare routine styling" },
          { label: "Shot mode", value: "Routine host", detail: "Slow product holds with calm first-person delivery" },
        ],
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
        asset: "creatorDaniel",
        look: "Clean studio, direct-to-camera proof",
        voice: "Fast, practical product verdict",
        generationSettings: [
          { label: "Face lock", value: "88%", detail: "Stable direct-to-camera proof framing" },
          { label: "Wardrobe", value: "Navy overshirt", detail: "Clean commerce-review studio styling" },
          { label: "Shot mode", value: "Product verdict", detail: "Faster cuts, price proof, and practical CTA beats" },
        ],
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
        asset: "creatorJordan",
        look: "Candid shelfie setup, soft daylight",
        voice: "Friendly myth-busting explainer",
        generationSettings: [
          { label: "Face lock", value: "89%", detail: "Consistent candid shelfie angles across variants" },
          { label: "Wardrobe", value: "Sage overshirt", detail: "Soft daylight routine storyteller styling" },
          { label: "Shot mode", value: "Myth-busting proof", detail: "Conversational explainers with inclusive creator voice" },
        ],
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
      { label: "Face lock", value: "86%", detail: "Stable across all six real-footage cuts" },
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
        duration: "0:25 - 0:30",
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
    { id: "shot-1", number: 1, start: "0:00", startSeconds: 0, durationSeconds: 5, title: "Bottle reveal hook", asset: "actualShot1", videoAsset: "actualVideo1", videoStartSeconds: 0, videoEndSeconds: 5 },
    { id: "shot-2", number: 2, start: "0:05", startSeconds: 5, durationSeconds: 5, title: "Bathroom shelf proof", asset: "actualShot2", videoAsset: "actualVideo1", videoStartSeconds: 5, videoEndSeconds: 10 },
    { id: "shot-3", number: 3, start: "0:10", startSeconds: 10, durationSeconds: 5, title: "Handheld serum hold", asset: "actualShot3", videoAsset: "actualVideo1", videoStartSeconds: 10, videoEndSeconds: 15 },
    { id: "shot-4", number: 4, start: "0:15", startSeconds: 15, durationSeconds: 5, title: "Label macro lock", asset: "actualShot4", videoAsset: "actualVideo2", videoStartSeconds: 0, videoEndSeconds: 5 },
    { id: "shot-5", number: 5, start: "0:20", startSeconds: 20, durationSeconds: 5, title: "Ingredient close read", asset: "actualShot5", videoAsset: "actualVideo2", videoStartSeconds: 5, videoEndSeconds: 10 },
    { id: "shot-6", number: 6, start: "0:25", startSeconds: 25, durationSeconds: 5, title: "Bottle CTA close", asset: "actualShot6", videoAsset: "actualVideo2", videoStartSeconds: 10, videoEndSeconds: 15 },
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
    { id: "m-10", atSeconds: 29, kind: "product" },
  ],
  hotspots: [
    { id: "hotspot-1", number: 1, name: "AHA BHA PHA Serum", range: "00:03 - 00:14", x: 39, y: 61 },
    { id: "hotspot-2", number: 2, name: "Dropper Detail", range: "00:10 - 00:15", x: 28, y: 54 },
    { id: "hotspot-3", number: 3, name: "Label Proof", range: "00:18 - 00:28", x: 61, y: 38 },
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
      fitScore: 92,
      platform: "TikTok Shop",
      signal: "+14.2% save-rate lift on proof-first skincare hooks",
      shopperIntent: "Trust the result before seeing a price or bundle.",
      translation: "Gen Z loves simple, real routines that feel authentic and result-driven.",
      example: "Cut from bare skin to one serum drop, then show the real glow in window light.",
      hook: "POV: your morning serum finally shows up on camera.",
      shotPlan: [
        {
          time: "0-3s",
          title: "Bare-skin opener",
          detail: "Creator faces soft window light with visible texture and no smoothing.",
        },
        {
          time: "3-7s",
          title: "Texture proof",
          detail: "Macro dropper shot lands before any claim or bundle message.",
        },
        {
          time: "7-15s",
          title: "Glow check",
          detail: "Before/after cheek angle, bottle in hand, then Shopee CTA.",
        },
      ],
      overlayCopy: "real glow, no filter - one serum drop",
      cta: "Tap the Shopee bundle while the intro price is live.",
      guardrail: "Avoid poreless skin claims or medical brightening promises.",
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
      fitScore: 88,
      platform: "TikTok",
      signal: "+12.7% completion lift on routine edits under 30s",
      shopperIntent: "Find the single step that makes a rushed morning feel polished.",
      translation: "Frame the serum as the one step that makes a rushed morning feel put together.",
      example: "Start with a bathroom shelf grab, then a 3-step routine ending on the Shopee CTA.",
      hook: "GRWM but I only have five minutes and one serum step.",
      shotPlan: [
        {
          time: "0-2s",
          title: "Rushed cue",
          detail: "Phone alarm, bathroom shelf grab, serum label readable.",
        },
        {
          time: "2-8s",
          title: "Three-step rhythm",
          detail: "Cleanser, serum drop, sunscreen in fast tactile cuts.",
        },
        {
          time: "8-15s",
          title: "Doorway finish",
          detail: "Natural-light skin check with product and bundle badge.",
        },
      ],
      overlayCopy: "5-minute face, one glow step",
      cta: "Save the routine and grab the TikTok Shop set.",
      guardrail: "Do not make the routine feel like a clinical tutorial.",
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
      fitScore: 84,
      platform: "Shopee",
      signal: "+9.8% cart lift when discount appears after proof",
      shopperIntent: "Confirm the result is believable, then understand the deal quickly.",
      translation: "Make the value obvious while keeping the skincare result as the main reason to buy.",
      example: "Use a split frame: product texture left, bundle price and review count right.",
      hook: "I waited for the bundle before restocking this serum.",
      shotPlan: [
        {
          time: "0-3s",
          title: "Result first",
          detail: "Show creator result before any price overlay appears.",
        },
        {
          time: "3-9s",
          title: "Bundle reveal",
          detail: "Bottle, dropper, and Shopee bundle tile share the frame.",
        },
        {
          time: "9-15s",
          title: "Review proof",
          detail: "Pair review count with a creator touch-test close-up.",
        },
      ],
      overlayCopy: "bundle drop + real texture proof",
      cta: "Add the set before the promo timer ends.",
      guardrail: "Use one price message only so the face frame stays clean.",
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
    { rank: 1, title: "Glass Skin in 3 Steps", duration: "30.1s", channel: "TikTok", reach: "9.6M", trend: "14.2%", lift: "3.1%", asset: "actualShot5" },
    { rank: 2, title: "POV: Morning Routine", duration: "28.7s", channel: "TikTok", reach: "7.8M", trend: "12.7%", lift: "2.6%", asset: "shotDropper" },
    { rank: 3, title: "This Serum Changed My Skin", duration: "31.0s", channel: "Reels", reach: "6.3M", trend: "11.3%", lift: "2.1%", asset: "shotModel" },
  ],
  filmingReviewFallback: {
    score: 78,
    verdict: "Manual review needed",
    priority: "Review",
    summary: "Generated frame needs a quick production pass before export.",
    nextSetup: "Review safe zones, label visibility, and first-second hook before approving.",
    metrics: [
      { label: "Lighting", score: 78, status: "Check" },
      { label: "Camera angle", score: 76, status: "Check" },
      { label: "Headroom", score: 74, status: "Check" },
      { label: "Product read", score: 80, status: "Good" },
    ],
    priorityFixes: [
      { type: "warn", title: "Review crop safety", detail: "Confirm face, product, and CTA stay clear of platform UI." },
      { type: "good", title: "Keep product visible", detail: "Hold the bottle or texture cue long enough for shoppers to recognize it." },
    ],
    strengths: ["Product moment is present", "Needs human approval"],
  },
  filmingReviews: {
    "shot-1": {
      score: 84,
      verdict: "Clean product opener",
      priority: "Low",
      summary: "The citrus hook is bright and readable, with enough negative space for a short overlay.",
      nextSetup: "Hold the bottle 1s longer and keep citrus props below the label line.",
      metrics: [
        { label: "Lighting", score: 88, status: "Good" },
        { label: "Camera angle", score: 82, status: "Good" },
        { label: "Headroom", score: 80, status: "Good" },
        { label: "Product read", score: 86, status: "Good" },
      ],
      priorityFixes: [
        { type: "good", title: "Lock the label", detail: "Keep the serum name facing camera during the first second." },
        { type: "warn", title: "Reduce prop noise", detail: "Move the citrus slice away from the bottom CTA zone." },
      ],
      strengths: ["Strong opening color", "Readable product silhouette"],
    },
    "shot-2": {
      score: 80,
      verdict: "Texture sells well",
      priority: "Medium",
      summary: "Macro texture is useful, but reflection on the glass can hide the dropper shape.",
      nextSetup: "Flag the key light, rotate dropper 12deg, and keep the pour centered.",
      metrics: [
        { label: "Lighting", score: 76, status: "Tune" },
        { label: "Camera angle", score: 83, status: "Good" },
        { label: "Headroom", score: 82, status: "Good" },
        { label: "Product read", score: 79, status: "Tune" },
      ],
      priorityFixes: [
        { type: "warn", title: "Cut glass glare", detail: "Move the softbox off-axis so the dropper edge stays visible." },
        { type: "good", title: "Keep macro motion", detail: "The texture cue supports purchase trust, so preserve the slow pour." },
      ],
      strengths: ["Strong tactile detail", "Good transition candidate"],
    },
    "shot-3": {
      score: 82,
      verdict: "Strong creator proof",
      priority: "Medium",
      summary: "The frame has flattering light and believable eye line, but the crop is tight for social safe zones.",
      nextSetup: "Lower lens 10-15deg, pull back 6cm, keep serum near left third.",
      metrics: [
        { label: "Lighting", score: 90, status: "Good" },
        { label: "Camera angle", score: 72, status: "Tune" },
        { label: "Headroom", score: 70, status: "Tune" },
        { label: "Product read", score: 78, status: "Good" },
      ],
      priorityFixes: [
        { type: "warn", title: "Lower camera angle", detail: "Drop the lens by 10-15deg so the face feels less top-down." },
        { type: "warn", title: "Open the crop", detail: "Add 8% headroom for TikTok and Reels UI-safe framing." },
      ],
      strengths: ["Soft window light", "Natural eye line", "Creator expression feels credible"],
    },
    "shot-4": {
      score: 77,
      verdict: "Useful ingredient bridge",
      priority: "Medium",
      summary: "The science cue supports the claim, but it needs warmer framing to stay connected to skincare.",
      nextSetup: "Warm white balance, soften bubbles, and cut back to skin within 2s.",
      metrics: [
        { label: "Lighting", score: 75, status: "Tune" },
        { label: "Camera angle", score: 81, status: "Good" },
        { label: "Headroom", score: 84, status: "Good" },
        { label: "Product read", score: 68, status: "Tune" },
      ],
      priorityFixes: [
        { type: "warn", title: "Warm the bridge", detail: "Push the grade slightly warmer so the ingredient cue feels cosmetic, not clinical." },
        { type: "warn", title: "Return to product", detail: "Cut back to bottle or texture before the viewer forgets what is being sold." },
      ],
      strengths: ["Clear benefit beat", "Good visual contrast"],
    },
    "shot-5": {
      score: 86,
      verdict: "Social proof ready",
      priority: "Low",
      summary: "The creator expression and lower-third space are strong for proof copy and a commerce CTA.",
      nextSetup: "Keep text in the lower third and hold the bottle edge inside frame.",
      metrics: [
        { label: "Lighting", score: 86, status: "Good" },
        { label: "Camera angle", score: 84, status: "Good" },
        { label: "Headroom", score: 88, status: "Good" },
        { label: "Product read", score: 82, status: "Good" },
      ],
      priorityFixes: [
        { type: "good", title: "Safe lower third", detail: "Keep proof copy under the cheek line so platform UI does not cover the face." },
        { type: "warn", title: "Clarify label edge", detail: "Nudge the product toward camera before the CTA." },
      ],
      strengths: ["Authentic expression", "Good overlay space", "Strong mobile crop"],
    },
    "shot-6": {
      score: 83,
      verdict: "CTA frame close",
      priority: "Low",
      summary: "The final shelf shot is purchase-ready, with one timing tweak needed for the CTA.",
      nextSetup: "Center bottle, hold CTA 1s longer, and keep bundle text to one line.",
      metrics: [
        { label: "Lighting", score: 84, status: "Good" },
        { label: "Camera angle", score: 82, status: "Good" },
        { label: "Headroom", score: 86, status: "Good" },
        { label: "Product read", score: 80, status: "Good" },
      ],
      priorityFixes: [
        { type: "good", title: "Hold the CTA", detail: "Extend the final frame so shoppers can read the bundle prompt." },
        { type: "warn", title: "Center the bottle", detail: "Move the bottle 4% right to balance the shelf composition." },
      ],
      strengths: ["Clear product ending", "Clean background"],
    },
  },
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
  generationDurations: [
    { seconds: 15, label: "15s hook", note: "fast test for one opening idea" },
    { seconds: 30, label: "30s clip", note: "complete social sample with CTA" },
    { seconds: 45, label: "45s story", note: "longer routine with proof beats" },
  ],
  generationSampleCounts: [1, 2, 3, 4],
  generationDefaults: {
    durationSeconds: 30,
    sampleCount: 2,
  },
  generationPromptChips: [
    "window-light creator demo",
    "macro serum texture pour",
    "safe lower-third Shopee CTA",
    "handheld push-in camera move",
  ],
  generationPresets: [
    {
      id: "ugc-proof",
      label: "UGC Proof",
      prompt: "creator applies serum in window light",
      cost: 120,
      angle: "Trust-first creator sample with real skin texture.",
      outcome: "Best for testing proof-led openings and creator believability.",
      guide: [
        { label: "Hook", value: "POV morning glow check in natural window light." },
        { label: "Camera", value: "Handheld push-in, product label readable by second 2." },
        { label: "Overlay", value: "real glow, no filter - one serum drop" },
        { label: "CTA", value: "Tap the Shopee bundle while intro price is live." },
      ],
    },
    {
      id: "macro-texture",
      label: "Macro Texture",
      prompt: "gold serum texture macro pour",
      cost: 140,
      angle: "Texture-led product proof with satisfying close motion.",
      outcome: "Best for visual hooks, detail loops, and tactile product edits.",
      guide: [
        { label: "Hook", value: "Serum drop lands before the first text overlay." },
        { label: "Camera", value: "Slow macro pour, shallow depth, warm highlight." },
        { label: "Overlay", value: "lightweight glow serum, no heavy finish" },
        { label: "CTA", value: "Save the routine and grab the TikTok Shop set." },
      ],
    },
    {
      id: "shop-cta",
      label: "Shop CTA",
      prompt: "product bottle with bundle callout",
      cost: 100,
      angle: "Commerce-ready close with product, offer, and proof copy.",
      outcome: "Best for testing purchase frames, bundle copy, and final CTAs.",
      guide: [
        { label: "Hook", value: "Result first, offer second, product never leaves frame." },
        { label: "Camera", value: "Locked shelf close-up with bottle centered." },
        { label: "Overlay", value: "bundle drop + real texture proof" },
        { label: "CTA", value: "Add the set before the promo timer ends." },
      ],
    },
  ],
  aiSafeChecks: {
    status: "AI Safe",
    items: [
      "No medical cure claims",
      "No impossible skin results",
      "Commerce CTA is compliant",
      "Human review lane for every generated sample",
    ],
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

export function getGenerationEstimate({
  durationSeconds,
  preset,
  sampleCount,
}) {
  const safeSampleCount = Math.max(1, Math.floor(Number(sampleCount) || 1));
  const safeDurationSeconds = Math.max(4, Math.floor(Number(durationSeconds) || 4));
  const durationMultiplier = Math.max(1, Math.ceil(safeDurationSeconds / 15));
  const creditsPerSample = (preset?.cost || editorSnapshot.video.generationCost) * durationMultiplier;

  return {
    sampleCount: safeSampleCount,
    durationSeconds: safeDurationSeconds,
    durationMultiplier,
    creditsPerSample,
    totalCredits: creditsPerSample * safeSampleCount,
    totalDurationSeconds: safeDurationSeconds * safeSampleCount,
    label: `${safeSampleCount} ${safeSampleCount === 1 ? "sample" : "samples"} x ${safeDurationSeconds}s`,
  };
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

export function createGeneratedShots(
  shots,
  prompt,
  {
    durationSeconds = editorSnapshot.generationDefaults.durationSeconds,
    preset = editorSnapshot.generationPresets[0],
    sampleCount = editorSnapshot.generationDefaults.sampleCount,
  } = {},
) {
  const estimate = getGenerationEstimate({ durationSeconds, preset, sampleCount });
  const baseStartSeconds = getVideoDuration(shots);
  const cleanPrompt = prompt.trim() || preset.prompt;
  const assetCycle = ["shotSocial", "shotModel", "shotDropper", "shotBottle"];

  return Array.from({ length: estimate.sampleCount }, (_, index) => {
    const number = shots.length + index + 1;
    const startSeconds = baseStartSeconds + (index * estimate.durationSeconds);

    return {
      id: `shot-${number}`,
      number,
      start: formatShotStart(startSeconds),
      startSeconds,
      durationSeconds: estimate.durationSeconds,
      title: `AI ${preset.label} sample ${index + 1}`,
      asset: assetCycle[index % assetCycle.length],
      aiGenerated: true,
      prompt: cleanPrompt,
      presetId: preset.id,
      sampleIndex: index + 1,
      sampleCount: estimate.sampleCount,
      variantLabel: `Sample ${index + 1}/${estimate.sampleCount}`,
    };
  });
}

export function createAuditionShot(
  shots,
  person,
  {
    durationSeconds = 12,
    scripts = editorSnapshot.aiPeople.auditionScripts,
  } = {},
) {
  const number = shots.length + 1;
  const startSeconds = getVideoDuration(shots);
  const safeDurationSeconds = Math.max(4, Math.floor(Number(durationSeconds) || 12));
  const scriptLines = scripts.map((script) => `${script.title}: ${script.line}`).join(" ");

  return {
    id: `shot-${number}`,
    number,
    start: formatShotStart(startSeconds),
    startSeconds,
    durationSeconds: safeDurationSeconds,
    title: `${person.name} audition`,
    asset: person.asset,
    aiGenerated: true,
    audition: true,
    personId: person.id,
    personName: person.name,
    prompt: `${person.voice}. ${scriptLines}`,
    variantLabel: `${person.gender} creator audition`,
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
