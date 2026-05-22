export type NotificationKind =
  | "scholarship"
  | "roadmap"
  | "achievement"
  | "system"
  | "learning";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
  scheduledFor?: string;
};

export type NotificationState = {
  version: 1;
  items: AppNotification[];
  lastSchedulerRun: string | null;
};

export type SchedulerPrefs = {
  scholarshipReminders: boolean;
  roadmapReminders: boolean;
  achievementAlerts: boolean;
};
