import { GET } from "./route";
import { apiClient } from "@/lib/api/api";

// Mock the API client
jest.mock("@/lib/api/api", () => ({
  apiClient: {
    auth: {
      postCallback: jest.fn(),
    },
  },
}));

describe("GET /auth/callback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error in tests to avoid noisy output on the intentional error test
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("redirects to no_code error when code query parameter is missing", async () => {
    const request = new Request("http://localhost:3000/auth/callback");
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toMatch(
      /\/auth\/error\?reason=no_code$/,
    );
    expect(apiClient.auth.postCallback).not.toHaveBeenCalled();
  });

  it("redirects to the provided error URL when the backend says the login is invalid", async () => {
    (apiClient.auth.postCallback as jest.Mock).mockResolvedValueOnce({
      body: {
        valid: false,
        url: "/auth/error?reason=not_member",
      },
    });

    const request = new Request(
      "http://localhost:3000/auth/callback?code=unauthorized_code",
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain(
      "/auth/error?reason=not_member",
    );
    expect(apiClient.auth.postCallback).toHaveBeenCalledWith({
      code: "unauthorized_code",
    });
  });

  it("redirects to token_exchange error when valid is false but no URL is returned", async () => {
    (apiClient.auth.postCallback as jest.Mock).mockResolvedValueOnce({
      body: {
        valid: false,
      },
    });

    const request = new Request(
      "http://localhost:3000/auth/callback?code=invalid_code",
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain(
      "/auth/error?reason=token_exchange",
    );
  });

  it("redirects to admin (default) and sets the auth_token cookie on successful login", async () => {
    (apiClient.auth.postCallback as jest.Mock).mockResolvedValueOnce({
      body: {
        valid: true,
        token: "mock-jwt-token",
        // url omitted to test the fallback to "/admin"
      },
    });

    const request = new Request(
      "http://localhost:3000/auth/callback?code=valid_code",
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/admin");

    // Next.js response.cookies.set() writes to the set-cookie header
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("auth_token=mock-jwt-token");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Secure");
    expect(setCookie).toMatch(/SameSite=Lax/i);
  });

  it("redirects to the backend-provided URL and sets the cookie on successful login", async () => {
    (apiClient.auth.postCallback as jest.Mock).mockResolvedValueOnce({
      body: {
        valid: true,
        token: "mock-jwt-token-2",
        url: "/custom-dashboard",
      },
    });

    const request = new Request(
      "http://localhost:3000/auth/callback?code=valid_code",
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain("/custom-dashboard");
  });

  it("redirects to db_error when apiClient throws an exception", async () => {
    (apiClient.auth.postCallback as jest.Mock).mockRejectedValueOnce(
      new Error("Network failure"),
    );

    const request = new Request(
      "http://localhost:3000/auth/callback?code=error_code",
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toContain(
      "/auth/error?reason=db_error",
    );
    expect(console.error).toHaveBeenCalledWith(
      "Failed to execute postCallback via apiClient:",
      expect.any(Error),
    );
  });
});
