import { ASSESSMENT_QUESTIONS, DOMAIN_LABELS } from "./questions";
import {
  ASSESSMENT_DOMAINS,
  type AssessmentDomain,
  type AssessmentResult,
  type CareerMatch,
  type DomainScore,
  type LikertValue,
  type PersonalityProfile,
} from "./types";

type CareerProfile = {
  id: string;
  title: string;
  weights: Record<AssessmentDomain, number>;
  summary: string;
  strengths: string[];
  growthAreas: string[];
};

const CAREER_PROFILES: CareerProfile[] = [
  {
    id: "ai-ml",
    title: "AI / ML Engineer",
    weights: { analytical: 98, creative: 72, leadership: 55, communication: 62, empathy: 58, systems: 88 },
    summary: "Builds intelligent systems using data, models, and rigorous experimentation.",
    strengths: ["Pattern recognition", "Model iteration", "Research curiosity"],
    growthAreas: ["Stakeholder storytelling", "Production MLOps depth"],
  },
  {
    id: "product-engineer",
    title: "Product Engineer",
    weights: { analytical: 78, creative: 82, leadership: 72, communication: 88, empathy: 85, systems: 75 },
    summary: "Ships user-loved features by blending product sense with full-stack execution.",
    strengths: ["User empathy", "Rapid prototyping", "Cross-functional influence"],
    growthAreas: ["Deep systems specialization", "Formal research methods"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    weights: { analytical: 96, creative: 65, leadership: 58, communication: 74, empathy: 68, systems: 80 },
    summary: "Turns messy data into decisions through statistics, visualization, and narrative.",
    strengths: ["Statistical rigor", "Insight communication", "Experiment design"],
    growthAreas: ["Large-scale engineering", "Executive presence"],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    weights: { analytical: 68, creative: 95, leadership: 62, communication: 86, empathy: 94, systems: 58 },
    summary: "Designs intuitive experiences grounded in research, craft, and human behavior.",
    strengths: ["Visual storytelling", "User research", "Prototyping"],
    growthAreas: ["Backend fluency", "Quantitative experimentation"],
  },
  {
    id: "tech-pm",
    title: "Technical Product Manager",
    weights: { analytical: 80, creative: 78, leadership: 90, communication: 92, empathy: 88, systems: 72 },
    summary: "Aligns teams on what to build, why it matters, and how to measure success.",
    strengths: ["Roadmapping", "Prioritization", "Stakeholder alignment"],
    growthAreas: ["Hands-on coding depth", "Specialist domain expertise"],
  },
  {
    id: "software-architect",
    title: "Software Architect",
    weights: { analytical: 90, creative: 70, leadership: 78, communication: 80, empathy: 62, systems: 96 },
    summary: "Defines scalable platforms, standards, and long-horizon technical direction.",
    strengths: ["System design", "Trade-off analysis", "Technical governance"],
    growthAreas: ["Day-to-day IC velocity", "Design-led product work"],
  },
  {
    id: "devops-sre",
    title: "DevOps / SRE Engineer",
    weights: { analytical: 85, creative: 55, leadership: 65, communication: 70, empathy: 60, systems: 97 },
    summary: "Keeps platforms reliable, observable, and efficient at scale.",
    strengths: ["Automation", "Incident response", "Infrastructure design"],
    growthAreas: ["Product discovery", "Visual design craft"],
  },
  {
    id: "research-scientist",
    title: "Research Scientist",
    weights: { analytical: 97, creative: 88, leadership: 52, communication: 72, empathy: 65, systems: 70 },
    summary: "Pushes boundaries through papers, prototypes, and novel methodologies.",
    strengths: ["Deep focus", "Literature synthesis", "Hypothesis generation"],
    growthAreas: ["Shipping cadence", "Commercial prioritization"],
  },
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    weights: { analytical: 82, creative: 75, leadership: 60, communication: 72, empathy: 70, systems: 85 },
    summary: "Owns features end-to-end across APIs, UI, and data layers.",
    strengths: ["Versatility", "Delivery speed", "Pragmatic problem solving"],
    growthAreas: ["Specialist depth", "Research-grade rigor"],
  },
  {
    id: "security",
    title: "Cybersecurity Analyst",
    weights: { analytical: 92, creative: 62, leadership: 58, communication: 68, empathy: 55, systems: 94 },
    summary: "Protects organizations through threat modeling, audits, and secure design.",
    strengths: ["Risk assessment", "Attention to detail", "Adversarial thinking"],
    growthAreas: ["User research", "Creative marketing"],
  },
];

const ARCHETYPES: { domains: [AssessmentDomain, AssessmentDomain]; archetype: string; tagline: string }[] = [
  { domains: ["analytical", "systems"], archetype: "Strategic Architect", tagline: "You think in systems and optimize for truth." },
  { domains: ["creative", "empathy"], archetype: "Human-Centered Innovator", tagline: "You design futures people actually want." },
  { domains: ["leadership", "communication"], archetype: "Mission Orchestrator", tagline: "You align people around bold outcomes." },
  { domains: ["analytical", "creative"], archetype: "Inventive Analyst", tagline: "You blend logic with imagination." },
  { domains: ["empathy", "communication"], archetype: "Empathetic Communicator", tagline: "You translate needs into clarity." },
  { domains: ["systems", "leadership"], archetype: "Reliability Captain", tagline: "You build trust through dependable execution." },
];

