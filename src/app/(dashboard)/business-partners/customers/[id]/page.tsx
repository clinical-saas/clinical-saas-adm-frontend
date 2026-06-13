"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Customer } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => apiClient<Customer>(`/customer/${id}`),
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
        title="Customer Details"
        action={
          <Link href="/business-partners/customers">
            <Button variant="outline">Back</Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{data.phone || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Identification Type
              </p>
              <p className="font-medium">{data.identificationType || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Identification Number
              </p>
              <p className="font-medium">{data.identificationNumber || "—"}</p>
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
      <div className="flex gap-2">
        <Link href={`/business-partners/customers/${id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Link href={`/business-partners/customers/${id}/history`}>
          <Button variant="outline">Service History</Button>
        </Link>
      </div>
    </div>
  );
}
