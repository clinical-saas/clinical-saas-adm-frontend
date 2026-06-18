import { useAuthStore } from '@/stores/auth';

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
  const base = API_BASE.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const urlString = `${base}${cleanPath}`;
  const url = new URL(urlString);
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) =>
      url.searchParams.set(k, v),
    );
  }

  const { params: _, ...fetchOptions } = options || {};

  const auth = useAuthStore.getState();
  const authHeaders: Record<string, string> = {};
  if (auth.user?.id) authHeaders['user-id'] = auth.user.id;
  if (auth.tenantId) authHeaders['tenant-id'] = auth.tenantId;

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  return res.json();
}