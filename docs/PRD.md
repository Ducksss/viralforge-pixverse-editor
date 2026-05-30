# Product Requirements Document: ViralForge PixVerse Editor

## 1. Product Overview

ViralForge PixVerse Editor is a web-based campaign editing demo for commerce
sellers who want to turn an AI-generated product video into a complete
marketing asset workflow. The current product focuses on a skincare launch
campaign for Summer Glow Vitamin C Serum and presents a 36-second
PixVerse-style video as the central content component.

The app is not a video generation tool. It is a product experience around an
AI-generated video: sellers can review the assembled campaign, inspect shots,
track product hotspots, get frame-level feedback, translate trends into useful
creative direction, plan props, and prepare listing assets for commerce
channels. The AI People workspace adds pre-generation creator casting so
sellers can upload or select licensed people references before creating UGC
variants.

## 2. Track Fit

- Track: Video Generation Track
- Domain: Marketing / E-commerce
- AI video role: Product demo and short-form campaign creative
- Required video length: At least 30 seconds
- Current campaign length: 36 seconds
- Functional requirement beyond playback: Shot review, social preview,
  hotspots, feedback, sourcing checklist, trend guidance, and listing assets

## 3. Problem Statement

Small commerce sellers often struggle to turn a generated product video into a
ready-to-use campaign. A video may look good, but sellers still need to know
whether it fits current trends, highlights the right product moments, supports
purchase intent, and can be converted into channel-specific assets.

ViralForge solves this by wrapping the video in a practical editor workflow
that helps sellers review, improve, and package the campaign.

## 4. Target Users

### Primary User

Small to mid-sized e-commerce sellers who promote products on Shopee, TikTok
Shop, Instagram Reels, and similar short-form commerce channels.

### Secondary Users

- Marketing freelancers creating product campaign assets for sellers
- Social commerce teams validating short-form creative
- Hackathon judges evaluating PixVerse video integration inside a functional
  product experience

## 5. Goals

- Make the PixVerse-generated video a meaningful campaign asset, not a
  decorative embed.
- Help sellers understand what each shot contributes to conversion.
- Provide practical post-generation workflow tools around a finished video.
- Demonstrate a complete TRAE-assisted build workflow: concept, storyboard,
  prompt planning, UI implementation, testing, and validation.
- Create a polished demo that can be cloned, run locally, tested, and deployed.

## 6. Non-Goals

- Generate videos directly inside the app.
- Authenticate with PixVerse or spend PixVerse credits.
- Process real user uploads.
- Integrate real checkout, payments, or seller account data.
- Replace a full video editor such as Premiere, CapCut, or Final Cut Pro.

## 7. Current Product Experience

The current app presents a polished ViralForge Commerce editor with these
major areas:

- Left navigation for campaign workflow modules
- Top project bar with project title, saved state, aspect ratio, export, and
  share controls
- AI People workspace for model-reference upload, gender intent, creator
  casting, generation readiness, and consent guardrails
- Main PixVerse video preview for the 36-second campaign
- Vertical social preview for 9:16 short-form channels
- Six-shot storyboard strip with timing and selected state
- Waveform timeline with creative markers
- Product hotspot panel for campaign purchase cues
- Frame feedback panel with score and improvement guidance
- Compact trend brief for platform-native creative advice
- Top performing video references for benchmark inspiration
- Filming tips based on the current frame
- Props sourcing checklist with editable completion state
- Listing assets panel for generated images, description, and SEO keywords

## 8. Core User Flows

### Flow 1: Review Campaign Video

1. Seller opens the campaign editor.
2. Seller watches or scans the 16:9 video preview.
3. Seller checks the 9:16 social preview to understand mobile presentation.
4. Seller reviews the 36-second duration and six-shot structure.

Expected result: the seller understands the complete campaign asset and how it
will appear in social commerce contexts.

### Flow 2: Prepare AI People

1. Seller opens the AI People workspace.
2. Seller uploads a model reference image.
3. Seller chooses gender intent for the generated creator.
4. Seller selects a reusable AI creator profile.
5. Seller checks readiness and consent guardrails before generation.

Expected result: the seller can cast a licensed UGC creator and verify that the
people setup is ready before generating campaign variants.

### Flow 3: Inspect Shots

1. Seller selects a shot from the storyboard strip.
2. The selected shot receives a visible active state.
3. The frame feedback panel updates to match the selected shot.
4. Seller reviews score, strengths, and suggested improvements.

Expected result: the seller can evaluate the campaign shot by shot instead of
only watching the video passively.

### Flow 4: Validate Product Hotspots

1. Seller opens the Product Hotspots panel.
2. Seller sees purchase-relevant moments such as serum, dropper detail, and
   glow result.
3. Seller reviews the time ranges where these moments appear.

Expected result: the video supports product discovery and purchase intent.

### Flow 5: Prepare Props

1. Seller reviews the props sourcing checklist.
2. Seller marks items complete as they are sourced.
3. Completion progress updates immediately.

Expected result: the seller can move from creative review to practical
production planning.

### Flow 6: Package Listing Assets

1. Seller reviews generated listing images.
2. Seller checks product description and SEO keywords.
3. Seller uses the assets as a basis for Shopee or TikTok Shop listing content.

Expected result: the video campaign becomes a reusable commerce asset set.

## 9. Functional Requirements

### Campaign Preview

- Show a 16:9 primary video preview area.
- Show visible campaign timing of 00:12 / 00:36 in the preview frame.
- Provide playback-style controls for play, skip, volume, loop, captions, and
  fullscreen presentation.
- Preserve video as the central content component of the screen.

### AI People

