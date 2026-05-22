import type { CareerRoadmap, MilestoneStatus, RoadmapProgress } from "./types";

export function computeRoadmapStats(roadmap: CareerRoadmap, progress: RoadmapProgress) {
  const allMilestones = roadmap.phases.flatMap((p) => p.milestones);
  const totalMilestones = allMilestones.length;
  const doneMilestones = allMilestones.filter(
    (m) => progress.milestoneStatus[m.id] === "done",
  ).length;

  const totalSkills = roadmap.skills.length;
  const doneSkills = roadmap.skills.filter((s) => progress.skillCompleted[s.id]).length;

  const totalProjects = roadmap.projects.length;
  const doneProjects = roadmap.projects.filter((p) => progress.projectCompleted[p.id]).length;

  const total = totalMilestones + totalSkills + totalProjects;
  const done = doneMilestones + doneSkills + doneProjects;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    percent,
    doneMilestones,
    totalMilestones,
    doneSkills,
    totalSkills,
    doneProjects,
    totalProjects,
  };
}

export function toggleMilestone(
  progress: RoadmapProgress,
  milestoneId: string,
): RoadmapProgress {
  const current = progress.milestoneStatus[milestoneId] ?? "pending";
  const next: MilestoneStatus =
    current === "pending" ? "in_progress" : current === "in_progress" ? "done" : "pending";
  return {
    ...progress,
    milestoneStatus: { ...progress.milestoneStatus, [milestoneId]: next },
    updatedAt: new Date().toISOString(),
  };
}
