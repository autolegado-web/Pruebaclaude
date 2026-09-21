import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-[-0.01em] transition-[background,color,border-color,opacity] duration-200 ease-[var(--ease-out-quint)] disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-ink/85",
        secondary: "bg-bone text-ink hover:bg-ash",
        outline: "border border-line-strong bg-transparent text-ink hover:border-ink",
        ghost: "text-ink hover:bg-bone",
        light: "bg-paper text-ink hover:bg-paper/90",
        onDark: "border border-white/30 text-paper hover:border-white hover:bg-white/10",
        link: "h-auto p-0 text-ink underline decoration-line underline-offset-[6px] hover:decoration-ink",
      },
      size: {
        sm: "h-9 px-3.5 text-[0.8125rem]",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-7 text-[0.9375rem]",
        icon: "h-10 w-10",
      },
      block: { true: "w-full" },
    },
    compoundVariants: [{ variant: "link", size: "md", class: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, asChild, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(button({ variant, size, block }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            <span>Enviando…</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
