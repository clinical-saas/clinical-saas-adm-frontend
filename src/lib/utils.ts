import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Form Input Sanitization ────────────────────────────────────────────────

/**
 * Sanitizes a name: keeps only letters (including accented and ñ), spaces,
 * converts to UPPERCASE, collapses multiple spaces to one.
 */
export function sanitizeName(value: string): string {
  // Allow: a-z, A-Z, accented vowels, ñ/Ñ, space
  return value
    .replace(/[^a-zA-ZÁÉÍÓÚÄËÏÖÜÑÀÂÃÊÎÔÛáéíóúäëïöüñàâãêîôû\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .toUpperCase()
}

/**
 * Sanitizes input to digits only (0-9). Rejects everything else including +, -, (, ), spaces.
 */
export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * Sanitizes email: lowercases and removes spaces.
 * Does NOT strip special characters during typing (keeps @, ., _, -, + intact).
 */
export function sanitizeEmail(value: string): string {
  return value.toLowerCase().replace(/\s/g, "")
}

/**
 * Formats a digit-only string into a visual phone mask.
 * Input: "582125551234" → Output: "+58-212-555-1234"
 * Prefixes with "+" if not present.
 */
export function formatPhone(digits: string): string {
  if (!digits) return ""
  const clean = digits.replace(/\D/g, "")
  if (clean.length === 0) return ""
  
  // Always start with + if we have country code
  let formatted = clean
  // Format as +XX-XXX-XXX-XXXX for international numbers
  if (clean.length >= 11) {
    // Assume 2 digit country code + 10 digits
    const country = clean.slice(0, 2)
    const part1 = clean.slice(2, 5)
    const part2 = clean.slice(5, 8)
    const part3 = clean.slice(8, 12)
    formatted = `+${country}-${part1}-${part2}-${part3}`
  } else if (clean.length >= 10) {
    // 10 digits without country code
    const part1 = clean.slice(0, 3)
    const part2 = clean.slice(3, 6)
    const part3 = clean.slice(6, 10)
    formatted = `+${part1}-${part2}-${part3}`
  } else if (clean.length >= 7) {
    // Local number with area code
    const part1 = clean.slice(0, 3)
    const part2 = clean.slice(3, 7)
    const part3 = clean.slice(7)
    formatted = `+${part1}-${part2}-${part3}`
  } else {
    formatted = clean
  }
  
  return formatted.startsWith("+") ? formatted : `+${formatted}`
}

/**
 * Validates email format.
 * Rules:
 * - Exactly one @
 * - Before @: at least 1 char, allows . - _ +
 * - After @: at least 2 segments separated by ., each segment min 2 chars
 * - No spaces
 */
export function isValidEmail(value: string): boolean {
  if (!value || value.trim() !== value) return false
  const atCount = (value.match(/@/g) || []).length
  if (atCount !== 1) return false
  
  const [local, domain] = value.split("@")
  if (!local || local.length === 0) return false
  if (!/^[a-zA-Z0-9._+-]+$/.test(local)) return false
  
  if (!domain || domain.length < 4) return false
  const domainParts = domain.split(".")
  if (domainParts.length < 2) return false
  if (domainParts.some((part) => part.length < 2)) return false
  
  return true
}
