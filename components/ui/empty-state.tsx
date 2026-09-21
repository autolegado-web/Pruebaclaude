import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rule flex flex-col items-start gap-3 py-16", className)}>
      <h2 className="display-sm">{title}</h2>
      <p className="lede">{description}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
