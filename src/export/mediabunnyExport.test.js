import { describe, expect, it, vi } from "vitest";
import { addAudioAssetToTimeline, createInitialTimelineProject, updateTextOverlay } from "../editor/timeline.js";
import {
  buildExportPlan,
  ExportCanceledError,
  exportTimelineProject,
  getClipVisualSourceSeconds,
} from "./mediabunnyExport.js";

function createMediabunnyMocks({ canEncode = true } = {}) {
  const calls = {
    audioAdds: 0,
    finalized: false,
    frames: [],
    tracks: [],
  };

  class FakeOutput {
    constructor({ target }) {
      this.target = target;
    }

    addVideoTrack(source, metadata) {
      calls.tracks.push({ type: "video", metadata });
      this.videoSource = source;
    }

    addAudioTrack(source, metadata) {
      calls.tracks.push({ type: "audio", metadata });
      this.audioSource = source;
    }

    async start() {}

    async finalize() {
      calls.finalized = true;
      this.target.buffer = new Uint8Array([1, 2, 3]).buffer;
    }

    async getMimeType() {
      return "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"";
    }
  }

  class FakeCanvasSource {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.config = config;
    }

    async add(timestamp, duration) {
      calls.frames.push({ timestamp, duration });
    }
  }

  class FakeAudioBufferSource {
    constructor(config) {
      this.config = config;
    }

    async add(buffer) {
      calls.audioAdds += 1;
      calls.audioBuffer = buffer;
    }
  }

  class FakeBufferTarget {
    constructor() {
      this.buffer = null;
    }
  }

  return {
    calls,
    deps: {
      AudioBufferSource: FakeAudioBufferSource,
      BufferTarget: FakeBufferTarget,
      CanvasSource: FakeCanvasSource,
      Mp4OutputFormat: class {},
      Output: FakeOutput,
      QUALITY_HIGH: "quality-high",
      canEncodeAudio: vi.fn(async () => canEncode),
      canEncodeVideo: vi.fn(async () => canEncode),
      createAudioBuffer: () => ({ duration: 20, numberOfChannels: 2 }),
      createCanvas: () => ({
        width: 0,
        height: 0,
        getContext: () => ({
          clearRect: vi.fn(),
          drawImage: vi.fn(),
          fillRect: vi.fn(),
          fillText: vi.fn(),
          measureText: () => ({ width: 120 }),
          restore: vi.fn(),
          save: vi.fn(),
        }),
      }),
      loadVisual: async () => ({ kind: "placeholder", title: "frame" }),
    },
  };
}

describe("Mediabunny export orchestration", () => {
  it("builds a 9:16 export plan from timeline state", () => {
    const project = updateTextOverlay(createInitialTimelineProject(), "overlay-main-cta", {
      text: "Tap for the bundle",
    });

    expect(buildExportPlan(project)).toMatchObject({
      width: 1080,
      height: 1920,
      fps: 30,
      durationSeconds: 20,
      frameCount: 600,
      music: expect.objectContaining({ assetId: "music-glass-skin" }),
      audioTracks: [expect.objectContaining({ assetId: "music-glass-skin", trackId: "A1" })],
      overlays: [expect.objectContaining({ text: "Tap for the bundle" })],
    });
  });

  it("exports all placed audio clips instead of only the legacy music setting", () => {
    const project = addAudioAssetToTimeline(createInitialTimelineProject(), "music-clean-glow");

    expect(buildExportPlan(project)).toMatchObject({
      durationSeconds: 40,
      frameCount: 1200,
      audioTracks: [
        expect.objectContaining({ assetId: "music-glass-skin", startSeconds: 0 }),
        expect.objectContaining({ assetId: "music-clean-glow", startSeconds: 20 }),
      ],
    });
  });

  it("freezes the visual source frame when audio extends past the V1 edit", () => {
    const project = addAudioAssetToTimeline(createInitialTimelineProject(), "music-clean-glow");
    const lastClip = project.timelineClips.at(-1);

    expect(buildExportPlan(project).durationSeconds).toBe(40);
    expect(getClipVisualSourceSeconds(lastClip, 30, project.fps)).toBeCloseTo(
      lastClip.sourceOutSeconds - (1 / project.fps),
      4,
    );
  });

  it("renders video frames, mixes music, reports progress, and returns an MP4 blob", async () => {
    const { calls, deps } = createMediabunnyMocks();
    const progress = [];

    const result = await exportTimelineProject(createInitialTimelineProject(), {
      deps,
      onProgress: (event) => progress.push(event),
    });

    expect(calls.tracks.map((track) => track.type)).toEqual(["video", "audio"]);
    expect(calls.frames).toHaveLength(600);
    expect(calls.audioAdds).toBe(1);
    expect(calls.finalized).toBe(true);
    expect(progress.at(-1)).toMatchObject({ stage: "complete", progress: 1 });
    expect(result.blob).toBeInstanceOf(Blob);
    expect(result.fileName).toBe("viralforge-summer-glow-9x16.mp4");
  });

  it("fails early when browser encoding support is unavailable", async () => {
    const { deps } = createMediabunnyMocks({ canEncode: false });

    await expect(exportTimelineProject(createInitialTimelineProject(), { deps })).rejects.toThrow(
      "This browser cannot encode the required MP4 video/audio tracks.",
    );
  });

  it("honors cancellation before encoding starts", async () => {
    const { deps } = createMediabunnyMocks();
    const signal = AbortSignal.abort();

    await expect(exportTimelineProject(createInitialTimelineProject(), { deps, signal })).rejects.toBeInstanceOf(
      ExportCanceledError,
    );
  });
});
