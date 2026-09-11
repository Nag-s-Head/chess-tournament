import { render, screen } from "@testing-library/react";
import AuthErrorPage from "./page";

describe("AuthErrorPage", () => {
  it("renders layout structure with heading, login link, and footer", () => {
    render(<AuthErrorPage searchParams={{ reason: "not_member" }} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("renders successfully when reason key exists in map", () => {
    render(<AuthErrorPage searchParams={{ reason: "not_member" }} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).not.toBe("");
  });

  it("falls back gracefully when reason is unknown", () => {
    render(<AuthErrorPage searchParams={{ reason: "unknown_reason_code" }} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).not.toBe("");
  });

  it("falls back gracefully when reason is empty or undefined", () => {
    render(<AuthErrorPage searchParams={{}} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).not.toBe("");
  });

  it("falls back gracefully when searchParams is undefined", () => {
    render(<AuthErrorPage />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).not.toBe("");
  });

  it("contains a navigation link targeting the sign-in page", () => {
    render(<AuthErrorPage searchParams={{ reason: "invalid_session" }} />);

    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toHaveAttribute("href", "/auth/login");
  });
});
