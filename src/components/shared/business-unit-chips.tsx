interface BusinessUnitChipsProps {
  units: Array<{ id: string; business_name: string }> | undefined;
  className?: string;
}

// Business-unit pills. Shared across list and detail views. `className` lets
// callers constrain width (e.g. inside a table cell: max-w-[300px]).
export function BusinessUnitChips({ units, className }: BusinessUnitChipsProps) {
  if (!units || units.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className={`flex flex-wrap gap-1 ${className ?? ""}`}>
      {units.map((u) => (
        <span
          key={u.id}
          className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs whitespace-nowrap"
        >
          {u.business_name || u.id}
        </span>
      ))}
    </div>
  );
}
