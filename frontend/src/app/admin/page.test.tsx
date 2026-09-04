import { render, screen } from "@testing-library/react";
import AdminPage from "./page";

describe("Admin Page", () => {
  it("renders 'You are logged in' placeholder", () => {
    render(<AdminPage />);
    const heading = screen.getByRole("heading", { name: /you are logged in/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders sign out link", () => {
    render(<AdminPage />);
    const logoutLink = screen.getByRole("link", { name: /sign out/i });
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute("href", "/auth/logout");
  });
});
