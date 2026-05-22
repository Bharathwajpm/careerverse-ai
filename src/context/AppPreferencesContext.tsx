import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { defaultSettings } from "@/lib/settings/defaults";
import { loadUserSettings, saveUserSettings } from "@/lib/settings/storage";
import type { AppLanguage, AppTheme, UserSettings } from "@/lib/settings/types";

function resolveTheme(theme: AppTheme): "dark" | "light" {
  if (theme === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme === "light" ? "light" : "dark";
}

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(resolved);
  document.documentElement.lang =
    loadUserSettings().language === "hi" ? "hi" : loadUserSettings().language === "ta" ? "ta" : "en";
  document.documentElement.style.colorScheme = resolved;
}

type AppPreferencesValue = {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings> | ((s: UserSettings) => UserSettings)) => void;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: AppLanguage) => void;
};

const AppPreferencesContext = createContext<AppPreferencesValue | null>(null);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(() =>
    defaultSettings(user?.name, user?.email),
  );

  useEffect(() => {
    const loaded = loadUserSettings(user?.name, user?.email);
    if (user?.name && loaded.profile.displayName === "Operator") {
      loaded.profile.displayName = user.name;
    }
    setSettings(loaded);
    applyTheme(loaded.theme);
  }, [user?.name, user?.email]);

  useEffect(() => {
    applyTheme(settings.theme);
    document.documentElement.lang =
      settings.language === "hi" ? "hi" : settings.language === "ta" ? "ta" : "en";
    saveUserSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  const updateSettings = useCallback(
    (patch: Partial<UserSettings> | ((s: UserSettings) => UserSettings)) => {
      setSettings((prev) => (typeof patch === "function" ? patch(prev) : { ...prev, ...patch }));
    },
    [],
  );

  const setTheme = useCallback((theme: AppTheme) => {
    setSettings((s) => ({ ...s, theme }));
  }, []);

  const setLanguage = useCallback((language: AppLanguage) => {
    setSettings((s) => ({ ...s, language }));
  }, []);

  const value = useMemo(
    () => ({ settings, updateSettings, setTheme, setLanguage }),
    [settings, updateSettings, setTheme, setLanguage],
  );

  return (
    <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  return ctx;
}
