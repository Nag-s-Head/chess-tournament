import { GET } from "./[...path]/route";

jest.mock("next/server", () => ({
  NextResponse: jest.fn((body, init) => ({
    status: init?.status || 200,
    statusText: init?.statusText || "OK",
    headers: new Headers(init?.headers),
    body,
  })),
}));

describe("Auth Proxy Route", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("proxies request to backend and forwards headers and status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 307,
      statusText: "Temporary Redirect",
      headers: new Headers({
        location: "/admin/testMode",
        "set-cookie": "admin-authentication=test-key; Path=/",
      }),
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    } as unknown as Response);

    const req = {
      url: "http://localhost:3000/auth/login",
      method: "GET",
      headers: new Headers(),
      blob: jest.fn(),
    } as unknown as Request;

    const res = (await GET(req)) as unknown as { status: number; headers: Headers };

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("/admin/testMode");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "GET",
        redirect: "manual",
      })
    );
  });
});
