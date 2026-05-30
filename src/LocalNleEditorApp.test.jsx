import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { exportTimelineProject } from "./export/mediabunnyExport.js";

vi.mock("@remotion/player", () => ({
  Player: ({ inputProps }) => (
    <div data-testid="remotion-player">
      Remotion viewer {inputProps.project.aspectRatio} {inputProps.project.textOverlays[0].text}
    </div>
  ),
}));

vi.mock("./export/mediabunnyExport.js", async () => {
  const actual = await vi.importActual("./export/mediabunnyExport.js");
  return {
    ...actual,
    exportTimelineProject: vi.fn(async (project, { onProgress } = {}) => {
      onProgress?.({ stage: "encoding", progress: 0.5 });
      onProgress?.({ stage: "complete", progress: 1 });
      return {
        blob: new Blob(["mp4"], { type: "video/mp4" }),
        durationSeconds: 23,
        fileName: "viralforge-summer-glow-9x16.mp4",
        mimeType: "video/mp4",
      };
    }),
  };
});

describe("DaVinci-style local editor", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/local-editor");
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the focused NLE workspace with commerce assistant context", () => {
    render(<App />);

    expect(screen.getByText("ViralForge Edit")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Media Pool" })).toBeInTheDocument();
    expect(screen.getByTestId("remotion-player")).toHaveTextContent("Remotion viewer 9:16");
    expect(screen.getByRole("heading", { name: "Inspector" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Timeline" })).toBeInTheDocument();
    expect(screen.getByText("Trend Beats")).toBeInTheDocument();
    expect(screen.getAllByText("AI Safe").length).toBeGreaterThan(0);
  });

  it("adds clips from the media pool, reorders timeline clips, and trims the selected clip", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /add ingredient close read to timeline/i }));
    expect(screen.getByRole("button", { name: /timeline clip ingredient close read/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /timeline clip handheld serum hold/i }));
    await user.click(screen.getByRole("button", { name: /move selected clip earlier/i }));
    await user.click(screen.getByRole("button", { name: /move selected clip earlier/i }));

    const videoTrack = screen.getByTestId("video-track");
    const clipButtons = within(videoTrack).getAllByRole("button", { name: /timeline clip/i });
    expect(clipButtons[0]).toHaveAccessibleName(/handheld serum hold/i);

    await user.clear(screen.getByLabelText(/source out/i));
    await user.type(screen.getByLabelText(/source out/i), "14.5");
    expect(screen.getByText("Selected duration: 4.5s")).toBeInTheDocument();
  }, 10000);

  it("edits music and CTA overlay state shared by preview, timeline, and persistence", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.selectOptions(screen.getByLabelText(/music track/i), "music-clean-glow");
    await user.clear(screen.getByLabelText(/music volume/i));
    await user.type(screen.getByLabelText(/music volume/i), "37");
    await user.clear(screen.getByLabelText(/cta text/i));
    await user.type(screen.getByLabelText(/cta text/i), "Tap for the bundle before it sells out");

    expect(screen.getByTestId("remotion-player")).toHaveTextContent("Tap for the bundle before it sells out");
    await waitFor(() => {
      expect(screen.getByText("Music: Clean Glow Loop at 37%")).toBeInTheDocument();
    });

    unmount();
    render(<App />);

    expect(screen.getByLabelText(/cta text/i)).toHaveValue("Tap for the bundle before it sells out");
    expect(screen.getByLabelText(/music volume/i)).toHaveValue(37);
  }, 10000);

  it("imports local media as session assets and marks them for reselect after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.upload(
      screen.getByLabelText(/import local media/i),
      new File(["not-a-real-video"], "desk-demo.mp4", { type: "video/mp4" }),
    );

    expect(await screen.findByText("desk-demo.mp4")).toBeInTheDocument();

    unmount();
    render(<App />);

    expect(screen.getByText("desk-demo.mp4")).toBeInTheDocument();
    expect(screen.getByText("Reselect required")).toBeInTheDocument();
  });

  it("exports the shared timeline project through the Mediabunny orchestration layer", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /export 9:16 mp4/i }));

    await waitFor(() => {
      expect(exportTimelineProject).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole("status", { name: /export status/i })).toHaveTextContent("Export complete");
    expect(screen.getByText("viralforge-summer-glow-9x16.mp4")).toBeInTheDocument();
    expect(exportTimelineProject.mock.calls[0][0]).toMatchObject({
      aspectRatio: "9:16",
      musicTrack: expect.objectContaining({ enabled: true }),
      textOverlays: [expect.objectContaining({ id: "overlay-main-cta" })],
    });
  });
});
