// Apple-style pitch deck for ViralForge PixVerse Editor.
// White/black "sandwich", big type, generous whitespace, one warm glow accent.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const GLOBAL = "/opt/homebrew/lib/node_modules";
const pptxgen = require(`${GLOBAL}/pptxgenjs`);
const React = require(`${GLOBAL}/react`);
const ReactDOMServer = require(`${GLOBAL}/react-dom/server`);
const sharp = require(`${GLOBAL}/sharp`);
const Fa = require(`${GLOBAL}/react-icons/fa`);

// ---- palette ----
const INK = "1D1D1F";      // near-black (Apple)
const GRAY = "6E6E73";     // secondary text
const FAINT = "86868B";    // captions
const FILL = "F5F5F7";     // light card fill
const WHITE = "FFFFFF";
const ACCENT = "FF6A3D";   // warm "Summer Glow" vitamin-C
const HAIR = "D2D2D7";     // hairline border

const FONT_H = "Helvetica Neue"; // SF-like
const FONT_B = "Helvetica Neue";

// ---- icon rasterizer ----
async function icon(IconComponent, color = "#" + INK, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}
const shadow = () => ({ type: "outer", color: "000000", blur: 9, offset: 3, angle: 135, opacity: 0.10 });

const pres = new pptxgen();
pres.defineLayout({ name: "W", width: 13.333, height: 7.5 });
pres.layout = "W";
pres.author = "ViralForge Commerce";
pres.title = "ViralForge PixVerse Editor";
const W = 13.333, H = 7.5;

// kicker label helper
function kicker(slide, text, x, y, color = ACCENT) {
  slide.addText(text.toUpperCase(), {
    x, y, w: 6, h: 0.3, margin: 0, fontFace: FONT_B, fontSize: 12,
    bold: true, color, charSpacing: 3, align: "left",
  });
}

