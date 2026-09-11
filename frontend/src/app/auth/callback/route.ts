import { apiClient } from "@/lib/api/api";
import { Logger } from "@/lib/logger/logger";
import { NextResponse, NextRequest } from "next/server";

const logger = new Logger();

export async function GET(request: NextRequest) {
  const externalUrl = process.env.FRONTEND_EXTERNAL_BASE_URL;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?reason=no_code", externalUrl),
    );
  }

  try {
    const resp = await apiClient.auth.postCallback({
      code,
    });

    const data = resp.data;

    if (!data?.valid) {
      const errorPath = data?.url || "/auth/error?reason=token_exchange";
      return NextResponse.redirect(new URL(errorPath, externalUrl), {
        status: 307,
      });
    }

    const redirectPath = data?.url || "/admin";
    const response = NextResponse.redirect(new URL(redirectPath, externalUrl), {
      status: 307,
    });

    if (data?.token) {
      response.cookies.set({
        name: "auth_token",
        value: data.token,
        path: "/",
        httpOnly: process.env.TEST_MODE !== "true",
        secure: true,
        sameSite: "strict",
      });
    }

    return response;
  } catch (error: unknown) {
    logger.error("Failed to execute postCallback via apiClient:", { error });
    return NextResponse.redirect(
      new URL("/auth/error?reason=db_error", externalUrl),
    );
  }
}
