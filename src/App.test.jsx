import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import SetupWizard from "./SetupWizard.jsx";


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

  it("supports header commands, playback controls, and timeline sync", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /editor edit & generate/i }));
    await user.click(screen.getByRole("button", { name: /rename project/i }));
    await user.clear(screen.getByLabelText(/project title/i));
    await user.type(screen.getByLabelText(/project title/i), "TikTok Glow Relaunch");
    await user.click(screen.getByRole("button", { name: /save project title/i }));
    expect(screen.getByText("TikTok Glow Relaunch")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /aspect ratio/i }));
    await user.click(screen.getByRole("menuitem", { name: /9:16 vertical/i }));
    expect(screen.getByTestId("social-preview-title")).toHaveTextContent("(9:16)");

    await user.click(screen.getByRole("button", { name: /export campaign/i }));
    await user.click(screen.getByRole("menuitem", { name: /publish package/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Export queued");

    await user.click(screen.getByRole("button", { name: /share campaign/i }));
    await user.click(screen.getByRole("menuitem", { name: /copy review link/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Review link copied");

    await user.click(screen.getByRole("button", { name: /play video/i }));
    expect(screen.getByRole("button", { name: /pause video/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /skip to next shot/i }));
    expect(screen.getByText("00:17 / 00:36")).toBeInTheDocument();
    expect(screen.getByTestId("frame-feedback-title")).toHaveTextContent("Shot 4 - 00:17");

    await user.click(screen.getByRole("button", { name: /turn captions on/i }));
    expect(screen.getByText("Captions on")).toBeInTheDocument();
  });

  it("runs AI generation and appends a generated shot to the editor", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /editor edit & generate/i }));
    await user.click(screen.getByRole("button", { name: /AI Generate/i }));
    expect(screen.getByRole("heading", { name: /AI Generate Studio/i })).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/generation prompt/i),
      "Macro texture pour with bold price overlay",
    );
    await user.click(screen.getByRole("button", { name: /UGC Proof/i }));
    await user.click(screen.getByRole("button", { name: /generate shot/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Generation queued");
    expect(screen.getByText("Shots (7)")).toBeInTheDocument();
    expect(screen.getByText("AI generated proof frame")).toBeInTheDocument();
    expect(screen.getByText("2,330")).toBeInTheDocument();
  });

  it("manages hotspots, timeline markers, trend cards, and listing assets", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /editor edit & generate/i }));
    await user.click(screen.getByRole("button", { name: /add timeline event/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Timeline marker added at 00:12");

    await user.click(screen.getByRole("button", { name: /add hotspot/i }));
    expect(screen.getByText("Shop CTA")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /edit Shop CTA/i }));
    await user.clear(screen.getByLabelText(/hotspot name/i));
    await user.type(screen.getByLabelText(/hotspot name/i), "Bundle CTA");
    await user.click(screen.getByRole("button", { name: /save hotspot/i }));
    expect(screen.getByText("Bundle CTA")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete Dropper Detail/i }));
    expect(screen.queryByText("Dropper Detail")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next trend/i }));
    expect(screen.getByText(/Morning routine angle/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /description tab/i }));
    expect(screen.getByText(/Brighten and even your skin/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /SEO keywords tab/i }));
    expect(screen.getByText("brightening serum")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /regenerate listing assets/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Listing assets regenerated");
    await user.click(screen.getByRole("button", { name: /copy listing assets/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Listing assets copied");
  });

  it("supports the full onboarding wizard flow and returns configuration", async () => {
    const user = userEvent.setup();
    const handleComplete = vi.fn();
    render(<SetupWizard onComplete={handleComplete} />);

    // Screen 1: Login
    expect(screen.getByText("Welcome to ViralForge")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/email address/i), "seller@brand.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in with tiktok shop/i }));


    // Screen 2: Connecting loader
    expect(screen.getByText("Connecting to TikTok Shop…")).toBeInTheDocument();

    // Wait for the loader to finish (1.5s delay)
    await waitFor(() => {
      expect(screen.getByText("Select your product")).toBeInTheDocument();
    }, { timeout: 2000 });

    // Click on a product card to select it (e.g. Matte Finish Setting Spray)
    const productCard = screen.getByRole("button", { name: /matte finish setting spray/i });
    await user.click(productCard);

    // Click Create Campaign
    await user.click(screen.getByRole("button", { name: /create campaign/i }));

    // Screen 3: Product Story
    expect(screen.getByText("What's your product story?")).toBeInTheDocument();
    
    // Choose tone pill
    await user.click(screen.getByRole("button", { name: "Funny" }));

    // Click trending hook suggestion chip
    await user.click(screen.getByRole("button", { name: /skincare gatekeepers/i }));

    // Textarea should contain hook text
    const textarea = screen.getByLabelText(/product description/i);
    expect(textarea).toHaveValue("Skincare gatekeepers are going to be so mad at this");

    // Click Build my video
    await user.click(screen.getByRole("button", { name: /build my video/i }));

    // Screen 4: Choose Character
    expect(screen.getByText("Who's telling your story?")).toBeInTheDocument();

    // Select avatar card (e.g., Zoe)
    await user.click(screen.getByRole("button", { name: /zoe/i }));

    // Click Generate video
    await user.click(screen.getByRole("button", { name: /generate video/i }));

    expect(handleComplete).toHaveBeenCalledWith(expect.objectContaining({
      product: expect.objectContaining({ name: "Matte Finish Setting Spray" }),
      story: "Skincare gatekeepers are going to be so mad at this",
      tone: "Funny",
      character: expect.objectContaining({ name: "Zoe" })
    }));
  });
});
