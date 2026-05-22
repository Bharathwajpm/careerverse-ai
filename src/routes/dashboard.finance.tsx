import { createFileRoute } from "@tanstack/react-router";
import { FinanceDashboard } from "@/components/finance/FinanceDashboard";

export const Route = createFileRoute("/dashboard/finance")({
  head: () => ({ meta: [{ title: "Finance — CareerVerse AI" }] }),
  component: FinancePage,
});

function FinancePage() {
  return <FinanceDashboard />;
}
