# ViralForge PixVerse Editor

A polished React/Vite demo of a ViralForge Commerce campaign editor for the
TRAE x PixVerse Video Generation Track.

The app models a 36-second Summer Glow skincare campaign with a PixVerse-style
video preview, vertical social preview, shot strip, waveform timeline, product
hotspots, AI frame feedback, trend translation, prop sourcing checklist, and
auto-generated listing assets. It also includes a UGC AI People workspace for
uploading a model reference, selecting gender intent, casting reusable AI
creator profiles, and checking consent readiness before generation.

## Run Locally

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Validate

```sh
npm test
npm run build
```

## Product Scope

- Domain: Marketing / E-commerce
- User: small commerce sellers creating short-form product campaign assets
- Video concept: a PixVerse-generated skincare campaign assembled from six
  short shots totaling 36 seconds
- Functionality beyond playback: project renaming, export/share commands,
  aspect-ratio switching, playback controls, shot selection, timeline markers,
  AI shot generation, frame feedback comparison, editable hotspots, sourcing
  checklist progress, trend guidance, social preview, AI people setup, and
  listing asset review

## Implementation Notes

- Built with React, Vite, Vitest, Testing Library, and lucide-react.
- All editor controls and content panels are code-native.
- Campaign frames are local static assets derived from the accepted editor
  concept image for demo fidelity.
- The app is intentionally client-only. Export, sharing, sourcing, AI
  generation, and copy commands update realistic local editor state instead of
  calling external services.

## Product Requirements

See [docs/PRD.md](docs/PRD.md) for the product requirements, target user,
core workflows, functional requirements, success metrics, risks, and future
enhancements. See [docs/UGC_AI_PEOPLE.md](docs/UGC_AI_PEOPLE.md) for the AI
People workflow and test coverage.

## Interactive Workflows

- Rename the campaign from the top bar and watch saved status update.
- Switch between 16:9, 9:16, and 1:1 preview targets.
- Open Export or Share menus to queue a package or copy a review link.
- Play, skip, mute, loop, toggle captions, scrub the timeline, and add CTA
  markers at the current playhead.
- Use AI Generate to choose a preset, enter a prompt, spend PixVerse credits,
  and append a generated shot to the timeline.
- Add, edit, and delete product hotspots directly from the hotspot panel.
- Upload a model reference, select gender intent, cast a reusable creator, and
  check consent readiness from the AI People workspace.
- Navigate trend cards, source props, regenerate listing assets, switch listing
  tabs, and copy generated commerce copy.
