"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyLinkButtonProps {
  url: string;
  className?: string;
  compact?: boolean;
}

export function CopyLinkButton({ url, className, compact }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable — no-op */
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium text-primary hover:underline",
          className
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 truncate rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs font-mono text-muted-foreground">
        {url}
      </div>
      <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button type="button" size="sm" variant="ghost">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </a>
    </div>
  );
}
