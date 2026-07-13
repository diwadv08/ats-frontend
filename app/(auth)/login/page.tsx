"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Eye,
  EyeOff,
  Lock,
  Mail,
  SearchCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim().toLowerCase();
    if (!email || !formData.password) {
      toast.error("Enter your email address and password.");
      return;
    }
    setIsLoading(true);
    try {
      const session = await api.post<{ accessToken: string; user: { role: string } }>("/auth/signin", { email, password: formData.password });
      localStorage.setItem("ats_access_token", session.accessToken);
      localStorage.setItem("ats_user", JSON.stringify(session.user));
      toast.success("Welcome back!", { description: `Signed in as ${session.user.role.replaceAll("_", " ")}.` });
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const boardItems = [
    { label: "Resume review", value: "32", icon: SearchCheck },
    { label: "Interview slots", value: "14", icon: BellRing },
    { label: "Team notes", value: "89", icon: Users },
  ];

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="auth-frame grid gap-4 p-3 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <aside className="auth-brand-panel hidden min-h-[640px] p-8 lg:block">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold tracking-tight">RD ATS</span>
              </div>

              <div className="max-w-md">
                <p className="auth-chip mb-5 border-white/12 bg-white/10 text-white/70 dark:border-border/70 dark:bg-background/30 dark:text-muted-foreground">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                  Hiring operations console
                </p>
                <h1 className="text-5xl font-bold leading-tight text-white dark:text-foreground">
                  Enter a calmer command center.
                </h1>
              </div>
            </div>

            <div className="grid gap-3">
              {boardItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1 }}
                  className="flex items-center justify-between rounded-xl border border-white/12 bg-white/10 p-4 backdrop-blur dark:border-border/70 dark:bg-background/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/18 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-white/78 dark:text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-white dark:text-foreground">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[480px] items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">RD ATS</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <p className="auth-chip mb-4 text-xs">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                Secure workspace
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Sign in
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Continue to your applicant tracking dashboard.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleSubmit}
              className="auth-card space-y-5 p-5 sm:p-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  icon={<Mail className="h-4 w-4" />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link href="#" className="text-sm font-semibold text-primary">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    icon={<Lock className="h-4 w-4" />}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full text-base font-semibold"
                isLoading={isLoading}
                disabled={isLoading || !formData.email.trim() || !formData.password}
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>

            <div className="mt-6 rounded-xl border border-border/60 bg-muted/34 p-4 text-center text-xs text-muted-foreground">
              Use your workspace account to access the hiring console.
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              New to RD ATS?{" "}
              <Link href="/signup" className="font-semibold text-primary">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </motion.section>
    </main>
  );
}
