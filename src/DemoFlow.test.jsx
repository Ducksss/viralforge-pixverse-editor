import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import DemoFlow from "./DemoFlow.jsx";

const demoData = {
  product: {
    name: "Sunbyme Miracle Serum",
  },
  story: "POV: you finally found the serum that works",
  tone: "Authentic",
  characters: [
    {
      image: "/creator-maya.png",
      name: "Maya Tan",
      style: "Relatable",
    },
  ],
};

function createDataTransfer() {
  const data = new Map();

  return {
    dropEffect: "move",
    effectAllowed: "move",
    getData(type) {
      return data.get(type) || "";
    },
    setData(type, value) {
      data.set(type, value);
    },
  };
}

describe("DemoFlow video review editor action", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds an edit video action that opens the drag/drop timeline editor", async () => {
    const user = userEvent.setup();

    render(<DemoFlow data={demoData} initialView="editor" />);

    const editButton = screen.getByRole("button", {
      name: "Edit video in drag and drop timeline",
    });

    expect(editButton).toHaveClass("btn-editor");

    await user.click(editButton);

    const nle = screen.getByTestId("campaign-nle-bay");

    expect(within(nle).getByRole("heading", { name: "Remotion Timeline" })).toBeInTheDocument();
    expect(within(nle).getByText("Media Pool")).toBeInTheDocument();
    expect(within(nle).getAllByText("Product Close-up").length).toBeGreaterThan(0);
    expect(screen.getByText("Local timeline")).toBeInTheDocument();
    expect(screen.getByText("Ready to edit")).toBeInTheDocument();
  });

  it("supports reordering generated video clips through drag and drop", async () => {
    const user = userEvent.setup();

    render(<DemoFlow data={demoData} initialView="editor" />);

    await user.click(screen.getByRole("button", {
      name: "Edit video in drag and drop timeline",
    }));

    const nle = screen.getByTestId("campaign-nle-bay");
    const initialClipTitles = Array.from(nle.querySelectorAll(".campaign-nle-clip strong"))
      .map((element) => element.textContent);

    expect(initialClipTitles.slice(0, 2)).toEqual(["Product Close-up", "Texture dropper"]);

    const [firstClip, secondClip] = nle.querySelectorAll(".campaign-nle-clip");
    const dataTransfer = createDataTransfer();

    fireEvent.dragStart(firstClip, { dataTransfer });
    fireEvent.drop(secondClip, { dataTransfer });

    await waitFor(() => {
      const reorderedClipTitles = Array.from(nle.querySelectorAll(".campaign-nle-clip strong"))
        .map((element) => element.textContent);

      expect(reorderedClipTitles.slice(0, 2)).toEqual(["Texture dropper", "Product Close-up"]);
    });
    expect(screen.getByText("Local timeline reordered")).toBeInTheDocument();
  });
});
