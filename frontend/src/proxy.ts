import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "./lib/api/api";
import { Logger } from "./lib/logger/logger";

const externalUrl = process.env.FRONTEND_EXTERNAL_BASE_URL;
const logger = new Logger();

export async function proxy(request: NextRequest) {
  const baseUrl = externalUrl || request.url;

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

    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, baseUrl));
    }

    return NextResponse.redirect(new URL("/auth/login", baseUrl));
  } catch (error) {
    logger.error("OAuth2 backend communication failed", { error });
    return NextResponse.redirect(new URL("/auth/login", baseUrl));
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
