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
  customFetch: async (input, init) => {
    const baseUrl = getBaseUrl();
    let url = typeof input === "string" ? input : input.toString();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      ...init,
    });

    if (response.ok) {
      const clone = response.clone();
      try {
        const json = await clone.json();
        const headers = new Headers(response.headers);
        headers.set("content-type", "application/json");

        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch {
        // Body was not JSON, return original response
      }
    }

    return response;
  },
});
