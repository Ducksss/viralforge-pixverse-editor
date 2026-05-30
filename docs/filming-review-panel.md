# Filming Review Panel

The Filming Tips panel is a shot-aware production review surface for the
currently selected storyboard frame. It should not regress into a static
checklist: every selected shot needs specific guidance that helps a seller or
creator decide whether to keep, retake, or adjust the frame.

## Data Contract

Shot guidance lives in `editorSnapshot.filmingReviews`, keyed by shot ID.
Generated or unknown shots use `editorSnapshot.filmingReviewFallback`.

Each review includes:

- `score`: numeric readiness score shown in the review card.
- `verdict`: short production judgment, such as `Strong creator proof`.
- `priority`: retake priority used in the readiness card.
- `summary`: one-sentence frame diagnosis.
- `metrics`: four compact score tiles for lighting, camera angle, headroom,
  and product read.
- `priorityFixes`: the two highest-value production notes.
- `nextSetup`: exact setup instruction for the next take or prompt pass.
- `strengths`: small positive chips that explain what should be preserved.

## Interaction

The `Brief` action in the panel calls back into the editor and updates the
saved-status line with `Filming notes added to shot N brief`. Selecting another
shot must refresh the review content from that shot's data.

## Visual Contract

The panel should read as a production review tool, not a generic checklist. It
renders shot number and time range, priority, a safe-crop frame preview with
composition overlays, a readiness score, metric bars, severity-coded fixes,
the next setup instruction, and strengths to preserve in the next take.

## Verification

Coverage lives in:

- `src/editorData.test.js`: validates the shot-aware filming review data shape.
- `src/App.test.jsx`: validates the rendered panel, selected-shot update, and
  brief action status, including the polished review surface elements.
