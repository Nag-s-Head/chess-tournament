import { render, screen } from "@testing-library/react";
import LoginPage from "./page";
import { apiClient } from "@/lib/api/api";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/api/api", () => ({
  apiClient: {
    auth: {
      getValidate: jest.fn(),
      getLogin: jest.fn(),
    },
  },
}));

describe("LoginPage", () => {
  const mockGetValidate = apiClient.auth.getValidate as jest.Mock;
  const mockGetLogin = apiClient.auth.getLogin as jest.Mock;
  const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("redirects to /admin when user is already authenticated", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: true },
    });

    // Invoke async server component
    const jsx = await LoginPage();
    render(jsx);

    expect(mockGetValidate).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith("/admin");
  });

  it("renders page with backend-provided OAuth link when user is unauthenticated", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: false },
    });
    mockGetLogin.mockResolvedValueOnce({
      url: "https://github.com/login/oauth/authorize?client_id=mock",
    });

    const jsx = await LoginPage();
    render(jsx);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: /github/i });
    expect(loginLink).toHaveAttribute(
      "href",
      "https://github.com/login/oauth/authorize?client_id=mock",
    );
  });

  it("falls back to error URL when getLogin API call fails", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: false },
    });
    mockGetLogin.mockRejectedValueOnce(new Error("API failure"));

    const jsx = await LoginPage();
    render(jsx);

    const loginLink = screen.getByRole("link", { name: /github/i });
    expect(loginLink).toHaveAttribute(
      "href",
      "/auth/error?reason=backend_error",
    );
    expect(console.error).toHaveBeenCalledWith(
      "Getting Login URL failed",
      expect.any(Error),
    );
  });

  it("falls back to error URL when getLogin returns no URL property", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: false },
    });
    mockGetLogin.mockResolvedValueOnce(null);

    const jsx = await LoginPage();
    render(jsx);

    const loginLink = screen.getByRole("link", { name: /github/i });
    expect(loginLink).toHaveAttribute(
      "href",
      "/auth/error?reason=backend_error",
    );
  });

  it("continues to render page when getValidate check throws an error", async () => {
    mockGetValidate.mockRejectedValueOnce(new Error("Validation endpoint down"));
    mockGetLogin.mockResolvedValueOnce({
      url: "https://github.com/login/oauth/authorize?client_id=fallback",
    });

    const jsx = await LoginPage();
    render(jsx);

    expect(console.error).toHaveBeenCalledWith(
      "Checking if logged in failed",
      expect.any(Error),
    );
    expect(mockRedirect).not.toHaveBeenCalled();

    const loginLink = screen.getByRole("link", { name: /github/i });
    expect(loginLink).toHaveAttribute(
      "href",
      "https://github.com/login/oauth/authorize?client_id=fallback",
    );
  });
});
