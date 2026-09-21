import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="page py-28 lg:py-36">
      <EmptyState
        title="Esta página no existe"
        description="Puede que el coche ya se haya vendido o que el enlace esté mal escrito."
        action={
          <Button asChild>
            <Link href="/coches">Ver coches disponibles</Link>
          </Button>
        }
      />
    </div>
  );
}
