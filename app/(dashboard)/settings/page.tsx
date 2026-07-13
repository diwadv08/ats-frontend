"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, Save, Settings, Upload } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { WorkspaceUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SettingsPage() {
  const [user, setUser] = useState<WorkspaceUser | null>(null); const [saving, setSaving] = useState(false);
  useEffect(() => { api.get<WorkspaceUser>("/auth/me").then(setUser).catch(() => toast.error("Unable to load your profile")); }, []);
  if (!user) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const save = async () => { setSaving(true); try { const result = await api.patch<WorkspaceUser>("/auth/me", { name: user.name, department: user.department, avatarUrl: user.avatarUrl || undefined }); setUser(result); toast.success("Profile settings saved"); } catch (error) { toast.error(error instanceof ApiError ? error.message : "Unable to save profile"); } finally { setSaving(false); } };
  const upload = (file?: File) => { if (!file) return; if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; } if (file.size > 750_000) { toast.error("Please use an image smaller than 750 KB"); return; } const reader = new FileReader(); reader.onload = () => setUser({ ...user, avatarUrl: String(reader.result) }); reader.readAsDataURL(file); };
  return <div className="mx-auto max-w-2xl space-y-6"><div><p className="flex items-center gap-2 text-sm font-medium text-primary"><Settings className="h-4 w-4" /> Workspace profile</p><h1 className="mt-1 text-3xl font-bold">Profile settings</h1></div><section className="glass-card space-y-6 rounded-2xl p-6"><div className="flex items-center gap-4"><Avatar className="h-20 w-20"><AvatarImage src={user.avatarUrl || undefined} /><AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar><div><p className="font-semibold">Profile photo</p><p className="text-sm text-muted-foreground">Upload an image or use a direct image URL.</p><label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary"><Upload className="h-4 w-4" /> Upload photo<input type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0])} /></label></div></div><div className="space-y-2"><label className="text-sm font-medium">Photo URL</label><Input value={user.avatarUrl || ""} onChange={(e) => setUser({ ...user, avatarUrl: e.target.value })} placeholder="https://..." icon={<Camera className="h-4 w-4" />} /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">Name</label><Input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Department</label><Input value={user.department || ""} onChange={(e) => setUser({ ...user, department: e.target.value })} /></div></div><div className="flex justify-end"><Button onClick={save} isLoading={saving}><Save className="h-4 w-4" /> Save changes</Button></div></section></div>;
}
