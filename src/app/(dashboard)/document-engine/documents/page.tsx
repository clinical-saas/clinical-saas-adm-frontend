"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Document } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "documentTypeId",
    header: "Type",
    cell: ({ row }) => row.original.documentTypeId ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status ?? "—",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/document-engine/documents/${row.original.id}`}>
        <Button variant="outline" size="xs">View</Button>
      </Link>
    ),
  },
];

export default function DocumentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: () => apiClient<Document[]>("/document-engine"),
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
        title="Documents"
        action={
          <Link href="/document-engine/documents/new">
            <Button>Create Document</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No documents"
          description="Get started by creating your first document."
          action={
            <Link href="/document-engine/documents/new">
              <Button>Create Document</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
