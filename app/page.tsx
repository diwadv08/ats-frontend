/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Root Page (redirects to login)
 * ─────────────────────────────────────────────────────────────
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}
