"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient, ApiError } from "@/lib/api/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BusinessUnitForm,
  type BusinessUnitFormValues,
} from "@/components/shared/business-unit-form";

export default function CreateBusinessUnitPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: BusinessUnitFormValues) => {
    setError(null);
    try {
      const payload = {
        ...values,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
      };
      await apiClient("/business-unit", {
        method: "POST",
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crear Business Unit"
        action={
          <Link href="/organization/business-units">
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
          <BusinessUnitForm onSubmit={onSubmit} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
