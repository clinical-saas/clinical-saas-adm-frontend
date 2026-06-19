"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Specialist, ApiResponse, SearchSpecialistsFilters } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const columns: ColumnDef<Specialist>[] = [
  {
    id: "name",
    header: "Name",
    accessorFn: (row) =>
      [row.first_name, row.last_name].filter(Boolean).join(" "),
  },
  {
    accessorKey: "identification_number",
    header: "ID Number",
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
    queryFn: () =>
      apiClient<ApiResponse<Specialist>>("/service-provider"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Loading...
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

  const specialists = data?.data ?? [];
  const meta = data?.meta;

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
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Identification</label>
              <input
                type="text"
                placeholder="Search by identification..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Name</label>
              <input
                type="text"
                placeholder="Search by name..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline">Search</Button>
              <Button variant="ghost">Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {specialists.length > 0 ? (
        <DataTable columns={columns} data={specialists} />
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
