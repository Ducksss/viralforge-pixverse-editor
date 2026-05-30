#!/usr/bin/env node
// Generate 20 photoreal UGC creator portraits (10 male / 10 female, mixed ages)
// and save them as PNGs into src/assets/ugc/{male,female}/.
//
// Usage:
//   OPENAI_API_KEY=sk-... node scripts/generate-ugc.mjs
//   OPENAI_API_KEY=sk-... node scripts/generate-ugc.mjs f02-young-black   # regen one
//
// Provider: OpenAI Images API (gpt-image-1). Re-running skips files that
// already exist; pass persona ids as args to force-regenerate just those.

import { writeFile, mkdir, access, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "src/assets/ugc");

const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const SIZE = process.env.OPENAI_IMAGE_SIZE || "1024x1536"; // vertical, UGC framing
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "high";
const API_KEY = process.env.OPENAI_API_KEY;

// Shared realism contract. This is the part that keeps faces from looking
// plastic/AI: real skin texture, candid framing, imperfect amateur capture.
const REALISM =
  "Photorealistic candid selfie taken on a modern smartphone front camera. " +
  "Hyper-realistic natural skin with visible pores, fine lines and subtle " +
  "imperfections, NOT airbrushed, NOT smoothed, NOT glossy. Realistic catchlights " +
  "in the eyes, natural eye moisture, individual stray hairs. Authentic everyday " +
  "user-generated-content look, slightly imperfect amateur framing, gentle phone-camera " +
  "depth of field. Head-and-shoulders portrait, face sharp and in focus, genuine relaxed " +
  "expression making eye contact with the camera. " +
  "Avoid: plastic skin, waxy look, over-smoothing, heavy retouching, cartoon, 3D render, " +
  "CGI, illustration, beauty-filter, text, watermark, logo.";