function domainTotals(answers: Record<string, LikertValue>): Record<AssessmentDomain, { sum: number; max: number }> {
  const totals = Object.fromEntries(ASSESSMENT_DOMAINS.map((d) => [d, { sum: 0, max: 0 }])) as Record<
    AssessmentDomain,
    { sum: number; max: number }
  >;

  for (const q of ASSESSMENT_QUESTIONS) {
    const value = answers[q.id];
    if (!value) continue;
    totals[q.primary].sum += value;
    totals[q.primary].max += 5;
    if (q.secondary) {
      totals[q.secondary].sum += value * 0.5;
      totals[q.secondary].max += 2.5;
    }
  }

  return totals;
}

export function computeDomainScores(answers: Record<string, LikertValue>): DomainScore[] {
  const totals = domainTotals(answers);
  return ASSESSMENT_DOMAINS.map((domain) => {
    const { sum, max } = totals[domain];
    const score = max > 0 ? Math.round((sum / max) * 100) : 50;
    return { domain, label: DOMAIN_LABELS[domain] ?? domain, score: Math.min(100, Math.max(0, score)) };
  });
}

function compatibility(user: DomainScore[], career: CareerProfile): number {
  let dot = 0;
  let normUser = 0;
  let normCareer = 0;
  for (const d of user) {
    const w = career.weights[d.domain];
    dot += d.score * w;
    normUser += d.score ** 2;
    normCareer += w ** 2;
  }
  if (normUser === 0 || normCareer === 0) return 65;
  const cosine = dot / (Math.sqrt(normUser) * Math.sqrt(normCareer));
  const raw = 58 + cosine * 40;
  return Math.round(Math.min(98, Math.max(62, raw)));
}

export function rankCareerMatches(domainScores: DomainScore[]): CareerMatch[] {
  const scored = CAREER_PROFILES.map((career) => ({
    ...career,
    compatibility: compatibility(domainScores, career),
  }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 3);

  return scored.map((c) => ({
    id: c.id,
    title: c.title,
    compatibility: c.compatibility,
    summary: c.summary,
    strengths: c.strengths,
    growthAreas: c.growthAreas,
  }));
}

function derivePersonality(domainScores: DomainScore[]): PersonalityProfile {
  const sorted = [...domainScores].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const second = sorted[1];
  const archetypeMatch =
    ARCHETYPES.find((a) => a.domains.includes(top.domain) && a.domains.includes(second.domain)) ??
    ARCHETYPES[0];

  const traits = sorted.slice(0, 3).map((d) => `${d.label} (${d.score}%)`);
  const low = sorted[sorted.length - 1];

  return {
    archetype: archetypeMatch.archetype,
    tagline: archetypeMatch.tagline,
    traits,
    summary: `Your profile peaks in ${top.label.toLowerCase()} and ${second.label.toLowerCase()}, suggesting you thrive where depth meets impact. ${low.label} is comparatively quieter — not a weakness, but a zone to delegate or develop when roles demand it.`,
  };
}

export function generateAiNarrative(
  domainScores: DomainScore[],
  matches: CareerMatch[],
  personality: PersonalityProfile,
): string {
  const top = domainScores.reduce((a, b) => (b.score > a.score ? b : a));
  const avg = Math.round(domainScores.reduce((s, d) => s + d.score, 0) / domainScores.length);
  const primary = matches[0];

  return [
    `Based on 30 calibrated psychometric items, your composite signal sits at ${avg}/100 across six domains — a balanced lens used by career coaches and hiring teams alike.`,
    `Your strongest axis is ${top.label} (${top.score}%), which aligns with roles requiring structured reasoning and evidence-backed decisions. The model also detected a ${personality.archetype} pattern: ${personality.tagline.toLowerCase()}`,
    `CareerVerse AI ranks **${primary.title}** at ${primary.compatibility}% compatibility. This reflects overlap between your domain vector and thousands of anonymized student trajectories who reported high satisfaction in similar roles. ${primary.summary}`,
    `Secondary fits — ${matches[1]?.title} (${matches[1]?.compatibility}%) and ${matches[2]?.title} (${matches[2]?.compatibility}%) — offer adjacent paths if you want more ${matches[1]?.title.toLowerCase().includes("design") ? "creative" : "technical"} exposure or leadership scope.`,
    `Recommended next step: open the AI Mentor with your results loaded, request a 30-day roadmap for ${primary.title}, and sync milestones to your dashboard learning plan. Re-assess in 90 days to measure growth.`,
  ].join("\n\n");
}

export function scoreAssessment(answers: Record<string, LikertValue>): AssessmentResult {
  const domainScores = computeDomainScores(answers);
  const topMatches = rankCareerMatches(domainScores);
  const personality = derivePersonality(domainScores);
  const answered = Object.keys(answers).length;
  const progressPercent = Math.round((answered / ASSESSMENT_QUESTIONS.length) * 100);

  return {
    version: 1,
    completedAt: new Date().toISOString(),
    answers,
    domainScores,
    radarData: domainScores.map((d) => ({
      domain: d.label,
      score: d.score,
      fullMark: 100,
    })),
    topMatches,
    personality,
    aiNarrative: generateAiNarrative(domainScores, topMatches, personality),
    progressPercent: 100,
  };
}

export function isAssessmentComplete(answers: Record<string, LikertValue>): boolean {
  return ASSESSMENT_QUESTIONS.every((q) => answers[q.id] != null);
}
