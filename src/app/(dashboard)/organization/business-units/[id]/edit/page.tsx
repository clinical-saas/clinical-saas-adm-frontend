"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { BusinessUnit } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BusinessUnitForm,
  type BusinessUnitFormValues,
} from "@/components/shared/business-unit-form";

export default function EditBusinessUnitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.businessUnits.detail(id),
    queryFn: () => apiClient<BusinessUnit>(`/business-unit/${id}`),
  });

  const onSubmit = async (values: BusinessUnitFormValues) => {
    setError(null);
    try {
      const payload = {
        ...values,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
      };
      await apiClient(`/business-unit/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      router.push("/organization/business-units");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!data) {
    return <div className="text-destructive">Business Unit no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar Business Unit"
        action={
          <Link href={`/organization/business-units/${id}`}>
            <Button variant="outline">Cancelar</Button>
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
          <BusinessUnitForm
            defaultValues={{
              tenantId: data.tenant_id,
              code: data.code,
              businessName: data.business_name,
              email: data.email ?? "",
              phone: data.phone ?? "",
              address: data.address ?? "",
              active: data.active,
            }}
            onSubmit={onSubmit}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
