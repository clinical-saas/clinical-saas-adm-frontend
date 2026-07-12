"use client";

import { Info } from "lucide-react";

interface InfoHintProps {
  text: string;
  className?: string;
}

// Lightweight, dependency-free hint: an info icon with a native tooltip
// (title attribute). Used where a full tooltip system is not available.
export function InfoHint({ text, className }: InfoHintProps) {
  return (
    <span
      title={text}
      aria-label={text}
      className={`inline-flex cursor-help align-middle text-muted-foreground ${className ?? ""}`}
    >
      <Info className="h-3.5 w-3.5" />
    </span>
  );
}
