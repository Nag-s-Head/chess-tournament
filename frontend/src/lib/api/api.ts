import { Api } from "./api.gen";

const apiUrl = process.env["INTERNAL_API_URL"];

export const apiClient = new Api({
  baseUrl: apiUrl,
  customFetch: (input, init?) => {
    return fetch(input, {
      cache: "no-cache",
      credentials: "include",
      mode: "cors",
      ...init,
    });
  },
});
