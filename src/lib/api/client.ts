const API_BASE = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> },
): Promise<T> {
  const url = new URL(path, API_BASE);
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) =>
      url.searchParams.set(k, v),
    );
  }

  const { params: _, ...fetchOptions } = options || {};

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = '/login';
    }
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  return res.json();
}