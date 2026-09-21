"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border border-line-strong transition-colors duration-150 data-[state=checked]:border-ink data-[state=checked]:bg-ink",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="text-paper">
      <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export function CheckboxRow({
  id,
  label,
  count,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: React.ReactNode;
  count?: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="group flex items-center gap-3 py-1.5">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onCheckedChange(v === true)} />
      <label htmlFor={id} className="flex flex-1 cursor-pointer items-baseline justify-between gap-3 text-sm">
        <span className="text-ink">{label}</span>
        {count != null ? <span className="text-[0.75rem] text-graphite" data-numeric>{count}</span> : null}
      </label>
    </div>
  );
}
