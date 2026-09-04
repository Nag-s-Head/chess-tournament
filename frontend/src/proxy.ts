import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "./lib/api/api";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/test-mode") {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const authHeader = request.headers.get("authorization");

  try {
    const apiResponse = await apiClient.auth.getValidate({
      headers: {
        cookie: cookieHeader,
        ...(authHeader ? { authorization: authHeader } : {}),
      },
    });

    const status = apiResponse.data?.status;
    const valid = apiResponse.data?.valid;
    const redirectUrl = apiResponse.data?.url;

    if (status === "Valid" || valid === true) {
      return NextResponse.next();
    }

    if (status === "Login" || valid === false) {
      if (redirectUrl) {
        if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {
          return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    console.error("OAuth2 backend communication failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/admin/:path*",
};
