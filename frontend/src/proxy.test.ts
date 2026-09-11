/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { proxy, config } from "./proxy";
import { apiClient } from "./lib/api/api";
import { NextRequest } from "next/server";

jest.mock("./lib/api/api", () => ({
  apiClient: {
    auth: {
      getValidate: jest.fn(),
    },
  },
}));

describe("Proxy Middleware", () => {
  const mockGetValidate = apiClient.auth.getValidate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("exports correct matcher config", () => {
    expect(config.matcher).toEqual(["/admin", "/admin/:path*"]);
  });

  it("allows navigation when auth validation succeeds (valid: true)", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: true },
    });

    const req = new NextRequest("http://localhost:3000/admin/dashboard", {
      headers: {
        cookie: "auth_token=valid-jwt-token",
      },
    });

    const res = await proxy(req);

    expect(mockGetValidate).toHaveBeenCalledWith({
      headers: {
        Cookie: "auth_token=valid-jwt-token",
      },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("passes empty Cookie header when auth_token cookie is absent", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: true },
    });

    const req = new NextRequest("http://localhost:3000/admin/dashboard");

    await proxy(req);

    expect(mockGetValidate).toHaveBeenCalledWith({
      headers: {
        Cookie: "",
      },
    });
  });

  it("redirects to the backend-provided URL when valid is false and url is present", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: {
        valid: false,
        url: "/auth/error?reason=unauthorized",
      },
    });

    const req = new NextRequest("http://localhost:3000/admin/dashboard");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/auth/error?reason=unauthorized",
    );
    expect(console.error).toHaveBeenCalledWith(
      "Access to admin portal by unauthenticated user was attempted.",
      "Response:",
      expect.anything(),
    );
  });

  it("redirects to /auth/login fallback when valid is false and no url is provided", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: false },
    });

    const req = new NextRequest("http://localhost:3000/admin/dashboard");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/auth/login",
    );
  });

  it("redirects to /auth/login when apiClient throws an exception", async () => {
    mockGetValidate.mockRejectedValueOnce(new Error("Network connection lost"));

    const req = new NextRequest("http://localhost:3000/admin/dashboard");
    const res = await proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/auth/login",
    );
    expect(console.error).toHaveBeenCalledWith(
      "OAuth2 backend communication failed:",
      expect.any(Error),
    );
  });
});
