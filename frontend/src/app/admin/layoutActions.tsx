"use server";

import { apiClient } from "@/lib/api/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  try {
    await apiClient.auth.getLogout({});
  } catch (error: unknown) {
    console.error(
      "Failed to logout server side, clearing cookies, and redirecting regardless",
      error,
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  redirect("/");
}
