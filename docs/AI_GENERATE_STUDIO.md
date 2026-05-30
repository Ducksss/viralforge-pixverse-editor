# AI Generate Studio

AI Generate Studio is the guided PixVerse sample builder inside the editor. It
turns a trend preset and product prompt into one or more generated candidate
clips that are appended to the current shot strip for review.

## Guided Flow

1. Pick a trend preset: UGC Proof, Macro Texture, or Shop CTA.
2. Choose sample count: 1, 2, 3, or 4 candidates.
3. Choose clip duration: 15s hook, 30s clip, or 45s story.
4. Write or seed the prompt with helper chips for creator demo, texture, CTA,
   and camera motion cues.
5. Review preset coaching for hook, camera, overlay, and CTA structure.
6. Confirm AI Safe checks and generate the samples.

## Credit Estimate

Each preset has a 15-second base cost. Longer durations multiply that base:

- 15s = 1x preset cost
- 30s = 2x preset cost
- 45s = 3x preset cost

Total credits are `preset base cost x duration multiplier x sample count`.
For example, UGC Proof costs 120 credits at 15 seconds. Three 30-second UGC
Proof samples cost `120 x 2 x 3 = 720` credits.

## Generated Samples

Generation is client-only in this demo. When the user generates, the app creates
deterministic sample clips with sequential shot numbers, start times, selected
duration, selected preset metadata, and the submitted prompt. The first new
sample becomes the selected shot and the available PixVerse balance is reduced
by the estimate.

## AI Safe Guardrails

The studio keeps generation commerce-safe by showing the checks before launch:

- No medical cure claims
- No impossible skin results
- Commerce CTA is compliant
- Human review lane for every generated sample

If AI Safe is toggled off from the toolbar, generated samples are treated as
manual-review candidates before export.
