import { loadAssessmentResult } from "@/lib/assessment/storage";
import type { CertRecommendation, Course, YoutubeResource } from "./types";

export const DEFAULT_COURSES: Course[] = [
  {
    id: "c1",
    title: "Full-Stack Web Development",
    provider: "CareerVerse Academy",
    duration: "42h",
    level: "intermediate",
    progress: 35,
    category: "Web",
  },
  {
    id: "c2",
    title: "Data Structures & Algorithms",
    provider: "CS Foundations",
    duration: "28h",
    level: "intermediate",
    progress: 62,
    category: "Core CS",
  },
  {
    id: "c3",
    title: "Machine Learning Fundamentals",
    provider: "AI Track",
    duration: "36h",
    level: "beginner",
    progress: 12,
    category: "AI/ML",
  },
  {
    id: "c4",
    title: "System Design Primer",
    provider: "Engineering Plus",
    duration: "18h",
    level: "advanced",
    progress: 0,
    category: "Architecture",
  },
  {
    id: "c5",
    title: "UX Research for Developers",
    provider: "Product School",
    duration: "14h",
    level: "beginner",
    progress: 48,
    category: "Product",
  },
  {
    id: "c6",
    title: "Cloud & DevOps Essentials",
    provider: "Cloud Native",
    duration: "24h",
    level: "intermediate",
    progress: 20,
    category: "DevOps",
  },
];

export const CERT_RECOMMENDATIONS: CertRecommendation[] = [
  { id: "cert1", name: "AWS Cloud Practitioner", provider: "Amazon", relevance: 86, hours: 25 },
  { id: "cert2", name: "Meta Front-End Professional", provider: "Coursera", relevance: 82, hours: 40 },
  { id: "cert3", name: "Google Data Analytics", provider: "Google", relevance: 78, hours: 35 },
  { id: "cert4", name: "CKA Kubernetes Admin", provider: "CNCF", relevance: 74, hours: 50 },
];

export const YOUTUBE_RESOURCES: YoutubeResource[] = [
  {
    id: "yt1",
    title: "System Design Interview — Step by Step",
    channel: "Tech Dummies",
    duration: "1:12:00",
    views: "2.1M",
    topic: "System Design",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "yt2",
    title: "React Hooks Explained in 30 Minutes",
    channel: "Web Dev Simplified",
    duration: "32:10",
    views: "890K",
    topic: "React",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "yt3",
    title: "Behavioral Interview: STAR Method",
    channel: "Career Coach Amy",
    duration: "18:45",
    views: "450K",
    topic: "Interviews",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "yt4",
    title: "Python for Data Science — Full Course",
    channel: "freeCodeCamp",
    duration: "4:30:00",
    views: "5.2M",
    topic: "Data Science",
    videoId: "dQw4w9WgXcQ",
  },
];

export function personalizedCerts(): CertRecommendation[] {
  const assessment = loadAssessmentResult();
  const top = assessment?.topMatches[0]?.title?.toLowerCase() ?? "";
  return [...CERT_RECOMMENDATIONS]
    .map((c) => ({
      ...c,
      relevance:
        top.includes("data") && c.name.includes("Data")
          ? Math.min(98, c.relevance + 12)
          : top.includes("engineer") && c.name.includes("Front")
            ? Math.min(98, c.relevance + 10)
            : c.relevance,
    }))
    .sort((a, b) => b.relevance - a.relevance);
}
