export type FinanceEducationCard = {
  id: string;
  title: string;
  summary: string;
  tip: string;
  icon: "piggy" | "shield" | "book" | "trending";
};

export const FINANCE_EDUCATION: FinanceEducationCard[] = [
  {
    id: "e1",
    title: "50/30/20 for students",
    summary: "Allocate 50% needs, 30% wants, 20% savings — adjust for hostel life.",
    tip: "Track rent + mess in 'needs' before entertainment.",
    icon: "piggy",
  },
  {
    id: "e2",
    title: "Emergency fund first",
    summary: "Aim for 3 months of expenses before aggressive investing.",
    tip: "Keep it in a separate savings account you don't touch.",
    icon: "shield",
  },
  {
    id: "e3",
    title: "Education loan EMI",
    summary: "Compare moratorium periods; interest accrues even when not paying.",
    tip: "Use the EMI calculator here before signing any loan offer.",
    icon: "book",
  },
  {
    id: "e4",
    title: "Compound your stipend",
    summary: "Even ₹500/month in a disciplined SIP builds long-term habit.",
    tip: "Automate transfers on stipend day — friction beats willpower.",
    icon: "trending",
  },
  {
    id: "e5",
    title: "Scholarship stacking",
    summary: "Multiple small grants can cover more than one large award.",
    tip: "Pair need-based govt schemes with private merit scholarships.",
    icon: "book",
  },
  {
    id: "e6",
    title: "Credit score basics",
    summary: "First card or loan? Pay full balance on time — history starts early.",
    tip: "Avoid maxing utilization; stay under 30% of limit.",
    icon: "shield",
  },
];
