"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { ApiResponse } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { BusinessUnitChips } from "@/components/shared/business-unit-chips";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

// Row shape returned by the customer search projection (ICustomerSearch).
interface CustomerRow {
  id: string;
  identification_number: string;
  identification_type_id: number;
  first_name: string | null;
  last_name: string | null;
  birth_date?: string | null;
  age?: number | null;
  business_units?: Array<{ id: string; business_name: string }>;
}

const columns: ColumnDef<CustomerRow>[] = [
  {
    id: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name = [row.original.first_name, row.original.last_name]
        .filter(Boolean)
        .join(" ");
      return name || "—";
    },
  },
  {
    accessorKey: "identification_number",
    header: "N° Identificación",
    cell: ({ row }) => row.original.identification_number ?? "—",
  },
  {
    id: "business_units",
    header: "Unidades de Negocio",
    cell: ({ row }) => (
      <BusinessUnitChips units={row.original.business_units} className="max-w-[300px]" />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <Link href={`/business-partners/customers/${row.original.id}`}>
        <Button variant="outline" size="xs">
          Ver
        </Button>
      </Link>
    ),
  },
];

export default function CustomersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.customers.list(),
    // Interim: sin tenantIds el backend devuelve todos los tenants (fase multi-tenant).
    // TODO: paridad de búsqueda/paginación/filtros server con el search de specialist.
    queryFn: () => apiClient<ApiResponse<CustomerRow>>("/customer?page=1&limit=100"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const rows = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        action={
          <Link href="/business-partners/customers/new">
            <Button>Crear Customer</Button>
          </Link>
        }
      />
      {rows.length > 0 ? (
        <DataTable columns={columns} data={rows} />
      ) : (
        <EmptyState
          title="Sin customers"
          description="Crea tu primer customer para empezar."
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
