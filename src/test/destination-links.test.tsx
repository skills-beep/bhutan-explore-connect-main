import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Index from "@/pages/Index";

describe("Explore Bhutan cards", () => {
  it("links each destination card to its detail page", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /explore paro valley/i });
    expect(link).toHaveAttribute("href", "/destinations/paro");
  });
});
