"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Document } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.documents.detail(id),
    queryFn: () => apiClient<Document>(`/document-engine/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  if (!data) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Details"
        action={
          <Link href="/document-engine/documents">
            <Button variant="outline">Back</Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Code</p>
              <p className="font-medium">{data.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Document Type</p>
              <p className="font-medium">{data.documentTypeId ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{data.status ?? "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
