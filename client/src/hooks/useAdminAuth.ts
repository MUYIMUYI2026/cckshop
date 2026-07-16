import { useState, useEffect } from "react";

type AdminUser = { id: number; email: string; name?: string } | null;

let cachedAdmin: AdminUser | undefined = undefined;

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser>(cachedAdmin ?? null);
  const [loading, setLoading] = useState(cachedAdmin === undefined);

  useEffect(() => {
    if (cachedAdmin !== undefined) {
      setAdmin(cachedAdmin);
      setLoading(false);
      return;
    }
    fetch("/api/admin-auth/me", { credentials: "include" })
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        cachedAdmin = data;
        setAdmin(data);
      })
      .catch(() => {
        cachedAdmin = null;
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/admin-auth/logout", { method: "POST", credentials: "include" });
    cachedAdmin = null;
    window.location.href = "/admin/login";
  };

  return { admin, loading, isAuthenticated: !!admin, logout };
}
