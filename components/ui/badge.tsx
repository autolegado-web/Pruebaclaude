import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "verified" | "outline" | "dark" | "label";

const tones: Record<Tone, string> = {
  neutral: "bg-bone text-graphite",
  verified: "bg-paper text-ink",
  outline: "border border-line text-graphite",
  dark: "bg-ink text-paper",
  label: "border border-line text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs px-2 py-1 text-[0.6875rem] leading-none tracking-[0.01em]",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Etiqueta medioambiental DGT: se lee mejor con el color real del distintivo. */
export function EnvBadge({ label, className }: { label: "0" | "ECO" | "C" | "B"; className?: string }) {
  const map = {
    "0": { bg: "#0b5d3b", fg: "#ffffff", title: "Distintivo ambiental Cero emisiones" },
    ECO: { bg: "#1c6b9c", fg: "#ffffff", title: "Distintivo ambiental ECO" },
    C: { bg: "#3e7d3a", fg: "#ffffff", title: "Distintivo ambiental C" },
    B: { bg: "#c18a1d", fg: "#000000", title: "Distintivo ambiental B" },
  } as const;
  const { bg, fg, title } = map[label];
  return (
    <span
      title={title}
      className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-xs px-1.5 text-[0.625rem] font-semibold", className)}
      style={{ background: bg, color: fg }}
    >
      {label}
      <span className="sr-only"> · {title}</span>
    </span>
  );
}
