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
  customFetch: (input, init?) => {
    const baseUrl = getBaseUrl();
    let url = typeof input === "string" ? input : input.toString();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return fetch(url, {
      cache: "no-cache",
      credentials: "include",
      mode: "cors",
      ...init,
    });
  },
});
