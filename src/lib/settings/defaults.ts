import type { UserSettings } from "./types";

export function defaultSettings(name = "Operator", email = ""): UserSettings {
  return {
    version: 1,
    profile: {
      displayName: name,
      headline: "Student · CareerVerse OS",
      bio: "",
      location: "",
      avatarDataUrl: null,
    },
    theme: "dark",
    language: "en",
    notifications: {
      scholarshipReminders: true,
      roadmapReminders: true,
      achievementAlerts: true,
      weeklyDigest: true,
      emailDigest: false,
      pushEnabled: true,
    },
    ai: {
      tone: "coach",
      detailLevel: "balanced",
      careerFocus: email.includes("@") ? "Full-stack & cloud" : "Career exploration",
      useAssessmentContext: true,
      suggestScholarships: true,
      mockInterviewCoaching: true,
    },
    account: {
      twoFactorEnabled: false,
      publicProfile: true,
      dataExportRequested: false,
    },
  };
}