// Each persona = identity (who) + scene (lighting / setting / wardrobe).
// Scene variety stops the 20 from reading as one template.
const PEOPLE = [
  // ----- MALE (10) -----
  { gender: "male", age: "young", id: "m01-young-east-asian",
    who: "a good-looking East Asian man in his early 20s, tidy black hair, light stubble, clear skin",
    scene: "soft window daylight, plain bedroom wall behind, wearing a grey crewneck tee" },
  { gender: "male", age: "young", id: "m02-young-black",
    who: "a handsome Black man in his mid 20s, short fade haircut, warm brown skin, bright easy smile",
    scene: "bright outdoor overcast light, blurred green park behind, wearing a white tee and gold chain" },
  { gender: "male", age: "young", id: "m03-young-south-asian",
    who: "a handsome South Asian man in his early 20s, wavy dark hair, warm brown skin, light beard",
    scene: "warm golden-hour sunlight from the side, blurred city street behind, denim jacket" },
  { gender: "male", age: "middle", id: "m04-middle-white",
    who: "a handsome white man in his early 40s, short brown hair flecked with grey, neat stubble, friendly eyes",
    scene: "soft kitchen daylight, blurred home interior behind, navy button-down shirt" },
  { gender: "male", age: "middle", id: "m05-middle-latino",
    who: "a handsome Latino man in his late 30s, neat dark hair, trimmed beard, tan skin",
    scene: "warm indoor lamp light, blurred living room behind, olive henley shirt" },
  { gender: "male", age: "middle", id: "m06-middle-middle-eastern",
    who: "a handsome Middle Eastern man in his mid 40s, salt-and-pepper beard, kind eyes, light wrinkles",
    scene: "bright cafe window light, blurred coffee shop behind, charcoal sweater" },
  { gender: "male", age: "old", id: "m07-old-white",
    who: "a warm older white man in his early 60s, silver-grey hair, real age wrinkles and laugh lines, gentle grandfatherly smile",
    scene: "soft afternoon daylight, blurred garden behind, light blue checked shirt" },
  { gender: "male", age: "old", id: "m08-old-east-asian",
    who: "a kind older East Asian man in his late 60s, thinning grey hair, soft laugh lines, thin-framed glasses",
    scene: "even indoor daylight, plain warm wall behind, beige cardigan" },
  { gender: "male", age: "old", id: "m09-old-black",
    who: "a distinguished older Black man in his 60s, short grey hair, neat grey beard, deep smile lines",
    scene: "warm window light, blurred bookshelf behind, dark green sweater" },
  { gender: "male", age: "young", id: "m10-young-southeast-asian",
    who: "a good-looking Southeast Asian man in his early 20s, modern textured haircut, clear skin, bright smile",
    scene: "cool daylight, blurred white apartment behind, black hoodie" },

  // ----- FEMALE (10) -----
  { gender: "female", age: "young", id: "f01-young-east-asian",
    who: "a pretty East Asian woman in her early 20s, long straight black hair, dewy skin, light natural makeup",
    scene: "soft window daylight, blurred plant-filled room behind, cream knit top" },
  { gender: "female", age: "young", id: "f02-young-black",
    who: "a pretty Black woman in her mid 20s, natural curly afro, radiant smile, glowing skin",
    scene: "bright outdoor light, blurred sunny street behind, mustard tee" },
  { gender: "female", age: "young", id: "f03-young-white",
    who: "a pretty white woman in her early 20s, wavy blonde hair, light freckles, minimal makeup",
    scene: "warm golden-hour light, blurred beach behind, light linen shirt" },
  { gender: "female", age: "middle", id: "f04-middle-south-asian",
    who: "a pretty South Asian woman in her late 30s, long dark hair, warm brown skin, subtle makeup",
    scene: "soft indoor daylight, blurred home office behind, deep red blouse" },
  { gender: "female", age: "middle", id: "f05-middle-latina",
    who: "a pretty Latina woman in her early 40s, shoulder-length wavy brown hair, confident warm smile",
    scene: "bright kitchen daylight, blurred counter behind, white shirt" },
  { gender: "female", age: "middle", id: "f06-middle-middle-eastern",
    who: "a striking Middle Eastern woman in her mid 40s, dark wavy hair, expressive eyes, light age lines",
    scene: "warm cafe light, blurred interior behind, teal scarf and top" },
  { gender: "female", age: "old", id: "f07-old-white",
    who: "a graceful older white woman in her early 60s, soft grey bob, real wrinkles and gentle smile lines",
    scene: "soft daylight, blurred living room behind, lavender blouse" },
  { gender: "female", age: "old", id: "f08-old-east-asian",
    who: "a kind older East Asian woman in her late 60s, short grey hair, warm crow's-feet smile, glasses",
    scene: "even window light, plain wall behind, soft pink cardigan" },
  { gender: "female", age: "old", id: "f09-old-black",
    who: "a joyful older Black woman in her 60s, silver natural curls, deep warm smile lines, grandmotherly",
    scene: "warm afternoon light, blurred porch behind, patterned orange top" },
  { gender: "female", age: "young", id: "f10-young-southeast-asian",
    who: "a pretty Southeast Asian woman in her early 20s, long dark hair, dewy clear skin, cheerful",
    scene: "cool daylight, blurred bright cafe behind, pastel blue top" },

  // ----- KOREAN (K-beauty style, mixed ages) -----
  { gender: "male", age: "young", id: "m15-korean",
    who: "a handsome Korean man in his early 20s, soft styled black hair, smooth fair skin, clean K-beauty look, gentle smile",
    scene: "bright soft daylight, blurred minimalist Seoul cafe behind, light beige sweater" },
  { gender: "male", age: "middle", id: "m16-korean",
    who: "a handsome Korean man in his late 30s, neat dark hair, well-groomed, fair-to-medium skin, refined features",
    scene: "soft window light, blurred modern office behind, crisp white shirt" },
  { gender: "male", age: "old", id: "m17-korean",
    who: "a kind older Korean man in his early 60s, grey-flecked hair, gentle wrinkles, warm dignified smile",
    scene: "soft afternoon daylight, blurred home interior behind, soft grey cardigan" },
  { gender: "female", age: "young", id: "f15-korean",
    who: "a pretty Korean woman in her early 20s, long straight black hair, dewy glass skin, soft natural K-beauty makeup",
    scene: "bright soft daylight, blurred minimalist studio behind, pastel knit top" },
  { gender: "female", age: "middle", id: "f16-korean",
    who: "a pretty Korean woman in her late 30s, sleek shoulder-length hair, radiant well-cared-for skin, elegant",
    scene: "soft daylight, blurred bright apartment behind, cream blouse" },
  { gender: "female", age: "old", id: "f17-korean",
    who: "a graceful older Korean woman in her early 60s, neat short dark-grey hair, gentle smile lines, warm",
    scene: "soft window light, blurred living room behind, soft lavender top" },

  // ----- EXTRA YOUNG KOREAN FEMALES (more variation) -----
  { gender: "female", age: "young", id: "f18-korean-young-wavy",
    who: "a pretty Korean woman in her early 20s, soft wavy light-brown hair, dewy glass skin, cute approachable look, subtle blush makeup",
    scene: "bright airy daylight, blurred pastel cafe behind, oversized cream cardigan" },
  { gender: "female", age: "young", id: "f19-korean-young-bob",
    who: "a pretty Korean woman in her mid 20s, sleek short black bob, clear glass skin, chic confident expression, minimal makeup",
    scene: "soft studio daylight, plain warm-white wall behind, fitted black turtleneck" },
  { gender: "female", age: "young", id: "f20-korean-young-bangs",
    who: "a pretty Korean woman in her early 20s, long straight black hair with see-through bangs, doll-like fresh features, glass skin, soft pink lip",
    scene: "bright window light, blurred bedroom with fairy lights behind, pastel pink knit top" },
  { gender: "female", age: "young", id: "f21-korean-young-sporty",
    who: "a pretty Korean woman in her early 20s, dark hair in a high ponytail, healthy glowing skin, fresh natural no-makeup look, bright cheerful smile",
    scene: "outdoor daylight, blurred green park behind, light athletic zip-up" },
  { gender: "female", age: "young", id: "f22-korean-young-elegant",
    who: "a pretty Korean woman in her mid 20s, long layered dark-brown hair, radiant glass skin, elegant refined look, soft glam makeup",
    scene: "soft golden indoor light, blurred upscale interior behind, beige silk blouse" },
];

