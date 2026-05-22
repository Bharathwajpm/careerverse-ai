import { createFileRoute } from "@tanstack/react-router";
import { MockInterviewApp } from "@/components/interview/MockInterviewApp";

export const Route = createFileRoute("/dashboard/interviews")({
  head: () => ({ meta: [{ title: "Mock Interviews — CareerVerse AI" }] }),
  component: InterviewPage,
});

function InterviewPage() {
  return <MockInterviewApp />;
}
