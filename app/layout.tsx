/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Root Layout
 * Theme provider, fonts, and global providers setup.
 * ─────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ColorThemeProvider, colorThemeInitScript } from "@/components/providers/color-theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RD ATS — Premium Applicant Tracking System",
    template: "%s | RD ATS",
  },
  description:
    "A premium, ultra-modern Applicant Tracking System built with Next.js 15, TypeScript, and Tailwind CSS.",
  keywords: [
    "ATS",
    "Applicant Tracking System",
    "Recruitment",
    "Hiring",
    "HR Software",
    "Next.js",
    "React",
  ],
  authors: [{ name: "RD ATS" }],
  creator: "RD ATS",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "RD ATS — Premium Applicant Tracking System",
    description: "Ultra-modern SaaS dashboard for recruitment teams.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets data-color-theme before paint so there's no flash of the default palette */}
        <script dangerouslySetInnerHTML={{ __html: colorThemeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ColorThemeProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className:
                  "glass-card border-border/50 shadow-[var(--shadow-lg)]",
              }}
            />
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
