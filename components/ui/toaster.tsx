"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useToasts } from "@/app/providers";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToasts();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end sm:px-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "toast-anim pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-sm px-4 py-3 text-sm",
            toast.tone === "error" ? "bg-[var(--color-alert)] text-paper" : "bg-ink text-paper",
          )}
        >
          <p className="flex-1 leading-snug">{toast.message}</p>
          {toast.action ? (
            <Link
              href={toast.action.href}
              onClick={() => dismiss(toast.id)}
              className="shrink-0 underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {toast.action.label}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Cerrar aviso"
            className="shrink-0 rounded-xs p-1 text-paper/60 transition-colors hover:text-paper"
          >
            <X aria-hidden className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
