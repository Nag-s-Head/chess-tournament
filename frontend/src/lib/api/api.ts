import { Api } from "./api.gen";

const apiUrl = process.env["INTERNAL_API_URL"];

export function getApiClient() {
  const api = new Api({
    baseUrl: apiUrl,
    customFetch: (input, init?) => {
      return fetch(input, {
        cache: "no-cache",
        ...init,
      });
    },
  });

  return api;
}
