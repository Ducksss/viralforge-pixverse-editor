import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
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
        addEventListener(name, callback) {
          listeners.set(name, [...(listeners.get(name) || []), callback]);
        },
        emit(name, detail) {
          for (const callback of listeners.get(name) || []) {
            callback({ detail });
          }
        },
        emitFrame(frame) {
          this.currentFrame = frame;
          this.emit("frameupdate", { frame });
        },
        getCurrentFrame() {
          return this.currentFrame;
        },
        removeEventListener(name, callback) {
          listeners.set(name, (listeners.get(name) || []).filter((item) => item !== callback));
        },
        seekTo(frame) {
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

  it("renders the local NLE as the default editor and removes the legacy top editor", async () => {
    const { container } = render(<App />);

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

  it("keeps the legacy campaign route on the old workspace", async () => {
    window.history.pushState({}, "", "/campaign");
    render(<App />);

    expect(screen.getByTestId("campaign-nle-bay")).toBeInTheDocument();
    expect(screen.queryByText("Preview 30s")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ViralForge Edit" })).not.toBeInTheDocument();
    expect(await screen.findByText("Using demo fallback")).toBeInTheDocument();
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

  it("keeps the standalone local NLE available for focused testing", () => {
    window.history.pushState({}, "", "/local-editor");
    render(<App />);

    expect(screen.getByRole("heading", { name: "ViralForge Edit" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Media Pool" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Program Monitor" })).toBeInTheDocument();
    expect(screen.getByTestId("remotion-player")).toHaveTextContent("Remotion viewer 9:16");
    expect(screen.queryByText("Preview 30s")).not.toBeInTheDocument();
  });
});
