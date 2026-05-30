# UGC Creator Portraits

Photoreal UGC creator headshots for the Summer Glow skincare campaign, generated
with [`scripts/generate-ugc.mjs`](../../../scripts/generate-ugc.mjs) (OpenAI
`gpt-image-1`, `1024x1536`, `quality: high`).

These are a standalone asset library. They are **not yet imported** into the app
or the `editorSnapshot.aiPeople` data model — wire them in when needed.

## Set summary

- **31 portraits total** — 13 male, 18 female
- Ages spread across young / middle-aged / older
- Ethnic mix: East Asian, Southeast Asian, South Asian, Black, White, Latino/a,
  Middle Eastern, plus a dedicated **Korean (K-beauty)** group weighted toward
  young women

## Male (`male/`)

| File | Age | Profile |
| --- | --- | --- |
| `m01-young-east-asian.png` | young | East Asian |
| `m02-young-black.png` | young | Black |
| `m03-young-south-asian.png` | young | South Asian |
| `m04-middle-white.png` | middle | White |
| `m05-middle-latino.png` | middle | Latino |
| `m06-middle-middle-eastern.png` | middle | Middle Eastern |
| `m07-old-white.png` | older | White |
| `m08-old-east-asian.png` | older | East Asian |
| `m09-old-black.png` | older | Black |
| `m10-young-southeast-asian.png` | young | Southeast Asian |
| `m15-korean.png` | young | Korean |
| `m16-korean.png` | middle | Korean |
| `m17-korean.png` | older | Korean |

## Female (`female/`)

| File | Age | Profile |
| --- | --- | --- |
| `f01-young-east-asian.png` | young | East Asian |
| `f02-young-black.png` | young | Black |
| `f03-young-white.png` | young | White |
| `f04-middle-south-asian.png` | middle | South Asian |
| `f05-middle-latina.png` | middle | Latina |
| `f06-middle-middle-eastern.png` | middle | Middle Eastern |
| `f07-old-white.png` | older | White |
| `f08-old-east-asian.png` | older | East Asian |
| `f09-old-black.png` | older | Black |
| `f10-young-southeast-asian.png` | young | Southeast Asian |
| `f15-korean.png` | young | Korean |
| `f16-korean.png` | middle | Korean |
| `f17-korean.png` | older | Korean |
| `f18-korean-young-wavy.png` | young | Korean — wavy light-brown hair, cute |
| `f19-korean-young-bob.png` | young | Korean — sleek black bob, chic |
| `f20-korean-young-bangs.png` | young | Korean — see-through bangs, doll-like |
| `f21-korean-young-sporty.png` | young | Korean — high ponytail, fresh/sporty |
| `f22-korean-young-elegant.png` | young | Korean — layered brown hair, elegant |

## Regenerate

```sh
# all (skips files that already exist)
OPENAI_API_KEY=sk-... node scripts/generate-ugc.mjs

# specific personas only (force-overwrites just those)
OPENAI_API_KEY=sk-... node scripts/generate-ugc.mjs f20-korean-young-bangs m07-old-white
```
