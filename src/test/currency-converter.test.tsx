import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "@/App";

describe("Currency converter page", () => {
  it("renders the converter route", () => {
    window.history.pushState({}, "", "/currency-converter");

    render(<App />);

    expect(screen.getByText(/currency converter/i)).toBeInTheDocument();
  });
});
