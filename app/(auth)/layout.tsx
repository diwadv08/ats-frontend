/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Auth Layout
 * Minimal layout for login/signup pages.
 * ─────────────────────────────────────────────────────────────
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
