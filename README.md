# ViralForge PixVerse Editor

A polished React/Vite demo of a ViralForge Commerce campaign editor for the
TRAE x PixVerse Video Generation Track.

The app models a 36-second Summer Glow skincare campaign with a PixVerse-style
video preview, vertical social preview, shot strip, waveform timeline, product
hotspots, AI frame feedback, trend translation, prop sourcing checklist, and
auto-generated listing assets.

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
- Functionality beyond playback: shot selection, frame feedback, hotspots,
  sourcing checklist, trend guidance, social preview, and listing asset review

## Implementation Notes

- Built with React, Vite, Vitest, Testing Library, and lucide-react.
- All editor controls and content panels are code-native.
- Campaign frames are local static assets derived from the accepted editor
  concept image for demo fidelity.
