import { describe, expect, it } from "vitest";
import { inspectMediaFile } from "./media.js";

describe("media inspection", () => {
  it("extracts video metadata through Mediabunny-compatible dependencies", async () => {
    class FakeBlobSource {
      constructor(blob) {
        this.blob = blob;
      }
    }

    class FakeInput {
      constructor(options) {
        this.options = options;
      }

      async canRead() {
        return true;
      }

      async computeDuration() {
        return 12.45;
      }

      async getPrimaryVideoTrack() {
        return {
          getDisplayWidth: async () => 1920,
          getDisplayHeight: async () => 1080,
          getRotation: async () => 0,
          computePacketStats: async () => ({ averagePacketRate: 29.97 }),
        };
      }

      async getPrimaryAudioTrack() {
        return null;
      }
    }

    const file = new File(["video"], "routine.mp4", { type: "video/mp4" });
    const asset = await inspectMediaFile(file, {
      BlobSource: FakeBlobSource,
      Input: FakeInput,
      formats: ["mp4"],
      createObjectURL: () => "blob://routine",
      idFactory: () => "upload-routine",
    });

    expect(asset).toMatchObject({
      id: "upload-routine",
      kind: "video",
      sourceType: "upload",
      name: "routine.mp4",
      durationSeconds: 12.45,
      width: 1920,
      height: 1080,
      frameRate: 29.97,
      objectUrl: "blob://routine",
    });
  });

  it("falls back to safe metadata when a local file cannot be parsed", async () => {
    class UnreadableInput {
      async canRead() {
        return false;
      }
    }

    const file = new File(["bad"], "unknown.mov", { type: "video/quicktime" });
    const asset = await inspectMediaFile(file, {
      BlobSource: class {},
      Input: UnreadableInput,
      formats: ["mov"],
      createObjectURL: () => "blob://unknown",
      idFactory: () => "upload-fallback",
    });

    expect(asset).toMatchObject({
      id: "upload-fallback",
      kind: "video",
      sourceType: "upload",
      name: "unknown.mov",
      durationSeconds: 6,
      width: 1080,
      height: 1920,
      frameRate: 30,
      warning: "Metadata could not be parsed; using a safe editable placeholder.",
    });
  });
});
