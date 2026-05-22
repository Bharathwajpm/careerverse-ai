export type AppTheme = "dark" | "light" | "system";
export type AppLanguage = "en" | "hi" | "ta";

export type NotificationPrefs = {
  scholarshipReminders: boolean;
  roadmapReminders: boolean;
  achievementAlerts: boolean;
  weeklyDigest: boolean;
  emailDigest: boolean;
  pushEnabled: boolean;
};

export type AiPersonalization = {
  tone: "professional" | "friendly" | "coach";
  detailLevel: "concise" | "balanced" | "deep";
  careerFocus: string;
  useAssessmentContext: boolean;
  suggestScholarships: boolean;
  mockInterviewCoaching: boolean;
};

export type AccountSettings = {
  twoFactorEnabled: boolean;
  publicProfile: boolean;
  dataExportRequested: boolean;
};

export type UserProfile = {
  displayName: string;
  headline: string;
  bio: string;
  location: string;
  avatarDataUrl: string | null;
};

export type UserSettings = {
  version: 1;
  profile: UserProfile;
  theme: AppTheme;
  language: AppLanguage;
  notifications: NotificationPrefs;
  ai: AiPersonalization;
  account: AccountSettings;
};
