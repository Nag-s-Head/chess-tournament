import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

jest.mock("@/lib/api/api", () => ({
  apiClient: {
    auth: {
      getValidate: jest.fn().mockResolvedValue({
        data: { valid: false, status: "Login", url: "/auth/test-mode" },
      }),
    },
  },
}));

describe("Login Page", () => {
  it("renders login title", async () => {
    render(await LoginPage());
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Admin Portal");
  });

  it("renders GitHub login link pointing to validate-returned URL", async () => {
    render(await LoginPage());
    const loginLink = screen.getByRole("link", {
      name: /continue with github/i,
    });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/test-mode");
  });
});
