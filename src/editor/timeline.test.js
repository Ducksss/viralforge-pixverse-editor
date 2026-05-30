import { describe, expect, it } from "vitest";
import {
  addAssetToTimeline,
  computeTimelineDuration,
  createInitialTimelineProject,
  deserializeTimelineProject,
  getClipAtPlayhead,
  reorderTimelineClip,
  serializeTimelineProject,
  trimTimelineClip,
  updateMusicTrack,
  updateTextOverlay,
} from "./timeline.js";

describe("timeline project helpers", () => {
  it("creates a gapless 9:16 editor project from seeded media", () => {
    const project = createInitialTimelineProject();

    expect(project.aspectRatio).toBe("9:16");
    expect(project.width).toBe(1080);
    expect(project.height).toBe(1920);
    expect(project.fps).toBe(30);
    expect(project.mediaAssets.some((asset) => asset.kind === "video")).toBe(true);
    expect(project.mediaAssets.some((asset) => asset.kind === "audio")).toBe(true);
    expect(project.timelineClips.map((clip) => clip.startSeconds)).toEqual([0, 5, 10, 15]);
    expect(computeTimelineDuration(project)).toBe(20);
  });

  it("adds clips, reorders them, trims with bounds, and resolves playhead clips", () => {
    let project = createInitialTimelineProject();
    project = addAssetToTimeline(project, "sample-social-proof");

    expect(project.timelineClips.at(-1)).toMatchObject({
      assetId: "sample-social-proof",
      startSeconds: 20,
      sourceInSeconds: 5,
      sourceOutSeconds: 10,
    });

    project = reorderTimelineClip(project, "clip-creator-proof", "clip-citrus-hook");
    expect(project.timelineClips.map((clip) => clip.id)).toEqual([
      "clip-creator-proof",
      "clip-citrus-hook",
      "clip-dropper-texture",
      "clip-ingredient-bridge",
      "clip-ingredient-close-read",
    ]);
    expect(project.timelineClips.map((clip) => clip.startSeconds)).toEqual([0, 5, 10, 15, 20]);

    project = trimTimelineClip(project, "clip-creator-proof", {
      sourceInSeconds: 1.25,
      sourceOutSeconds: 4.5,
    });
    const trimmed = project.timelineClips[0];
    expect(trimmed.durationSeconds).toBe(3.25);
    expect(project.timelineClips[1].startSeconds).toBe(3.25);
    expect(getClipAtPlayhead(project, 3.1).id).toBe("clip-creator-proof");
    expect(getClipAtPlayhead(project, 3.3).id).toBe("clip-citrus-hook");
  });

  it("updates music and CTA overlay settings used by preview and export", () => {
    let project = createInitialTimelineProject();

    project = updateMusicTrack(project, {
      assetId: "music-clean-glow",
      trimStartSeconds: 4,
      volume: 0.37,
    });
    expect(project.musicTrack).toMatchObject({
      assetId: "music-clean-glow",
      trimStartSeconds: 4,
      volume: 0.37,
      enabled: true,
    });

    project = updateTextOverlay(project, "overlay-main-cta", {
      text: "Tap for the bundle before it sells out",
      startSeconds: 2,
      durationSeconds: 7,
    });
    expect(project.textOverlays[0]).toMatchObject({
      text: "Tap for the bundle before it sells out",
      startSeconds: 2,
      durationSeconds: 7,
    });
  });

  it("serializes metadata while requiring uploaded blobs to be reselected", () => {
    const project = {
      ...createInitialTimelineProject(),
      mediaAssets: [
        ...createInitialTimelineProject().mediaAssets,
        {
          id: "upload-video-1",
          kind: "video",
          sourceType: "upload",
          name: "desk-demo.mp4",
          durationSeconds: 8,
          objectUrl: "blob:http://local/desk-demo",
          file: new File(["demo"], "desk-demo.mp4", { type: "video/mp4" }),
        },
      ],
    };

    const serialized = serializeTimelineProject(project);
    const uploaded = serialized.mediaAssets.find((asset) => asset.id === "upload-video-1");

    expect(uploaded).toMatchObject({
      sourceType: "upload",
      name: "desk-demo.mp4",
      reselectRequired: true,
    });
    expect(uploaded.objectUrl).toBeUndefined();
    expect(uploaded.file).toBeUndefined();

    const restored = deserializeTimelineProject(serialized);
    expect(restored.mediaAssets.find((asset) => asset.id === "upload-video-1")).toMatchObject({
      reselectRequired: true,
      unavailableReason: "Reselect this local file to preview or export it.",
    });
  });
});
