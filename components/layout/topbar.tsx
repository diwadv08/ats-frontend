"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Menu, Moon, Search, Settings, Sun, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { api } from "@/lib/api";
import { WorkspaceUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorThemeSwitcher } from "@/components/shared/color-theme-switcher";

interface TopbarProps { onMenuClick: () => void; sidebarCollapsed: boolean; }
export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme(); const [user, setUser] = useState<WorkspaceUser | null>(null); const [drawer, setDrawer] = useState(false);
  const logout = () => { localStorage.removeItem("ats_access_token"); router.replace("/login"); };
  useEffect(() => { api.get<WorkspaceUser>("/auth/me").then(setUser).catch(() => undefined); }, []);
  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  return <><header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 shadow-[var(--shadow-xs)] backdrop-blur-xl sm:px-6"><button onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted lg:hidden"><Menu className="h-5 w-5" /></button><div className="relative hidden max-w-md flex-1 sm:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search applicants, jobs..." className="h-10 border-0 bg-muted/50 pl-9" /></div><div className="ml-auto flex items-center gap-2"><ColorThemeSwitcher /><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted">{theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}</button><button onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted"><Avatar className="h-8 w-8"><AvatarImage src={user?.avatarUrl || undefined} /><AvatarFallback>{initial}</AvatarFallback></Avatar><span className="hidden text-sm font-semibold sm:block">{user?.name || "Profile"}</span></button></div></header>{drawer && <><button aria-label="Close profile" onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/35" /><aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm flex-col border-l border-border bg-background p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Your profile</h2><button onClick={() => setDrawer(false)} className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5" /></button></div><div className="mt-8 flex flex-col items-center text-center"><Avatar className="h-24 w-24"><AvatarImage src={user?.avatarUrl || undefined} /><AvatarFallback className="text-3xl">{initial}</AvatarFallback></Avatar><h3 className="mt-4 text-lg font-semibold">{user?.name || "Workspace member"}</h3><p className="text-sm text-muted-foreground">{user?.email}</p><p className="mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{user?.role?.replaceAll("_", " ")}</p></div><div className="mt-8 space-y-3 border-t border-border pt-6"><p className="text-sm text-muted-foreground">{user?.department || "No department assigned"}</p><Link onClick={() => setDrawer(false)} href="/settings"><Button variant="outline" className="w-full"><Settings className="h-4 w-4" /> Profile settings</Button></Link><Button variant="destructive" className="w-full" onClick={logout}><LogOut className="h-4 w-4" /> Logout</Button></div></aside></>}</>;
}
