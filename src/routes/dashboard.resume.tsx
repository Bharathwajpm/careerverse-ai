import { createFileRoute } from "@tanstack/react-router";
import { ResumeAnalyzer } from "@/components/resume/ResumeAnalyzer";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — CareerVerse AI" }] }),
  component: ResumePage,
});

function ResumePage() {
  return <ResumeAnalyzer />;
}
