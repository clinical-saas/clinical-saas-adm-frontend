"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { AppSubModule } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<AppSubModule>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "moduleId",
    header: "Module ID",
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
        href={`/settings/platform-catalog/sub-modules/${row.original.id}`}
      >
        <Button variant="outline" size="xs">
          View
        </Button>
      </Link>
    ),
  },
];

export default function SubModulesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.subModules.list(),
    queryFn: () => apiClient<AppSubModule[]>("/app-sub-module"),
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
        title="Sub Modules"
        action={
          <Link href="/settings/platform-catalog/sub-modules/new">
            <Button>Create Sub Module</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No sub modules"
          description="Get started by creating your first sub module."
          action={
            <Link href="/settings/platform-catalog/sub-modules/new">
              <Button>Create Sub Module</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
