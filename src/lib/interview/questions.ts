import type { InterviewMode, InterviewQuestion } from "./types";

const TECHNICAL: InterviewQuestion[] = [
  {
    id: "t1",
    mode: "technical",
    difficulty: "easy",
    text: "Explain the difference between REST and GraphQL. When would you pick each?",
    tip: "Mention caching, over-fetching, and schema flexibility.",
  },
  {
    id: "t2",
    mode: "technical",
    difficulty: "medium",
    text: "Design a rate limiter for a public API. What data structures and trade-offs matter?",
    tip: "Cover token bucket vs sliding window; distributed stores.",
  },
  {
    id: "t3",
    mode: "technical",
    difficulty: "medium",
    text: "Walk through how you would debug a production memory leak in a Node.js service.",
    tip: "Heap snapshots, metrics, rollout strategy.",
  },
  {
    id: "t4",
    mode: "technical",
    difficulty: "hard",
    text: "How would you implement idempotent payment processing with retries?",
    tip: "Idempotency keys, deduplication, exactly-once illusion.",
  },
  {
    id: "t5",
    mode: "technical",
    difficulty: "easy",
    text: "What is the time complexity of binary search? Describe a bug you've seen in search implementations.",
    tip: "O(log n); off-by-one on boundaries.",
  },
  {
    id: "t6",
    mode: "technical",
    difficulty: "hard",
    text: "Design a feature-flag system with safe rollouts and instant rollback.",
    tip: "Targeting rules, evaluation latency, audit logs.",
  },
];

const HR: InterviewQuestion[] = [
  {
    id: "h1",
    mode: "hr",
    difficulty: "easy",
    text: "Tell me about yourself and why you're interested in this role.",
    tip: "2-minute arc: past → present → future fit.",
  },
  {
    id: "h2",
    mode: "hr",
    difficulty: "medium",
    text: "Describe a time you disagreed with a teammate. How did you resolve it?",
    tip: "Use STAR; focus on empathy and outcome.",
  },
  {
    id: "h3",
    mode: "hr",
    difficulty: "medium",
    text: "What's a project you're proud of? What was your specific contribution?",
    tip: "Quantify impact; own your slice clearly.",
  },
  {
    id: "h4",
    mode: "hr",
    difficulty: "easy",
    text: "Where do you see yourself in three years?",
    tip: "Align growth with company trajectory.",
  },
  {
    id: "h5",
    mode: "hr",
    difficulty: "hard",
    text: "Tell me about a failure. What did you learn and change afterward?",
    tip: "Vulnerability + concrete behavior change.",
  },
  {
    id: "h6",
    mode: "hr",
    difficulty: "medium",
    text: "Why should we hire you over other candidates?",
    tip: "Unique strengths + evidence, not generic traits.",
  },
];

export function getQuestionsForMode(mode: InterviewMode, count = 4): InterviewQuestion[] {
  const pool = mode === "technical" ? TECHNICAL : HR;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}
