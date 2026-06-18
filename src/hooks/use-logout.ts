"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/stores/auth";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:4000/api";
      await fetch(`${API_BASE.replace(/\/$/, "")}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Server logout best-effort — clear local state regardless
    }
    clearAuth();
    window.location.href = "/login";
  }, [clearAuth]);

  return { logout };
}