function promptFor(p) {
  return `${p.who}. Setting: ${p.scene}. ${REALISM}`;
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function generateOne(p) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: promptFor(p),
      n: 1,
      size: SIZE,
      quality: QUALITY,
      output_format: "png",
      moderation: "low",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 400)}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image data returned: ${JSON.stringify(json).slice(0, 300)}`);
  return Buffer.from(b64, "base64");
}

async function main() {
  if (!API_KEY) {
    console.error("Missing OPENAI_API_KEY. Run:\n  OPENAI_API_KEY=sk-... node scripts/generate-ugc.mjs");
    process.exit(1);
  }
  await mkdir(resolve(OUT, "male"), { recursive: true });
  await mkdir(resolve(OUT, "female"), { recursive: true });

  // Optional: regenerate only the persona ids passed as CLI args.
  const only = process.argv.slice(2);
  const targets = only.length ? PEOPLE.filter((p) => only.includes(p.id)) : PEOPLE;
  if (only.length && targets.length !== only.length) {
    const found = new Set(targets.map((p) => p.id));
    console.error(`Unknown persona id(s): ${only.filter((x) => !found.has(x)).join(", ")}`);
    process.exit(1);
  }

  let ok = 0, skipped = 0, failed = 0;
  for (const p of targets) {
    const file = resolve(OUT, p.gender, `${p.id}.png`);
    if (!only.length && await exists(file)) { skipped++; console.log(`skip   ${p.gender}/${p.id}.png (exists)`); continue; }
    if (only.length && await exists(file)) await unlink(file).catch(() => {});
    try {
      const buf = await generateOne(p);
      await writeFile(file, buf);
      ok++;
      console.log(`ok     ${p.gender}/${p.id}.png (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed++;
      console.error(`FAIL   ${p.gender}/${p.id}.png -> ${err.message}`);
    }
  }
  console.log(`\nDone. generated=${ok} skipped=${skipped} failed=${failed} -> ${OUT}`);
  if (failed) process.exit(1);
}

main();
