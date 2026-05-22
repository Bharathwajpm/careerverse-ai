import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import type { NotificationKind } from "@/lib/notifications/types";

const kindTone: Record<NotificationKind, string> = {
  scholarship: "text-neon-cyan",
  roadmap: "text-neon-purple",
  achievement: "text-neon-pink",
  system: "text-muted-foreground",
  learning: "text-neon-blue",
};

function kindLabel(kind: NotificationKind) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function NotificationCenter() {
  const navigate = useNavigate();
  const { state, unread, markRead, markAllRead, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative grid size-9 place-items-center rounded-full border border-border/60 bg-card/50"
        aria-label="Notifications"
      >
        <Bell className="size-4 text-muted-foreground" />
        {unread > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 grid min-w-[18px] place-items-center rounded-full bg-neon-pink px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute right-0 z-50 mt-2 w-[min(calc(100vw-1.5rem),22rem)] max-h-[min(70vh,24rem)] overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-glow backdrop-blur-xl sm:max-h-[28rem]"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div>
                  <p className="font-display text-sm font-semibold">Notifications</p>
                  <p className="text-[10px] text-muted-foreground">{unread} unread</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                    title="Mark all read"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {state.items.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">All caught up.</li>
                ) : (
                  state.items.map((n) => (
                    <li
                      key={n.id}
                      className={`border-b border-border/40 px-4 py-3 ${n.read ? "opacity-70" : "bg-neon-purple/5"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className={`text-[10px] font-bold uppercase ${kindTone[n.kind]}`}>
                            {kindLabel(n.kind)}
                          </p>
                          <p className="mt-0.5 text-sm font-medium">{n.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                          {n.href ? (
                            <button
                              type="button"
                              onClick={() => {
                                markRead(n.id);
                                setOpen(false);
                                void navigate({ to: n.href! });
                              }}
                              className="mt-2 text-xs text-neon-cyan hover:underline"
                            >
                              View →
                            </button>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => dismiss(n.id)}
                          className="shrink-0 rounded p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      {!n.read ? (
                        <button
                          type="button"
                          onClick={() => markRead(n.id)}
                          className="mt-2 text-[10px] text-neon-purple hover:underline"
                        >
                          Mark read
                        </button>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
