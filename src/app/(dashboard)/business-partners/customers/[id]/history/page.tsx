"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { ServiceHistoryEntry } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<ServiceHistoryEntry>[] = [
  {
    accessorKey: "serviceDate",
    header: "Date",
  },
  {
    accessorKey: "serviceDescription",
    header: "Service",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "businessUnit",
    header: "Business Unit",
    cell: ({ row }) => row.original.businessUnit ?? "—",
  },
];

export default function CustomerHistoryPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.customers.history(id),
    queryFn: () =>
      apiClient<ServiceHistoryEntry[]>(`/customer/${id}/history`),
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
        title="Service History"
        action={
          <Link href={`/business-partners/customers/${id}`}>
            <Button variant="outline">Back to Customer</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No service history"
          description="This customer has no service history yet."
        />
      )}
    </div>
  );
}
