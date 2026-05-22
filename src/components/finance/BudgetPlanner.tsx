import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Wallet } from "lucide-react";
import { budgetVsActual } from "@/lib/finance/analytics";
import { ChartPanel } from "@/components/ui/chart-panel";
import { CHART_TOOLTIP_STYLE, formatChartInr } from "@/lib/chart-utils";
import { formatInr } from "@/lib/finance/emi";
import type { FinanceData } from "@/lib/finance/types";

type Props = {
  data: FinanceData;
  onUpdateBudget: (categoryId: FinanceData["budget"][0]["id"], planned: number) => void;
  onIncomeChange: (income: number) => void;
};

export function BudgetPlanner({ data, onUpdateBudget, onIncomeChange }: Props) {
  const chartData = budgetVsActual(data);
  const totalPlanned = data.budget.reduce((s, b) => s + b.planned, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Wallet className="size-3.5 text-neon-purple" />
        Budget planner
      </p>

      <label className="mt-4 block text-xs text-muted-foreground">
        Monthly income (₹)
        <input
          type="number"
          min={0}
          value={data.monthlyIncome}
          onChange={(e) => onIncomeChange(Number(e.target.value))}
          className="mt-1 w-full max-w-xs rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
        />
      </label>

      <ChartPanel className="mt-4">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 270 / 0.4)" />
          <XAxis dataKey="category" tick={{ fill: "oklch(0.65 0.02 260)", fontSize: 10 }} />
          <YAxis tick={{ fill: "oklch(0.65 0.02 260)", fontSize: 10 }} />
          <Tooltip formatter={(v) => formatChartInr(v)} contentStyle={CHART_TOOLTIP_STYLE} />
          <Legend />
          <Bar dataKey="planned" fill="oklch(0.68 0.27 295)" name="Planned" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="oklch(0.82 0.16 200)" name="Actual" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartPanel>

      <div className="mt-4 space-y-2">
        {data.budget.map((b) => (
          <motion.div
            key={b.id}
            layout
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-card/30 px-3 py-2"
          >
            <span className="text-sm font-medium">{b.label}</span>
            <input
              type="number"
              min={0}
              value={b.planned}
              onChange={(e) => onUpdateBudget(b.id, Number(e.target.value))}
              className="w-28 rounded-md border border-border/60 bg-background/50 px-2 py-1 text-right text-sm"
            />
          </motion.div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Planned total: {formatInr(totalPlanned)} · Remaining after plan:{" "}
        <span className={data.monthlyIncome - totalPlanned >= 0 ? "text-neon-cyan" : "text-destructive"}>
          {formatInr(data.monthlyIncome - totalPlanned)}
        </span>
      </p>
    </motion.div>
  );
}
