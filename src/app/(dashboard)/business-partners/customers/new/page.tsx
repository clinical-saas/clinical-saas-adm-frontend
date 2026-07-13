"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CustomerForm,
  type CustomerFormValues,
} from "@/components/shared/customer-form";

export default function CreateCustomerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: CustomerFormValues) => {
    setError(null);
    try {
      const { customerId: _, ...payload } = values; // businessUnitIds travels to the backend
      await apiClient("/customer", {
        method: "POST",
        body: JSON.stringify(payload),
        // Target tenant: the BFF honors it only when the role is super_admin.
        headers: { "x-target-tenant-id": values.tenantId },
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      router.push("/business-partners/customers");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          typeof err.body === "object" && err.body && "message" in err.body
            ? (err.body as { message: string }).message
            : `Error ${err.status}`,
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Customer"
        action={
          <Link href="/business-partners/customers">
            <Button variant="outline">Cancel</Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <CustomerForm onSubmit={onSubmit} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
