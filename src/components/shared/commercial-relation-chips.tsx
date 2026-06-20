interface CommercialRelationChipsProps {
  isSupplier: boolean;
  isAgent: boolean;
  isCustomer: boolean;
}

const chips = [
  { key: "isSupplier", label: "Specialist" },
  { key: "isAgent", label: "Agent" },
  { key: "isCustomer", label: "Customer" },
] as const;

export function CommercialRelationChips({
  isSupplier,
  isAgent,
  isCustomer,
}: CommercialRelationChipsProps) {
  const values = [isSupplier, isAgent, isCustomer];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, index) => (
        <span
          key={chip.key}
          data-active={values[index]}
          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=false]:border-input data-[active=false]:text-muted-foreground"
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}
