import { proxy, config } from "./proxy";
import { apiClient } from "./lib/api/api";

jest.mock("./lib/api/api", () => ({
  apiClient: {
    auth: {
      getValidate: jest.fn(),
    },
  },
}));

jest.mock("next/server", () => {
  return {
    NextResponse: {
      next: jest.fn(() => ({ status: 200, type: "next" })),
      redirect: jest.fn((url: URL | string) => ({
        status: 307,
        type: "redirect",
        headers: new Map([["location", url.toString()]]),
      })),
    },
  };
});

describe("Proxy Middleware", () => {
  const mockGetValidate = apiClient.auth.getValidate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exports correct matcher config", () => {
    expect(config.matcher).toBe("/admin/:path*");
  });

  it("bypasses auth validation for /admin/test-mode", async () => {
    const mockReq = {
      nextUrl: { pathname: "/admin/test-mode" },
      url: "http://localhost:3000/admin/test-mode",
      headers: new Map(),
    } as unknown as Parameters<typeof proxy>[0];

    const res = await proxy(mockReq);

    expect(mockGetValidate).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("redirects to login url when status is Login", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: false, status: "Login", url: "/admin/testMode" },
    });

    const mockReq = {
      nextUrl: { pathname: "/admin/dashboard" },
      url: "http://localhost:3000/admin/dashboard",
      headers: new Map(),
    } as unknown as Parameters<typeof proxy>[0];

    const res = await proxy(mockReq);

    expect(mockGetValidate).toHaveBeenCalled();
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/admin/testMode");
  });

  it("allows navigation when status is Valid", async () => {
    mockGetValidate.mockResolvedValueOnce({
      data: { valid: true, status: "Valid" },
    });

    const mockReq = {
      nextUrl: { pathname: "/admin/dashboard" },
      url: "http://localhost:3000/admin/dashboard",
      headers: new Map([["cookie", "admin-authentication=secret"]]),
    } as unknown as Parameters<typeof proxy>[0];

    const res = await proxy(mockReq);

    expect(mockGetValidate).toHaveBeenCalledWith({
      headers: {
        cookie: "admin-authentication=secret",
      },
    });
    expect(res.status).toBe(200);
  });
});
