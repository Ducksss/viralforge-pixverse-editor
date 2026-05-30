import { describe, expect, it } from "vitest";
import { buildTimelineMarkers, editorSnapshot, getChecklistProgress } from "./editorData.js";

describe("editorSnapshot", () => {
  it("models the PixVerse campaign editor with a 36 second assembled video", () => {
    expect(editorSnapshot.project.title).toBe("Summer Glow Skincare - PixVerse Campaign");
    expect(editorSnapshot.video.durationSeconds).toBe(36);
    expect(editorSnapshot.shots).toHaveLength(6);
    expect(editorSnapshot.shots.map((shot) => shot.durationSeconds).reduce((sum, duration) => sum + duration, 0)).toBe(36);
    expect(editorSnapshot.hotspots.map((hotspot) => hotspot.name)).toEqual([
      "Vitamin C Serum",
      "Dropper Detail",
      "Glow Result",
    ]);
  });

  it("computes checklist progress from source-prop completion state", () => {
    expect(getChecklistProgress(editorSnapshot.propsChecklist)).toEqual({
      completed: 3,
      total: 6,
      label: "3/6",
    });
  });

  it("creates timeline markers at deterministic positions", () => {
    expect(buildTimelineMarkers(editorSnapshot.timelineEvents).slice(0, 3)).toEqual([
      { id: "m-1", kind: "hook", left: "0.0%" },
      { id: "m-2", kind: "product", left: "5.6%" },
      { id: "m-3", kind: "benefit", left: "16.7%" },
    ]);
  });
});
