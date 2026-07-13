/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Dashboard Shell
 * Wraps dashboard pages with sidebar, topbar, and content area.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("ats_access_token")) { router.replace("/login"); return; }
    setAuthenticated(true);
  }, [router]);

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <motion.div
          initial={{ x: -260 }}
          animate={{ x: mobileMenuOpen ? 0 : -260 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 z-50"
        >
          <Sidebar
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
          />
        </motion.div>
      </div>

      {/* Main content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 260,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block min-h-screen"
      >
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="p-6 sm:p-8">{children}</div>
      </motion.main>

      {/* Mobile main content */}
      <div className="lg:hidden min-h-screen">
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          sidebarCollapsed={true}
        />
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
