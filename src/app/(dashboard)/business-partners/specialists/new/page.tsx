"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient, ApiError } from "@/lib/api/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SpecialistForm,
  type SpecialistFormValues,
} from "@/components/shared/specialist-form";

export default function CreateSpecialistPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: SpecialistFormValues) => {
    setError(null);
    try {
      const { providerId: _, businessUnitIds: __, ...payload } = values;
      await apiClient("/service-provider", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push("/business-partners/specialists");
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
        title="Create Specialist"
        action={
          <Link href="/business-partners/specialists">
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
          <SpecialistForm onSubmit={onSubmit} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
