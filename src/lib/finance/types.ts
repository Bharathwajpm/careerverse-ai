export type ExpenseCategory =
  | "food"
  | "transport"
  | "education"
  | "rent"
  | "entertainment"
  | "other";

export type Expense = {
  id: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
};

export type BudgetCategory = {
  id: ExpenseCategory;
  label: string;
  planned: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
};

export type FinanceData = {
  version: 1;
  monthlyIncome: number;
  budget: BudgetCategory[];
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  emiPresets: {
    principal: number;
    annualRate: number;
    tenureMonths: number;
  };
};

export type EmiResult = {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
};
