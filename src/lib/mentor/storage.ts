import type { MentorChatSession, MentorLocale } from "./types";

const SESSIONS_KEY = "cv_mentor_sessions";
const ACTIVE_KEY = "cv_mentor_active_id";
const LOCALE_KEY = "cv_mentor_locale";

type Store = {
  sessions: MentorChatSession[];
  activeId: string | null;
};

function readStore(): Store {
  if (typeof window === "undefined") return { sessions: [], activeId: null };
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    const sessions = raw ? (JSON.parse(raw) as MentorChatSession[]) : [];
    const activeId = window.localStorage.getItem(ACTIVE_KEY);
    return { sessions: Array.isArray(sessions) ? sessions : [], activeId };
  } catch {
    return { sessions: [], activeId: null };
  }
}

function writeSessions(sessions: MentorChatSession[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadMentorSessions(): MentorChatSession[] {
  return readStore().sessions.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function loadActiveSessionId(): string | null {
  return readStore().activeId;
}

export function setActiveSessionId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_KEY, id);
}

export function upsertMentorSession(session: MentorChatSession) {
  const { sessions } = readStore();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  writeSessions(sessions);
  setActiveSessionId(session.id);
}

export function deleteMentorSession(id: string) {
  const store = readStore();
  const sessions = store.sessions.filter((s) => s.id !== id);
  writeSessions(sessions);
  if (store.activeId === id) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACTIVE_KEY);
    }
  }
}

export function loadMentorLocale(): MentorLocale {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem(LOCALE_KEY);
  if (raw === "hi" || raw === "ta" || raw === "en") return raw;
  return "en";
}

export function saveMentorLocale(locale: MentorLocale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
}
