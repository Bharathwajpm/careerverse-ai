import { createFileRoute } from "@tanstack/react-router";
import { RoadmapDashboard } from "@/components/roadmap/RoadmapDashboard";

export const Route = createFileRoute("/dashboard/roadmaps")({
  head: () => ({ meta: [{ title: "Career Roadmaps — CareerVerse AI" }] }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return <RoadmapDashboard />;
}
