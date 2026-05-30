import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SetupWizard, { DEFAULT_PRODUCT_STORY } from "./SetupWizard.jsx";

describe("SetupWizard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("prefills the product story prompt for the Summer Glow campaign", async () => {
    vi.useFakeTimers();
    render(<SetupWizard onComplete={vi.fn()} />);

    // URL is now pre-filled with somebymi, just click scan
    fireEvent.click(screen.getByRole("button", { name: /scan for products/i }));

    // Advance through scanning animation
    await act(async () => {
      vi.advanceTimersByTime(3700);
    });

    // Now we land on brand-profile step, click Continue to go to product selection
    expect(screen.getByRole("heading", { name: "Your brand identity" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByRole("heading", { name: "Select your product" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Summer Glow Vitamin C Serum/i })).toHaveClass("selected");

    fireEvent.click(screen.getByRole("button", { name: /create campaign/i }));

    expect(screen.getByLabelText("Product Description")).toHaveValue(DEFAULT_PRODUCT_STORY);
    expect(screen.getByRole("button", { name: /build my video/i })).toBeEnabled();
  });
});
