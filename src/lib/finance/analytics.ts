import type { BudgetCategory, Expense, ExpenseCategory, FinanceData } from "./types";

export function expensesByCategory(expenses: Expense[]): Record<ExpenseCategory, number> {
  const map = {
    food: 0,
    transport: 0,
    education: 0,
    rent: 0,
    entertainment: 0,
    other: 0,
  } satisfies Record<ExpenseCategory, number>;

  for (const e of expenses) {
    map[e.category] += e.amount;
  }
  return map;
}

export function budgetVsActual(data: FinanceData) {
  const actual = expensesByCategory(data.expenses);
  return data.budget.map((b) => ({
    category: b.label,
    planned: b.planned,
    actual: actual[b.id] ?? 0,
  }));
}

export function monthlySpendTotal(expenses: Expense[]): number {
  return expenses.reduce((s, e) => s + e.amount, 0);
}

export function savingsRate(data: FinanceData): number {
  const spend = monthlySpendTotal(data.expenses);
  const income = data.monthlyIncome;
  if (income <= 0) return 0;
  return Math.max(0, Math.round(((income - spend) / income) * 100));
}

export function totalSavingsProgress(data: FinanceData): {
  current: number;
  target: number;
  percent: number;
} {
  const current = data.savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const target = data.savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
  return {
    current,
    target,
    percent: target > 0 ? Math.round((current / target) * 100) : 0,
  };
}

export function chartExpensePie(expenses: Expense[]) {
  const byCat = expensesByCategory(expenses);
  return Object.entries(byCat)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
}
