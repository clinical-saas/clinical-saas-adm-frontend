"use client";

export interface ChipOption {
  id: string;
  label: string;
}

interface ChipToggleGroupProps {
  label?: string;
  options: ChipOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll?: () => void;
  showToggleAll?: boolean;
  emptyText?: string;
}

const chipClass =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium cursor-pointer transition-colors data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=false]:border-input data-[active=false]:text-muted-foreground";

/**
 * Multi-select rendered as toggleable pills, with an optional
 * "select all / deselect all" pill. Presentational and controlled:
 * the parent owns the selected state. Shared by the business-partner
 * list filters (status / tenant / business units).
 */
export function ChipToggleGroup({
  label,
  options,
  selectedIds,
  onToggle,
  onToggleAll,
  showToggleAll = true,
  emptyText,
}: ChipToggleGroupProps) {
  const allSelected =
    options.length > 0 && options.every((o) => selectedIds.includes(o.id));

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.length > 0 ? (
          <>
            {showToggleAll && onToggleAll && (
              <span
                onClick={onToggleAll}
                data-active={allSelected}
                className={chipClass}
              >
                {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
              </span>
            )}
            {options.map((o) => (
              <span
                key={o.id}
                onClick={() => onToggle(o.id)}
                data-active={selectedIds.includes(o.id)}
                className={chipClass}
              >
                {o.label}
              </span>
            ))}
          </>
        ) : (
          emptyText && (
            <span className="text-sm text-muted-foreground">{emptyText}</span>
          )
        )}
      </div>
    </div>
  );
}
