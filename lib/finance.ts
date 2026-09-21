export interface FinanceInput {
  /** Precio del vehículo en euros. */
  price: number;
  /** Entrada aportada por el comprador. */
  downPayment: number;
  /** Plazo en meses. */
  months: number;
  /** TAE anual en porcentaje, p. ej. 7.95. */
  apr: number;
}

export interface FinanceResult {
  monthly: number;
  financed: number;
  totalInterest: number;
  totalPaid: number;
}

export const FINANCE_DEFAULTS = {
  apr: 7.95,
  months: 60,
  downPaymentRatio: 0.15,
} as const;

export const TERM_OPTIONS = [24, 36, 48, 60, 72, 84] as const;

/**
 * Cuota de un préstamo francés (amortización constante).
 * Es una estimación: la entidad financiera fija las condiciones reales.
 */
export function calculateFinance({ price, downPayment, months, apr }: FinanceInput): FinanceResult {
  const financed = Math.max(0, price - downPayment);
  const safeMonths = Math.max(1, Math.round(months));

  if (financed === 0) {
    return { monthly: 0, financed: 0, totalInterest: 0, totalPaid: 0 };
  }

  const i = apr / 100 / 12;
  const monthly =
    i === 0 ? financed / safeMonths : (financed * i) / (1 - Math.pow(1 + i, -safeMonths));
  const totalPaid = monthly * safeMonths;

  return {
    monthly: Math.round(monthly),
    financed,
    totalInterest: Math.round(totalPaid - financed),
    totalPaid: Math.round(totalPaid),
  };
}

/** Cuota orientativa que se muestra en la card del catálogo. */
export function estimateMonthly(price: number, apr: number = FINANCE_DEFAULTS.apr): number {
  return calculateFinance({
    price,
    downPayment: Math.round((price * FINANCE_DEFAULTS.downPaymentRatio) / 100) * 100,
    months: FINANCE_DEFAULTS.months,
    apr,
  }).monthly;
}

export const FINANCE_DISCLAIMER =
  "Simulación orientativa. Las condiciones finales dependen de la entidad financiera y del estudio de la operación.";
