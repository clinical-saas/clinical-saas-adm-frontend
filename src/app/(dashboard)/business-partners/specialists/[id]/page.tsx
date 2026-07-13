"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import { fmtDateOnly } from "@/lib/format";
import type { Specialist, IdentificationType } from "@/types";
import type { TenantLite } from "@/components/shared/business-unit-form";
import { PageHeader } from "@/components/shared/page-header";
import { CommercialRelationChips } from "@/components/shared/commercial-relation-chips";
import { PhoneFormatter } from "@/components/shared/phone-formatter";
import { InfoHint } from "@/components/shared/info-hint";
import { TenantChip } from "@/components/shared/tenant-chip";
import { BusinessUnitChips } from "@/components/shared/business-unit-chips";
import { StatusChip } from "@/components/shared/status-chip";
import { ReadonlyChip } from "@/components/shared/readonly-chip";
import { AuditSection } from "@/components/shared/audit-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) {
    return null;
  }
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) {
    return null;
  }
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function SpecialistDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.specialists.detail(id),
    queryFn: () => apiClient<Specialist>(`/service-provider/${id}`),
  });

  const { data: tenants } = useQuery({
    queryKey: queryKeys.tenants.list(),
    queryFn: () => apiClient<TenantLite[]>("/tenant"),
  });

  const { data: identificationTypes } = useQuery({
    queryKey: queryKeys.identificationTypes.list(),
    queryFn: () => apiClient<IdentificationType[]>("/identification-type"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ");
  const tenantName =
    tenants?.find((t) => t.id === data.tenant_id)?.business_name ?? data.tenant_id;
  const idType = identificationTypes?.find(
    (t) => String(t.id) === String(data.identification_type_id),
  );
  const idTypeName = idType?.name ?? String(data.identification_type_id);
  const age = calculateAge(data.birth_date);

  return (
    <div className="space-y-6">
      <PageHeader
        title={fullName || "Specialist Details"}
        action={
          <Link href="/business-partners/specialists">
            <Button variant="outline">Volver</Button>
          </Link>
        }
      />
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tenant</p>
              <TenantChip name={tenantName} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unidades de Negocio</p>
              <BusinessUnitChips units={data.business_units} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Identificación</p>
              <p className="font-medium">{idTypeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Número de Identificación</p>
              <p className="font-medium">{data.identification_number || "—"}</p>
            </div>
          </div>

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
              <p className="font-medium">
                <PhoneFormatter phone={data.phone} />
              </p>
            </div>
            {data.birth_date && (
              <div>
                <p className="text-sm text-muted-foreground">Fecha Nac.</p>
                <p className="font-medium">{fmtDateOnly(data.birth_date)}</p>
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
              <p className="text-sm text-muted-foreground">
                Relación Comercial{" "}
                <InfoHint text="Campo de solo lectura, no editable" />
              </p>
              <CommercialRelationChips
                isSupplier={data.is_supplier}
                isAgent={data.is_agent}
                isCustomer={data.is_customer}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <StatusChip active={data.active} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Readonly</p>
              <ReadonlyChip readonly={data.readonly} />
            </div>
          </div>
        </CardContent>
      </Card>
      <AuditSection
        createdAt={data.created_at}
        createdBy={data.created_by}
        updatedAt={data.updated_at}
        updatedBy={data.updated_by}
        removedAt={data.removed_at}
        removedBy={data.removed_by}
      />
      <div className="flex gap-2">
        <Link href={`/business-partners/specialists/${id}/edit`}>
          <Button variant="outline">Editar</Button>
        </Link>
        <Link href={`/business-partners/specialists/${id}/history`}>
          <Button variant="outline">Service History</Button>
        </Link>
      </div>
    </div>
  );
}
