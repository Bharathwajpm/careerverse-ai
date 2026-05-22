import { motion } from "framer-motion";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartPanel } from "@/components/ui/chart-panel";
import { formatChartInr } from "@/lib/chart-utils";
import { PiggyBank, TrendingUp } from "lucide-react";
import { chartExpensePie, monthlySpendTotal, savingsRate, totalSavingsProgress } from "@/lib/finance/analytics";
import { formatInr } from "@/lib/finance/emi";
import type { FinanceData, SavingsGoal } from "@/lib/finance/types";

const PIE_COLORS = [
  "oklch(0.68 0.27 295)",
  "oklch(0.82 0.16 200)",
  "oklch(0.75 0.22 345)",
  "oklch(0.72 0.20 245)",
  "oklch(0.78 0.18 160)",
  "oklch(0.65 0.15 280)",
];

type Props = {
  data: FinanceData;
  onUpdateGoal: (id: string, currentAmount: number) => void;
};

export function SavingsAnalytics({ data, onUpdateGoal }: Props) {
  const spend = monthlySpendTotal(data.expenses);
  const rate = savingsRate(data);
  const progress = totalSavingsProgress(data);
  const pieData = chartExpensePie(data.expenses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6"
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <TrendingUp className="size-3.5 text-neon-cyan" />
        Savings analytics
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/40 bg-card/40 p-4">
          <p className="text-[10px] uppercase text-muted-foreground">Spent this month</p>
          <p className="font-display mt-1 text-xl font-semibold">{formatInr(spend)}</p>
        </div>
        <div className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 p-4">
          <p className="text-[10px] uppercase text-muted-foreground">Savings rate</p>
          <p className="font-display mt-1 text-xl font-semibold text-neon-cyan">{rate}%</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/40 p-4">
          <p className="text-[10px] uppercase text-muted-foreground">Goals progress</p>
          <p className="font-display mt-1 text-xl font-semibold">{progress.percent}%</p>
        </div>
      </div>

      {pieData.length > 0 ? (
        <ChartPanel className="mt-6" heightClass="h-44 sm:h-48">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatChartInr(v)} />
          </PieChart>
        </ChartPanel>
      ) : null}

      <p className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
        <PiggyBank className="size-3.5" />
        Savings goals
      </p>
      <ul className="mt-3 space-y-3">
        {data.savingsGoals.map((g: SavingsGoal) => {
          const pct = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
          return (
            <li key={g.id} className="rounded-xl border border-border/40 bg-card/30 p-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{g.name}</span>
                <span className="text-muted-foreground">
                  {formatInr(g.currentAmount)} / {formatInr(g.targetAmount)}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-aurora"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={g.targetAmount}
                  value={g.currentAmount}
                  onChange={(e) => onUpdateGoal(g.id, Number(e.target.value))}
                  className="flex-1 accent-neon-purple"
                />
                <span className="text-xs text-neon-purple">{pct}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
