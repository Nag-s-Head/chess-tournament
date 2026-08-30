import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "./lib/api/api";

export async function proxy(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!bearerToken) {
    try {
      const apiResponse = await apiClient.authValidate.getValidate();

      if (!apiResponse.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("OAuth2 backend communication failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
