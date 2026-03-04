// File: src/lib/auth.ts

import api from "@/lib/api";

export async function isAuthenticated(): Promise<boolean> {
  try {
    await api.get("/auth/me", {
        withCredentials: true,
      });// any protected route
    return true;
  } catch {
    return false;
  }
}

export function logout() {
  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`;
}