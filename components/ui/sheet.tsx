"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

const sides = {
  left: "inset-y-0 left-0 h-full w-[88vw] max-w-sm panel-left",
  right: "inset-y-0 right-0 h-full w-[88vw] max-w-sm panel-right",
  bottom: "inset-x-0 bottom-0 max-h-[92vh] w-full rounded-t-lg panel-bottom",
  center:
    "left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md panel-center",
} as const;

export function SheetContent({
  side = "right",
  title,
  description,
  className,
  children,
  footer,
}: {
  side?: keyof typeof sides;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="overlay-anim fixed inset-0 z-50 bg-black/45" />
      <Dialog.Content
        className={cn(
          "fixed z-50 flex flex-col bg-paper shadow-[0_0_0_1px_rgba(0,0,0,0.06)] focus:outline-none",
          sides[side],
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <Dialog.Title className="display-sm">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="meta mt-1">{description}</Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          <Dialog.Close
            aria-label="Cerrar"
            className="-mr-1 -mt-1 rounded-sm p-2 text-graphite transition-colors hover:bg-bone hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </Dialog.Close>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? <footer className="border-t border-line px-5 py-4">{footer}</footer> : null}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
