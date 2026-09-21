"use client";

import { useEffect, useState } from "react";
import type { Car } from "@/types/car";
import { MockCtaButton } from "@/components/car/mock-cta-button";
import { estimateMonthly } from "@/lib/finance";
import { cn, formatMonthly, formatPrice } from "@/lib/utils";

export function StickyCta({ car }: { car: Car }) {
  const [show, setShow] = useState(false);
  const monthly = estimateMonthly(car.price, car.financing.apr);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-paper/95 px-[max(1.25rem,env(safe-area-inset-left))] py-3 backdrop-blur-md transition-transform duration-300 ease-[var(--ease-out-quint)] lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="min-w-0">
        <p data-numeric className="truncate text-[1.0625rem] font-medium leading-tight tracking-[-0.02em]">
          {formatPrice(car.price)}
        </p>
        <p data-numeric className="text-[0.6875rem] text-graphite">
          {formatMonthly(monthly)} estimados
        </p>
      </div>
      <MockCtaButton className="ml-auto shrink-0" toastMessage="Solicitud enviada. Te respondemos por email">
        Solicitar información
      </MockCtaButton>
    </div>
  );
}
