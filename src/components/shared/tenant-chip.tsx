// Tenant pill (blue). Shared across detail views.
export function TenantChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
      {name}
    </span>
  );
}
