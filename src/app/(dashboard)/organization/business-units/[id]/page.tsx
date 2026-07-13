"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { BusinessUnit } from "@/types";
import type { TenantLite } from "@/components/shared/business-unit-form";
import { PageHeader } from "@/components/shared/page-header";
import { TenantChip } from "@/components/shared/tenant-chip";
import { PhoneFormatter } from "@/components/shared/phone-formatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value}</p>
    </div>
  );
}

function fmtDate(value: string | null): string {
  if (!value) {
    return "—";
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleString();
}

export default function BusinessUnitDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.businessUnits.detail(id),
    queryFn: () => apiClient<BusinessUnit>(`/business-unit/${id}`),
  });

  const { data: tenants } = useQuery({
    queryKey: queryKeys.tenants.list(),
    queryFn: () => apiClient<TenantLite[]>("/tenant"),
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

  const tenantName = tenants?.find((t) => t.id === data.tenant_id)?.business_name ?? data.tenant_id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalle Business Unit"
        action={
          <div className="flex gap-2">
            <Link href={`/organization/business-units/${id}/edit`}>
              <Button>Editar</Button>
            </Link>
            <Link href="/organization/business-units">
              <Button variant="outline">Volver</Button>
            </Link>
          </div>
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tenant" value={<TenantChip name={tenantName} />} />
            <Field label="Código" value={data.code} />
            <Field label="Nombre Comercial" value={data.business_name} />
            <Field
              label="Status"
              value={
                data.active ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Inactivo
                  </span>
                )
              }
            />
            <Field label="Email" value={data.email ?? "—"} />
            <Field label="Teléfono" value={<PhoneFormatter phone={data.phone} />} />
            <Field label="Dirección" value={data.address ?? "—"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm font-semibold text-muted-foreground">Auditoría</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Creado" value={fmtDate(data.created_at)} />
            <Field label="Creado por" value={data.created_by ?? "—"} />
            <Field label="Actualizado" value={fmtDate(data.updated_at)} />
            <Field label="Actualizado por" value={data.updated_by ?? "—"} />
            {data.removed_at && (
              <>
                <Field label="Eliminado" value={fmtDate(data.removed_at)} />
                <Field label="Eliminado por" value={data.removed_by ?? "—"} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
