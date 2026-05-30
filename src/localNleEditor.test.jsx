import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

vi.mock("@remotion/player", () => ({
  Player: ({ inputProps }) => (
    <div data-testid="remotion-player">
      Remotion viewer {inputProps.project.aspectRatio}
    </div>
  ),
}));

describe("local NLE editor route", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the desktop editor as the default app surface", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ViralForge Edit" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Media Pool" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Program Monitor" })).toBeInTheDocument();
    expect(screen.getByTestId("remotion-player")).toHaveTextContent("Remotion viewer 9:16");
    expect(screen.getByRole("heading", { name: "Inspector" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Timeline" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Creator Casting" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export 9:16 MP4" })).toBeInTheDocument();
  });
});
