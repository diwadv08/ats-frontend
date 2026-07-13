"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Shield, UserCog, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { WorkspaceUser, UserRole } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const roles: UserRole[] = ["SUPER_ADMIN", "ADMIN", "RECRUITER", "INTERVIEWER", "MANAGER"];
const label = (role: string) => role.replaceAll("_", " ");

export default function UsersPage() {
  const [users, setUsers] = useState<WorkspaceUser[]>([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState<string | null>(null);
  useEffect(() => { api.get<WorkspaceUser[]>("/auth/users").then(setUsers).catch((error) => toast.error(error instanceof ApiError ? error.message : "Unable to load users")).finally(() => setLoading(false)); }, []);
  const updateRole = async (user: WorkspaceUser, role: UserRole) => { setSaving(user.id); try { const updated = await api.patch<WorkspaceUser>(`/auth/users/${user.id}`, { role }); setUsers((items) => items.map((item) => item.id === user.id ? updated : item)); toast.success(`${user.name}'s role updated`); } catch (error) { toast.error(error instanceof ApiError ? error.message : "Role update failed"); } finally { setSaving(null); } };
  return <div className="mx-auto max-w-6xl space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-sm font-medium text-primary"><Shield className="h-4 w-4" /> Access control</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Users</h1><p className="mt-2 text-sm text-muted-foreground">Manage every workspace member and their role.</p></div><Badge variant="secondary" className="w-fit"><Users className="mr-1.5 h-3.5 w-3.5" /> {users.length} members</Badge></div><section className="glass-card overflow-hidden rounded-2xl">{loading ? <div className="flex h-60 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : <div className="divide-y divide-border/50">{users.map((user) => <div key={user.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><Avatar><AvatarImage src={user.avatarUrl || undefined} /><AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate font-semibold">{user.name}</p><p className="truncate text-sm text-muted-foreground">{user.email} · {user.department || "No department"}</p></div></div><div className="flex flex-wrap gap-2">{roles.map((role) => <button key={role} disabled={saving === user.id} onClick={() => updateRole(user, role)} className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${user.role === role ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"}`}>{user.role === role && <Check className="h-3 w-3" />}{label(role)}</button>)}</div></div>)}</div>}</section></div>;
}
