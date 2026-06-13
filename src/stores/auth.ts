import { create } from 'zustand';

type AuthUser = {
  id: string;
  username: string;
  roleId: string;
};

type AuthState = {
  user: AuthUser | null;
  tenantId: string | null;
  setAuth: (user: AuthUser, tenantId: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

function loadAuth(): Pick<AuthState, 'user' | 'tenantId'> {
  if (typeof window === 'undefined') {
    return { user: null, tenantId: null };
  }
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return { user: null, tenantId: null };
    const parsed = JSON.parse(raw) as { user: AuthUser; tenantId: string };
    return { user: parsed.user, tenantId: parsed.tenantId };
  } catch {
    return { user: null, tenantId: null };
  }
}

function saveAuth(user: AuthUser | null, tenantId: string | null) {
  if (typeof window === 'undefined') return;
  if (user && tenantId) {
    localStorage.setItem('auth', JSON.stringify({ user, tenantId }));
  } else {
    localStorage.removeItem('auth');
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadAuth(),
  setAuth: (user, tenantId) => {
    saveAuth(user, tenantId);
    set({ user, tenantId });
  },
  clearAuth: () => {
    saveAuth(null, null);
    set({ user: null, tenantId: null });
  },
  isAuthenticated: () => get().user !== null,
}));