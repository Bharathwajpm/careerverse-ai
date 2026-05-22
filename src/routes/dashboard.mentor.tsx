import { createFileRoute } from "@tanstack/react-router";
import { MentorChat } from "@/components/mentor/MentorChat";

type MentorSearch = {
  prompt?: string;
};

export const Route = createFileRoute("/dashboard/mentor")({
  validateSearch: (search: Record<string, unknown>): MentorSearch => ({
    prompt: typeof search.prompt === "string" ? search.prompt : undefined,
  }),
  head: () => ({ meta: [{ title: "AI Mentor — CareerVerse AI" }] }),
  component: MentorPage,
});

function MentorPage() {
  const { prompt } = Route.useSearch();
  return <MentorChat initialPrompt={prompt} />;
}
