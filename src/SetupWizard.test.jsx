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

    fireEvent.change(screen.getByPlaceholderText("https://yourstore.com"), {
      target: { value: "https://summerglow.example" },
    });
    fireEvent.click(screen.getByRole("button", { name: /scan for products/i }));

    await act(async () => {
      vi.advanceTimersByTime(3700);
    });

    expect(screen.getByRole("heading", { name: "Select your product" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Summer Glow Vitamin C Serum/i })).toHaveClass("selected");

    fireEvent.click(screen.getByRole("button", { name: /create campaign/i }));

    expect(screen.getByLabelText("Product Description")).toHaveValue(DEFAULT_PRODUCT_STORY);
    expect(screen.getByRole("button", { name: /build my video/i })).toBeEnabled();
  });
});
