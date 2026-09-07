"use server";
import { apiClient } from "@/lib/api/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import setCookieParser from "set-cookie-parser";

export async function doLogin(token: string) {
  const resp = await apiClient.auth.getCallback({ code: token });

  const rawCookies = resp.headers.getSetCookie();

  if (rawCookies && rawCookies.length > 0) {
    const parsedCookies = setCookieParser.parse(rawCookies);
    const cookieStore = await cookies();

    for (const cookie of parsedCookies) {
      cookieStore.set({
        name: cookie.name,
        value: cookie.value,
        path: cookie.path || "/",
        expires: cookie.expires,
        maxAge: cookie.maxAge,
        domain: cookie.domain,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite as
          "lax" | "strict" | "none" | boolean | undefined,
      });
    }
  }

  redirect("/login");
}
