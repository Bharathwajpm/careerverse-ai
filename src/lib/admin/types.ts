export type AdminUser = {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  lastActive: string;
  modulesUsed: number;
  xp: number;
};

export type AdminScholarshipRow = {
  id: string;
  name: string;
  provider: string;
  amount: string;
  status: "active" | "draft" | "archived";
  applications: number;
};

export type AdminContentRow = {
  id: string;
  title: string;
  type: "course" | "video" | "article";
  status: "published" | "draft";
  views: number;
};

export type AdminOverview = {
  totalUsers: number;
  activeToday: number;
  assessmentsCompleted: number;
  scholarshipsSaved: number;
  revenueMrr: number;
  growthSeries: { month: string; users: number; sessions: number }[];
  moduleUsage: { module: string; count: number }[];
};
