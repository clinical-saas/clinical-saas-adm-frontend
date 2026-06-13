"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { ServiceOrder } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<ServiceOrder>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },
  {
    accessorKey: "specialistId",
    header: "Specialist ID",
    cell: ({ row }) => row.original.specialistId ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "scheduledDate",
    header: "Scheduled Date",
    cell: ({ row }) => row.original.scheduledDate ?? "—",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) =>
      row.original.totalAmount != null
        ? `$${Number(row.original.totalAmount).toFixed(2)}`
        : "—",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/service-orders/${row.original.id}`}>
        <Button variant="outline" size="xs">View</Button>
      </Link>
    ),
  },
];

export default function ServiceOrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.serviceOrders.list(),
    queryFn: () => apiClient<ServiceOrder[]>("/service-order"),
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
        title="Service Orders"
        action={
          <Link href="/service-orders/new">
            <Button>Create Service Order</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No service orders"
          description="Get started by creating your first service order."
          action={
            <Link href="/service-orders/new">
              <Button>Create Service Order</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
