import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "./lib/api/api";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/test-mode") {
    return NextResponse.next();
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const apiResponse = await apiClient.auth.getValidate({
      headers: {
        cookie: cookieHeader,
      },
      format: "json",
    });

    const valid = apiResponse.data?.valid;
    const redirectUrl = apiResponse.data?.url;

    if (valid) {
      return NextResponse.next();
    }

    console.error(
      "Access to admin portal by unathenticated user was attempted",
    );
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    console.error("OAuth2 backend communication failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
