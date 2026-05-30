import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EditorApp from "./App.jsx";
import CampaignWorkspaceApp from "./CampaignWorkspaceApp.jsx";

vi.mock("@remotion/player", async () => {
  const React = await vi.importActual("react");
  return {
    Player: React.forwardRef(({ inputProps }, ref) => {
      React.useImperativeHandle(ref, () => ({ seekTo: () => {} }));
      return (
        <div data-testid="remotion-player">
          Remotion viewer {inputProps.project.aspectRatio} {inputProps.project.textOverlays[0].text}
        </div>
      );
    }),
  };
});

function assertIndependentCollapse(panels) {
  expect(panels.length).toBeGreaterThan(0);

  for (const panel of panels) {
    expect(panel.content()).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: panel.collapse }));
    expect(panel.query()).not.toBeInTheDocument();
  }

  fireEvent.click(screen.getByRole("button", { name: panels[0].expand }));

  expect(panels[0].content()).toBeInTheDocument();
  for (const panel of panels.slice(1)) {
    expect(panel.query()).not.toBeInTheDocument();
  }
}

describe("right rail collapsible panels", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn(async () =>
      Response.json({
        accountId: 42,
        creditMonthly: 1000,
        creditPackage: 250,
        fetchedAt: "2026-05-30T05:23:00.000Z",
        source: "pixverse-api",
        totalCredits: 1250,
      }),
    ));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("collapses every campaign right rail panel independently", async () => {
    render(<CampaignWorkspaceApp />);

    await screen.findByText("Synced PixVerse API");

    assertIndependentCollapse([
      { collapse: /collapse trend brief/i, expand: /expand trend brief/i, content: () => screen.getByText(/what's the vibe/i), query: () => screen.queryByText(/what's the vibe/i) },
      { collapse: /collapse top performing videos/i, expand: /expand top performing videos/i, content: () => screen.getByText("Glass Skin in 3 Steps"), query: () => screen.queryByText("Glass Skin in 3 Steps") },
      { collapse: /collapse filming tips/i, expand: /expand filming tips/i, content: () => screen.getByText("Shot readiness"), query: () => screen.queryByText("Shot readiness") },
      { collapse: /collapse props sourcing checklist/i, expand: /expand props sourcing checklist/i, content: () => screen.getByText("White marble tray"), query: () => screen.queryByText("White marble tray") },
      { collapse: /collapse listing assets/i, expand: /expand listing assets/i, content: () => screen.getByText("Images (6)"), query: () => screen.queryByText("Images (6)") },
    ]);
  }, 10000);

  it("collapses every local editor assistant block independently", () => {
    window.history.pushState({}, "", "/local-editor");
    render(<EditorApp />);

    assertIndependentCollapse([
      { collapse: /collapse creator casting/i, expand: /expand creator casting/i, content: () => screen.getByRole("button", { name: /generate audition/i }), query: () => screen.queryByRole("button", { name: /generate audition/i }) },
      { collapse: /collapse trend beats/i, expand: /expand trend beats/i, content: () => screen.getByText(/0s hook needs product/i), query: () => screen.queryByText(/0s hook needs product/i) },
      { collapse: /collapse filming review/i, expand: /expand filming review/i, content: () => screen.getByText("Coverage"), query: () => screen.queryByText("Coverage") },
      { collapse: /collapse compliance/i, expand: /expand compliance/i, content: () => screen.getByText(/No medical claim/i), query: () => screen.queryByText(/No medical claim/i) },
    ]);
  });
});
