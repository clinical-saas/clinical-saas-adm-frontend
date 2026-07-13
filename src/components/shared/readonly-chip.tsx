// Readonly pill (black/white). Shared across detail views.
export function ReadonlyChip({ readonly }: { readonly: boolean }) {
  if (readonly) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-gray-100 dark:text-gray-900">
        Solo lectura
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Editable
    </span>
  );
}
