import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

describe("ViralForge editor", () => {
  it("renders the accepted PixVerse campaign editor surface", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ViralForge" })).toBeInTheDocument();
    expect(screen.getByText("Summer Glow Skincare - PixVerse Campaign")).toBeInTheDocument();
    expect(screen.getByText("Preview 36s")).toBeInTheDocument();
    expect(screen.getByText("Social Preview")).toBeInTheDocument();
    expect(screen.getByText("Gen Z Trend Translator")).toBeInTheDocument();
    expect(screen.getByText("Product Hotspots")).toBeInTheDocument();
    expect(screen.getByTestId("frame-feedback-title")).toHaveTextContent("Frame Feedback");
    expect(screen.getByText("Listing Assets")).toBeInTheDocument();
  });

  it("updates selected shot feedback and prop progress through real UI state", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /select shot 2/i }));
    expect(screen.getByTestId("frame-feedback-title")).toHaveTextContent("Shot 2 - 00:05");

    expect(screen.getByText("3/6")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /white marble tray/i }));
    expect(screen.getByText("4/6")).toBeInTheDocument();
  });
});
