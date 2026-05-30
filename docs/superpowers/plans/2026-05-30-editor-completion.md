# Editor Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete local PixVerse editor workflow over the existing concept UI.

**Architecture:** Add deterministic editor helpers in `src/editorData.js`, then wire stateful React controls in `src/App.jsx` and style the new states in `src/styles.css`. Preserve the current layout and assets while making every visible command meaningful.

**Tech Stack:** React 19, Vite, Vitest, Testing Library, lucide-react, CSS grid/flex.

---

### Task 1: Data Helpers And Fixtures

**Files:**
- Modify: `src/editorData.js`
- Modify: `src/editorData.test.js`

- [ ] Add failing helper tests for second formatting, current-shot lookup,
  generated shot creation, timeline event creation, and hotspot creation.
- [ ] Implement helper functions and extend the snapshot with editor options,
  generation presets, trend cards, export/share options, and listing tab data.
- [ ] Run `npm test -- src/editorData.test.js`.

### Task 2: Stateful Editor Workflows

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`

- [ ] Add failing UI tests for title edit, aspect ratio, export/share, playback,
  AI generation, hotspot editing, timeline markers, trend navigation, and
  listing tabs.
- [ ] Replace decorative controls with accessible buttons, menus, forms, and
  local-state reducers.
- [ ] Run `npm test -- src/App.test.jsx`.

### Task 3: Visual Polish And Docs

**Files:**
- Modify: `src/styles.css`
- Modify: `README.md`

- [ ] Style menus, AI studio, active controls, messages, fullscreen/compare
  states, responsive layouts, and generated shot labels.
- [ ] Document the now-interactive workflows in the README.
- [ ] Run `npm test` and `npm run build`.