- Show a UGC AI People workspace as a first-class sidebar destination.
- Provide a model-reference upload control for people images.
- Show uploaded filename and readiness state after a reference is selected.
- Provide gender options for Woman, Man, and Non-binary.
- Selecting gender must update local UI state.
- Show at least three reusable creator profiles with name, gender, fit score,
  role, language, voice, and consent status.
- Selecting a creator must update the hero and selected-creator rail.
- Show generation readiness with a derived completed-count label.
- Show consent and usage guardrails before generation.
- Show a timed UGC audition plan mapped to campaign moments.

### Shot Strip

- Display exactly six campaign shots.
- Show start time and duration for each shot.
- Default selected shot should be shot 3.
- Selecting a shot must update local UI state.
- Selected shot must update frame feedback content.

### Timeline

- Show a waveform-style timeline.
- Show creative markers at deterministic positions based on timestamp.
- Preserve the total campaign duration of 36 seconds.

### Product Hotspots

- Show at least three product hotspots.
- Each hotspot must include name, number, and time range.
- Hotspots must connect to commerce-relevant product moments.

### Frame Feedback

- Show score, status, and feedback note for the selected shot.
- Support different feedback entries per shot.
- Include a Compare control for future shot comparison workflows.

### Trend Brief

- Display trend chips for campaign direction.
- Summarize trends into one-line seller guidance.
- Include compact hook, shot plan, overlay copy, and CTA recommendations.

### Props Checklist

- Show six sourcing items.
- Show progress as completed count over total count.
- Allow checklist items to be toggled.
- Update progress immediately when a user toggles an item.

### Listing Assets

- Show generated image thumbnails.
- Show a generated listing description.
- Show SEO keyword chips.
- Provide a Copy All control for future clipboard integration.

## 10. UX Requirements

- The first viewport must feel like a real editor, not a landing page.
- The video must be visually dominant.
- Controls must be code-native and interactive where expected.
- Sidebar navigation must communicate a complete commerce workflow.
- The UI should be dense enough for productivity, but still readable.
- Cards should use small radii and restrained borders.
- Desktop layout should match the provided reference image closely.
- Mobile layout should avoid horizontal clipping by stacking panels.
- Copy must be specific to the campaign and domain.

## 11. Content Requirements

The demo should consistently reference:

- Brand: ViralForge Commerce
- Project: Summer Glow Skincare - PixVerse Campaign
- Product: Summer Glow Vitamin C Serum
- Channels: Shopee and TikTok Shop
- Campaign duration: 36 seconds
- PixVerse model label: PixVerse: V6
- Quality label: 720p

## 12. Technical Requirements

- Framework: React
- Build tool: Vite
- Test runner: Vitest
- UI test library: Testing Library
- Icons: lucide-react
- Styling: plain CSS with design tokens
- Runtime: local development server at `http://127.0.0.1:5173/`
- Repository: standalone GitHub repository

## 13. Test Requirements

Automated tests must verify:

- The campaign model contains a 36-second assembled video.
- The six shot durations sum to 36 seconds.
- Hotspot data contains the expected commerce moments.
- Checklist progress is computed correctly.
- Timeline markers are positioned deterministically.
- The AI People model includes creator profiles, gender options, and readiness
  data.
- Upload readiness updates from 4/5 to 5/5 when a model reference is present.
- The editor renders the primary workflow panels.
- The AI People page renders upload, casting, readiness, and guardrail panels.
- Uploading a model reference updates visible local UI state.
- Selecting gender and creator profiles updates visible local UI state.
- Selecting shot 2 updates frame feedback.
- Checking the white marble tray updates checklist progress from 3/6 to 4/6.

Manual validation should verify:

- App loads at the local Vite URL.
- No framework error overlay appears.
- Browser console has no relevant app warnings or errors.
- Desktop screenshot matches the reference structure.
- Mobile screenshot avoids clipped primary content.

## 14. Success Metrics

### Demo Success

- A judge or viewer can understand the product in under 30 seconds.
- The video is clearly central to the workflow.
- The app demonstrates functionality beyond playback.
- The experience looks like a complete commerce editor rather than a mock
  player page.

### Engineering Success

- `npm test` passes.
- `npm run build` passes.
- The app runs locally with `npm run dev`.
- The repository is self-contained and documented.

### Product Success

- Sellers can identify which shots support purchase intent.
- Sellers can see what props and assets are still needed.
- Sellers can translate creative trends into concrete campaign changes.
- Sellers can move from video review to listing preparation.

## 15. Risks and Mitigations

### Risk: The video feels decorative

Mitigation: Surround the video with functional workflows such as hotspots,
feedback, trend translation, props, and listing assets.

### Risk: The demo is mistaken for a video generation tool

Mitigation: Position the app as a post-generation campaign editor and make the
video a content asset inside a broader product workflow.

### Risk: Static data feels fake

Mitigation: Use specific campaign copy, product names, realistic time ranges,
shot-level feedback, and commerce channel details.

### Risk: Mobile layout clips content

Mitigation: Stack panels under 760px, use compact navigation, and preserve the
video frame with containment.

## 16. Future Enhancements

- Connect to the PixVerse API or CLI workflow for real generated clips.
- Add upload/import flow for final PixVerse videos.
- Add real playback state and seekable timeline.
- Add hotspot editing with drag handles on video frames.
- Add listing copy export to clipboard.
- Add campaign variants for different products and channels.
- Add comments, approval, and team review workflow.
- Add deployment workflow for a public demo link.

## 17. Open Questions

- Should future versions support authenticated PixVerse generation inside the
  app, or stay focused on post-generation review?
- Should the primary buyer flow include a real product listing preview?
- Should listing export target Shopee, TikTok Shop, Shopify, or a generic CSV?
- Should frame feedback be rule-based, AI-generated, or manually authored in
  the demo?
