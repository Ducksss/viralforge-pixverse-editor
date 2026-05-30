import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./CampaignWorkspaceApp.jsx";

describe("PixVerse balance sync", () => {
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

  it("syncs the sidebar balance from the local PixVerse API proxy", async () => {
    render(<App />);

    expect(await screen.findByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("1,000 monthly + 250 package")).toBeInTheDocument();
    expect(screen.getByText("Synced PixVerse API")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/pixverse/balance", {
      headers: { Accept: "application/json" },
    });
  });
});
