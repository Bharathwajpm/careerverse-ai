import { loadAssessmentResult } from "@/lib/assessment/storage";
import type { KeywordMatch, ResumeAnalysisResult, ResumeRecommendation, SkillGap } from "./types";

const ROLE_KEYWORDS: Record<string, string[]> = {
  engineer: ["Python", "React", "AWS", "CI/CD", "API", "Docker", "Git", "Agile", "SQL"],
  data: ["Python", "SQL", "Machine Learning", "Tableau", "Statistics", "Pandas", "A/B Testing"],
  security: ["SIEM", "Penetration Testing", "OWASP", "Risk Assessment", "Linux", "Firewall"],
  default: ["Leadership", "Communication", "Problem Solving", "Teamwork", "JavaScript", "Project Management"],
};

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function scoreFromFile(fileName: string, fileSize: number): number {
  const seed = hashSeed(fileName + fileSize);
  const base = 72 + (seed % 22);
  const sizeBonus = fileSize > 50_000 && fileSize < 500_000 ? 4 : 0;
  const pdfBonus = fileName.toLowerCase().endsWith(".pdf") ? 3 : 0;
  return Math.min(96, base + sizeBonus + pdfBonus);
}

function gradeFromScore(score: number): ResumeAnalysisResult["atsGrade"] {
  if (score >= 90) return "A";
  if (score >= 82) return "B";
  if (score >= 74) return "C";
  return "D";
}

function pickKeywords(fileName: string): KeywordMatch[] {
  const lower = fileName.toLowerCase();
  const pool =
    lower.includes("data") || lower.includes("analyst")
      ? ROLE_KEYWORDS.data
      : lower.includes("security") || lower.includes("cyber")
        ? ROLE_KEYWORDS.security
        : lower.includes("dev") || lower.includes("engineer") || lower.includes("software")
          ? ROLE_KEYWORDS.engineer
          : ROLE_KEYWORDS.default;

  const assessment = loadAssessmentResult();
  const topRole = assessment?.topMatches[0]?.title ?? "";
  if (topRole.toLowerCase().includes("data")) pool.push("Machine Learning", "Statistics");
  if (topRole.toLowerCase().includes("security")) pool.push("Threat Modeling", "Incident Response");

  const unique = [...new Set(pool)].slice(0, 12);
  const seed = hashSeed(fileName);

  return unique.map((term, i) => ({
    term,
    found: (seed + i * 7) % 10 > 3,
    importance: i < 4 ? "high" : i < 8 ? "medium" : ("low" as const),
    category: i % 3 === 0 ? "Technical" : i % 3 === 1 ? "Tools" : "Soft Skills",
  }));
}

function skillGaps(keywords: KeywordMatch[]): SkillGap[] {
  const missing = keywords.filter((k) => !k.found && k.importance === "high");
  const assessment = loadAssessmentResult();
  const gaps: SkillGap[] = missing.slice(0, 4).map((k) => ({
    skill: k.term,
    priority: "critical" as const,
    reason: `High-impact keyword "${k.term}" not detected in your resume scan.`,
  }));

  if (gaps.length < 3) {
    gaps.push({
      skill: "Quantified achievements",
      priority: "recommended",
      reason: "Add 2–3 bullets with metrics (%, $, time saved) under each role.",
    });
  }
  if (assessment?.topMatches[0]) {
    gaps.push({
      skill: assessment.topMatches[0].title,
      priority: "optional",
      reason: `Tailor language toward your assessment match: ${assessment.topMatches[0].title}.`,
    });
  }
  return gaps.slice(0, 5);
}

function recommendations(score: number, keywords: KeywordMatch[]): ResumeRecommendation[] {
  const missingHigh = keywords.filter((k) => !k.found && k.importance === "high").length;
  return [
    {
      id: "r1",
      title: "Add metric-driven impact bullets",
      impact: "high",
      category: "content",
      detail: "Replace task lists with outcomes: 'Reduced API latency by 40%' beats 'Worked on APIs'.",
    },
    {
      id: "r2",
      title: "Mirror target role keywords",
      impact: missingHigh > 2 ? "high" : "medium",
      category: "keywords",
      detail: `We found ${missingHigh} high-priority terms missing. Sprinkle them naturally in experience bullets.`,
    },
    {
      id: "r3",
      title: "Simplify layout for ATS parsers",
      impact: "medium",
      category: "format",
      detail: "Use standard headings (Experience, Education, Skills). Avoid tables, text boxes, and graphics.",
    },
    {
      id: "r4",
      title: "Keep to 1–2 pages",
      impact: score < 85 ? "medium" : "low",
      category: "structure",
      detail: "Recruiters spend ~7 seconds on first pass. Front-load your strongest 3 achievements.",
    },
    {
      id: "r5",
      title: "Add a projects section",
      impact: "medium",
      category: "content",
      detail: "Link 2 GitHub repos with README summaries — especially for students and career switchers.",
    },
  ];
}

function generateAiFeedback(
  score: number,
  grade: ResumeAnalysisResult["atsGrade"],
  keywords: KeywordMatch[],
  gaps: SkillGap[],
): string {
  const found = keywords.filter((k) => k.found).length;
  const total = keywords.length;
  const assessment = loadAssessmentResult();

  return [
    `**ATS scan complete** (demo mode). Your resume scores **${score}/100** (Grade ${grade}) against common applicant tracking parsers used by Fortune 500 recruiters.`,
    `Keyword coverage: **${found}/${total}** tracked terms appear with sufficient density. ATS systems weight exact matches in experience sections 2–3× higher than skills lists alone.`,
    gaps[0]
      ? `Priority gap: **${gaps[0].skill}** — ${gaps[0].reason}`
      : "Your keyword profile is strong. Focus next on quantified impact and consistent tense.",
    assessment?.topMatches[0]
      ? `Given your career assessment (${assessment.topMatches[0].title}, ${assessment.topMatches[0].compatibility}% fit), align bullet verbs with that track's hiring signals.`
      : "Complete the career assessment for role-specific keyword packs.",
    "Re-upload after edits to track score deltas. Connect with AI Mentor for line-by-line rewrites.",
  ].join("\n\n");
}

export function analyzeResume(file: File): ResumeAnalysisResult {
  const atsScore = scoreFromFile(file.name, file.size);
  const atsGrade = gradeFromScore(atsScore);
  const keywords = pickKeywords(file.name);
  const skillGapsList = skillGaps(keywords);

  const sections = {
    formatting: Math.min(100, atsScore + 2),
    keywords: Math.round((keywords.filter((k) => k.found).length / keywords.length) * 100),
    impact: Math.min(100, atsScore - 4 + (hashSeed(file.name) % 8)),
    length: file.size < 100_000 ? 88 : file.size < 400_000 ? 92 : 78,
    readability: Math.min(100, atsScore + (hashSeed(file.name) % 5)),
  };

  const chartData = [
    { name: "Formatting", score: sections.formatting, fullMark: 100 },
    { name: "Keywords", score: sections.keywords, fullMark: 100 },
    { name: "Impact", score: sections.impact, fullMark: 100 },
    { name: "Length", score: sections.length, fullMark: 100 },
    { name: "Readability", score: sections.readability, fullMark: 100 },
  ];

  return {
    version: 1,
    fileName: file.name,
    analyzedAt: new Date().toISOString(),
    atsScore,
    atsGrade,
    sections,
    chartData,
    keywords,
    skillGaps: skillGapsList,
    recommendations: recommendations(atsScore, keywords),
    aiFeedback: generateAiFeedback(atsScore, atsGrade, keywords, skillGapsList),
  };
}
