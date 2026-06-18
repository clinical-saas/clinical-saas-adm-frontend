"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Specialist } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Specialist>[] = [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) =>
      [row.first_name, row.last_name].filter(Boolean).join(" "),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email ?? "—",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone ?? "—",
  },
  {
    id: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = [
        row.original.is_supplier && "Proveedor",
        row.original.is_agent && "Agente",
        row.original.is_customer && "Cliente",
      ].filter(Boolean);
      return roles.length ? roles.join(", ") : "—";
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) =>
      row.original.active ? (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Inactive
        </span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/business-partners/specialists/${row.original.id}`}>
        <Button variant="outline" size="xs">
          View
        </Button>
      </Link>
    ),
  },
];

export default function SpecialistsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.specialists.list(),
    queryFn: () => apiClient<Specialist[]>("/service-provider"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Specialists"
        action={
          <Link href="/business-partners/specialists/new">
            <Button>Create Specialist</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No specialists"
          description="Get started by creating your first specialist."
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
