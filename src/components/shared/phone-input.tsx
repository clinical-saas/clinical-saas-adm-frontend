"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { sanitizeDigits, formatPhone } from "@/lib/utils";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value = "",
  onChange,
  onBlur,
  placeholder,
  disabled,
  className,
}: PhoneInputProps) {
  // Display formatted value visually, but internal form value is clean digits
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    // When external value changes (e.g., form reset), update display
    const formatted = value ? formatPhone(value) : "";
    setDisplayValue(formatted);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract only digits
    const digits = sanitizeDigits(e.target.value);
    onChange?.(digits);
    // Update display with formatted version
    setDisplayValue(digits ? formatPhone(digits) : "");
  };

  return (
    <Input
      value={displayValue}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder ?? "+XX-XXX-XXX-XXXX"}
      disabled={disabled}
      className={className}
    />
  );
}
