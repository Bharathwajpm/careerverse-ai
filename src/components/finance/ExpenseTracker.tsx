import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Receipt } from "lucide-react";
import { formatInr } from "@/lib/finance/emi";
import type { Expense, ExpenseCategory, FinanceData } from "@/lib/finance/types";

type Props = {
  data: FinanceData;
  onAdd: (expense: Omit<Expense, "id">) => void;
  onRemove: (id: string) => void;
};

const CATEGORIES: { id: ExpenseCategory; label: string }[] = [
  { id: "food", label: "Food" },
  { id: "transport", label: "Transport" },
  { id: "education", label: "Education" },
  { id: "rent", label: "Rent" },
  { id: "entertainment", label: "Entertainment" },
  { id: "other", label: "Other" },
];

export function ExpenseTracker({ data, onAdd, onRemove }: Props) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!label.trim() || num <= 0) return;
    onAdd({
      label: label.trim(),
      amount: num,
      category,
      date: new Date().toISOString().slice(0, 10),
    });
    setLabel("");
    setAmount("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass rounded-2xl p-6"
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Receipt className="size-3.5 text-neon-pink" />
        Expense tracker
      </p>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap gap-2">
        <input
          placeholder="Description"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="min-w-[120px] flex-1 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Amount"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="rounded-lg border border-border/60 bg-card/50 px-2 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-lg bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="size-4" /> Add
        </button>
      </form>

      <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
        {data.expenses.length === 0 ? (
          <li className="py-4 text-center text-xs text-muted-foreground">No expenses logged yet.</li>
        ) : (
          [...data.expenses]
            .reverse()
            .slice(0, 12)
            .map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-card/30 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{ex.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {ex.category} · {ex.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold">{formatInr(ex.amount)}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(ex.id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))
        )}
      </ul>
    </motion.div>
  );
}
