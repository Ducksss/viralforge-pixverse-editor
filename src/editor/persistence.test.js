import { describe, expect, it } from "vitest";
import { createInitialTimelineProject, updateTextOverlay } from "./timeline.js";
import { loadTimelineProject, saveTimelineProject } from "./persistence.js";

describe("timeline persistence", () => {
  it("round-trips editable project metadata through storage", () => {
    const storage = new Map();
    const localStorageLike = {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    };
    const project = updateTextOverlay(createInitialTimelineProject(), "overlay-main-cta", {
      text: "Last day for the Shopee bundle",
    });

    saveTimelineProject(project, localStorageLike);
    const restored = loadTimelineProject(localStorageLike);

    expect(restored.textOverlays[0].text).toBe("Last day for the Shopee bundle");
    expect(restored.timelineClips).toHaveLength(project.timelineClips.length);
    expect(restored.musicTrack.assetId).toBe(project.musicTrack.assetId);
  });
});
