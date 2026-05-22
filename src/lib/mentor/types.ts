export type MentorRole = "user" | "assistant";

export type MentorMessage = {
  id: string;
  role: MentorRole;
  content: string;
  createdAt: number;
  /** When true, UI animates reveal (assistant only). */
  animate?: boolean;
};

export type MentorChatSession = {
  id: string;
  title: string;
  messages: MentorMessage[];
  createdAt: number;
  updatedAt: number;
};

export type MentorLocale = "en" | "hi" | "ta";
