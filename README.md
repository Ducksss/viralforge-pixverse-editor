# ViralForge Local Video Editor

A browser-local React/Vite video editor for commerce sellers. The default
workspace is a DaVinci Resolve-inspired edit page: media pool on the left,
Remotion 9:16 program monitor in the center, inspector on the right, and a
custom multitrack timeline across the bottom.

The editor is built around one shared timeline model. Media pool actions,
clip reorder, trim handles, CTA overlay editing, Remotion preview, persistence,
and Mediabunny export all read and write the same project state.

## Run Locally

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

The previous ViralForge campaign workspace is still available at `/campaign`
for regression coverage and PixVerse balance experiments.

## Core Editor Flow

1. Import or select clips from the media pool.
2. Drag clips into the timeline or use the Add command.
3. Reorder clips, select a clip, and trim source in/out in the inspector.
4. Select a music bed and adjust music start/volume.
5. Edit the CTA text overlay shared by preview and export.
6. Preview through Remotion Player.
7. Export a downloadable 9:16 MP4 through the Mediabunny orchestration layer.

## Features

- Seeded sample video clips and music beds for a deterministic first run.
- Local video/audio upload with Mediabunny metadata probing and safe fallback
  metadata for unsupported files.
- `@dnd-kit` drag/drop from media pool to timeline plus sortable clip reorder.
- Custom timeline helpers for duration, gapless sequencing, trim bounds,
  playhead-to-clip resolution, CTA timing, and serialization.
- Remotion Player preview using `src/remotion/EditorComposition.jsx`.
- Mediabunny export orchestration using canvas video samples and a music bed.
- Commerce assistant context inside the editor: trend beats, filming review,
  CTA/listing metadata, and compliance guardrails.
- Local metadata persistence through `localStorage`.

## Browser-Local Limits

- V1 does not upload media, call PixVerse generation APIs, or render on a
  server.
- Uploaded file blobs are session-only. After a hard refresh, saved metadata
  remains, but uploads show `Reselect required`.
- Source clip audio is muted in v1 export. The selected music bed is the
  supported audio track.
- Export targets 9:16 social video first. 16:9 and 1:1 are editable project
  settings, but 9:16 MP4 is the primary deliverable.
- Real MP4 export depends on the browser supporting the required AVC/AAC
  encoding path exposed through Mediabunny.

## Validate

```sh
npm test
npm run build
```

Focused suites cover timeline helpers, media import metadata, localStorage
serialization, Mediabunny export orchestration, the DaVinci-style local editor,
and the preserved campaign workspace.

## Documentation

- [Local video editor PRD](docs/PRD.md)
- [AI Generate Studio legacy workflow](docs/AI_GENERATE_STUDIO.md)
- [UGC AI People legacy workflow](docs/UGC_AI_PEOPLE.md)
- [Filming review panel notes](docs/filming-review-panel.md)
