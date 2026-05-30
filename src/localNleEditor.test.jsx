import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

vi.mock("@remotion/player", async () => {
  const React = await vi.importActual("react");
  return {
    Player: React.forwardRef(({ inputProps }, ref) => {
      React.useImperativeHandle(ref, () => ({ seekTo: () => {} }));
      return (
        <div data-testid="remotion-player">
          Remotion viewer {inputProps.project.aspectRatio}
        </div>
      );
    }),
  };
});

describe("local NLE editor route", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("PixVerse balance API unavailable in unit tests");
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the legacy campaign editor by default with the local NLE spliced in", async () => {
    const { container } = render(<App />);

    expect(screen.getByText("Preview 30s")).toBeInTheDocument();
    expect(screen.getByTestId("campaign-nle-bay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Remotion Timeline" })).toBeInTheDocument();
    expect(screen.getByText("Product Hotspots")).toBeInTheDocument();
    expect(screen.getByTestId("social-preview-title")).toHaveTextContent("Social Preview");
    expect(container.querySelector(".davinci-shell")).toBeNull();
    expect(screen.queryByRole("heading", { name: "ViralForge Edit" })).not.toBeInTheDocument();
    expect(await screen.findByText("Using demo fallback")).toBeInTheDocument();
  });

  it("keeps the legacy campaign route on the old workspace", async () => {
    window.history.pushState({}, "", "/campaign");
    render(<App />);

    expect(screen.getByText("Preview 30s")).toBeInTheDocument();
    expect(screen.getByTestId("campaign-nle-bay")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ViralForge Edit" })).not.toBeInTheDocument();
    expect(await screen.findByText("Using demo fallback")).toBeInTheDocument();
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
