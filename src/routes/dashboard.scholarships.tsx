import { createFileRoute } from "@tanstack/react-router";
import { ScholarshipDashboard } from "@/components/scholarship/ScholarshipDashboard";

export const Route = createFileRoute("/dashboard/scholarships")({
  head: () => ({ meta: [{ title: "Scholarships — CareerVerse AI" }] }),
  component: ScholarshipPage,
});

function ScholarshipPage() {
  return <ScholarshipDashboard />;
}
