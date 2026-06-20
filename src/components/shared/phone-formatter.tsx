"use client";

import { cn } from "@/lib/utils";

export interface PhoneFormatterProps {
  phone: string | null | undefined;
  className?: string;
}

function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 0) return "—";

  let formatted = digits;

  if (!phone.startsWith("+") && !phone.startsWith("00")) {
    formatted = `+${digits}`;
  } else if (phone.startsWith("00")) {
    formatted = `+${digits.slice(2)}`;
  }

  if (formatted.length >= 10) {
    if (formatted.length === 10) {
      formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6)}`;
    } else if (formatted.length === 11) {
      if (formatted.startsWith("+1")) {
        formatted = `${formatted.slice(0, 2)} (${formatted.slice(2, 5)}) ${formatted.slice(5, 8)}-${formatted.slice(8)}`;
      } else {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6, 10)}-${formatted.slice(10)}`;
      }
    } else {
      formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6, 10)}-${formatted.slice(10)}`;
    }
  } else if (formatted.length >= 7) {
    formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7)}`;
  } else if (formatted.length >= 4) {
    formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
  }

  return formatted;
}

export function PhoneFormatter({ phone, className }: PhoneFormatterProps) {
  return (
    <span className={cn("", className)}>
      {formatPhone(phone)}
    </span>
  );
}
