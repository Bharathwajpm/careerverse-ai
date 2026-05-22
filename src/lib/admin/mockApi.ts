import type { AdminContentRow, AdminOverview, AdminScholarshipRow, AdminUser } from "./types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const USERS: AdminUser[] = [
  { id: "u1", name: "Aanya Sharma", email: "aanya@demo.edu", plan: "pro", lastActive: "2026-05-19", modulesUsed: 8, xp: 1240 },
  { id: "u2", name: "Rohan Patel", email: "rohan@demo.edu", plan: "free", lastActive: "2026-05-18", modulesUsed: 5, xp: 680 },
  { id: "u3", name: "Meera Iyer", email: "meera@demo.edu", plan: "pro", lastActive: "2026-05-19", modulesUsed: 7, xp: 910 },
  { id: "u4", name: "Arjun Das", email: "arjun@demo.edu", plan: "free", lastActive: "2026-05-17", modulesUsed: 3, xp: 320 },
  { id: "u5", name: "Kavya N.", email: "kavya@demo.edu", plan: "pro", lastActive: "2026-05-19", modulesUsed: 9, xp: 1580 },
];

let scholarships: AdminScholarshipRow[] = [
  { id: "s1", name: "NSP Central Sector", provider: "Govt of India", amount: "₹50k/yr", status: "active", applications: 1240 },
  { id: "s2", name: "Adobe India Women-in-Tech", provider: "Adobe", amount: "₹2L", status: "active", applications: 89 },
  { id: "s3", name: "AWS Educate Cloud Grant", provider: "Amazon", amount: "Credits", status: "draft", applications: 0 },
];

let content: AdminContentRow[] = [
  { id: "c1", title: "System Design Primer", type: "course", status: "published", views: 4200 },
  { id: "c2", title: "STAR Interview Method", type: "video", status: "published", views: 3100 },
  { id: "c3", title: "Budgeting for Students", type: "article", status: "draft", views: 0 },
];

export async function fetchAdminOverview(): Promise<AdminOverview> {
  await delay();
  return {
    totalUsers: 12840,
    activeToday: 892,
    assessmentsCompleted: 5621,
    scholarshipsSaved: 18420,
    revenueMrr: 248000,
    growthSeries: [
      { month: "Dec", users: 8200, sessions: 12400 },
      { month: "Jan", users: 9100, sessions: 14200 },
      { month: "Feb", users: 9800, sessions: 15800 },
      { month: "Mar", users: 10400, sessions: 17100 },
      { month: "Apr", users: 11600, sessions: 19200 },
      { month: "May", users: 12840, sessions: 21400 },
    ],
    moduleUsage: [
      { module: "Assessment", count: 5621 },
      { module: "Mentor", count: 9102 },
      { module: "Roadmaps", count: 4401 },
      { module: "Scholarships", count: 6200 },
      { module: "Interviews", count: 2810 },
      { module: "Learning", count: 5300 },
    ],
  };
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  await delay(300);
  return [...USERS];
}

export async function fetchAdminScholarships(): Promise<AdminScholarshipRow[]> {
  await delay(300);
  return [...scholarships];
}

export async function updateScholarshipStatus(
  id: string,
  status: AdminScholarshipRow["status"],
): Promise<AdminScholarshipRow[]> {
  await delay(200);
  scholarships = scholarships.map((s) => (s.id === id ? { ...s, status } : s));
  return [...scholarships];
}

export async function fetchAdminContent(): Promise<AdminContentRow[]> {
  await delay(300);
  return [...content];
}

export async function toggleContentPublish(id: string): Promise<AdminContentRow[]> {
  await delay(200);
  content = content.map((c) =>
    c.id === id
      ? { ...c, status: c.status === "published" ? "draft" : "published" }
      : c,
  );
  return [...content];
}
