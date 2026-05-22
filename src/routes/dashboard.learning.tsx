import { createFileRoute } from "@tanstack/react-router";
import { LearningDashboard } from "@/components/learning/LearningDashboard";

export const Route = createFileRoute("/dashboard/learning")({
  head: () => ({ meta: [{ title: "Learning — CareerVerse AI" }] }),
  component: LearningPage,
});

function LearningPage() {
  return <LearningDashboard />;
}
