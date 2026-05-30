import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./CampaignWorkspaceApp.jsx";

describe("ViralForge campaign workspace", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("PixVerse balance API unavailable in unit tests");
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens directly on the editor while keeping AI People reachable", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("heading", { name: "Remotion Timeline" })).toBeInTheDocument();
    expect(screen.getByTestId("social-preview-title")).toHaveTextContent("Social Preview");
    expect(screen.queryByText("Preview 30s")).not.toBeInTheDocument();
    expect(screen.queryByText("AI Generate")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Filming Tips/i })).toBeInTheDocument();
    expect(screen.getByText("Shot readiness")).toBeInTheDocument();
    expect(screen.getByText("Shot 1 - 00:00 to 00:05")).toBeInTheDocument();
    expect(screen.getByText("Low priority")).toBeInTheDocument();
    expect(screen.getByText("Clean product opener")).toBeInTheDocument();
    expect(screen.getByText("Priority fixes")).toBeInTheDocument();
    expect(screen.getByText("Lock the label")).toBeInTheDocument();
    expect(screen.getByText("Reduce prop noise")).toBeInTheDocument();
    expect(screen.getByText("Next setup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ai people models & consent/i }));

    expect(screen.getByRole("heading", { name: "UGC AI People" })).toBeInTheDocument();
    expect(screen.getByText(/Pick a licensed AI creator/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Upload model reference")).toBeInTheDocument();
    expect(screen.getByText("Using selected creator reference")).toBeInTheDocument();
    expect(screen.getByText("Profile ready")).toBeInTheDocument();
    expect(screen.getAllByText("Creator reference selected")).toHaveLength(2);
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Creator Casting" })).toBeInTheDocument();
    expect(screen.getByText("Reusable licensed AI creators for UGC campaign variants")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Generation Readiness" })).toBeInTheDocument();
  });

  it("updates people reference, gender, and selected creator state locally", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /ai people models & consent/i }));
    await user.upload(
      screen.getByLabelText("Upload model reference"),
      new File(["portrait"], "maya-reference.webp", { type: "image/webp" }),
    );
    await user.click(screen.getByRole("button", { name: "Man" }));
    await user.click(screen.getByRole("button", { name: "Use Daniel Ong" }));

    expect(screen.getByText("maya-reference.webp")).toBeInTheDocument();
    expect(screen.getByText("Custom reference ready")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("Gender intent: Man")).toBeInTheDocument();
    expect(screen.getByTestId("selected-person-name")).toHaveTextContent("Daniel Ong");
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("generates a selected creator audition into the local NLE timeline", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /ai people models & consent/i }));
    await user.click(screen.getByRole("button", { name: "Use Daniel Ong" }));
    await user.click(screen.getByRole("button", { name: "Generate audition" }));

    expect(screen.getByRole("status")).toHaveTextContent("Audition generated: Daniel Ong (12s)");
    expect(screen.queryByText("Shots (7)")).not.toBeInTheDocument();

    const nle = screen.getByTestId("campaign-nle-bay");
    expect(within(nle).getAllByText("Daniel Ong audition").length).toBeGreaterThan(0);
    expect(within(nle).getByText("0:42")).toBeInTheDocument();
  });

  it("adds campaign media directly inside the primary local NLE", async () => {
    const user = userEvent.setup();

    render(<App />);

    const nle = screen.getByTestId("campaign-nle-bay");
    const ingredientAssetCard = within(nle).getAllByText(/Ingredient close read/i)[0].closest(".campaign-nle-asset");
    expect(ingredientAssetCard).not.toBeNull();
    await user.click(within(ingredientAssetCard).getAllByRole("button")[0]);

    expect(screen.getByRole("status")).toHaveTextContent(/Ingredient close read added to local timeline/i);
    expect(within(nle).getAllByText(/Ingredient close read/i).length).toBeGreaterThan(2);
    expect(within(nle).getByText("0:35")).toBeInTheDocument();
  });

  it("renders the trend translator as a compact trend brief", async () => {
    render(<App />);

    await screen.findByText("Using demo fallback");

    const heading = screen.getByRole("heading", { name: /trend brief beta/i });
    const panel = heading.closest("section");

    expect(panel).not.toBeNull();
    expect(within(panel).getByText("Proof first. Deal second.")).toBeInTheDocument();
    expect(within(panel).getByText("15s plan")).toBeInTheDocument();
    expect(within(panel).queryByText(/Gen Z loves simple/i)).not.toBeInTheDocument();
    expect(within(panel).queryByText(/Avoid poreless skin claims/i)).not.toBeInTheDocument();
  });
});
