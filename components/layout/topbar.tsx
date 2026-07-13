/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Topbar Component
 * Header with search, notifications, theme toggle, and user menu.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColorThemeSwitcher } from "@/components/shared/color-theme-switcher";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ onMenuClick, sidebarCollapsed }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "New applicant",
      message: "Sarah Chen applied for Frontend Developer",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Interview reminder",
      message: "Marcus Johnson interview at 2:00 PM",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Offer accepted",
      message: "David Kim accepted the DevOps offer",
      time: "3h ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/78 backdrop-blur-xl px-4 sm:px-6 shadow-[var(--shadow-xs)]">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applicants, jobs..."
            className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-emerald-500/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Color theme picker */}
        <ColorThemeSwitcher />

        {/* Light/dark toggle */}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          {!mounted ? (
            <div className="h-4 w-4" />
          ) : (
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4 text-slate-600" />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card1 rounded-xl border border-border/50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <span className="text-xs text-muted-foreground">
                    {notifications.filter((n) => n.unread).length} new
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer",
                        notification.unread && "bg-emerald-500/5"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 rounded-full shrink-0",
                          notification.unread
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/30"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <Avatar className="h-8 w-8 ring-2">
              <AvatarFallback className="bg-primary font-semibold">AM</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">Alex Morgan</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hiring Manager
              </p>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 glass-card1 rounded-xl border border-border/50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-medium">Alex Morgan</p>
                  <p className="text-xs text-muted-foreground">
                    alex.morgan@rdats.com
                  </p>
                </div>
                <div className="py-1">
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-border/50 py-1">
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
