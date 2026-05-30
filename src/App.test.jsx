import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

describe("ViralForge editor", () => {
  it("renders the AI People workspace and keeps the PixVerse editor reachable", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "ViralForge" })).toBeInTheDocument();
    expect(screen.getByText("Summer Glow Skincare - PixVerse Campaign")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "UGC AI People" })).toBeInTheDocument();
    expect(screen.getByLabelText("Upload model reference")).toBeInTheDocument();
    expect(screen.getByText("Creator Casting")).toBeInTheDocument();
    expect(screen.getByText("Generation Readiness")).toBeInTheDocument();
    expect(screen.getByText("Consent & Usage Guardrails")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /editor edit & generate/i }));
    expect(screen.getByText("Preview 36s")).toBeInTheDocument();
    expect(screen.getByText("Social Preview")).toBeInTheDocument();
    expect(screen.getByText("Gen Z Trend Translator")).toBeInTheDocument();
    expect(screen.getByText("Product Hotspots")).toBeInTheDocument();
    expect(screen.getByTestId("frame-feedback-title")).toHaveTextContent("Frame Feedback");
    expect(screen.getByText("Listing Assets")).toBeInTheDocument();
  });

  it("supports uploading a model reference, changing gender, and selecting a person", async () => {
    const user = userEvent.setup();
    render(<App />);

    const file = new File(["face reference"], "maya-reference.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Upload model reference"), file);

    expect(screen.getByText("maya-reference.png")).toBeInTheDocument();
    expect(screen.getByText("Reference ready")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Non-binary" }));
    expect(screen.getByRole("button", { name: "Non-binary" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Gender intent: Non-binary")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Use Jordan Lee" }));
    expect(screen.getByTestId("selected-person-name")).toHaveTextContent("Jordan Lee");
    expect(screen.getByText("Creator fit: 89%")).toBeInTheDocument();
  });

  it("updates selected shot feedback and prop progress through real UI state", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /editor edit & generate/i }));
    await user.click(screen.getByRole("button", { name: /select shot 2/i }));
    expect(screen.getByTestId("frame-feedback-title")).toHaveTextContent("Shot 2 - 00:05");

    expect(screen.getByText("3/6")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /white marble tray/i }));
    expect(screen.getByText("4/6")).toBeInTheDocument();
  });
});
