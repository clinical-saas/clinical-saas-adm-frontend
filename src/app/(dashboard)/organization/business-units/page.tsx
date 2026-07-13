"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { BusinessUnit } from "@/types";
import type { TenantLite } from "@/components/shared/business-unit-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusChip } from "@/components/shared/status-chip";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableActionCell } from "@/components/shared/data-table-action-cell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PageSize } from "@/components/shared/pagination";

export default function BusinessUnitsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  // Todos los tenants (sin scope) — el módulo lista BUs de todos los tenants
  const { data: tenants } = useQuery({
    queryKey: queryKeys.tenants.list(),
    queryFn: () => apiClient<TenantLite[]>("/tenant"),
  });

  const allTenantIds = useMemo(() => {
    return (tenants ?? []).map((t) => t.id);
  }, [tenants]);

  const { data: units, isLoading, error, isFetching } = useQuery({
    queryKey: [...queryKeys.businessUnits.list(), allTenantIds],
    queryFn: () => {
      const ids = allTenantIds.join(",");
      return apiClient<BusinessUnit[]>(`/business-unit/by-tenants?tenant_ids=${ids}`);
    },
    enabled: allTenantIds.length > 0,
    placeholderData: (prev) => prev,
  });

  const tenantName = useCallback(
    (tenantId: string) => {
      const t = tenants?.find((x) => x.id === tenantId);
      return t?.business_name ?? "—";
    },
    [tenants],
  );

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      return apiClient<BusinessUnit>(`/business-unit/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !active }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessUnits.all });
    },
    onError: () => {
      // TODO: toast de error (multi-tenant: editar BU de otro tenant falla; ver backlog)
    },
  });

  const handleToggleActive = useCallback(
    (unit: BusinessUnit) => {
      toggleMutation.mutate({ id: unit.id, active: unit.active });
    },
    [toggleMutation],
  );

  // Filtro client-side (todos opcionales)
  const filtered = useMemo(() => {
    let rows = units ?? [];
    if (selectedTenantIds.length > 0) {
      rows = rows.filter((u) => selectedTenantIds.includes(u.tenant_id));
    }
    if (selectedStatuses.length > 0) {
      rows = rows.filter((u) => selectedStatuses.includes(String(u.active)));
    }
    const q = searchText.trim().toLowerCase();
    if (q) {
      rows = rows.filter((u) => {
        return (
          u.code.toLowerCase().includes(q) ||
          u.business_name.toLowerCase().includes(q)
        );
      });
    }
    return rows;
  }, [units, selectedTenantIds, selectedStatuses, searchText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const columns: ColumnDef<BusinessUnit>[] = useMemo(
    () => [
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <DataTableActionCell
            actions={[
              {
                variant: "view",
                onClick: () => router.push(`/organization/business-units/${row.original.id}`),
                title: "Ver",
              },
              {
                variant: "edit",
                onClick: () => router.push(`/organization/business-units/${row.original.id}/edit`),
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
      { accessorKey: "code", header: "Código" },
      { accessorKey: "business_name", header: "Nombre" },
      {
        id: "tenant",
        header: "Tenant",
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
            {tenantName(row.original.tenant_id)}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email ?? "—",
      },
      {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => row.original.phone ?? "—",
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => <StatusChip active={row.original.active} />,
      },
    ],
    [router, handleToggleActive, tenantName],
  );

  const toggleAllTenants = () => {
    if (selectedTenantIds.length === allTenantIds.length) {
      setSelectedTenantIds([]);
    } else {
      setSelectedTenantIds([...allTenantIds]);
    }
    setPage(1);
  };

  const toggleAllStatuses = () => {
    if (selectedStatuses.length === 2) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(["true", "false"]);
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedTenantIds([]);
    setSelectedStatuses([]);
    setPage(1);
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
        title="Business Units"
        description={`${filtered.length} unidad${filtered.length !== 1 ? "es" : ""}`}
        action={
          <Link href="/organization/business-units/new">
            <Button>Crear Business Unit</Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Buscar</label>
                <Input
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-2">
                  <span
                    onClick={toggleAllStatuses}
                    data-active={selectedStatuses.length === 2}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    Todos
                  </span>
                  <span
                    onClick={() => {
                      setSelectedStatuses((prev) =>
                        prev.includes("true") ? prev.filter((s) => s !== "true") : [...prev, "true"],
                      );
                      setPage(1);
                    }}
                    data-active={selectedStatuses.includes("true")}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    Activo
                  </span>
                  <span
                    onClick={() => {
                      setSelectedStatuses((prev) =>
                        prev.includes("false") ? prev.filter((s) => s !== "false") : [...prev, "false"],
                      );
                      setPage(1);
                    }}
                    data-active={selectedStatuses.includes("false")}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    Inactivo
                  </span>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Tenant</label>
                <div className="flex flex-wrap gap-2">
                  <span
                    onClick={toggleAllTenants}
                    data-active={selectedTenantIds.length === allTenantIds.length && allTenantIds.length > 0}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    Todos
                  </span>
                  {tenants?.map((t) => (
                    <span
                      key={t.id}
                      onClick={() => {
                        setSelectedTenantIds((prev) =>
                          prev.includes(t.id) ? prev.filter((id) => id !== t.id) : [...prev, t.id],
                        );
                        setPage(1);
                      }}
                      data-active={selectedTenantIds.includes(t.id)}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      {t.business_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
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
      ) : pageSlice.length > 0 ? (
        <DataTable
          columns={columns}
          data={pageSlice}
          pageSize={pageSize}
          pageIndex={page - 1}
          pageCount={pageCount}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      ) : (
        <EmptyState
          title="Sin business units"
          description="No hay unidades que coincidan. Crea una nueva o ajusta los filtros."
          action={
            <Link href="/organization/business-units/new">
              <Button>Crear Business Unit</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
