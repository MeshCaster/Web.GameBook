import { supabase } from "../auth/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

async function getAccessToken(): Promise<string | undefined> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  } catch {
    return undefined;
  }
}

async function refreshAccessToken(): Promise<string | undefined> {
  try {
    const { data: { session } } = await supabase.auth.refreshSession();
    return session?.access_token;
  } catch {
    return undefined;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const url = `${API_BASE}${path}`;

  const doFetch = (token?: string) =>
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

  let token = await getAccessToken();
  let res = await doFetch(token);

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      res = await doFetch(token);
    }
  }

  if (!res.ok) {
    await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
