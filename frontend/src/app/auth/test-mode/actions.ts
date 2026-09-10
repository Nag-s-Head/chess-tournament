"use server";
import { apiClient } from "@/lib/api/api";
import { redirect } from "next/navigation";

export async function doLogin(token: string) {
  const data = await apiClient.auth.postCallback({ code: token });

  if (!data.valid || !data.token) {
    redirect(data.url ?? "/auth/error?reason=backend");
  }

  cookieStore.set({
    name: "auth_token",
    value: data.token,
    path: "/",
    expires: 60 * 60,
    sameSite: "strict",
  });

  redirect("/admin");
}
