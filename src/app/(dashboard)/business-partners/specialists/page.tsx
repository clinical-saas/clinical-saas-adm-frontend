"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Specialist, ApiResponse, SearchSpecialistsFilters } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { StatusChip } from "@/components/shared/status-chip";
import { BusinessUnitChips } from "@/components/shared/business-unit-chips";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth";
import type { TenantInfo, BusinessUnitInfo } from "@/stores/auth";
import { useRouter } from "next/navigation";
import type { IdentificationType } from "@/types";
import { DataTableActionCell } from "@/components/shared/data-table-action-cell";
import { PhoneFormatter } from "@/components/shared/phone-formatter";
import type { PageSize } from "@/components/shared/pagination";

interface SpecialistRow extends Specialist {
  tenant_name?: string;
  identification_type_name?: string;
  business_units?: Array<{ id: string; business_name: string }>;
}

function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function SpecialistsPage() {
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
  // Adjust during render (not in an effect) to avoid cascading renders;
  // re-seeds only when the tenants list identity changes, so a user
  // deselection is preserved.
  const [prevTenants, setPrevTenants] = useState(tenants);
  if (tenants !== prevTenants) {
    setPrevTenants(tenants);
    if (tenants && tenants.length > 0) {
      setSelectedTenantIds(tenants.map((t) => t.id));
    }
  }

  // Focus the search input on mount (side effect → stays in an effect).
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
    queryKey: queryKeys.specialists.search(filters as SearchSpecialistsFilters),
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
      return apiClient<ApiResponse<SpecialistRow>>(`/service-provider?${params.toString()}`);
    },
    placeholderData: (prev) => prev,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const endpoint = active ? `/service-provider/${id}/disable` : `/service-provider/${id}/enable`;
      return apiClient<Specialist>(endpoint, { method: "PATCH", body: JSON.stringify({}) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specialists.all });
    },
    onError: () => {
      // Error handling - could add toast here later
    },
  });

  const handleToggleActive = useCallback((specialist: SpecialistRow) => {
    toggleMutation.mutate({ id: specialist.id, active: specialist.active });
  }, [toggleMutation]);

  const columns: ColumnDef<SpecialistRow>[] = useMemo(() => [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DataTableActionCell
          actions={[
            {
              variant: "view",
              onClick: () => router.push(`/business-partners/specialists/${row.original.id}`),
              title: "Ver",
            },
            {
              variant: "edit",
              onClick: () => router.push(`/business-partners/specialists/${row.original.id}/edit`),
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
    // Email column temporarily hidden
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: ({ row }) => row.original.email ?? "—",
    //   enableSorting: true,
    // },
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

  const specialists = data?.data ?? [];
  const meta = data?.meta;

  const handleTenantFilterChange = (ids: string[]) => {
    setSelectedTenantIds(ids);
    setSelectedBusinessUnitIds((prev) => prev.filter((id) => {
      const bu = businessUnits?.find((b) => b.id === id);
      return bu && ids.includes(bu.tenantId);
    }));
  };

  const handleBusinessUnitFilterChange = (ids: string[]) => {
    setSelectedBusinessUnitIds(ids);
  };

  const handleStatusFilterChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
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

  const toggleAllTenants = () => {
    if (!tenants) return;
    if (selectedTenantIds.length === tenants.length) {
      setSelectedTenantIds([]);
    } else {
      setSelectedTenantIds(tenants.map((t) => t.id));
    }
  };

  const toggleAllBusinessUnits = () => {
    if (filteredBusinessUnits.length === 0) return;
    if (selectedBusinessUnitIds.length === filteredBusinessUnits.length) {
      setSelectedBusinessUnitIds([]);
    } else {
      setSelectedBusinessUnitIds(filteredBusinessUnits.map((bu) => bu.id));
    }
  };

  const toggleAllStatuses = () => {
    const allStatuses = ["true", "false"];
    if (selectedStatuses.length === allStatuses.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses([...allStatuses]);
    }
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
        title="Specialists"
        description={
          meta ? `${meta.total} specialist${meta.total !== 1 ? "s" : ""} found` : undefined
        }
        action={
          <Link href="/business-partners/specialists/new">
            <Button>Create Specialist</Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-2">
                  <span
                    onClick={toggleAllStatuses}
                    data-active={selectedStatuses.length === 2}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    {selectedStatuses.length === 2 ? "Deseleccionar todos" : "Seleccionar todos"}
                  </span>
                  <span
                    onClick={() =>
                      setSelectedStatuses((prev) =>
                        prev.includes("true") ? prev.filter((s) => s !== "true") : [...prev, "true"]
                      )
                    }
                    data-active={selectedStatuses.includes("true")}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    Activo
                  </span>
                  <span
                    onClick={() =>
                      setSelectedStatuses((prev) =>
                        prev.includes("false") ? prev.filter((s) => s !== "false") : [...prev, "false"]
                      )
                    }
                    data-active={selectedStatuses.includes("false")}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    Inactivo
                  </span>
                </div>
              </div>

              <div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar por nombre, identificación... (mín 3 caracteres)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Tenant</label>
                <div className="flex flex-wrap gap-2">
                  {tenants && tenants.length > 1 && (
                    <span
                      onClick={toggleAllTenants}
                      data-active={selectedTenantIds.length === tenants.length}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      {selectedTenantIds.length === tenants.length ? "Deseleccionar todos" : "Seleccionar todos"}
                    </span>
                  )}
                  {tenants?.map((t) => (
                    <span
                      key={t.id}
                      onClick={() =>
                        setSelectedTenantIds((prev) =>
                          prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                        )
                      }
                      data-active={selectedTenantIds.includes(t.id)}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      {t.businessName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Unidades de Negocio</label>
                <div className="flex flex-wrap gap-2">
                  {filteredBusinessUnits.length > 0 && (
                    <span
                      onClick={toggleAllBusinessUnits}
                      data-active={selectedBusinessUnitIds.length === filteredBusinessUnits.length}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      {selectedBusinessUnitIds.length === filteredBusinessUnits.length ? "Deseleccionar todos" : "Seleccionar todos"}
                    </span>
                  )}
                  {filteredBusinessUnits.map((bu) => (
                    <span
                      key={bu.id}
                      onClick={() =>
                        setSelectedBusinessUnitIds((prev) =>
                          prev.includes(bu.id) ? prev.filter((id) => id !== bu.id) : [...prev, bu.id]
                        )
                      }
                      data-active={selectedBusinessUnitIds.includes(bu.id)}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      {bu.businessName}
                    </span>
                  ))}
                  {filteredBusinessUnits.length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      {selectedTenantIds.length === 0 ? "Selecciona un tenant" : "Sin unidades"}
                    </span>
                  )}
                </div>
              </div>
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
      ) : specialists.length > 0 ? (
        <DataTable
          columns={columns}
          data={specialists}
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
          title="No specialists found"
          description="Try adjusting your search criteria or create a new specialist."
          action={
            <Link href="/business-partners/specialists/new">
              <Button>Create Specialist</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
