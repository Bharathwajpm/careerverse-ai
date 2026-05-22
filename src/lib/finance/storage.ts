import type { FinanceData } from "./types";

const KEY = "cv_finance_data";

const DEFAULT: FinanceData = {
  version: 1,
  monthlyIncome: 15000,
  budget: [
    { id: "food", label: "Food", planned: 4000 },
    { id: "transport", label: "Transport", planned: 1500 },
    { id: "education", label: "Education", planned: 3000 },
    { id: "rent", label: "Rent", planned: 5000 },
    { id: "entertainment", label: "Entertainment", planned: 1000 },
    { id: "other", label: "Other", planned: 500 },
  ],
  expenses: [],
  savingsGoals: [
    { id: "g1", name: "Emergency fund", targetAmount: 50000, currentAmount: 12000 },
    { id: "g2", name: "Laptop upgrade", targetAmount: 80000, currentAmount: 25000 },
  ],
  emiPresets: {
    principal: 500000,
    annualRate: 10.5,
    tenureMonths: 60,
  },
};

export function loadFinanceData(): FinanceData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as FinanceData;
    return parsed?.version === 1 ? parsed : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveFinanceData(data: FinanceData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}
