import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminAuthService, type AdminSession } from "@/lib/admin-api";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/rural")({
  head: () => ({
    meta: [
      { title: "DE'BAIT 2026 — RURAL OPERATIONAL DESK" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: RuralAdminRoute,
});

function RuralAdminRoute() {
  const [session, setSession] = useState<AdminSession | null>(() => AdminAuthService.getSession());

  useEffect(() => {
    const handleAuthChange = () => {
      setSession(AdminAuthService.getSession());
    };

    window.addEventListener("rural-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("rural-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    setSession(AdminAuthService.getSession());
  };

  const handleLogout = () => {
    AdminAuthService.logout();
    setSession(null);
  };

  if (!session) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard operatorName={session.username} onLogout={handleLogout} />;
}
