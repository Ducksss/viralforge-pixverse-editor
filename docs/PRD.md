# Product Requirements Document: ViralForge Local Video Editor

## 1. Product Overview

ViralForge is now a browser-local video editor for commerce sellers assembling
short-form product videos. The primary workspace is a DaVinci Resolve-inspired
edit page with a media pool, Remotion preview monitor, inspector, and custom
multitrack timeline.

The commerce layer remains in the product, but it acts as assistant context
inside the editor: trend beats, filming review, CTA/listing metadata, and
compliance guardrails. The app does not require authentication, cloud storage,
or server rendering in v1.

## 2. Target Users

- Small commerce sellers cutting product clips for Shopee, TikTok Shop,
  Instagram Reels, and similar channels.
- Marketing operators who need a fast product-video assembly workflow without
  installing a desktop NLE.
- Demo evaluators who need to see a real editing flow rather than a dashboard
  with playback attached.

## 3. Goals

- Make the first screen feel like a real editor.
- Support import/select media, drag/drop editing, clip reorder, trim, music,
  CTA overlay, preview, persistence, and export.
- Keep all state in one timeline model so preview and export cannot drift.
- Keep v1 fully browser-local and transparent about persistence limits.
- Preserve the older campaign workspace at `/campaign` for regression and
  related ViralForge commerce workflows.

## 4. Non-Goals

- No PixVerse API generation call in v1.
- No cloud media storage or permanent uploaded blob persistence.
- No authentication or seller account integration.
- No server-side Remotion render.
- No source clip audio mixing in v1 export.
- No attempt to replace professional NLEs for color, keyframes, effects, or
  multi-user collaboration.

## 5. Core User Flow

1. Seller opens the editor at `/`.
2. Seller picks bundled real MP4 cuts from `src/assets/video/` or imports local video/audio.
3. Seller drags clips from the media pool into the timeline.
4. Seller reorders clips, selects clips, and trims source in/out.
5. Seller chooses a music bed and edits music volume/start.
6. Seller edits the CTA overlay.
7. Seller previews through Remotion Player.
8. Seller exports a 9:16 MP4 through Mediabunny.
9. Seller downloads the resulting blob locally.

## 6. Functional Requirements

### Campaign Workspace

- Preserve the ViralForge Commerce shell as the default route.
- Keep sidebar modules, topbar actions, AI People, product hotspots, filming
  review, props, trend guidance, and listing assets visible around the editor.
- Splice the local NLE into the editor page instead of replacing the commerce
  workspace.
- Keep the standalone DaVinci-style editor available at `/local-editor` for
  focused testing and regression.

### AI People

- Show a UGC AI People workspace as a first-class sidebar destination.
- Provide model-reference upload, gender intent, creator profile selection,
  readiness state, consent guardrails, and timed UGC audition planning.

### Media Pool

- Show deterministic real-footage video cuts and music beds.
- Allow local video/audio import.
- Probe media metadata with Mediabunny when possible.
- Fall back to safe editable placeholder metadata when metadata parsing fails.
- Mark restored uploaded media as `Reselect required` after hard refresh.
- Support drag/drop from media cards to the timeline.
- Provide explicit Add/Use buttons for keyboard and testability.

### Timeline

- Use a custom timeline model, not DOM-derived state.
- Represent media with `MediaAsset`.
- Represent timeline clips with `TimelineClip`.
- Represent music with `MusicTrack`.
- Represent CTA overlays with `TextOverlay`.
- Keep clips gapless after add, trim, or reorder.
- Resolve selected clip from playhead position.
- Support sortable clip reorder with `@dnd-kit`.
- Show video, music, and text lanes.

### Inspector

- Show project aspect settings for 9:16, 16:9, and 1:1.
- Keep 9:16 MP4 as the primary export target.
- Show selected clip title and selected duration.
- Allow source in/out trimming with bounds.
- Allow moving the selected clip earlier or later.
- Allow music track, music volume, and music start edits.
- Allow CTA text, start, and duration edits.

### Preview

- Use `@remotion/player` for in-browser preview.
- Render the same project state used by export.
- Show real media poster frames, video playback, or upload placeholders.
- Render safe zones and CTA overlay.
- Respect project aspect dimensions.

### Trend Brief

- Display trend chips for campaign direction.
- Summarize trends into one-line seller guidance.
- Include compact hook, shot plan, overlay copy, and CTA recommendations.

### Export

- Use Mediabunny for browser codec support checks and MP4 writing.
- Render video frames through a canvas sample pipeline.
- Draw active clip visuals, safe zones, and CTA text into the export canvas.
- Add the selected music bed as the supported audio track.
- Report progress, success, cancel, and error states.
- Return a downloadable MP4 blob named `viralforge-summer-glow-9x16.mp4`.

### Persistence

- Persist timeline metadata to `localStorage`.
- Persist trims, clip order, playhead, music settings, CTA overlay, and project
  settings.
- Do not persist uploaded `File` objects or object URLs.
- Restore uploaded assets as metadata-only rows requiring reselect.

### Commerce Assistant

- Show trend beats connected to timeline timing.
- Show filming review context and runtime/coverage summary.
- Show CTA/listing-oriented overlay metadata.
- Show compliance guardrails including `AI Safe`.

## 7. Technical Requirements

- React + Vite for the application shell.
- `remotion@4.0.469` and `@remotion/player@4.0.469` for preview.
- `mediabunny@1.45.4` for metadata and export orchestration.
- `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` for drag/drop.
- Vitest and Testing Library for unit and UI coverage.
- No server dependency for the default editor path.

## 8. Data Model

Core types live in `src/editor/timeline.js` as JSDoc typedefs:

- `MediaAsset`: bundled real-footage, uploaded, or generated media metadata.
- `TimelineClip`: a placed clip with source in/out and gapless start time.
- `MusicTrack`: selected music asset, enabled state, start trim, and volume.
- `TextOverlay`: CTA text, timing, and position.
- `TimelineProject`: complete editor state for preview, persistence, and
  export.
- `ExportJob`: UI state for progress, completion, cancel, and error handling.

## 9. Validation

Required commands:

```sh
npm test
npm run build
```

Coverage expectations:

- Timeline helpers: duration, reorder, trim bounds, playhead resolution,
  gapless sequencing, CTA timing, and serialization.
- Media helpers: mocked files and mocked Mediabunny metadata responses.
- Export orchestration: unsupported codecs, cancel path, progress events, and
  successful MP4 blob result.
- UI: real media import/add, reorder, trim, music selection, CTA editing,
  persistence/reload, upload reselect placeholder, and export status.
- Legacy campaign workspace: preserved `/campaign` behavior.

## 10. Risks and Follow-Ups

- Browser MP4 encoding support varies by platform and codec availability.
- Large local media can be memory-intensive because v1 renders through canvas.
- Real source audio mixing is intentionally deferred until the timeline model
  supports per-clip audio policy.
- Uploaded media persistence needs IndexedDB or the File System Access API for
  a permanent local-library version.
- Server/cloud rendering would be needed for reliable long-form export and
  background jobs.
