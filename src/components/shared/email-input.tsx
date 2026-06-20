"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { sanitizeEmail, isValidEmail } from "@/lib/utils";

interface EmailInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

function getEmailError(value: string): string | undefined {
  if (!value) return undefined; // Empty is allowed (optional)
  
  if (isValidEmail(value)) return undefined;
  
  // Determine specific error
  if (!value.includes("@")) {
    return "Falta el simbolo @";
  }
  
  const [local, domain] = value.split("@");
  if (!local || local.length === 0) {
    return "Formato de email invalido";
  }
  
  if (!domain || domain.length < 4 || !domain.includes(".")) {
    return "Dominio invalido (minimo 2 segmentos separados por punto)";
  }
  
  const domainParts = domain.split(".");
  if (domainParts.some((part) => part.length < 2)) {
    return "Dominio invalido (minimo 2 segmentos separados por punto)";
  }
  
  return "Formato de email invalido";
}

export function EmailInput({
  value = "",
  onChange,
  onBlur,
  placeholder,
  disabled,
  className,
  error: externalError,
}: EmailInputProps) {
  const [internalError, setInternalError] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeEmail(e.target.value);
    onChange?.(sanitized);
    // Clear error while typing
    if (internalError) setInternalError(undefined);
  };

  const handleBlur = () => {
    onBlur?.();
    // Validate on blur only if there's a value
    if (value) {
      const err = getEmailError(value);
      setInternalError(err);
    }
  };

  const error = externalError ?? internalError;

  return (
    <div className="space-y-1">
      <Input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder ?? "juan@example.com"}
        disabled={disabled}
        className={className}
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
