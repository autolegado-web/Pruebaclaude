"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useCarFilters } from "@/lib/use-car-filters";

export function LoadMore({ remaining }: { remaining: number }) {
  const { loadMore } = useCarFilters();
  const [pending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false);

  return (
    <div className="mt-14 flex justify-center">
      <Button
        variant="outline"
        size="lg"
        loading={pending && clicked}
        onClick={() => {
          setClicked(true);
          startTransition(loadMore);
        }}
      >
        Ver {Math.min(12, remaining)} coches más
      </Button>
    </div>
  );
}
