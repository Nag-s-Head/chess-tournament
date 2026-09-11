"use server";
import { apiClient } from "@/lib/api/api";
import { Logger } from "@/lib/logger/logger";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const logger = new Logger();

export async function logout() {
  try {
    await apiClient.auth.getLogout({});
  } catch (error: unknown) {
    logger.error(
      "Failed to logout server side, clearing cookies, and redirecting regardless",
      { error },
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  redirect("/");
}
