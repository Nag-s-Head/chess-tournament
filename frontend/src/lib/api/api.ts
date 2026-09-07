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
  customFetch: async (input, init?) => {
    const baseUrl = getBaseUrl();
    let url = typeof input === "string" ? input : input.toString();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    const headers = new Headers(init?.headers);

    if (typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        if (cookieString) {
          headers.set("cookie", cookieString);
        }
      } catch {
        // Safe fallback if called outside of a request-scoped context
      }
    }

    return fetch(url, {
      cache: "no-cache",
      credentials: "include",
      mode: "cors",
      ...init,
      headers,
    });
  },
});
