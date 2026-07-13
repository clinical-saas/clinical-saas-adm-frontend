"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Customer } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CustomerForm,
  type CustomerFormValues,
} from "@/components/shared/customer-form";

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => apiClient<Customer>(`/customer/${id}`),
  });

  const onSubmit = async (values: CustomerFormValues) => {
    setError(null);
    try {
      const { customerId: _, ...payload } = values; // businessUnitIds travels to the backend
      await apiClient(`/customer/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      router.push(`/business-partners/customers`);
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

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Customer not found</div>;

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Customer"
        action={
          <Link href={`/business-partners/customers/${id}`}>
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
          <CustomerForm
            defaultValues={{
              customerId: data.id,
              tenantId: data.tenant_id,
              businessUnitIds: data.businessUnitIds ?? [],
              active: data.active,
              firstName: data.first_name ?? "",
              lastName: data.last_name ?? "",
              birthDate: formatDate(data.birth_date),
              shortAddress: data.short_address ?? "",
              address: data.address ?? "",
              email: data.email ?? "",
              phone: data.phone ?? "",
              isSupplier: data.is_supplier,
              isAgent: data.is_agent,
              isCustomer: data.is_customer,
              readonly: data.readonly,
              identificationTypeId: data.identification_type_id,
              identificationNumber: data.identification_number,
            }}
            onSubmit={onSubmit}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
