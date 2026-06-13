"use client";

import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Room } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { EmptyState } from "@/components/shared/empty-state";

const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => row.original.code ?? "—",
  },
  {
    accessorKey: "businessUnitId",
    header: "Business Unit ID",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => row.original.capacity ?? "—",
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
];

export default function RoomsReportPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.rooms.list(),
    queryFn: () => apiClient<Room[]>("/business-unit-room"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  const total = data?.length ?? 0;
  const active = data?.filter((r) => r.isActive).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Rooms Report" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-700">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{active}</p>
          </CardContent>
        </Card>
      </div>
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No rooms"
          description="There are no rooms in the system yet."
        />
      )}
    </div>
  );
}
