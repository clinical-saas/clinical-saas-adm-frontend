import { create } from 'zustand';

type AuthUser = {
  id: string;
  username: string;
  roleId: string;
};

export type TenantInfo = {
  id: string;
  code: string;
  businessName: string;
};

export type PendingTenantInfo = {
  id: string;
  name: string;
};

type AuthState = {
  user: AuthUser | null;
  tenantId: string | null;
  tenants: TenantInfo[] | null;
  allTenants: TenantInfo[] | null;
  pendingTenants: PendingTenantInfo[] | null;
  isPendingTenant: boolean;
  setAuth: (user: AuthUser, tenantId: string, tenants?: TenantInfo[]) => void;
  setPendingTenants: (tenants: PendingTenantInfo[]) => void;
  setAllTenants: (tenants: TenantInfo[]) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

type StoredAuth = {
  user: AuthUser;
  tenantId: string;
  tenants: TenantInfo[];
  allTenants: TenantInfo[];
};

function loadAuth(): Pick<AuthState, 'user' | 'tenantId' | 'tenants' | 'allTenants'> {
  if (typeof window === 'undefined') {
    return { user: null, tenantId: null, tenants: null, allTenants: null };
  }
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return { user: null, tenantId: null, tenants: null, allTenants: null };
    const parsed = JSON.parse(raw) as StoredAuth;
    return {
      user: parsed.user,
      tenantId: parsed.tenantId,
      tenants: parsed.tenants ?? null,
      allTenants: parsed.allTenants ?? null,
    };
  } catch {
    return { user: null, tenantId: null, tenants: null, allTenants: null };
  }
}

function saveAuth(
  user: AuthUser | null,
  tenantId: string | null,
  tenants?: TenantInfo[] | null,
  allTenants?: TenantInfo[] | null,
) {
  if (typeof window === 'undefined') return;
  if (user && tenantId) {
    localStorage.setItem(
      'auth',
      JSON.stringify({ user, tenantId, tenants: tenants ?? null, allTenants: allTenants ?? null }),
    );
  } else {
    localStorage.removeItem('auth');
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadAuth(),
  pendingTenants: null,
  isPendingTenant: false,
  setAuth: (user, tenantId, tenants) => {
    const currentAllTenants = get().allTenants;
    saveAuth(user, tenantId, tenants ?? null, currentAllTenants ?? null);
    set({ user, tenantId, tenants: tenants ?? null, pendingTenants: null, isPendingTenant: false });
  },
  setPendingTenants: (pendingTenants) => {
    set({ pendingTenants, isPendingTenant: pendingTenants.length > 0 });
  },
  setAllTenants: (allTenants) => {
    const { user, tenantId, tenants } = get();
    saveAuth(user, tenantId, tenants, allTenants);
    set({ allTenants });
  },
  clearAuth: () => {
    saveAuth(null, null, null, null);
    set({ user: null, tenantId: null, tenants: null, allTenants: null, pendingTenants: null, isPendingTenant: false });
  },
  isAuthenticated: () => get().user !== null && !get().isPendingTenant,
}));
