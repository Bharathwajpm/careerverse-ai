import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Sparkles, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMentorChat } from "@/hooks/use-mentor-chat";
import { mentorStrings } from "@/lib/mentor/i18n";
import { SUGGESTED_PROMPTS } from "@/lib/mentor/demo-responses";
import { loadMentorLocale, saveMentorLocale } from "@/lib/mentor/storage";
import type { MentorLocale } from "@/lib/mentor/types";
import { ChatMessage } from "./ChatMessage";
import { MentorSidebar } from "./MentorSidebar";
import { TypingIndicator } from "./TypingIndicator";
import { DashboardPageSkeleton } from "@/components/shared/LoadingSkeletons";

type Props = {
  initialPrompt?: string;
};

export function MentorChat({ initialPrompt }: Props) {
  const [locale, setLocale] = useState<MentorLocale>(() => loadMentorLocale());
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const t = mentorStrings(locale);

  const {
    sessions,
    activeSession,
    activeId,
    typing,
    hydrated,
    sendMessage,
    newChat,
    selectSession,
    removeSession,
  } = useMentorChat(initialPrompt);

  const handleLocaleChange = (next: MentorLocale) => {
    setLocale(next);
    saveMentorLocale(next);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, typing]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input;
    setInput("");
    void sendMessage(text);
  }

  if (!hydrated || !activeSession) {
    return (
      <div className="mx-auto max-w-6xl p-4">
        <DashboardPageSkeleton />
      </div>
    );
  }

  const sidebar = (
    <MentorSidebar
      sessions={sessions}
      activeId={activeId}
      locale={locale}
      onLocaleChange={handleLocaleChange}
      onNewChat={newChat}
      onSelect={selectSession}
      onDelete={removeSession}
    />
  );

  return (
    <div className="mx-auto grid h-[calc(100dvh-8rem)] max-w-7xl grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[minmax(200px,260px)_1fr]">
      <div className="hidden min-h-0 lg:block">{sidebar}</div>

      <section className="glass relative flex min-h-0 flex-col overflow-hidden rounded-2xl">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.68_0.27_295/0.12),transparent)]"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <header className="relative z-10 flex shrink-0 items-center gap-3 border-b border-border/50 px-4 py-3">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-lg border border-border/60 lg:hidden"
                aria-label="Open chat history"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100vw-2rem,280px)] border-border/60 bg-background p-3">
              {sidebar}
            </SheetContent>
          </Sheet>

          <div className="grid size-9 place-items-center rounded-full bg-gradient-aurora shadow-glow">
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-sm font-semibold">{t.title}</h2>
            <p className="flex items-center gap-1.5 text-[11px] text-neon-cyan">
              <span className="size-1.5 animate-pulse rounded-full bg-neon-cyan" />
              {t.subtitle}
            </p>
          </div>
          <span className="hidden rounded-full border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-purple sm:inline">
            {t.demoBadge}
          </span>
        </header>

        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
          <div className="mx-auto max-w-2xl space-y-5">
            {activeSession.messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {typing ? <TypingIndicator label={t.listening} /> : null}
            <div ref={endRef} />
          </div>
        </div>

        <footer className="relative z-10 shrink-0 border-t border-border/50 p-3 md:p-4">
          <div className="mx-auto max-w-2xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t.suggested}
            </p>
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SUGGESTED_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={typing}
                  onClick={() => void sendMessage(q)}
                  className="shrink-0 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-neon-purple/50 hover:text-foreground disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card/60 p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                placeholder={t.placeholder}
                className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25"
                aria-label="Voice input (demo)"
                onClick={() => void sendMessage("Help me practice interview answers out loud")}
              >
                <Mic className="size-4" />
              </button>
              <button
                type="submit"
                disabled={typing || !input.trim()}
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-aurora text-white shadow-glow transition hover:scale-105 disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </footer>
      </section>
    </div>
  );
}
