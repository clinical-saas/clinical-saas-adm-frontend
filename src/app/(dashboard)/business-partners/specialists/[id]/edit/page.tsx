"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Specialist } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SpecialistForm,
  type SpecialistFormValues,
} from "@/components/shared/specialist-form";

export default function EditSpecialistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.specialists.detail(id),
    queryFn: () => apiClient<Specialist>(`/service-provider/${id}`),
  });

  const onSubmit = async (values: SpecialistFormValues) => {
    setError(null);
    try {
      await apiClient(`/service-provider/${id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      router.push(`/business-partners/specialists/${id}`);
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

  if (!data) return <div>Specialist not found</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Specialist"
        action={
          <Link href={`/business-partners/specialists/${id}`}>
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
          <SpecialistForm
            defaultValues={{
              providerId: data.id,
              tenantId: data.tenant_id,
              active: data.active,
              firstName: data.first_name ?? "",
              lastName: data.last_name ?? "",
              birthDate: data.birth_date ?? "",
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
