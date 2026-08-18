import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the ticket button", () => {
    render(<Page />);

    const ticketLink = screen.getByRole("link", { name: /get tickets/i });
    expect(ticketLink).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<Page />);

    const footerNav = screen.getByRole("navigation", {
      name: /footer/i,
    });
    expect(footerNav).toBeInTheDocument();
  });
});
