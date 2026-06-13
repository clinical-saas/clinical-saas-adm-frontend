"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Platform } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Platform>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        href={`/settings/platform-catalog/platforms/${row.original.id}`}
      >
        <Button variant="outline" size="xs">
          View
        </Button>
      </Link>
    ),
  },
];

export default function PlatformsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.platforms.list(),
    queryFn: () => apiClient<Platform[]>("/platform"),
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
        title="Platforms"
        action={
          <Link href="/settings/platform-catalog/platforms/new">
            <Button>Create Platform</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No platforms"
          description="Get started by creating your first platform."
          action={
            <Link href="/settings/platform-catalog/platforms/new">
              <Button>Create Platform</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
