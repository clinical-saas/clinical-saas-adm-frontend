import { Card, CardContent } from "@/components/ui/card";
import { fmtDate } from "@/lib/format";

interface AuditSectionProps {
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  removedAt?: string | null;
  removedBy?: string | null;
}

// Audit card (created/updated/removed _at/_by). Shared across detail views.
// The removed_* pair only renders when removedAt is present.
export function AuditSection({
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
  removedAt,
  removedBy,
}: AuditSectionProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <p className="text-sm font-semibold text-muted-foreground">Auditoría</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Creado</p>
            <p className="font-medium">{fmtDate(createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Creado por</p>
            <p className="font-medium">{createdBy || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actualizado</p>
            <p className="font-medium">{fmtDate(updatedAt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actualizado por</p>
            <p className="font-medium">{updatedBy || "—"}</p>
          </div>
          {removedAt && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Eliminado</p>
                <p className="font-medium">{fmtDate(removedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eliminado por</p>
                <p className="font-medium">{removedBy || "—"}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
