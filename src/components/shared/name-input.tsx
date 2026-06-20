"use client";

import { Input } from "@/components/ui/input";
import { sanitizeName } from "@/lib/utils";

interface NameInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function NameInput({
  value = "",
  onChange,
  onBlur,
  placeholder,
  disabled,
  className,
}: NameInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeName(e.target.value);
    onChange?.(sanitized);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
}
