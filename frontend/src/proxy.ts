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

    const valid = apiResponse.data?.valid;
    const redirectUrl = apiResponse.data?.url;

    if (valid) {
      return NextResponse.next();
    }

    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl);
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
