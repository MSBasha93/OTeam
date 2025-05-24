const BASE_URL = 'http://localhost:4000';

export async function api<T>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
  body?: any,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }

  return res.json();
}
