import { describe, expect, it } from "vitest";
import {
  buildTimelineMarkers,
  createAuditionShot,
  createGeneratedShot,
  createGeneratedShots,
  createHotspot,
  createTimelineEvent,
  editorSnapshot,
  formatSeconds,
  getGenerationEstimate,
  getChecklistProgress,
  getPeopleReadiness,
  getShotAtTime,
} from "./editorData.js";

describe("editorSnapshot", () => {
  it("models the PixVerse campaign editor with a 30 second real-footage assembled video", () => {
    expect(editorSnapshot.project.title).toBe("AHA BHA PHA 30 Days Miracle Serum Launch");
    expect(editorSnapshot.project.category).toBe("Serum");
    expect(editorSnapshot.video.durationSeconds).toBe(30);
    expect(editorSnapshot.shots).toHaveLength(6);
    expect(editorSnapshot.shots.map((shot) => shot.durationSeconds).reduce((sum, duration) => sum + duration, 0)).toBe(30);
    expect(editorSnapshot.shots.map((shot) => shot.videoAsset)).toEqual([
      "actualVideo1",
      "actualVideo1",
      "actualVideo1",
      "actualVideo2",
      "actualVideo2",
      "actualVideo2",
    ]);
    expect(editorSnapshot.hotspots.map((hotspot) => hotspot.name)).toEqual([
      "AHA BHA PHA Serum",
      "Dropper Detail",
      "Label Proof",
    ]);
  });

  it("computes checklist progress from source-prop completion state", () => {
    expect(getChecklistProgress(editorSnapshot.propsChecklist)).toEqual({
      completed: 3,
      total: 6,
      label: "3/6",
    });
  });

  it("models reusable AI people with selected-profile readiness", () => {
    expect(editorSnapshot.defaultPage).toBe("editor");
    expect(editorSnapshot.aiPeople.defaultGender).toBe("Woman");
    expect(editorSnapshot.aiPeople.creatorProfiles.map((person) => person.name)).toEqual([
      "Maya Chen",
      "Daniel Ong",
      "Jordan Lee",
    ]);
    expect(editorSnapshot.aiPeople.genderOptions.map((option) => option.label)).toEqual([
      "Woman",
      "Man",
      "Non-binary",
    ]);
    expect(editorSnapshot.aiPeople.creatorProfiles.map((person) => person.asset)).toEqual([
      "creatorMaya",
      "creatorDaniel",
      "creatorJordan",
    ]);
    expect(new Set(editorSnapshot.aiPeople.creatorProfiles.map((person) => person.asset)).size).toBe(3);
    expect(
      editorSnapshot.aiPeople.creatorProfiles.find(
        (person) => person.id === editorSnapshot.aiPeople.defaultPersonId,
      )?.gender,
    ).toBe(editorSnapshot.aiPeople.defaultGender);
    expect(editorSnapshot.aiPeople.uploadRequirements).toContain("No minors or private likeness");
    expect(editorSnapshot.aiPeople.readinessChecklist[0]).toMatchObject({
      id: "reference",
      label: "Creator reference selected",
      done: true,
    });
    expect(getPeopleReadiness(editorSnapshot.aiPeople)).toEqual({
      completed: 5,
      total: 5,
      label: "5/5",
    });
    expect(getPeopleReadiness(editorSnapshot.aiPeople, { referenceUploaded: true })).toEqual({
      completed: 5,
      total: 5,
      label: "5/5",
    });
  });

  it("creates timeline markers at deterministic positions", () => {
    expect(buildTimelineMarkers(editorSnapshot.timelineEvents).slice(0, 3)).toEqual([
      { id: "m-1", kind: "hook", left: "0.0%" },
      { id: "m-2", kind: "product", left: "6.7%" },
      { id: "m-3", kind: "benefit", left: "20.0%" },
    ]);
  });

  it("formats seconds and resolves the active shot from the playhead", () => {
    expect(formatSeconds(0)).toBe("00:00");
    expect(formatSeconds(75)).toBe("01:15");
    expect(formatSeconds(12)).toBe("00:12");

    expect(getShotAtTime(editorSnapshot.shots, 12).id).toBe("shot-3");
    expect(getShotAtTime(editorSnapshot.shots, 30).id).toBe("shot-6");
    expect(getShotAtTime(editorSnapshot.shots, -2).id).toBe("shot-1");
  });

  it("creates deterministic generated shots, timeline events, and hotspots", () => {
    const generatedShot = createGeneratedShot(
      editorSnapshot.shots,
      "Macro texture pour with bold price overlay",
    );
    expect(generatedShot).toMatchObject({
      id: "shot-7",
      number: 7,
      start: "0:30",
      startSeconds: 30,
      durationSeconds: 4,
      title: "AI generated proof frame",
      prompt: "Macro texture pour with bold price overlay",
    });

    const event = createTimelineEvent(editorSnapshot.timelineEvents, 12, "cta");
    expect(event).toEqual({
      id: "m-11",
      atSeconds: 12,
      kind: "cta",
      label: "CTA",
    });

    const hotspot = createHotspot(editorSnapshot.hotspots, 12);
    expect(hotspot).toEqual({
      id: "hotspot-4",
      number: 4,
      name: "Shop CTA",
      range: "00:12 - 00:16",
      x: 67,
      y: 58,
    });
  });

  it("estimates guided generation batches and creates sequential sample clips", () => {
    const preset = editorSnapshot.generationPresets.find((item) => item.id === "ugc-proof");
    const estimate = getGenerationEstimate({
      preset,
      sampleCount: 3,
      durationSeconds: 30,
    });

    expect(estimate).toEqual({
      sampleCount: 3,
      durationSeconds: 30,
      durationMultiplier: 2,
      creditsPerSample: 240,
      totalCredits: 720,
      totalDurationSeconds: 90,
      label: "3 samples x 30s",
    });

    const generatedShots = createGeneratedShots(
      editorSnapshot.shots,
      "creator applies serum, macro texture, Shopee CTA",
      {
        durationSeconds: 30,
        preset,
        sampleCount: 3,
      },
    );

    expect(generatedShots).toEqual([
      expect.objectContaining({
        id: "shot-7",
        number: 7,
        start: "0:30",
        startSeconds: 30,
        durationSeconds: 30,
        title: "AI UGC Proof sample 1",
        variantLabel: "Sample 1/3",
      }),
      expect.objectContaining({
        id: "shot-8",
        number: 8,
        start: "1:00",
        startSeconds: 60,
        durationSeconds: 30,
        title: "AI UGC Proof sample 2",
        variantLabel: "Sample 2/3",
      }),
      expect.objectContaining({
        id: "shot-9",
        number: 9,
        start: "1:30",
        startSeconds: 90,
        durationSeconds: 30,
        title: "AI UGC Proof sample 3",
        variantLabel: "Sample 3/3",
      }),
    ]);
  });

  it("creates deterministic AI people audition shots from the selected creator", () => {
    const person = editorSnapshot.aiPeople.creatorProfiles.find((profile) => profile.id === "daniel-ong");
    const auditionShot = createAuditionShot(editorSnapshot.shots, person, {
      scripts: editorSnapshot.aiPeople.auditionScripts,
    });

    expect(auditionShot).toMatchObject({
      id: "shot-7",
      number: 7,
      start: "0:30",
      startSeconds: 30,
      durationSeconds: 12,
      title: "Daniel Ong audition",
      asset: "creatorDaniel",
      audition: true,
      personId: "daniel-ong",
      personName: "Daniel Ong",
      variantLabel: "Man creator audition",
    });
    expect(auditionShot.prompt).toContain("Fast, practical product verdict");
    expect(auditionShot.prompt).toContain("Commerce close");
  });

  it("keeps trend translator briefs compact for right-rail scanning", () => {
    for (const trend of editorSnapshot.trendCards) {
      expect(trend.signal.length).toBeLessThanOrEqual(48);
      expect(trend.shopperIntent.length).toBeLessThanOrEqual(56);
      expect(trend.translation.length).toBeLessThanOrEqual(72);
      expect(trend.example.length).toBeLessThanOrEqual(72);
      expect(trend.hook.length).toBeLessThanOrEqual(56);
      expect(trend.guardrail.length).toBeLessThanOrEqual(56);
      expect(trend.overlayCopy.length).toBeLessThanOrEqual(44);
      expect(trend.cta.length).toBeLessThanOrEqual(52);
      expect(trend.checklist).toHaveLength(3);

      for (const item of trend.checklist) {
        expect(item.length).toBeLessThanOrEqual(30);
      }

      for (const step of trend.shotPlan) {
        expect(step.detail.length).toBeLessThanOrEqual(48);
      }
    }
  });

  it("defines switchable commerce projects for the current project card", () => {
    expect(editorSnapshot.projects.map((project) => project.title)).toEqual([
      "AHA BHA PHA 30 Days Miracle Serum Launch",
      "Cloud Bounce Moisturizer Campaign",
      "Fresh Reset Toner Flash Sale",
    ]);
    expect(editorSnapshot.projects.map((project) => project.category)).toEqual([
      "Serum",
      "Moisturizer",
      "Toner",
    ]);
    expect(new Set(editorSnapshot.projects.map((project) => project.category)).size).toBe(3);

    expect(editorSnapshot.projects[1]).toMatchObject({
      id: "cloud-bounce",
      product: "Cloud Bounce Gel Moisturizer",
      channels: "Shopee - Instagram Reels",
      status: "Brief ready",
    });
  });

  it("defines shot-aware filming review guidance for the current-frame panel", () => {
    const creatorReview = editorSnapshot.filmingReviews?.["shot-3"];

    expect(creatorReview).toMatchObject({
      score: 82,
      verdict: "Strong creator proof",
      priority: "Medium",
      nextSetup: "Lower lens 10-15deg, pull back 6cm, keep serum near left third.",
    });
    expect(creatorReview.metrics.map((metric) => metric.label)).toEqual([
      "Lighting",
      "Camera angle",
      "Headroom",
      "Product read",
    ]);
    expect(creatorReview.priorityFixes.map((fix) => fix.title)).toEqual([
      "Lower camera angle",
      "Open the crop",
    ]);

    expect(editorSnapshot.filmingReviewFallback).toMatchObject({
      score: 78,
      verdict: "Manual review needed",
      priority: "Review",
    });
  });
});
