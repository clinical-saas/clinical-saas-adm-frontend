"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type {
  Customer,
  ApiResponse,
  SearchCustomersFilters,
  IdentificationType,
} from "@/types";
import { useAuthStore } from "@/stores/auth";
import { PageHeader } from "@/components/shared/page-header";
import { StatusChip } from "@/components/shared/status-chip";
import { BusinessUnitChips } from "@/components/shared/business-unit-chips";
import { ChipToggleGroup } from "@/components/shared/chip-toggle-group";
import { DataTableActionCell } from "@/components/shared/data-table-action-cell";
import { PhoneFormatter } from "@/components/shared/phone-formatter";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PageSize } from "@/components/shared/pagination";

// Row shape returned by the customer search projection.
interface CustomerRow {
  id: string;
  tenant_id: string;
  identification_number: string;
  identification_type_id: number;
  first_name: string | null;
  last_name: string | null;
  phone?: string | null;
  birth_date?: string | null;
  age?: number | null;
  active: boolean;
  business_units?: Array<{ id: string; business_name: string }>;
}

const STATUS_OPTIONS = [
  { id: "true", label: "Activo" },
  { id: "false", label: "Inactivo" },
];

function calculateAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function CustomersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const tenants = useAuthStore((s) => s.tenants);
  const businessUnits = useAuthStore((s) => s.businessUnits);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [selectedBusinessUnitIds, setSelectedBusinessUnitIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  const [sorting, setSorting] = useState<{ id: string; desc: boolean } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filterApplyVersion, setFilterApplyVersion] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Seed the tenant filter with all available tenants when they load.
  const [prevTenants, setPrevTenants] = useState(tenants);
  if (tenants !== prevTenants) {
    setPrevTenants(tenants);
    if (tenants && tenants.length > 0) {
      setSelectedTenantIds(tenants.map((t) => t.id));
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredBusinessUnits = useMemo(() => {
    if (!businessUnits) return [];
    if (selectedTenantIds.length === 0) return [];
    return businessUnits.filter((bu) => selectedTenantIds.includes(bu.tenantId));
  }, [businessUnits, selectedTenantIds]);

  const identificationTypesQuery = useQuery({
    queryKey: queryKeys.identificationTypes.list(),
    queryFn: () => apiClient<IdentificationType[]>("/identification-type"),
  });

  const filters = useMemo(() => {
    const effectiveTenantIds = selectedTenantIds.length > 0
      ? selectedTenantIds
      : (tenants?.map((t) => t.id) ?? []);

    const f: Record<string, unknown> = {
      page,
      pageSize,
      filterApplyVersion,
    };
    if (debouncedSearch.length >= 3) {
      f.search = debouncedSearch;
    }
    if (sorting) {
      f.order = sorting.desc ? `-${sorting.id}` : sorting.id;
    }
    if (effectiveTenantIds.length > 0) {
      f.tenantIds = effectiveTenantIds;
    }
    if (selectedStatuses.length > 0) {
      f.statuses = selectedStatuses;
    }
    if (selectedBusinessUnitIds.length > 0) {
      f.businessUnitIds = selectedBusinessUnitIds;
    }
    return f;
  }, [debouncedSearch, page, pageSize, sorting, selectedTenantIds, selectedStatuses, selectedBusinessUnitIds, tenants, filterApplyVersion]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: queryKeys.customers.search(filters as SearchCustomersFilters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", String(filters.search));
      if (filters.page) params.set("page", String(filters.page));
      if (filters.pageSize) params.set("limit", String(filters.pageSize));
      if (filters.order) params.set("order", String(filters.order));
      if (filters.tenantIds) {
        params.set("tenantIds", (filters.tenantIds as string[]).join(","));
      }
      if (filters.statuses) {
        params.set("statuses", (filters.statuses as string[]).join(","));
      }
      if (filters.businessUnitIds) {
        params.set("businessUnitIds", (filters.businessUnitIds as string[]).join(","));
      }
      return apiClient<ApiResponse<CustomerRow>>(`/customer?${params.toString()}`);
    },
    placeholderData: (prev) => prev,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const endpoint = active ? `/customer/${id}/disable` : `/customer/${id}/enable`;
      return apiClient<Customer>(endpoint, { method: "PATCH", body: JSON.stringify({}) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });

  const handleToggleActive = useCallback((customer: CustomerRow) => {
    toggleMutation.mutate({ id: customer.id, active: customer.active });
  }, [toggleMutation]);

  const columns: ColumnDef<CustomerRow>[] = useMemo(() => [
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <DataTableActionCell
          actions={[
            {
              variant: "view",
              onClick: () => router.push(`/business-partners/customers/${row.original.id}`),
              title: "Ver",
            },
            {
              variant: "edit",
              onClick: () => router.push(`/business-partners/customers/${row.original.id}/edit`),
              title: "Editar",
            },
            {
              variant: "toggle",
              onClick: () => handleToggleActive(row.original),
              title: row.original.active ? "Inactivar" : "Activar",
              isActive: row.original.active,
            },
          ]}
        />
      ),
    },
    {
      accessorKey: "last_name",
      header: "Apellidos",
      enableSorting: true,
    },
    {
      accessorKey: "first_name",
      header: "Nombres",
      enableSorting: true,
    },
    {
      id: "age",
      header: "Edad",
      accessorFn: (row) => calculateAge(row.birth_date),
      cell: ({ row }) => {
        const age = calculateAge(row.original.birth_date);
        return age !== null ? `${age}` : "—";
      },
      enableSorting: true,
    },
    {
      id: "identification_type",
      header: "Tipo ID",
      accessorFn: (row) => {
        const it = identificationTypesQuery.data?.find((it) => String(it.id) === String(row.identification_type_id));
        return it?.name ?? "—";
      },
      enableSorting: true,
    },
    {
      accessorKey: "identification_number",
      header: "Identificación",
      enableSorting: true,
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => <PhoneFormatter phone={row.original.phone} />,
      enableSorting: true,
    },
    {
      id: "tenant",
      header: "Tenant",
      cell: ({ row }) => {
        const t = tenants?.find((ten) => ten.id === row.original.tenant_id);
        if (!t) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
            {t.businessName}
          </span>
        );
      },
      enableSorting: tenants != null && tenants.length > 1,
    },
    {
      id: "business_units",
      header: "Unidades de Negocio",
      cell: ({ row }) => (
        <BusinessUnitChips units={row.original.business_units} className="max-w-[300px]" />
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => <StatusChip active={row.original.active} />,
    },
  ], [tenants, identificationTypesQuery.data, router, handleToggleActive]);

  const customers = data?.data ?? [];
  const meta = data?.meta;

  const handleTenantToggle = (id: string) => {
    setSelectedTenantIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setSelectedBusinessUnitIds((bus) => bus.filter((buId) => {
        const bu = businessUnits?.find((b) => b.id === buId);
        return bu && next.includes(bu.tenantId);
      }));
      return next;
    });
  };

  const toggleAllTenants = () => {
    if (!tenants) return;
    setSelectedTenantIds(
      selectedTenantIds.length === tenants.length ? [] : tenants.map((t) => t.id),
    );
    setSelectedBusinessUnitIds([]);
  };

  const toggleAllBusinessUnits = () => {
    if (filteredBusinessUnits.length === 0) return;
    setSelectedBusinessUnitIds(
      selectedBusinessUnitIds.length === filteredBusinessUnits.length
        ? []
        : filteredBusinessUnits.map((bu) => bu.id),
    );
  };

  const toggleStatus = (id: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleAllStatuses = () => {
    setSelectedStatuses(selectedStatuses.length === STATUS_OPTIONS.length ? [] : STATUS_OPTIONS.map((s) => s.id));
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFilterApplyVersion((v) => v + 1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setDebouncedSearch("");
    if (tenants && tenants.length === 1) {
      setSelectedTenantIds([tenants[0].id]);
    } else if (tenants) {
      setSelectedTenantIds(tenants.map((t) => t.id));
    }
    setSelectedBusinessUnitIds([]);
    setSelectedStatuses([]);
    setPage(1);
    setFilterApplyVersion((v) => v + 1);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  if (error) {
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={
          meta ? `${meta.total} customer${meta.total !== 1 ? "s" : ""} found` : undefined
        }
        action={
          <Link href="/business-partners/customers/new">
            <Button>Crear Customer</Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChipToggleGroup
                label="Status"
                options={STATUS_OPTIONS}
                selectedIds={selectedStatuses}
                onToggle={toggleStatus}
                onToggleAll={toggleAllStatuses}
              />

              <div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar por nombre, identificación... (mín 3 caracteres)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <ChipToggleGroup
                label="Tenant"
                options={tenants?.map((t) => ({ id: t.id, label: t.businessName })) ?? []}
                selectedIds={selectedTenantIds}
                onToggle={handleTenantToggle}
                onToggleAll={toggleAllTenants}
                showToggleAll={tenants != null && tenants.length > 1}
              />

              <ChipToggleGroup
                label="Unidades de Negocio"
                options={filteredBusinessUnits.map((bu) => ({ id: bu.id, label: bu.businessName }))}
                selectedIds={selectedBusinessUnitIds}
                onToggle={(id) =>
                  setSelectedBusinessUnitIds((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  )
                }
                onToggleAll={toggleAllBusinessUnits}
                emptyText={selectedTenantIds.length === 0 ? "Selecciona un tenant" : "Sin unidades"}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleApplyFilters}>
                Aplicar filtros
              </Button>
              <Button variant="ghost" onClick={handleClearFilters}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {isFetching && !isLoading ? "Actualizando..." : "Cargando..."}
        </div>
      ) : customers.length > 0 ? (
        <DataTable
          columns={columns}
          data={customers}
          pageSize={pageSize}
          pageIndex={page - 1}
          pageCount={meta?.lastPage ?? 1}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
          onSortingChange={setSorting}
          sorting={sorting}
        />
      ) : (
        <EmptyState
          title="Sin customers"
          description="Ajusta los filtros o crea un nuevo customer."
          action={
            <Link href="/business-partners/customers/new">
              <Button>Crear Customer</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
