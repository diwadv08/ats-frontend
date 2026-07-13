"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleNext = () => {
    if (
      step === 1 &&
      (!formData.firstName || !formData.lastName || !formData.email)
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (step === 2 && (!formData.company || !formData.role)) {
      toast.error("Please fill in all fields");
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 750));

    toast.success("Account created!", {
      description: "Opening your RD ATS workspace...",
    });

    setTimeout(() => router.push("/dashboard"), 550);
  };

  const steps = [
    { number: 1, label: "Identity", detail: "Name and email" },
    { number: 2, label: "Workspace", detail: "Company profile" },
    { number: 3, label: "Access", detail: "Secure sign in" },
  ];

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="auth-frame grid gap-4 p-3 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <aside className="auth-brand-panel min-h-[120px] p-6 sm:p-8 lg:min-h-[380px]">
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold tracking-tight">RD ATS</span>
              </div>

              <p className="auth-chip mb-5 border-white/12 bg-white/10 text-white/70 dark:border-border/70 dark:bg-background/30 dark:text-muted-foreground">
                <ShieldCheck className="h-4.5 w-3.5 text-primary" />
                New workspace setup
              </p>
              <h1 className="max-w-lg text-4xl font-bold leading-tight text-white dark:text-foreground">
                Configure your hiring.
              </h1>
            </div>

            <div className="grid gap-2">
              {steps.map((item) => {
                const active = step >= item.number;
                return (
                  <motion.div
                    key={item.number}
                    animate={{ x: step === item.number ? 6 : 0 }}
                    className={`rounded-xl border p-4 backdrop-blur ${
                      active
                        ? "border-primary/38 bg-primary/14 text-white dark:text-foreground"
                        : "border-white/12 bg-white/8 text-white/58 dark:border-border/70 dark:bg-background/24 dark:text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/16 text-sm font-bold text-white dark:bg-muted/50 dark:text-foreground">
                        {step > item.number ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          item.number
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-xs opacity-70">{item.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[480px] items-center px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="auth-chip mb-4 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Step {step} of 3
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start with the basics, then secure your workspace.
                </p>
              </div>

              <div className="flex gap-2">
                {steps.map((item) => (
                  <div
                    key={item.number}
                    className={`h-2.5 w-10 rounded-full transition-colors ${
                      step >= item.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="auth-card p-5 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.form
                  key={step}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.24 }}
                  onSubmit={
                    step === 3 ? handleSubmit : (e) => e.preventDefault()
                  }
                  className="space-y-5"
                >
                  {step === 1 && (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First name</label>
                          <Input
                            placeholder="John"
                            icon={<User className="h-4 w-4" />}
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last name</label>
                          <Input
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          icon={<Mail className="h-4 w-4" />}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company</label>
                        <Input
                          placeholder="Acme Inc."
                          icon={<Building2 className="h-4 w-4" />}
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Job title</label>
                        <Input
                          placeholder="HR Manager"
                          icon={<Briefcase className="h-4 w-4" />}
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Password</label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Min. 8 characters"
                              icon={<Lock className="h-4 w-4" />}
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Confirm password
                          </label>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Repeat password"
                            icon={<Lock className="h-4 w-4" />}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <label className="flex items-start gap-2 rounded-xl border border-border/60 bg-muted/32 p-4 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          required
                        />
                        <span>
                          I agree to the{" "}
                          <Link href="#" className="font-medium text-primary">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="font-medium text-primary">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1"
                        isLoading={isLoading}
                      >
                        Create Account
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.form>
              </AnimatePresence>
            </div>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </motion.section>
    </main>
  );
}
