"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { FINANCE_DEFAULTS, FINANCE_DISCLAIMER, TERM_OPTIONS, calculateFinance } from "@/lib/finance";
import { cn, formatPrice } from "@/lib/utils";

export function FinanceCalculator({
  price,
  editablePrice = false,
  className,
}: {
  price: number;
  editablePrice?: boolean;
  className?: string;
}) {
  const [carPrice, setCarPrice] = useState(price);
  const defaultDown = Math.round((price * FINANCE_DEFAULTS.downPaymentRatio) / 100) * 100;
  const [downPayment, setDownPayment] = useState(defaultDown);
  const [months, setMonths] = useState<number>(FINANCE_DEFAULTS.months);
  const [apr, setApr] = useState<number>(FINANCE_DEFAULTS.apr);

  const maxDown = Math.max(1000, Math.round((carPrice * 0.6) / 100) * 100);
  const safeDown = Math.min(downPayment, maxDown);

  const result = useMemo(
    () => calculateFinance({ price: carPrice, downPayment: safeDown, months, apr }),
    [carPrice, safeDown, months, apr],
  );

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[1fr_20rem]", className)}>
      <div className="space-y-6">
        {editablePrice ? (
          <Field label="Precio del vehículo" htmlFor="calc-price">
            <Input
              id="calc-price"
              type="number"
              inputMode="numeric"
              min={1000}
              step={100}
              data-numeric
              value={carPrice}
              onChange={(e) => setCarPrice(Math.max(0, Number(e.target.value) || 0))}
            />
          </Field>
        ) : null}

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="calc-down" className="text-[0.8125rem] text-graphite">
              Entrada
            </label>
            <span data-numeric className="text-sm font-medium">
              {formatPrice(safeDown)}
            </span>
          </div>
          <Slider
            id="calc-down"
            className="mt-2"
            min={0}
            max={maxDown}
            step={500}
            value={[safeDown]}
            onValueChange={([v]) => setDownPayment(v)}
            aria-label="Entrada"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Plazo" htmlFor="calc-months">
            <Select id="calc-months" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
              {TERM_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m} meses
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Interés (TAE)" htmlFor="calc-apr">
            <Input
              id="calc-apr"
              type="number"
              inputMode="decimal"
              min={0}
              max={25}
              step={0.05}
              data-numeric
              value={apr}
              onChange={(e) => setApr(Math.max(0, Number(e.target.value) || 0))}
            />
          </Field>
        </div>
      </div>

      <div className="dark-surface rounded-lg bg-night p-6 text-paper">
        <p className="text-[0.8125rem] text-white/55">Cuota mensual estimada</p>
        <p data-numeric className="mt-1 text-[2.5rem] font-medium leading-none tracking-[-0.03em]">
          {formatPrice(result.monthly)}
          <span className="text-lg text-white/55">/mes</span>
        </p>

        <dl className="mt-6 space-y-2.5 border-t border-white/12 pt-5 text-[0.8125rem]">
          <div className="flex justify-between">
            <dt className="text-white/55">Importe financiado</dt>
            <dd data-numeric>{formatPrice(result.financed)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Intereses totales</dt>
            <dd data-numeric>{formatPrice(result.totalInterest)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Total a devolver</dt>
            <dd data-numeric>{formatPrice(result.totalPaid)}</dd>
          </div>
        </dl>

        <p className="mt-6 text-[0.75rem] leading-relaxed text-white/45">{FINANCE_DISCLAIMER}</p>
      </div>
    </div>
  );
}
