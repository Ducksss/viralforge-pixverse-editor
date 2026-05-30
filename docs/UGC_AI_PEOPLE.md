# UGC AI People Workflow

The UGC AI People page extends ViralForge from campaign review into creator
casting. Sellers can prepare a licensed person reference before generating
PixVerse UGC variants for the Summer Glow skincare campaign.

## Page Purpose

The page answers four operational questions:

- Which licensed or generated creator reference will appear in the generated
  UGC shots?
- Is the selected creator reference ready, or has a custom reference been
  uploaded?
- What gender intent, voice, language, wardrobe, and face-lock settings should
  PixVerse use?
- Are consent, disclosure, and brand-safety requirements complete before
  generation?

## Main Workflow

1. Open the AI People workspace from the ViralForge sidebar.
2. Use a reusable generated creator profile, or upload a custom model reference
   image with a clear face and release on file.
3. Choose the gender intent: Woman, Man, or Non-binary.
4. Select one of the reusable creator profiles.
5. Review generation readiness and consent guardrails.
6. Use the audition plan as the creator script map for campaign shots.

## Implemented Interactions

- Selecting a reusable creator profile provides a ready reference by default.
- Uploading a custom people reference stores the selected filename in local UI
  state and marks the model reference panel as a custom override.
- Gender selection updates the selected state and visible intent line.
- Selecting a creator updates the hero summary, selected creator rail, and fit
  score.
- The existing PixVerse editor remains reachable from the sidebar and keeps its
  shot-selection and props-checklist interactions.

## Data Model

The `editorSnapshot.aiPeople` model includes:

- `defaultPersonId` and `defaultGender`
- upload requirements
- gender options
- creator profiles with fit score, consent status, locale, language, voice, and
  visual asset mapping
- generation readiness checklist
- face/wardrobe/shot-mode settings
- timed UGC audition script lines
- consent and usage guardrails

`getPeopleReadiness()` derives the readiness count from the checklist. The
selected reusable creator profile satisfies the reference requirement by
default; uploads are optional custom overrides.

## Portrait Asset Library

The three reusable creator profiles are backed by generated, fictional adult
model portraits in `src/assets/`:

- `creator-maya.png`: warm bathroom skincare routine host with an amber serum.
- `creator-daniel.png`: clean studio commerce reviewer with a product bottle.
- `creator-jordan.png`: soft daylight shelfie storyteller with skincare props.

The portraits were generated with the built-in image generation workflow as
photoreal UGC casting references, then resized to 1200 x 675 PNG files for the
Vite asset pipeline. The old SVG illustration placeholders were removed so the
AI People workspace consistently presents model-like creator references.

## Test Coverage

Vitest and Testing Library cover:

- AI People fixture shape and default gender options
- readiness calculation before and after uploading a reference
- initial rendering of the AI People workspace
- navigation from AI People back to the PixVerse editor
- model reference upload state
- gender segmented-control state
- creator selection state
