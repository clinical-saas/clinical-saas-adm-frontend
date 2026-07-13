import type { SearchSpecialistsFilters, SearchCustomersFilters } from "@/types";

export const queryKeys = {
  tenants: {
    all: ["tenants"] as const,
    list: () => [...queryKeys.tenants.all, "list"] as const,
    detail: (id: string) => [...queryKeys.tenants.all, "detail", id] as const,
  },
  businessUnits: {
    all: ["business-units"] as const,
    list: () => [...queryKeys.businessUnits.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.businessUnits.all, "detail", id] as const,
  },
  businessPartners: {
    all: ["business-partners"] as const,
    list: () => [...queryKeys.businessPartners.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.businessPartners.all, "detail", id] as const,
  },
  roles: {
    all: ["roles"] as const,
    list: () => [...queryKeys.roles.all, "list"] as const,
    detail: (id: string) => [...queryKeys.roles.all, "detail", id] as const,
  },
  permissions: {
    all: ["permissions"] as const,
    list: () => [...queryKeys.permissions.all, "list"] as const,
    byRole: (roleId: string) =>
      [...queryKeys.permissions.all, "byRole", roleId] as const,
  },
  platformUsers: {
    all: ["platform-users"] as const,
    list: () => [...queryKeys.platformUsers.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.platformUsers.all, "detail", id] as const,
  },
  platforms: {
    all: ["platforms"] as const,
    list: () => [...queryKeys.platforms.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.platforms.all, "detail", id] as const,
  },
  modules: {
    all: ["modules"] as const,
    list: () => [...queryKeys.modules.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.modules.all, "detail", id] as const,
  },
  subModules: {
    all: ["sub-modules"] as const,
    list: () => [...queryKeys.subModules.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.subModules.all, "detail", id] as const,
  },
  identificationTypes: {
    all: ["identification-types"] as const,
    list: () => [...queryKeys.identificationTypes.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.identificationTypes.all, "detail", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: () => [...queryKeys.customers.all, "list"] as const,
    search: (filters?: SearchCustomersFilters) =>
      [...queryKeys.customers.all, "search", filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.customers.all, "detail", id] as const,
    history: (id: string) =>
      [...queryKeys.customers.all, "history", id] as const,
  },
  specialists: {
    all: ["specialists"] as const,
    list: () => [...queryKeys.specialists.all, "list"] as const,
    search: (filters?: SearchSpecialistsFilters) =>
      [...queryKeys.specialists.all, "search", filters ?? {}] as const,
    detail: (id: string) =>
      [...queryKeys.specialists.all, "detail", id] as const,
    history: (id: string) =>
      [...queryKeys.specialists.all, "history", id] as const,
  },
  services: {
    all: ["services"] as const,
    list: () => [...queryKeys.services.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.services.all, "detail", id] as const,
  },
  serviceCategories: {
    all: ["service-categories"] as const,
    list: () => [...queryKeys.serviceCategories.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.serviceCategories.all, "detail", id] as const,
  },
  rooms: {
    all: ["rooms"] as const,
    list: () => [...queryKeys.rooms.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.rooms.all, "detail", id] as const,
  },
  materials: {
    all: ["materials"] as const,
    list: () => [...queryKeys.materials.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.materials.all, "detail", id] as const,
  },
  serviceOrders: {
    all: ["service-orders"] as const,
    list: () => [...queryKeys.serviceOrders.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.serviceOrders.all, "detail", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    list: () => [...queryKeys.documents.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.documents.all, "detail", id] as const,
  },
  documentItems: {
    all: ["document-items"] as const,
    list: () => [...queryKeys.documentItems.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.documentItems.all, "detail", id] as const,
  },
  documentTypes: {
    all: ["document-types"] as const,
    list: () => [...queryKeys.documentTypes.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.documentTypes.all, "detail", id] as const,
  },
};
