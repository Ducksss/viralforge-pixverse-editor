# Local NLE and TikTok Preview Sync

The campaign workspace now treats the embedded Remotion Timeline as the primary
editor. The old top preview, shot strip, and AI Generate tab are removed from the
main editor canvas so timeline state has one owner.

## Clock Ownership

`CampaignNleBay` owns the timeline project and listens to the embedded
`@remotion/player` instance. Player `frameupdate` and `seeked` events are
converted into `project.playheadSeconds`, then published to the campaign shell
with `onPlayheadChange` and `onProjectChange`.

The campaign shell uses those callbacks to update the selected campaign shot and
the TikTok-style Social Preview. The TikTok preview does not keep an independent
playback clock when a timeline project is available.

## Preview Contract

The Social Preview resolves the active timeline clip through
`getClipAtPlayhead(project, project.playheadSeconds)`. For video clips, it seeks
the phone preview media element to:

```txt
clip.sourceInSeconds + project.playheadSeconds - clip.startSeconds
```

That keeps the phone preview aligned with timeline trims and clip placement.
If no playable clip is active, the preview falls back to the clip poster frame.

## Loop Prevention

The embedded Remotion Player must not loop in the campaign workspace:

- `loop={false}`
- `moveToBeginningWhenEnded={false}`
- `initialFrame` is derived from `project.playheadSeconds`

This prevents the local NLE from returning to the first source segment after a
short preview pass. Playback state still flows upward through `play`, `pause`,
and `ended` events so the campaign shell can reflect whether the NLE is playing.

## Verification

Coverage lives in:

- `src/localNleEditor.test.jsx`: verifies the legacy top editor is absent, the
  embedded player is non-looping, and Remotion frame events drive the TikTok
  synced preview.
- `src/App.test.jsx`: verifies the default workspace uses the Local NLE as the
  primary editor surface and that campaign media is added through that timeline.

Run the required validation before merging:

```sh
npm test
npm run build
```
