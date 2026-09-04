import { NextResponse } from "next/server";

function getBackendUrl(): string {
  let apiUrl = process.env.INTERNAL_API_URL || "http://127.0.0.1:8081";
  if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
    apiUrl = `http://${apiUrl}`;
  }
  return apiUrl.replace(/\/+$/, "");
}

async function proxyAuthRequest(request: Request) {
  const backendBase = getBackendUrl();
  const url = new URL(request.url);
  const targetUrl = `${backendBase}${url.pathname}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.blob();

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["transfer-encoding", "content-encoding"].includes(lowerKey)) {
        responseHeaders.append(key, value);
      }
    });

    const setCookieHeader = backendRes.headers.getSetCookie();
    if (setCookieHeader && setCookieHeader.length > 0) {
      responseHeaders.delete("set-cookie");
      for (const cookieStr of setCookieHeader) {
        responseHeaders.append("set-cookie", cookieStr);
      }
    }

    const resBody = await backendRes.arrayBuffer();

    return new NextResponse(resBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Failed to proxy auth request to backend:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const GET = (req: Request) => proxyAuthRequest(req);
export const POST = (req: Request) => proxyAuthRequest(req);
export const PUT = (req: Request) => proxyAuthRequest(req);
export const DELETE = (req: Request) => proxyAuthRequest(req);
