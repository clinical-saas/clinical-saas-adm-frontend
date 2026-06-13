"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { DocumentItem } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<DocumentItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "documentId",
    header: "Document ID",
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
      <Link href={`/document-engine/items/${row.original.id}`}>
        <Button variant="outline" size="xs">View</Button>
      </Link>
    ),
  },
];

export default function DocumentItemsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.documentItems.list(),
    queryFn: () => apiClient<DocumentItem[]>("/document-engine-item"),
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
        title="Document Items"
        action={
          <Link href="/document-engine/items/new">
            <Button>Create Document Item</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No document items"
          description="Get started by creating your first document item."
          action={
            <Link href="/document-engine/items/new">
              <Button>Create Document Item</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
