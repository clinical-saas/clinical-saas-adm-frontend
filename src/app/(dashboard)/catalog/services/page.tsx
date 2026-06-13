"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { ServiceItem } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<ServiceItem>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
  },
  {
    accessorKey: "duration",
    header: "Duration (min)",
    cell: ({ row }) => row.original.duration ?? "—",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) =>
      row.original.price != null
        ? `$${Number(row.original.price).toFixed(2)}`
        : "—",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
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
      <Link href={`/catalog/services/${row.original.id}`}>
        <Button variant="outline" size="xs">
          View
        </Button>
      </Link>
    ),
  },
];

export default function ServicesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.services.list(),
    queryFn: () => apiClient<ServiceItem[]>("/service"),
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
        title="Services"
        action={
          <Link href="/catalog/services/new">
            <Button>Create Service</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No services"
          description="Get started by creating your first service."
          action={
            <Link href="/catalog/services/new">
              <Button>Create Service</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
