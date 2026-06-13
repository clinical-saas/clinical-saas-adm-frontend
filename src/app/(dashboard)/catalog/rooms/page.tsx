"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Room } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    header: "Business Unit",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => row.original.capacity ?? "—",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        )}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/catalog/rooms/${row.original.id}`}>
        <Button variant="outline" size="xs">View</Button>
      </Link>
    ),
  },
];

export default function RoomsPage() {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooms"
        action={
          <Link href="/catalog/rooms/new">
            <Button>Create Room</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No rooms"
          description="Get started by creating your first room."
          action={
            <Link href="/catalog/rooms/new">
              <Button>Create Room</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
