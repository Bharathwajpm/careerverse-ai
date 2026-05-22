import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { calculateEmi, formatInr } from "@/lib/finance/emi";

type Props = {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  onChange: (patch: { principal?: number; annualRate?: number; tenureMonths?: number }) => void;
};

export function EmiCalculator({ principal, annualRate, tenureMonths, onChange }: Props) {
  const result = calculateEmi(principal, annualRate, tenureMonths);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Calculator className="size-3.5 text-neon-cyan" />
        EMI calculator
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block text-xs text-muted-foreground">
          Loan amount (₹)
          <input
            type="number"
            min={0}
            step={10000}
            value={principal}
            onChange={(e) => onChange({ principal: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs text-muted-foreground">
          Interest rate (% p.a.)
          <input
            type="number"
            min={0}
            max={30}
            step={0.1}
            value={annualRate}
            onChange={(e) => onChange({ annualRate: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs text-muted-foreground">
          Tenure (months)
          <input
            type="number"
            min={1}
            max={360}
            value={tenureMonths}
            onChange={(e) => onChange({ tenureMonths: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 p-4">
          <p className="text-[10px] uppercase text-muted-foreground">Monthly EMI</p>
          <p className="font-display mt-1 text-2xl font-semibold text-neon-cyan">
            {formatInr(result.monthlyEmi)}
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/40 p-4">
          <p className="text-[10px] uppercase text-muted-foreground">Total interest</p>
          <p className="font-display mt-1 text-xl font-semibold">{formatInr(result.totalInterest)}</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/40 p-4">
          <p className="text-[10px] uppercase text-muted-foreground">Total payment</p>
          <p className="font-display mt-1 text-xl font-semibold">{formatInr(result.totalPayment)}</p>
        </div>
      </div>
    </motion.div>
  );
}
