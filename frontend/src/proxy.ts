import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "./lib/api/api";

export async function proxy(request: NextRequest) {
  try {
    const cookie = request.cookies.get("auth_token");

    // Construct the standard Cookie header format
    const cookieHeader = cookie ? `${cookie.name}=${cookie.value}` : "";

    const resp = await apiClient.auth.getValidate({
      headers: {
        Cookie: cookieHeader,
      },
    });

    const data = resp.data;
    const valid = data?.valid;
    const redirectUrl = data?.url;

    if (valid) {
      return NextResponse.next();
    }

    // Log the parsed data instead of .text() to avoid stream lock errors
    console.error(
      "Access to admin portal by unauthenticated user was attempted.",
      "Response:",
      resp,
    );

    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch (error) {
    console.error("OAuth2 backend communication failed:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
