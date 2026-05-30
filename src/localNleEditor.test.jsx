import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

const remotionPlayers = vi.hoisted(() => []);

vi.mock("@remotion/player", () => ({
  Player: React.forwardRef(function MockPlayer(props, ref) {
    const handleRef = React.useRef(null);

    if (!handleRef.current) {
      const listeners = new Map();

      handleRef.current = {
        currentFrame: props.initialFrame || 0,
        props,
        seekCalls: [],
        addEventListener(name, callback) {
          listeners.set(name, [...(listeners.get(name) || []), callback]);
        },
        emit(name, detail) {
          for (const callback of listeners.get(name) || []) {
            callback({ detail });
          }
        },
        emitFrame(frame, { advanceAfterEmit = 0 } = {}) {
          this.currentFrame = frame;
          this.emit("frameupdate", { frame });
          this.currentFrame = frame + advanceAfterEmit;
        },
        getCurrentFrame() {
          return this.currentFrame;
        },
        removeEventListener(name, callback) {
          listeners.set(name, (listeners.get(name) || []).filter((item) => item !== callback));
        },
        seekTo(frame) {
          this.seekCalls.push(frame);
          this.currentFrame = frame;
          this.emit("seeked", { frame });
        },
      };
      remotionPlayers.push(handleRef.current);
    }

    handleRef.current.props = props;
    React.useImperativeHandle(ref, () => handleRef.current);

    return (
      <div
        className={props.className}
        data-loop={String(Boolean(props.loop))}
        data-testid={props.className === "campaign-nle-player" ? "campaign-nle-remotion-player" : "remotion-player"}
      >
        Remotion viewer {props.inputProps.project.aspectRatio} playhead {props.inputProps.project.playheadSeconds}
      </div>
    );
  }),
}));

describe("local NLE editor route", () => {
  beforeEach(() => {
    remotionPlayers.length = 0;
    localStorage.clear();
    window.history.pushState({}, "", "/");
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("PixVerse balance API unavailable in unit tests");
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("routes the home page to the editor and removes the legacy top editor", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/editor");
    });
    expect(screen.getByTestId("campaign-nle-bay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Remotion Timeline" })).toBeInTheDocument();
    expect(screen.getByTestId("social-preview-title")).toHaveTextContent("Social Preview");
    expect(screen.queryByText("Preview 30s")).not.toBeInTheDocument();
    expect(screen.queryByText(/Shots \(/)).not.toBeInTheDocument();
    expect(screen.queryByText("AI Generate")).not.toBeInTheDocument();
    expect(screen.queryByText("Product Hotspots")).not.toBeInTheDocument();
    expect(container.querySelector(".davinci-shell")).toBeNull();
    expect(screen.queryByRole("heading", { name: "ViralForge Edit" })).not.toBeInTheDocument();
    expect(await screen.findByText("Using demo fallback")).toBeInTheDocument();
  });

  it("redirects the legacy campaign route to the editor page", async () => {
    window.history.pushState({}, "", "/campaign");
    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/editor");
    });
    expect(screen.getByTestId("campaign-nle-bay")).toBeInTheDocument();
    expect(screen.queryByText("Preview 30s")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ViralForge Edit" })).not.toBeInTheDocument();
    expect(await screen.findByText("Using demo fallback")).toBeInTheDocument();
  });

  it("routes directly to AI People and navigates back through the sidebar", async () => {
    const user = userEvent.setup();

    window.history.pushState({}, "", "/ai-people");
    render(<App />);

    expect(window.location.pathname).toBe("/ai-people");
    expect(screen.getByRole("heading", { name: "UGC AI People" })).toBeInTheDocument();
    expect(screen.getByText(/Pick a licensed AI creator/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /editor edit & generate/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/editor");
    });
    expect(screen.getByRole("heading", { name: "Remotion Timeline" })).toBeInTheDocument();
    expect(screen.getByTestId("social-preview-title")).toHaveTextContent("Social Preview");
  });

  it("uses the local NLE playhead as the TikTok clock without looping the embedded player", async () => {
    render(<App />);

    const nlePlayer = await waitFor(() => {
      const player = remotionPlayers.find((item) => item.props.className === "campaign-nle-player");
      expect(player).toBeTruthy();
      return player;
    });

    expect(nlePlayer.props.loop).toBe(false);

    act(() => {
      nlePlayer.emitFrame(12 * nlePlayer.props.fps);
    });

    await waitFor(() => {
      expect(nlePlayer.props.inputProps.project.playheadSeconds).toBe(12);
    });
    expect(screen.getByLabelText(/Handheld serum hold TikTok synced preview/i)).toBeInTheDocument();
  });

  it("does not seek the embedded player back to stale playback frames", async () => {
    render(<App />);

    const nlePlayer = await waitFor(() => {
      const player = remotionPlayers.find((item) => item.props.className === "campaign-nle-player");
      expect(player).toBeTruthy();
      return player;
    });

    act(() => {
      nlePlayer.seekCalls.length = 0;
      nlePlayer.emitFrame(15, { advanceAfterEmit: 12 });
    });

    await waitFor(() => {
      expect(nlePlayer.props.inputProps.project.playheadSeconds).toBe(0.5);
    });
    expect(nlePlayer.seekCalls).toEqual([]);
  });

  it("still seeks the embedded player when the user jumps on the timeline", async () => {
    render(<App />);

    const nlePlayer = await waitFor(() => {
      const player = remotionPlayers.find((item) => item.props.className === "campaign-nle-player");
      expect(player).toBeTruthy();
      return player;
    });

    fireEvent.change(screen.getByLabelText(/jump to embedded timeline time/i), {
      target: { value: "12.5" },
    });
    fireEvent.click(screen.getByLabelText(/apply embedded timeline seek/i));

    await waitFor(() => {
      expect(nlePlayer.seekCalls).toContain(375);
    });
  });

  it("keeps the standalone local NLE available for focused testing", () => {
    window.history.pushState({}, "", "/local-editor");
    render(<App />);

    expect(screen.getByRole("heading", { name: "ViralForge Edit" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Media Pool" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Program Monitor" })).toBeInTheDocument();
    expect(screen.getByTestId("remotion-player")).toHaveTextContent("Remotion viewer 9:16");
    expect(screen.queryByText("Preview 30s")).not.toBeInTheDocument();
  });

  it("redirects the legacy local NLE query string to the standalone editor route", async () => {
    window.history.pushState({}, "", "/?workspace=local-nle");
    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/local-editor");
    });
    expect(screen.getByRole("heading", { name: "ViralForge Edit" })).toBeInTheDocument();
  });
});
