import { loadAssessmentResult } from "@/lib/assessment/storage";

const ROADMAP_TEMPLATE = `Here's a **30-day roadmap** tailored to your trajectory:

**Week 1 — Foundation**
• Audit skill gaps vs target role requirements
• Complete 2 focused modules (systems + communication)
• Ship one portfolio artifact with measurable impact

**Week 2 — Visibility**
• Publish a case study or blog post
• Request 2 informational interviews on LinkedIn
• Refine resume bullets with quantified outcomes

**Week 3 — Practice**
• 2 mock interviews (technical + behavioral)
• Contribute to one open-source or campus project
• Apply to 3 curated roles or scholarships

**Week 4 — Launch**
• Finalize portfolio & GitHub README
• Submit top applications with custom cover hooks
• Debrief with AI Mentor and set next sprint goals

Want me to sync this to your dashboard roadmap tab?`;

function assessmentContext(): string | null {
  const r = loadAssessmentResult();
  if (!r?.topMatches[0]) return null;
  const top = r.topMatches[0];
  return `your recent assessment (${top.title} at ${top.compatibility}% compatibility)`;
}

export function generateDemoMentorReply(userText: string): string {
  const lower = userText.toLowerCase();
  const ctx = assessmentContext();

  if (lower.includes("roadmap") || lower.includes("plan") || lower.includes("30 day")) {
    const prefix = ctx
      ? `I've loaded ${ctx}. `
      : "";
    return prefix + ROADMAP_TEMPLATE;
  }

  if (lower.includes("resume") || lower.includes("cv")) {
    return `**Resume scan complete** (demo).\n\n• ATS readability: **88/100**\n• Replace 3 passive verbs with impact verbs (led, shipped, reduced)\n• Add 2 metric-driven bullets under your strongest project\n• Mirror keywords from roles like ${ctx ? loadAssessmentResult()?.topMatches[0]?.title : "your target track"}\n\nI can draft rewrites — paste your experience section.`;
  }

  if (lower.includes("scholar") || lower.includes("grant") || lower.includes("funding")) {
    return `**Scholarship radar** (demo) found 3 high-fit opportunities:\n\n1. **Genesis Grant** — ₹4L · 92% eligibility · closes in 6 days\n2. **Kalpana Award** — ₹1.5L · 84% fit\n3. **OpenAI Fellowship** — $5K · portfolio + essay required\n\nShall I prefill the strongest application outline?`;
  }

  if (lower.includes("interview") || lower.includes("mock") || lower.includes("system design")) {
    return `**Mock interview mode** ready.\n\nSuggested session: *Design a feature-flag service with low latency and safe rollouts.*\n\n• 5 min — clarifying requirements\n• 20 min — high-level + deep dive\n• 10 min — trade-offs & failure modes\n\nI'll score communication, depth, and structure. Say **start** when ready.`;
  }

  if (lower.includes("career") && (lower.includes("switch") || lower.includes("change"))) {
    return ctx
      ? `Given ${ctx}, a pivot is realistic in 6–9 months with deliberate stacking:\n\n1. **Bridge role** — adjacent title that uses 70% of current skills\n2. **Proof projects** — 2 artifacts aligned to the new domain\n3. **Network** — 5 conversations/month with practitioners\n\nYour analytical + systems scores suggest you'd ramp fastest via project-first learning, not passive courses.`
      : `Career switches succeed with **bridge roles**, **proof projects**, and **consistent networking**. Take the assessment first and I'll personalize a transition map.`;
  }

  if (lower.includes("skill") || lower.includes("learn") || lower.includes("course")) {
    return `**Learning stack** (demo):\n\n• **Core:** DSA refresh (3h/week) + one systems primer\n• **Applied:** Build one end-to-end mini product\n• **Signal:** Write weekly learnings publicly\n\nBased on market demand, prioritize cloud + AI literacy even if your target isn't ML — interviewers expect fluency.`;
  }

  if (lower.includes("hello") || lower.includes("hi ") || lower === "hi") {
    return ctx
      ? `Hello! I've synced ${ctx}. Ask for a roadmap, resume review, scholarships, or mock interviews — I'm in **demo mode** with realistic coaching responses.`
      : `Hello! I'm your CareerVerse Mentor (demo mode). I can help with roadmaps, resume polish, scholarships, and interview prep. Complete the **career assessment** for hyper-personalized advice.`;
  }

  return `I'm analyzing your message against career market signals and student success patterns (demo mode).\n\n${ctx ? `Using ${ctx}, I recommend starting with a **focused 30-day roadmap** or a **resume pass**.` : "Try: *Build my 30-day roadmap*, *Improve my resume*, or *Find scholarships*."}\n\nWhat outcome matters most this week?`;
}

export const SUGGESTED_PROMPTS = [
  "Build my 30-day career roadmap",
  "Improve my resume for ATS",
  "Find scholarships I'm eligible for",
  "Mock a system design interview",
  "Which skills should I learn next?",
  "Help me switch career tracks",
] as const;

export function titleFromFirstMessage(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 42) return trimmed;
  return `${trimmed.slice(0, 42)}…`;
}
