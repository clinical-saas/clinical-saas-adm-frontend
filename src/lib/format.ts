// Date formatting helpers shared across detail views.

// Full date + time in the viewer's locale/timezone. For real timestamps
// (audit created/updated/removed).
export function fmtDate(value: string | null): string {
  if (!value) {
    return "—";
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleString();
}

// Calendar date only, formatted in UTC so a negative local offset does not
// shift it back one day (e.g. birth_date stored as UTC timestamptz).
export function fmtDateOnly(value: string | null): string {
  if (!value) {
    return "—";
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleDateString(undefined, { timeZone: "UTC" });
}
