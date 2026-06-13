"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { DocumentType } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

const columns: ColumnDef<DocumentType>[] = [
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
      <Link href={`/document-engine/types/${row.original.id}`}>
        <Button variant="outline" size="xs">View</Button>
      </Link>
    ),
  },
];

export default function DocumentTypesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.documentTypes.list(),
    queryFn: () => apiClient<DocumentType[]>("/document-type"),
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
        title="Document Types"
        action={
          <Link href="/document-engine/types/new">
            <Button>Create Document Type</Button>
          </Link>
        }
      />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <EmptyState
          title="No document types"
          description="Get started by creating your first document type."
          action={
            <Link href="/document-engine/types/new">
              <Button>Create Document Type</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
