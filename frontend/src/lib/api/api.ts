import "server-only";
import { Api } from "./api.gen";

function getBaseUrl(): string {
  let apiUrl = process.env.INTERNAL_API_URL || "http://127.0.0.1:8081";
  if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
    apiUrl = `http://${apiUrl}`;
  }
  return apiUrl.replace(/\/+$/, "");
}

export const apiClient = new Api({
  baseUrl: getBaseUrl(),
  baseApiParams: {
    cache: "no-store",
    format: "json",
  },
});
