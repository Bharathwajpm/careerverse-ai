import { loadAssessmentResult } from "@/lib/assessment/storage";
import { SCHOLARSHIPS } from "./dataset";
import type {
  IncomeBracket,
  Scholarship,
  ScholarshipFilters,
  ScholarshipProfile,
  ScoredScholarship,
} from "./types";

const INCOME_MAX: Record<IncomeBracket, number | null> = {
  "below-2.5": 2.5,
  "2.5-5": 5,
  "5-8": 8,
  "above-8": 999,
  any: null,
};

function incomeMatches(s: Scholarship, income: IncomeBracket): boolean {
  if (income === "any" || s.maxAnnualIncomeLakhs == null) return true;
  const userCeiling = INCOME_MAX[income];
  if (userCeiling == null) return true;
  return userCeiling <= s.maxAnnualIncomeLakhs;
}

function casteMatches(s: Scholarship, caste: ScholarshipProfile["caste"]): boolean {
  if (caste === "any" || s.castes.includes("any")) return true;
  return s.castes.includes(caste);
}

function stateMatches(s: Scholarship, state: string): boolean {
  if (!state || state === "any") return true;
  return s.states.includes("All India") || s.states.includes(state);
}

export function filterScholarships(
  filters: ScholarshipFilters,
  savedIds: Set<string>,
): Scholarship[] {
  const q = filters.query.trim().toLowerCase();

  return SCHOLARSHIPS.filter((s) => {
    if (filters.savedOnly && !savedIds.has(s.id)) return false;
    if (filters.category !== "all" && s.category !== filters.category) return false;
    if (!casteMatches(s, filters.caste === "any" ? "any" : filters.caste)) return false;
    if (!stateMatches(s, filters.state)) return false;
    if (!incomeMatches(s, filters.income)) return false;
    if (filters.caste !== "any" && !s.castes.includes("any") && !s.castes.includes(filters.caste)) {
      return false;
    }

    if (q) {
      const haystack = [
        s.name,
        s.provider,
        s.description,
        ...s.tags,
        ...s.requirements,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function daysUntilDeadline(deadline: string): number {
  const end = new Date(deadline);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDeadlineLabel(deadline: string): string {
  const days = daysUntilDeadline(deadline);
  if (days < 0) return "Closed";
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  return `${days}d`;
}

export function scoreScholarship(s: Scholarship, profile: ScholarshipProfile | null): ScoredScholarship {
  let score = 55;
  const reasons: string[] = [];

  if (profile) {
    if (casteMatches(s, profile.caste)) {
      score += 12;
      reasons.push("Caste category match");
    }
    if (stateMatches(s, profile.state)) {
      score += 10;
      reasons.push("State eligibility");
    }
    if (incomeMatches(s, profile.income)) {
      score += 10;
      reasons.push("Income bracket fit");
    }
    if (s.level === profile.level || s.level === "Any") {
      score += 8;
      reasons.push("Study level aligned");
    }
  }

  const days = daysUntilDeadline(s.deadline);
  if (days > 0 && days <= 14) {
    score += 5;
    reasons.push("Closing soon — apply priority");
  }
  if (days > 14 && days <= 45) {
    score += 3;
  }

  const assessment = loadAssessmentResult();
  if (assessment?.topMatches[0]) {
    const top = assessment.topMatches[0].title.toLowerCase();
    if (
      (top.includes("engineer") && s.category === "engineering") ||
      (top.includes("data") && s.category === "research") ||
      (top.includes("design") && s.category === "women-stem")
    ) {
      score += 12;
      reasons.push(`Career track: ${assessment.topMatches[0].title}`);
    }
  }

  if (s.category === "merit") score += 4;
  if (s.amountInr >= 200000) {
    score += 5;
    reasons.push("High award value");
  }

  return {
    ...s,
    matchScore: Math.min(98, Math.max(52, Math.round(score))),
    matchReasons: reasons.length ? reasons : ["General eligibility — verify documents"],
  };
}

export function recommendScholarships(
  profile: ScholarshipProfile | null,
  limit = 5,
): ScoredScholarship[] {
  return SCHOLARSHIPS.map((s) => scoreScholarship(s, profile))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export function totalOpportunityInr(scholarships: Scholarship[]): string {
  const sum = scholarships.reduce((a, s) => a + s.amountInr, 0);
  if (sum >= 100000) return `₹${(sum / 100000).toFixed(1)}L`;
  return `₹${(sum / 1000).toFixed(0)}K`;
}
