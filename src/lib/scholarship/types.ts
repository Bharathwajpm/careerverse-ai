export type CasteCategory = "general" | "obc" | "sc" | "st" | "ews" | "any";

export type IncomeBracket = "below-2.5" | "2.5-5" | "5-8" | "above-8" | "any";

export type ScholarshipCategory =
  | "engineering"
  | "women-stem"
  | "research"
  | "need-based"
  | "merit"
  | "global"
  | "minority";

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  amountDisplay: string;
  amountInr: number;
  currency: "INR" | "USD";
  deadline: string;
  category: ScholarshipCategory;
  level: "UG" | "PG" | "PhD" | "Any";
  states: string[];
  castes: CasteCategory[];
  maxAnnualIncomeLakhs: number | null;
  requirements: string[];
  description: string;
  tags: string[];
};

export type ScholarshipFilters = {
  query: string;
  state: string;
  caste: CasteCategory | "any";
  income: IncomeBracket;
  category: ScholarshipCategory | "all";
  savedOnly: boolean;
};

export type ScholarshipProfile = {
  version: 1;
  state: string;
  caste: CasteCategory;
  income: IncomeBracket;
  level: "UG" | "PG" | "PhD";
};

export type ScoredScholarship = Scholarship & {
  matchScore: number;
  matchReasons: string[];
};
