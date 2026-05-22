export type RoadmapTrackId =
  | "ai-ml"
  | "fullstack"
  | "cybersecurity"
  | "data-science"
  | "product"
  | "devops";

export type MilestoneStatus = "pending" | "in_progress" | "done";

export type RoadmapMilestone = {
  id: string;
  title: string;
  description: string;
  estimatedWeeks: number;
};

export type RoadmapPhase = {
  id: string;
  title: string;
  subtitle: string;
  durationWeeks: number;
  milestones: RoadmapMilestone[];
};

export type SkillCard = {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  hours: number;
  resources: string[];
};

export type CertificationSuggestion = {
  id: string;
  name: string;
  provider: string;
  relevance: number;
  estimatedMonths: number;
  url?: string;
};

export type ProjectRecommendation = {
  id: string;
  title: string;
  difficulty: "starter" | "intermediate" | "capstone";
  stack: string[];
  outcome: string;
};

export type LearningPathItem = {
  id: string;
  title: string;
  type: "course" | "book" | "lab" | "community";
  duration: string;
  children?: LearningPathItem[];
};

export type CareerRoadmap = {
  version: 1;
  trackId: RoadmapTrackId;
  title: string;
  tagline: string;
  generatedAt: string;
  totalWeeks: number;
  phases: RoadmapPhase[];
  skills: SkillCard[];
  certifications: CertificationSuggestion[];
  projects: ProjectRecommendation[];
  learningPath: LearningPathItem[];
};

export type RoadmapProgress = {
  version: 1;
  trackId: RoadmapTrackId;
  milestoneStatus: Record<string, MilestoneStatus>;
  skillCompleted: Record<string, boolean>;
  projectCompleted: Record<string, boolean>;
  updatedAt: string;
};
