import type { AssessmentQuestion } from "./types";

export const LIKERT_OPTIONS = [
  { value: 1 as const, label: "Strongly disagree" },
  { value: 2 as const, label: "Disagree" },
  { value: 3 as const, label: "Neutral" },
  { value: 4 as const, label: "Agree" },
  { value: 5 as const, label: "Strongly agree" },
] as const;

/** 30 psychometric items across six career domains. */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: "q01", emoji: "🧩", text: "I lose track of time when solving complex, open-ended problems.", primary: "analytical" },
  { id: "q02", emoji: "📊", text: "I trust data and evidence more than gut feelings when making decisions.", primary: "analytical", secondary: "systems" },
  { id: "q03", emoji: "🔍", text: "I enjoy breaking ambiguous challenges into smaller testable parts.", primary: "analytical" },
  { id: "q04", emoji: "🧪", text: "I feel energized when validating hypotheses through experiments.", primary: "analytical", secondary: "systems" },
  { id: "q05", emoji: "📐", text: "I naturally spot inconsistencies in logic, numbers, or arguments.", primary: "analytical" },
  { id: "q06", emoji: "🎨", text: "I often imagine new products, stories, or experiences before they exist.", primary: "creative" },
  { id: "q07", emoji: "✨", text: "I prefer unconventional solutions over safe, standard approaches.", primary: "creative" },
  { id: "q08", emoji: "🖌️", text: "Aesthetics and user delight matter as much as functionality to me.", primary: "creative", secondary: "empathy" },
  { id: "q09", emoji: "💡", text: "I connect ideas from unrelated fields to invent something new.", primary: "creative", secondary: "analytical" },
  { id: "q10", emoji: "🎭", text: "I enjoy brainstorming where no idea is criticized in the first round.", primary: "creative" },
  { id: "q11", emoji: "🚀", text: "I'd rather lead a team initiative than wait for detailed instructions.", primary: "leadership" },
  { id: "q12", emoji: "🎯", text: "I stay calm and decisive when plans change under pressure.", primary: "leadership", secondary: "systems" },
  { id: "q13", emoji: "🤝", text: "People often ask me to coordinate group work or settle conflicts.", primary: "leadership", secondary: "communication" },
  { id: "q14", emoji: "📣", text: "I am comfortable owning outcomes, including when things go wrong.", primary: "leadership" },
  { id: "q15", emoji: "🏁", text: "I set ambitious goals and hold myself accountable to deadlines.", primary: "leadership", secondary: "analytical" },
  { id: "q16", emoji: "💬", text: "I can explain technical topics to non-experts without losing them.", primary: "communication" },
  { id: "q17", emoji: "📝", text: "Clear writing and structured presentations are strengths of mine.", primary: "communication" },
  { id: "q18", emoji: "🎤", text: "I feel confident speaking in meetings, demos, or interviews.", primary: "communication", secondary: "leadership" },
  { id: "q19", emoji: "👂", text: "I ask clarifying questions before offering solutions.", primary: "communication", secondary: "empathy" },
  { id: "q20", emoji: "🌐", text: "I adapt my tone and examples when the audience changes.", primary: "communication" },
  { id: "q21", emoji: "💛", text: "I notice when teammates are stressed, even if they don't say it.", primary: "empathy" },
  { id: "q22", emoji: "🫶", text: "User pain points motivate me more than feature checklists.", primary: "empathy", secondary: "creative" },
  { id: "q23", emoji: "🧑‍🤝‍🧑", text: "I prioritize inclusive decisions that consider diverse perspectives.", primary: "empathy" },
  { id: "q24", emoji: "🩺", text: "I enjoy mentoring peers and celebrating their wins.", primary: "empathy", secondary: "leadership" },
  { id: "q25", emoji: "🌍", text: "I think about the societal impact of the work I might do.", primary: "empathy" },
  { id: "q26", emoji: "🛠️", text: "I prefer building reliable systems over one-off hacks.", primary: "systems" },
  { id: "q27", emoji: "⚙️", text: "I enjoy optimizing performance, automation, and architecture.", primary: "systems", secondary: "analytical" },
  { id: "q28", emoji: "🔐", text: "Security, scalability, and maintainability are non-negotiable for me.", primary: "systems" },
  { id: "q29", emoji: "🧱", text: "I like creating reusable components others can build on.", primary: "systems", secondary: "creative" },
  { id: "q30", emoji: "🔄", text: "I document processes so teams can repeat success consistently.", primary: "systems", secondary: "communication" },
];

export const DOMAIN_LABELS: Record<string, string> = {
  analytical: "Analytical",
  creative: "Creative",
  leadership: "Leadership",
  communication: "Communication",
  empathy: "Empathy",
  systems: "Systems Thinking",
};
