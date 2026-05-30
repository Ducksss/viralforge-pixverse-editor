import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CampaignWorkspaceApp from "./CampaignWorkspaceApp.jsx";

vi.mock("./pixverseBalanceClient.js", () => ({
  fetchPixVerseBalanceSnapshot: vi.fn(async () => ({
    accountId: "acct-test",
    creditMonthly: 1000,
    creditPackage: 250,
    fetchedAt: "2026-05-30T00:00:00.000Z",
    source: "pixverse-api",
    totalCredits: 1250,
  })),
}));

async function openAiPeoplePage() {
  const user = userEvent.setup();
  render(<CampaignWorkspaceApp />);

  await user.click(screen.getByRole("button", { name: /AI People Models & consent/i }));

  return user;
}

describe("CampaignWorkspaceApp AI People page", () => {
  it("shows distinct creator references and keeps selected creator gender in sync", async () => {
    const user = await openAiPeoplePage();

    expect(screen.getByRole("heading", { name: "UGC AI People" })).toBeInTheDocument();

    const creatorFrames = [
      screen.getByRole("img", { name: "Maya Chen creator frame" }),
      screen.getByRole("img", { name: "Daniel Ong creator frame" }),
      screen.getByRole("img", { name: "Jordan Lee creator frame" }),
    ];

    expect(new Set(creatorFrames.map((image) => image.getAttribute("src"))).size).toBe(3);

    await user.click(screen.getByRole("button", { name: "Use Jordan Lee" }));

    expect(screen.getByTestId("selected-person-name")).toHaveTextContent("Jordan Lee");
    expect(screen.getByText("Creator gender: Non-binary")).toBeInTheDocument();
    expect(screen.getByText("Gender intent: Non-binary")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Non-binary" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Sage overshirt")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Man" }));

    expect(screen.getByTestId("selected-person-name")).toHaveTextContent("Daniel Ong");
    expect(screen.getByText("Creator gender: Man")).toBeInTheDocument();
    expect(screen.getByText("Gender intent: Man")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Man" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Navy overshirt")).toBeInTheDocument();
  });
});
