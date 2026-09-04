import { render, screen } from "@testing-library/react";
import AuthErrorPage from "./page";

describe("Auth Error Page", () => {
  it("renders default error message when no reason given", async () => {
    render(await AuthErrorPage({}));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Authentication Error"
    );
    expect(screen.getByRole("link", { name: /back to sign in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("renders not_member error message", async () => {
    render(
      await AuthErrorPage({ searchParams: Promise.resolve({ reason: "not_member" }) })
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Access Denied");
  });

  it("renders invalid_session error message", async () => {
    render(
      await AuthErrorPage({
        searchParams: Promise.resolve({ reason: "invalid_session" }),
      })
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Invalid Session"
    );
  });
});
