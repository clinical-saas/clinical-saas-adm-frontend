"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { ServiceItem } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => apiClient<ServiceItem>(`/service/${id}`),
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
        title="Service Details"
        action={
          <Link href="/catalog/services">
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
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{data.categoryId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{data.description || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration (min)</p>
              <p className="font-medium">{data.duration ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">
                {data.price != null
                  ? `$${Number(data.price).toFixed(2)}`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {data.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
