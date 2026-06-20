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

export type BusinessUnitInfo = {
  id: string;
  tenantId: string;
  businessName: string;
};

type AuthState = {
  user: AuthUser | null;
  tenantId: string | null;
  tenants: TenantInfo[] | null;
  allTenants: TenantInfo[] | null;
  pendingTenants: PendingTenantInfo[] | null;
  isPendingTenant: boolean;
  businessUnits: BusinessUnitInfo[] | null;
  setAuth: (user: AuthUser, tenantId: string, tenants?: TenantInfo[]) => void;
  setPendingTenants: (tenants: PendingTenantInfo[]) => void;
  setAllTenants: (tenants: TenantInfo[]) => void;
  setBusinessUnits: (businessUnits: BusinessUnitInfo[]) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

type StoredAuth = {
  user: AuthUser;
  tenantId: string;
  tenants: TenantInfo[];
  allTenants: TenantInfo[];
  businessUnits: BusinessUnitInfo[];
};

function loadAuth(): Pick<AuthState, 'user' | 'tenantId' | 'tenants' | 'allTenants' | 'businessUnits'> {
  if (typeof window === 'undefined') {
    return { user: null, tenantId: null, tenants: null, allTenants: null, businessUnits: null };
  }
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return { user: null, tenantId: null, tenants: null, allTenants: null, businessUnits: null };
    const parsed = JSON.parse(raw) as StoredAuth;
    return {
      user: parsed.user,
      tenantId: parsed.tenantId,
      tenants: parsed.tenants ?? null,
      allTenants: parsed.allTenants ?? null,
      businessUnits: parsed.businessUnits ?? null,
    };
  } catch {
    return { user: null, tenantId: null, tenants: null, allTenants: null, businessUnits: null };
  }
}

function saveAuth(
  user: AuthUser | null,
  tenantId: string | null,
  tenants?: TenantInfo[] | null,
  allTenants?: TenantInfo[] | null,
  businessUnits?: BusinessUnitInfo[] | null,
) {
  if (typeof window === 'undefined') return;
  if (user && tenantId) {
    localStorage.setItem(
      'auth',
      JSON.stringify({ user, tenantId, tenants: tenants ?? null, allTenants: allTenants ?? null, businessUnits: businessUnits ?? null }),
    );
  } else {
    localStorage.removeItem('auth');
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadAuth(),
  pendingTenants: null,
  isPendingTenant: false,
  businessUnits: loadAuth().businessUnits,
  setAuth: (user, tenantId, tenants) => {
    const currentAllTenants = get().allTenants;
    const currentBusinessUnits = get().businessUnits;
    saveAuth(user, tenantId, tenants ?? null, currentAllTenants ?? null, currentBusinessUnits ?? null);
    set({ user, tenantId, tenants: tenants ?? null, pendingTenants: null, isPendingTenant: false });
  },
  setPendingTenants: (pendingTenants) => {
    set({ pendingTenants, isPendingTenant: pendingTenants.length > 0 });
  },
  setAllTenants: (allTenants) => {
    const { user, tenantId, tenants, businessUnits } = get();
    saveAuth(user, tenantId, tenants, allTenants, businessUnits ?? null);
    set({ allTenants });
  },
  setBusinessUnits: (businessUnits) => {
    const { user, tenantId, tenants, allTenants } = get();
    saveAuth(user, tenantId, tenants, allTenants, businessUnits ?? null);
    set({ businessUnits });
  },
  clearAuth: () => {
    saveAuth(null, null, null, null, null);
    set({ user: null, tenantId: null, tenants: null, allTenants: null, pendingTenants: null, isPendingTenant: false, businessUnits: null });
  },
  isAuthenticated: () => get().user !== null && !get().isPendingTenant,
}));
