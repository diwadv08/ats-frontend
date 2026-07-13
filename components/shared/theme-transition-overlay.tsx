/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Theme Transition Overlay
 * A premium, ~2s animated "wow" transition that plays every time
 * the color theme changes: a gradient ring expands from the
 * theme-switcher in the topbar, briefly covers the screen with a
 * shimmering preview of the incoming palette and a loader, then
 * dissolves away to reveal the fully re-themed app underneath.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";

interface ThemeTransitionOverlayProps {
  active: boolean;
  swatch: [string, string, string];
  label: string;
}

export function ThemeTransitionOverlay({
  active,
  swatch,
  label,
}: ThemeTransitionOverlayProps) {
  const [c1, c2, c3] = swatch;

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
          {/* Expanding color-wash circle, originating from the theme switcher (top-right) */}
          <motion.div
            initial={{ scale: 0, opacity: 0.95 }}
            animate={{ scale: [0, 55, 55, 0], opacity: [0.95, 1, 1, 0] }}
            transition={{
              duration: 2,
              times: [0, 0.32, 0.78, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute h-100 w-10 rounded-full"
            style={{
              top: 0,
              right: 0,
              width:'100%',
            }}
          />

          {/* Subtle shimmer sweep layered on top for extra polish */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [0, 0.35, 0.35, 0] }}
            transition={{ duration: 2, times: [0, 0.3, 0.8, 1] }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 92% 6%, ${c2}55, transparent 60%)`,
            }}
          />

          {/* Center loader card */}
          <motion.div
            initial={{ opacity: 0, y: 2, scale: 2.9 }}
            animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8], scale: [0.9, 1, 1, 0.96] }}
            transition={{ duration: 2, times: [0, 0.28, 0.8, 1], ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-white/20 bg-black/25 px-10 py-8 backdrop-blur-xl"
          >
            <div className="relative flex h-16 w-16 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${c1}, ${c2}, ${c3}, ${c1})`,
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg"
              >
                <Palette className="h-4 w-4" style={{ color: c1 }} />
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                Applying {label} theme
              </p>
              <p className="mt-0.5 text-xs text-white/70">
                Re-styling every widget…
              </p>
            </div>
            <div className="flex gap-1.5">
              {swatch.map((c, i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: c }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