async function build() {
  const icoProblem = await icon(Fa.FaRegQuestionCircle, "#" + ACCENT);
  const icoVideo = await icon(Fa.FaPlayCircle, "#" + INK);
  const icoLens = await icon(Fa.FaSearch, "#" + INK);
  const icoTag = await icon(Fa.FaShoppingBag, "#" + INK);
  const icoBolt = await icon(Fa.FaBolt, "#" + INK);
  const icoCheck = await icon(Fa.FaCheckCircle, "#" + ACCENT);

  // ===================================================================
  // 1 — TITLE (dark)
  // ===================================================================
  let s = pres.addSlide();
  s.background = { color: INK };
  s.addText("VIRALFORGE COMMERCE", {
    x: 1, y: 1.5, w: 10, h: 0.4, margin: 0, fontFace: FONT_B, fontSize: 13,
    bold: true, color: ACCENT, charSpacing: 4,
  });
  s.addText("PixVerse Editor", {
    x: 0.95, y: 2.1, w: 11.4, h: 1.5, margin: 0, fontFace: FONT_H, fontSize: 76,
    bold: true, color: WHITE,
  });
  s.addText("Turn one AI-generated product video into a complete, ready-to-ship campaign.", {
    x: 1, y: 3.7, w: 9.6, h: 0.9, margin: 0, fontFace: FONT_B, fontSize: 22,
    color: "C7C7CC", lineSpacingMultiple: 1.15,
  });
  s.addText([
    { text: "TRAE × PixVerse  ·  Video Generation Track", options: { color: "98989D" } },
  ], { x: 1, y: 5.9, w: 9, h: 0.4, margin: 0, fontFace: FONT_B, fontSize: 14 });
  // glow accent dot
  s.addShape(pres.shapes.OVAL, { x: 11.7, y: 5.8, w: 0.5, h: 0.5, fill: { color: ACCENT } });

  // ===================================================================
  // 2 — PROBLEM
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "The problem", 1, 0.9);
  s.addText("A good video isn't a campaign.", {
    x: 0.95, y: 1.3, w: 11.4, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 46, bold: true, color: INK,
  });
  s.addText(
    "Small commerce sellers can generate a slick product clip in minutes — then stall. The video looks great, but it still isn't ready to sell.",
    { x: 1, y: 2.5, w: 7.2, h: 1.1, margin: 0, fontFace: FONT_B, fontSize: 18, color: GRAY, lineSpacingMultiple: 1.25 }
  );
  const pains = [
    ["Does it fit the trend?", "No read on whether the creative lands on TikTok or Reels today."],
    ["Which moments sell?", "No idea which shots actually drive purchase intent."],
    ["Now what?", "No path from a finished clip to channel-ready listing assets."],
  ];
  let py = 3.95;
  for (const [h, d] of pains) {
    s.addShape(pres.shapes.RECTANGLE, { x: 1, y: py, w: 11.3, h: 0.92, fill: { color: FILL }, line: { type: "none" } });
    s.addShape(pres.shapes.RECTANGLE, { x: 1, y: py, w: 0.07, h: 0.92, fill: { color: ACCENT } });
    s.addText(h, { x: 1.35, y: py + 0.13, w: 4, h: 0.4, margin: 0, fontFace: FONT_H, fontSize: 18, bold: true, color: INK });
    s.addText(d, { x: 5.4, y: py + 0.13, w: 6.7, h: 0.66, margin: 0, fontFace: FONT_B, fontSize: 15, color: GRAY, valign: "middle" });
    py += 1.08;
  }

  // ===================================================================
  // 3 — SOLUTION (dark statement)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: INK };
  kicker(s, "The solution", 1, 1.2);
  s.addText([
    { text: "Not a video generator.\n", options: { color: "86868B" } },
    { text: "A post-generation campaign editor.", options: { color: WHITE } },
  ], { x: 0.95, y: 1.7, w: 11.4, h: 2.4, margin: 0, fontFace: FONT_H, fontSize: 50, bold: true, lineSpacingMultiple: 1.08 });
  s.addText(
    "ViralForge wraps a finished 36-second PixVerse clip in the practical workflow sellers actually need — review shot by shot, find the moments that convert, translate trends into direction, plan props, and export listing assets.",
    { x: 1, y: 4.6, w: 10.6, h: 1.4, margin: 0, fontFace: FONT_B, fontSize: 19, color: "C7C7CC", lineSpacingMultiple: 1.3 }
  );

  // ===================================================================
  // 4 — HOW IT WORKS (4 steps)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "How it works", 1, 0.9);
  s.addText("From clip to campaign in four moves.", {
    x: 0.95, y: 1.3, w: 11.4, h: 0.9, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: INK,
  });
  const steps = [
    [icoVideo, "Review", "Scan the 36s video in 16:9 and 9:16, across six timed shots."],
    [icoLens, "Inspect", "Select a shot, read its score, strengths, and fixes; mark product hotspots."],
    [icoBolt, "Direct", "Turn Gen-Z trends into concrete creative direction and prop plans."],
    [icoTag, "Package", "Export listing images, description, and SEO keywords for Shopee & TikTok Shop."],
  ];
  let sx = 1;
  const cardW = 2.83, gap = 0.32;
  for (let i = 0; i < steps.length; i++) {
    const [ic, h, d] = steps[i];
    const x = sx + i * (cardW + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.5, w: cardW, h: 3.5, fill: { color: WHITE }, line: { color: HAIR, width: 1 }, rectRadius: 0.12, shadow: shadow() });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 2.9, w: 0.85, h: 0.85, fill: { color: FILL } });
    s.addImage({ data: ic, x: x + 0.55, y: 3.1, w: 0.45, h: 0.45 });
    s.addText(`0${i + 1}`, { x: x + 1.9, y: 2.95, w: 0.7, h: 0.5, margin: 0, fontFace: FONT_H, fontSize: 30, bold: true, color: "E5E5EA", align: "right" });
    s.addText(h, { x: x + 0.35, y: 4.0, w: cardW - 0.6, h: 0.5, margin: 0, fontFace: FONT_H, fontSize: 22, bold: true, color: INK });
    s.addText(d, { x: x + 0.35, y: 4.55, w: cardW - 0.6, h: 1.3, margin: 0, fontFace: FONT_B, fontSize: 14, color: GRAY, lineSpacingMultiple: 1.2 });
  }

  // ===================================================================
  // 5 — FEATURES (the workspace)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "The workspace", 1, 0.9);
  s.addText("Everything around the video, in one editor.", {
    x: 0.95, y: 1.3, w: 11.4, h: 0.9, margin: 0, fontFace: FONT_H, fontSize: 38, bold: true, color: INK,
  });
  const feats = [
    ["Shot strip", "Six timed shots, default to shot 3, click to inspect."],
    ["Product hotspots", "Serum, dropper, glow result — mapped to time ranges."],
    ["AI frame feedback", "Per-shot score, status, and improvement notes."],
    ["Trend translator", "Gen-Z trend chips → platform-native creative advice."],
    ["Props checklist", "Six sourcing items with live completion progress."],
    ["Listing assets", "Generated images, description, and SEO keyword chips."],
  ];
  const fcols = 3, fcw = 3.7, fch = 1.65, fgx = 0.25, fgy = 0.3;
  const fx0 = 1, fy0 = 2.5;
  feats.forEach((f, i) => {
    const c = i % fcols, r = Math.floor(i / fcols);
    const x = fx0 + c * (fcw + fgx), y = fy0 + r * (fch + fgy);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: fcw, h: fch, fill: { color: FILL }, line: { type: "none" }, rectRadius: 0.1 });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.22, h: 0.22, fill: { color: ACCENT } });
    s.addText(f[0], { x: x + 0.68, y: y + 0.22, w: fcw - 0.9, h: 0.4, margin: 0, fontFace: FONT_H, fontSize: 19, bold: true, color: INK });
    s.addText(f[1], { x: x + 0.3, y: y + 0.72, w: fcw - 0.6, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 14, color: GRAY, lineSpacingMultiple: 1.18 });
  });

  // ===================================================================
  // 6 — COMPETITORS (comparison table)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Competitive landscape", 1, 0.7);
  s.addText("Where everyone else stops.", {
    x: 0.95, y: 1.1, w: 11.4, h: 0.8, margin: 0, fontFace: FONT_H, fontSize: 38, bold: true, color: INK,
  });
  const hdr = (t) => ({ text: t, options: { fill: { color: INK }, color: WHITE, bold: true, fontFace: FONT_H, fontSize: 14, align: "left", valign: "middle", margin: [6, 10, 6, 10] } });
  const cell = (t, opts = {}) => ({ text: t, options: { color: GRAY, fontFace: FONT_B, fontSize: 13, valign: "middle", align: "left", margin: [6, 10, 6, 10], ...opts } });
  const yes = () => cell("Yes", { color: "1A7F37", bold: true });
  const no = () => cell("—", { color: FAINT });
  const rows = [
    [hdr("Tool"), hdr("Category"), hdr("Generate"), hdr("Shot review"), hdr("Trend→direction"), hdr("Listing assets")],
    [cell("PixVerse / Runway / Sora", { color: INK, bold: true }), cell("AI video generators"), yes(), no(), no(), no()],
    [cell("CapCut / Premiere", { color: INK, bold: true }), cell("Editors"), no(), cell("Manual"), no(), no()],
    [cell("Canva / Later", { color: INK, bold: true }), cell("Design & scheduling"), cell("Basic"), no(), no(), cell("Partial")],
    [cell("ViralForge", { color: ACCENT, bold: true }), cell("Campaign editor", { color: INK }), cell("Imports"), yes(), yes(), yes()],
  ];
  s.addTable(rows, {
    x: 1, y: 2.1, w: 11.33, colW: [2.6, 2.0, 1.5, 1.7, 2.13, 1.4],
    rowH: [0.55, 0.62, 0.62, 0.62, 0.62], border: { type: "solid", pt: 1, color: HAIR },
    fill: { color: WHITE },
  });
  s.addText("AI tools make the clip. Editors cut it. Nobody turns a finished video into a sell-ready campaign — that's the gap ViralForge owns.", {
    x: 1, y: 5.7, w: 11.3, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 16, italic: true, color: INK, lineSpacingMultiple: 1.2,
  });

  // ===================================================================
  // 7 — DIFFERENTIATION (3 pillars)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Why we win", 1, 0.9);
  s.addText("Three things only ViralForge does.", {
    x: 0.95, y: 1.3, w: 11.4, h: 0.9, margin: 0, fontFace: FONT_H, fontSize: 38, bold: true, color: INK,
  });
  const pillars = [
    ["Conversion-first", "Hotspots and per-shot scoring tie every second of the video to purchase intent — not just aesthetics."],
    ["Trend-to-action", "The trend translator turns vague Gen-Z signals into concrete, platform-native creative direction."],
    ["Ships the asset", "Walk out with listing images, copy, and SEO keywords for Shopee & TikTok Shop — not just a file."],
  ];
  const pcw = 3.7, pgx = 0.25;
  pillars.forEach((p, i) => {
    const x = 1 + i * (pcw + pgx);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.6, w: pcw, h: 3.4, fill: { color: INK }, line: { type: "none" }, rectRadius: 0.12 });
    s.addText(`0${i + 1}`, { x: x + 0.4, y: 2.95, w: 2, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: ACCENT });
    s.addText(p[0], { x: x + 0.4, y: 3.85, w: pcw - 0.8, h: 0.6, margin: 0, fontFace: FONT_H, fontSize: 22, bold: true, color: WHITE });
    s.addText(p[1], { x: x + 0.4, y: 4.5, w: pcw - 0.8, h: 1.4, margin: 0, fontFace: FONT_B, fontSize: 15, color: "C7C7CC", lineSpacingMultiple: 1.25 });
  });

  // ===================================================================
  // 8 — WHO IT'S FOR + numbers
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Who it's for", 1, 0.9);
  s.addText("Built for the seller, not the studio.", {
    x: 0.95, y: 1.3, w: 11.4, h: 0.9, margin: 0, fontFace: FONT_H, fontSize: 38, bold: true, color: INK,
  });
  s.addText([
    { text: "Primary  ", options: { bold: true, color: INK } },
    { text: "Small-to-mid e-commerce sellers on Shopee, TikTok Shop, and Instagram Reels.", options: { color: GRAY } },
  ], { x: 1, y: 2.45, w: 6.7, h: 0.9, margin: 0, fontFace: FONT_B, fontSize: 17, lineSpacingMultiple: 1.25 });
  s.addText([
    { text: "Also  ", options: { bold: true, color: INK } },
    { text: "Marketing freelancers and social-commerce teams validating short-form creative.", options: { color: GRAY } },
  ], { x: 1, y: 3.5, w: 6.7, h: 0.9, margin: 0, fontFace: FONT_B, fontSize: 17, lineSpacingMultiple: 1.25 });

  // stat callouts on right
  const stats = [["36s", "campaign, 6 timed shots"], ["3+", "purchase hotspots mapped"], ["10+", "interactive workflows"]];
  let stY = 2.45;
  for (const [n, l] of stats) {
    s.addText(n, { x: 8.2, y: stY, w: 1.7, h: 0.85, margin: 0, fontFace: FONT_H, fontSize: 52, bold: true, color: ACCENT, align: "right" });
    s.addText(l, { x: 10.0, y: stY + 0.22, w: 2.5, h: 0.7, margin: 0, fontFace: FONT_B, fontSize: 14, color: GRAY, valign: "middle" });
    stY += 1.15;
  }

  // ===================================================================
  // 9 — TECH / BUILT WITH
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: WHITE };
  kicker(s, "Under the hood", 1, 0.9);
  s.addText("A real editor, built TRAE-assisted.", {
    x: 0.95, y: 1.3, w: 11.4, h: 0.9, margin: 0, fontFace: FONT_H, fontSize: 38, bold: true, color: INK,
  });
  const tech = [
    ["React + Vite", "Fast client-only SPA, dev server at 127.0.0.1:5173."],
    ["Vitest + Testing Library", "Model and UI tests: shots sum to 36s, hotspots, checklist math."],
    ["Code-native controls", "Every panel is interactive state, not a static mock."],
    ["Design tokens, plain CSS", "Dense but readable; stacks cleanly under 760px."],
  ];
  tech.forEach((t, i) => {
    const c = i % 2, r = Math.floor(i / 2);
    const x = 1 + c * 5.85, y = 2.5 + r * 1.55;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.55, h: 1.3, fill: { color: FILL }, line: { type: "none" }, rectRadius: 0.1 });
    s.addText(t[0], { x: x + 0.35, y: y + 0.2, w: 4.9, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 19, bold: true, color: INK });
    s.addText(t[1], { x: x + 0.35, y: y + 0.66, w: 4.9, h: 0.55, margin: 0, fontFace: FONT_B, fontSize: 14, color: GRAY, lineSpacingMultiple: 1.15 });
  });

  // ===================================================================
  // 10 — CLOSING (dark)
  // ===================================================================
  s = pres.addSlide();
  s.background = { color: INK };
  s.addText("VIRALFORGE COMMERCE", {
    x: 1, y: 2.2, w: 10, h: 0.4, margin: 0, fontFace: FONT_B, fontSize: 13, bold: true, color: ACCENT, charSpacing: 4,
  });
  s.addText("Every generated video,\nready to sell.", {
    x: 0.95, y: 2.7, w: 11.4, h: 1.9, margin: 0, fontFace: FONT_H, fontSize: 54, bold: true, color: WHITE, lineSpacingMultiple: 1.05,
  });
  s.addText("npm run dev  ·  http://127.0.0.1:5173/", {
    x: 1, y: 5.0, w: 10, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 18, color: "98989D",
  });
  s.addShape(pres.shapes.OVAL, { x: 11.7, y: 5.6, w: 0.5, h: 0.5, fill: { color: ACCENT } });

  await pres.writeFile({ fileName: "/Users/lele/Code/viralforge-pixverse-editor/scripts/deck/ViralForge-PixVerse-Deck.pptx" });
  console.log("written");
}
build().catch((e) => { console.error(e); process.exit(1); });
