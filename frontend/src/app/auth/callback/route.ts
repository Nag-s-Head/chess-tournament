import { apiClient } from "@/lib/api/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?reason=no_code", request.url),
    );
  }

  try {
    const data = await apiClient.auth.postCallback({
      code,
    });

    if (!data?.valid) {
      const errorUrl = data?.url || "/auth/error?reason=token_exchange";
      return NextResponse.redirect(new URL(errorUrl, request.url), {
        status: 307,
      });
    }

    const redirectUrl = data?.url || "/admin";
    const response = NextResponse.redirect(new URL(redirectUrl, request.url), {
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
  } catch (err) {
    console.error("Failed to execute postCallback via apiClient:", err);
    return NextResponse.redirect(
      new URL("/auth/error?reason=db_error", request.url),
    );
  }
}
