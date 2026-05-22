import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { mentorStrings, MENTOR_LOCALES } from "@/lib/mentor/i18n";
import type { MentorChatSession, MentorLocale } from "@/lib/mentor/types";

type Props = {
  sessions: MentorChatSession[];
  activeId: string | null;
  locale: MentorLocale;
  onLocaleChange: (l: MentorLocale) => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function MentorSidebar({
  sessions,
  activeId,
  locale,
  onLocaleChange,
  onNewChat,
  onSelect,
  onDelete,
}: Props) {
  const t = mentorStrings(locale);

  return (
    <aside className="glass flex min-h-0 flex-col rounded-2xl p-3 md:p-4 lg:max-h-full">
      <button
        type="button"
        onClick={onNewChat}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-aurora px-3 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
      >
        <Plus className="size-4" />
        {t.newChat}
      </button>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {t.recent}
      </p>
      <ul className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {sessions.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 pr-9 text-left text-sm transition ${
                  active
                    ? "bg-neon-purple/15 text-foreground ring-1 ring-neon-purple/30"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                <MessageSquare className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                <span className="line-clamp-2">{s.title}</span>
              </button>
              {onDelete && sessions.length > 1 ? (
                <button
                  type="button"
                  aria-label="Delete conversation"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                  className="absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground opacity-0 transition hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 border-t border-border/40 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Language
        </p>
        <div className="mt-2 flex gap-1.5">
          {MENTOR_LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLocaleChange(l.code)}
              className={`rounded-md border px-2.5 py-1 text-[10px] font-bold transition ${
                locale === l.code
                  ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan"
                  : "border-border/60 text-muted-foreground hover:border-neon-purple/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
