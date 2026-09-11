import { apiClient } from "@/lib/api/api";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/auth/error?reason=no_code");
  }

  try {
    const resp = await apiClient.auth.postCallback({
      code,
    });

    const data = resp.data;

    if (!data?.valid) {
      const errorUrl = data?.url || "/auth/error?reason=token_exchange";
      return NextResponse.redirect(errorUrl, {
        status: 307,
      });
    }

    const redirectUrl = data?.url || "/admin";
    const response = NextResponse.redirect(redirectUrl, {
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
    return NextResponse.redirect("/auth/error?reason=db_error");
  }
}
