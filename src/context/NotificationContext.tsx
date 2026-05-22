import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import {
  addNotification,
  loadNotificationState,
  markAllRead,
  markRead,
  removeNotification,
  unreadCount,
} from "@/lib/notifications/storage";
import { runNotificationScheduler } from "@/lib/notifications/scheduler";
import type { AppNotification, NotificationState } from "@/lib/notifications/types";

type NotificationContextValue = {
  state: NotificationState;
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  pushToast: (n: AppNotification) => void;
  refresh: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { settings } = useAppPreferences();
  const [state, setState] = useState<NotificationState>(() => loadNotificationState());
  const seenRef = useRef<Set<string>>(new Set(state.items.map((n) => n.id)));

  const pushToast = useCallback((n: AppNotification) => {
    const icon =
      n.kind === "scholarship"
        ? "🎓"
        : n.kind === "roadmap"
          ? "🗺️"
          : n.kind === "achievement"
            ? "🏆"
            : "✨";
    toast(n.title, {
      description: n.body,
      icon,
      action: n.href
        ? {
            label: "Open",
            onClick: () => {
              void navigate({ to: n.href! });
            },
          }
        : undefined,
    });
  }, [navigate]);

  const refresh = useCallback(() => {
    const prefs = settings.notifications;
    const next = runNotificationScheduler({
      scholarshipReminders: prefs.scholarshipReminders,
      roadmapReminders: prefs.roadmapReminders,
      achievementAlerts: prefs.achievementAlerts,
    });
    for (const item of next.items) {
      if (!item.read && !seenRef.current.has(item.id)) {
        seenRef.current.add(item.id);
        if (prefs.pushEnabled) pushToast(item);
      }
    }
    setState(next);
  }, [settings.notifications, pushToast]);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 90_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const handleMarkRead = useCallback((id: string) => {
    setState((s) => markRead(s, id));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setState((s) => markAllRead(s));
  }, []);

  const dismiss = useCallback((id: string) => {
    setState((s) => removeNotification(s, id));
  }, []);

  const value = useMemo(
    () => ({
      state,
      unread: unreadCount(state),
      markRead: handleMarkRead,
      markAllRead: handleMarkAllRead,
      dismiss,
      pushToast,
      refresh,
    }),
    [state, handleMarkRead, handleMarkAllRead, dismiss, pushToast, refresh],
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

export function notifyAchievement(title: string, body: string, href?: string) {
  const state = loadNotificationState();
  const next = addNotification(state, { kind: "achievement", title, body, href });
  return next.items[0];
}
