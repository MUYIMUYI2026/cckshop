import { useState, useEffect } from "react";

export type BuyerUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
} | null;

let cachedBuyer: BuyerUser | undefined = undefined;

export function useBuyerAuth() {
  const [buyer, setBuyer] = useState<BuyerUser>(cachedBuyer ?? null);
  const [loading, setLoading] = useState(cachedBuyer === undefined);

  useEffect(() => {
    if (cachedBuyer !== undefined) {
      setBuyer(cachedBuyer);
      setLoading(false);
      return;
    }
    fetch("/api/buyer-auth/me", { credentials: "include" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        cachedBuyer = data;
        setBuyer(data);
      })
      .catch(() => {
        cachedBuyer = null;
        setBuyer(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/buyer-auth/logout", { method: "POST", credentials: "include" });
    cachedBuyer = null;
    setBuyer(null);
    window.location.href = "/";
  };

  const refreshAuth = () => {
    cachedBuyer = undefined;
    setLoading(true);
    fetch("/api/buyer-auth/me", { credentials: "include" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        cachedBuyer = data;
        setBuyer(data);
      })
      .catch(() => {
        cachedBuyer = null;
        setBuyer(null);
      })
      .finally(() => setLoading(false));
  };

  return {
    buyer,
    loading,
    isAuthenticated: !!buyer,
    logout,
    refreshAuth,
  };
}
