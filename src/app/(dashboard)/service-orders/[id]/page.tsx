"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { ServiceOrder } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceOrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.serviceOrders.detail(id),
    queryFn: () => apiClient<ServiceOrder>(`/service-order/${id}`),
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
        title="Service Order Details"
        action={
          <Link href="/service-orders">
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
              <p className="text-sm text-muted-foreground">Customer ID</p>
              <p className="font-medium">{data.customerId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Specialist ID</p>
              <p className="font-medium">{data.specialistId ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{data.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Date</p>
              <p className="font-medium">{data.scheduledDate ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-medium">
                {data.totalAmount != null
                  ? `$${Number(data.totalAmount).toFixed(2)}`
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
