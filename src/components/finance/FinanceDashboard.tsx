import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadFinanceData, saveFinanceData } from "@/lib/finance/storage";
import type { FinanceData } from "@/lib/finance/types";
import { EmiCalculator } from "./EmiCalculator";
import { BudgetPlanner } from "./BudgetPlanner";
import { ExpenseTracker } from "./ExpenseTracker";
import { SavingsAnalytics } from "./SavingsAnalytics";
import { EducationCards } from "./EducationCards";
import { DashboardPageSkeleton } from "@/components/shared/LoadingSkeletons";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function FinanceDashboard() {
  const [data, setData] = useState<FinanceData | null>(null);

  useEffect(() => {
    setData(loadFinanceData());
  }, []);

  const persist = useCallback((next: FinanceData) => {
    setData(next);
    saveFinanceData(next);
  }, []);

  if (!data) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-purple">// finance hub</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          Financial guidance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          EMI calculator, budget planner, expense tracker, and savings analytics — saved on this device.
        </p>
      </motion.header>

      <EmiCalculator
        principal={data.emiPresets.principal}
        annualRate={data.emiPresets.annualRate}
        tenureMonths={data.emiPresets.tenureMonths}
        onChange={(patch) =>
          persist({
            ...data,
            emiPresets: { ...data.emiPresets, ...patch },
          })
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetPlanner
          data={data}
          onIncomeChange={(monthlyIncome) => persist({ ...data, monthlyIncome })}
          onUpdateBudget={(id, planned) =>
            persist({
              ...data,
              budget: data.budget.map((b) => (b.id === id ? { ...b, planned } : b)),
            })
          }
        />
        <ExpenseTracker
          data={data}
          onAdd={(expense) =>
            persist({
              ...data,
              expenses: [...data.expenses, { ...expense, id: uid() }],
            })
          }
          onRemove={(id) =>
            persist({
              ...data,
              expenses: data.expenses.filter((e) => e.id !== id),
            })
          }
        />
      </div>

      <SavingsAnalytics
        data={data}
        onUpdateGoal={(id, currentAmount) =>
          persist({
            ...data,
            savingsGoals: data.savingsGoals.map((g) =>
              g.id === id ? { ...g, currentAmount } : g,
            ),
          })
        }
      />

      <EducationCards />
    </div>
  );
}
