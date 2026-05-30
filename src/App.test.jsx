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

    expect(screen.getByText("Preview 36s")).toBeInTheDocument();
    expect(screen.getByTestId("social-preview-title")).toHaveTextContent("Social Preview");
    expect(screen.getByRole("heading", { name: /Filming Tips/i })).toBeInTheDocument();
    expect(screen.getByText("Shot readiness")).toBeInTheDocument();
    expect(screen.getByText("Shot 3 - 00:11 to 00:17")).toBeInTheDocument();
    expect(screen.getByText("Medium priority")).toBeInTheDocument();
    expect(screen.getByText("Safe crop")).toBeInTheDocument();
    expect(screen.getByText("Priority fixes")).toBeInTheDocument();
    expect(screen.getByText("Lower camera angle")).toBeInTheDocument();
    expect(screen.getByText("Open the crop")).toBeInTheDocument();
    expect(screen.getByText("Next setup")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ai people models & consent/i }));

    expect(screen.getByRole("heading", { name: "UGC AI People" })).toBeInTheDocument();
    expect(screen.getByLabelText("Upload model reference")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Creator Casting" })).toBeInTheDocument();
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
    expect(screen.getByText("Gender intent: Man")).toBeInTheDocument();
    expect(screen.getByTestId("selected-person-name")).toHaveTextContent("Daniel Ong");
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("generates a selected creator audition into the editor shot strip", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /ai people models & consent/i }));
    await user.click(screen.getByRole("button", { name: "Use Daniel Ong" }));
    await user.click(screen.getByRole("button", { name: "Generate audition" }));

    expect(screen.getByRole("status")).toHaveTextContent("Audition generated: Daniel Ong (12s)");
    expect(screen.getByText("Shots (7)")).toBeInTheDocument();
    expect(screen.getByText("48.0s")).toBeInTheDocument();

    const shotStrip = screen.getByText("Shots (7)").closest("section");
    expect(shotStrip).not.toBeNull();
    expect(within(shotStrip).getByText("Daniel Ong audition")).toBeInTheDocument();
  });

  it("guides AI generation and appends 30-second sample clips", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "AI Generate" }));

    expect(screen.getByRole("heading", { name: "AI Generate Studio" })).toBeInTheDocument();
    expect(screen.getByText("2 samples x 30s")).toBeInTheDocument();
    expect(screen.getByText("480 credits total")).toBeInTheDocument();
    expect(screen.getByText("Checks run before each sample enters the shot strip.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "3 samples" }));
    expect(screen.getByText("720 credits total")).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/generation prompt/i),
      "Macro texture pour with bold price overlay",
    );
    await user.click(screen.getByRole("button", { name: /macro serum texture pour/i }));
    await user.click(screen.getByRole("button", { name: "Generate samples" }));

    expect(screen.getByRole("status")).toHaveTextContent("Generation queued: 3 samples x 30s");
    expect(screen.getByText("Shots (9)")).toBeInTheDocument();
    expect(screen.getByText("126.0s")).toBeInTheDocument();
    expect(screen.getByText("1,730")).toBeInTheDocument();

    const shotStrip = screen.getByText("Shots (9)").closest("section");
    expect(shotStrip).not.toBeNull();
    expect(within(shotStrip).getByText("AI UGC Proof sample 1")).toBeInTheDocument();
    expect(within(shotStrip).getByText("AI UGC Proof sample 2")).toBeInTheDocument();
    expect(within(shotStrip).getByText("AI UGC Proof sample 3")).toBeInTheDocument();
  });
});
