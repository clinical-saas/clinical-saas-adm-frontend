"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { Specialist } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { CommercialRelationChips } from "@/components/shared/commercial-relation-chips";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SpecialistDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.specialists.detail(id),
    queryFn: () => apiClient<Specialist>(`/service-provider/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  if (!data) return null;

  const fullName = [data.first_name, data.last_name]
    .filter(Boolean)
    .join(" ");

  function calculateAge(birthDate: string | null): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  const age = calculateAge(data.birth_date);

  return (
    <div className="space-y-6">
      <PageHeader
        title={fullName || "Specialist Details"}
        action={
          <Link href="/business-partners/specialists">
            <Button variant="outline">Back</Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombres</p>
              <p className="font-medium">{data.first_name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Apellidos</p>
              <p className="font-medium">{data.last_name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{data.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefono</p>
              <p className="font-medium">{data.phone || "—"}</p>
            </div>
            {data.birth_date && (
              <div>
                <p className="text-sm text-muted-foreground">Fecha Nac.</p>
                <p className="font-medium">{data.birth_date}</p>
              </div>
            )}
            {age !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Edad</p>
                <p className="font-medium">{age} años</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Direccion</p>
              <p className="font-medium">{data.short_address || data.address || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relación Comercial</p>
              <CommercialRelationChips
                isSupplier={data.is_supplier}
                isAgent={data.is_agent}
                isCustomer={data.is_customer}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">
                {data.active ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Readonly</p>
              <p className="font-medium">{data.readonly ? "Si" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Link href={`/business-partners/specialists/${id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Link href={`/business-partners/specialists/${id}/history`}>
          <Button variant="outline">Service History</Button>
        </Link>
      </div>
    </div>
  );
}
