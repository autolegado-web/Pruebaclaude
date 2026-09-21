import type { Metadata } from "next";
import { FinanceCalculator } from "@/components/finance/finance-calculator";

export const metadata: Metadata = {
  title: "Financiación",
  description: "Simula la cuota mensual de cualquier coche antes de hablar con nadie.",
  alternates: { canonical: "/financiacion" },
};

export default function FinancePage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <header className="max-w-2xl">
        <h1 className="display-lg text-balance">Financiación</h1>
        <p className="lede mt-4">
          Ajusta entrada y plazo y verás la cuota al instante. Sin registro y sin dejar tu teléfono.
        </p>
      </header>

      <div className="mt-14">
        <FinanceCalculator price={32900} editablePrice />
      </div>

      <div className="mt-20 max-w-[68ch]">
        <h2 className="text-[1.0625rem] font-medium">Cómo leer esta simulación</h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
          El cálculo usa un sistema de amortización francés con cuota constante. El tipo que introduces
          es anual (TAE) y se aplica mes a mes sobre el capital pendiente. No incluye comisiones de
          apertura, seguros vinculados ni gastos de gestión, que varían según la entidad financiera.
        </p>
        <p className="meta mt-4">
          Simulación orientativa. No constituye una oferta financiera. Las condiciones finales dependen
          de la entidad financiera y del estudio de solvencia.
        </p>
      </div>
    </div>
  );
}
