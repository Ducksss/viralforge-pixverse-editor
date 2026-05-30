# Editor Completion Design

## Goal

Turn the PixVerse campaign editor from a static concept recreation into a
working, self-contained editor demo. The app remains client-only, but controls
must mutate real local state and expose realistic commerce-video workflows.

## Scope

- Header commands: rename project, switch aspect ratio, export a publishing
  package, share a review link, and show saved/working status.
- Preview commands: play/pause, skip, mute, captions, loop, fullscreen state,
  timeline scrubbing, and current-shot synchronization.
- Editor workspace: selectable shots, add AI-generated shots, add timeline
  markers at the current playhead, edit/delete hotspots, compare frame feedback,
  and keep feedback tied to the selected shot.
- AI Generate mode: prompt input, generation presets, cost/balance feedback,
  safety status, and queued generation that appends a usable shot.
- Right rail: navigable trend translator, expanded top videos, current-frame
  filming tips, prop checklist progress, listing asset tabs, regeneration, and
  copy status.

## Architecture

Keep the app within the existing Vite/React structure:

- `src/editorData.js` owns seed content plus deterministic helpers for time,
  generated shots, timeline events, and hotspot creation.
- `src/App.jsx` owns local UI state and interaction handlers. The app is still
  a single screen, but each panel receives explicit props instead of reaching
  into mutable state.
- `src/styles.css` continues as the global stylesheet and gains stateful
  controls, menus, and responsive polish without replacing the current visual
  system.

## Testing

Use Vitest and Testing Library. Add behavior tests for command menus, playback,
AI generation, hotspot/timeline/listing workflows, and data helpers. Validate
with `npm test` and `npm run build`.
