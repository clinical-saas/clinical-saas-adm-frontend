import { create } from 'zustand';

type AuthUser = {
  id: string;
  username: string;
  roleId: string;
};

export type TenantInfo = {
  id: string;
  name: string;
};

type AuthState = {
  user: AuthUser | null;
  tenantId: string | null;
  tenants: TenantInfo[] | null;
  isPendingTenant: boolean;
  setAuth: (user: AuthUser, tenantId: string) => void;
  setPendingTenants: (tenants: TenantInfo[]) => void;
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
  tenants: null,
  isPendingTenant: false,
  setAuth: (user, tenantId) => {
    saveAuth(user, tenantId);
    set({ user, tenantId, tenants: null, isPendingTenant: false });
  },
  setPendingTenants: (tenants) => {
    set({ tenants, isPendingTenant: tenants.length > 0 });
  },
  clearAuth: () => {
    saveAuth(null, null);
    set({ user: null, tenantId: null, tenants: null, isPendingTenant: false });
  },
  isAuthenticated: () => get().user !== null && !get().isPendingTenant,
}));