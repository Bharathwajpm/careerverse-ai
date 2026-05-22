import { useCallback, useEffect, useRef, useState } from "react";
import { generateDemoMentorReply, titleFromFirstMessage } from "@/lib/mentor/demo-responses";
import {
  deleteMentorSession,
  loadActiveSessionId,
  loadMentorSessions,
  setActiveSessionId,
  upsertMentorSession,
} from "@/lib/mentor/storage";
import type { MentorChatSession, MentorMessage } from "@/lib/mentor/types";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createWelcomeMessage(): MentorMessage {
  return {
    id: uid(),
    role: "assistant",
    content:
      "Hi — I'm your CareerVerse Mentor (demo mode). I've reviewed your dashboard signals. Ask for a **30-day roadmap**, resume help, scholarships, or interview practice.",
    createdAt: Date.now(),
  };
}

function createSession(): MentorChatSession {
  const now = Date.now();
  return {
    id: uid(),
    title: "New conversation",
    messages: [createWelcomeMessage()],
    createdAt: now,
    updatedAt: now,
  };
}

export function useMentorChat(initialPrompt?: string) {
  const [sessions, setSessions] = useState<MentorChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const initialPromptRef = useRef(initialPrompt);
  const promptSentRef = useRef(false);

  useEffect(() => {
    const loaded = loadMentorSessions();
    const active = loadActiveSessionId();
    if (loaded.length === 0) {
      const fresh = createSession();
      upsertMentorSession(fresh);
      setSessions([fresh]);
      setActiveId(fresh.id);
    } else {
      setSessions(loaded);
      setActiveId(active && loaded.some((s) => s.id === active) ? active : loaded[0].id);
    }
    setHydrated(true);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0] ?? null;

  const persist = useCallback((session: MentorChatSession) => {
    upsertMentorSession(session);
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id);
      if (idx < 0) return [session, ...prev];
      const next = [...prev];
      next[idx] = session;
      return next.sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeSession || !text.trim() || typing) return;

      const userMsg: MentorMessage = {
        id: uid(),
        role: "user",
        content: text.trim(),
        createdAt: Date.now(),
      };

      const title =
        activeSession.messages.length <= 1
          ? titleFromFirstMessage(text)
          : activeSession.title;

      const withUser: MentorChatSession = {
        ...activeSession,
        title,
        messages: [...activeSession.messages, userMsg],
        updatedAt: Date.now(),
      };
      persist(withUser);
      setTyping(true);

      const delay = 900 + Math.min(text.length * 8, 1200);
      await new Promise((r) => setTimeout(r, delay));

      const reply = generateDemoMentorReply(text);
      const assistantMsg: MentorMessage = {
        id: uid(),
        role: "assistant",
        content: reply,
        createdAt: Date.now(),
        animate: true,
      };

      persist({
        ...withUser,
        messages: [...withUser.messages, assistantMsg],
        updatedAt: Date.now(),
      });
      setTyping(false);
    },
    [activeSession, persist, typing],
  );

  useEffect(() => {
    if (!hydrated || !activeSession || promptSentRef.current) return;
    const prompt = initialPromptRef.current?.trim();
    if (!prompt) return;
    promptSentRef.current = true;
    void sendMessage(prompt);
  }, [hydrated, activeSession, sendMessage]);

  const newChat = useCallback(() => {
    const session = createSession();
    persist(session);
    setActiveId(session.id);
    setActiveSessionId(session.id);
  }, [persist]);

  const selectSession = useCallback((id: string) => {
    setActiveId(id);
    setActiveSessionId(id);
  }, []);

  const removeSession = useCallback(
    (id: string) => {
      deleteMentorSession(id);
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (next.length === 0) {
          const fresh = createSession();
          upsertMentorSession(fresh);
          setActiveId(fresh.id);
          return [fresh];
        }
        if (activeId === id) {
          const fallback = next[0];
          setActiveId(fallback.id);
          setActiveSessionId(fallback.id);
        }
        return next;
      });
    },
    [activeId],
  );

  return {
    sessions,
    activeSession,
    activeId,
    typing,
    hydrated,
    sendMessage,
    newChat,
    selectSession,
    removeSession,
  };
}
