/**
 * ─────────────────────────────────────────────────────────────
 * RD ATS Admin — Color Theme Switcher
 * Compact swatch picker: 3 curated theme presets, each shown as
 * a name plus its 3 colors laid out in a row, and a "Customize"
 * panel where the user can pick their own primary / secondary /
 * accent colors to build their own theme.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Settings2, Sparkles } from "lucide-react";
import { COLOR_THEMES, CUSTOM_THEME_ID } from "@/lib/color-themes";
import { useColorTheme } from "@/components/providers/color-theme-provider";
import { cn } from "@/lib/utils";

const COLOR_LABELS = ["Primary", "Secondary", "Accent"] as const;

export function ColorThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const { colorTheme, setColorTheme, customColors, setCustomColors } =
    useColorTheme();
  const [draftColors, setDraftColors] = useState(customColors);

  const openCustomize = () => {
    setDraftColors(customColors);
    setCustomizing(true);
  };

  const applyCustom = () => {
    setCustomColors(draftColors);
    setCustomizing(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="Change color theme"
        title="Color theme"
      >
        <Palette className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setOpen(false);
                setCustomizing(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-72 glass-card1 rounded-xl border border-border/50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="font-semibold text-sm">Color theme</h3>
              </div>

              <AnimatePresence mode="wait">
                {!customizing ? (
                  <motion.div
                    key="presets"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-2"
                  >
                    {COLOR_THEMES.map((t) => {
                      const active = t.id === colorTheme;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setColorTheme(t.id);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                            active && "bg-primary/10"
                          )}
                        >
                          <span className="text-sm font-medium">
                            {t.label}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="flex shrink-0 gap-1">
                              {t.swatch.map((c, i) => (
                                <span
                                  key={i}
                                  className="h-5 w-5 rounded-md ring-1 ring-black/5"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </span>
                            {active && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </span>
                        </button>
                      );
                    })}

                    {/* Custom theme entry */}
                    <button
                      onClick={() => {
                        setColorTheme(CUSTOM_THEME_ID);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                        colorTheme === CUSTOM_THEME_ID && "bg-primary/10"
                      )}
                    >
                      <span className="text-sm font-medium">Custom</span>
                      <span className="flex items-center gap-2">
                        <span className="flex shrink-0 gap-1">
                          {[
                            customColors.primary,
                            customColors.secondary,
                            customColors.accent,
                          ].map((c, i) => (
                            <span
                              key={i}
                              className="h-5 w-5 rounded-md ring-1 ring-black/5"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </span>
                        {colorTheme === CUSTOM_THEME_ID && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </span>
                    </button>

                    <div className="mt-1 border-t border-border/50 pt-1">
                      <button
                        onClick={openCustomize}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                      >
                        <Settings2 className="h-4 w-4" />
                        Customize colors
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="customize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                      Build your own palette
                    </div>
                    {COLOR_LABELS.map((label, i) => {
                      const key = (
                        ["primary", "secondary", "accent"] as const
                      )[i];
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3"
                        >
                          <label className="text-sm">{label}</label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono">
                              {draftColors[key]}
                            </span>
                            <input
                              type="color"
                              value={draftColors[key]}
                              onChange={(e) =>
                                setDraftColors((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              className="h-8 w-10 cursor-pointer rounded-md border border-border/50 bg-transparent p-0.5"
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex gap-1 rounded-lg overflow-hidden h-3">
                      {Object.values(draftColors).map((c, i) => (
                        <span
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setCustomizing(false)}
                        className="flex-1 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium hover:bg-muted/60 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={applyCustom}
                        className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        Apply theme
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
