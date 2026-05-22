import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Bot,
  Globe,
  Moon,
  Palette,
  Shield,
  Sun,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import { Switch } from "@/components/ui/switch";
import type { AppLanguage, AppTheme } from "@/lib/settings/types";
import { resetOnboarding } from "@/lib/onboarding/storage";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI", icon: Bot },
  { id: "account", label: "Account", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsDashboard() {
  const { user } = useAuth();
  const { settings, updateSettings, setTheme, setLanguage } = useAppPreferences();
  const [tab, setTab] = useState<TabId>("profile");
  const fileRef = useRef<HTMLInputElement>(null);

  const saveProfile = useCallback(() => {
    toast.success("Profile saved locally");
  }, []);

  const onAvatar = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      if (file.size > 800_000) {
        toast.error("Image must be under 800KB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateSettings((s) => ({
          ...s,
          profile: { ...s.profile, avatarDataUrl: reader.result as string },
        }));
        toast.success("Avatar updated");
      };
      reader.readAsDataURL(file);
    },
    [updateSettings],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-purple">// settings</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Operator settings</h1>
        <p className="text-sm text-muted-foreground">
          Profile, theme, notifications, language, and AI personalization — stored on this device.
        </p>
      </motion.header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
              tab === t.id
                ? "bg-neon-purple/20 text-foreground ring-1 ring-neon-purple/40"
                : "border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <section className="glass rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative grid size-20 overflow-hidden rounded-2xl border border-neon-purple/40 bg-gradient-aurora"
            >
              {settings.profile.avatarDataUrl ? (
                <img src={settings.profile.avatarDataUrl} alt="" className="size-full object-cover" />
              ) : (
                <span className="font-display text-2xl font-semibold text-white">
                  {settings.profile.displayName[0]?.toUpperCase() ?? "?"}
                </span>
              )}
              <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition hover:opacity-100">
                <Upload className="size-5 text-white" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onAvatar(e.target.files?.[0])}
            />
            <div>
              <p className="text-sm font-medium">Avatar upload</p>
              <p className="text-xs text-muted-foreground">PNG/JPG · max 800KB · demo local storage</p>
              {user ? (
                <p className="mt-1 text-xs text-muted-foreground">Account: {user.email}</p>
              ) : null}
            </div>
          </div>
          {(["displayName", "headline", "location"] as const).map((field) => (
            <label key={field} className="block">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{field}</span>
              <input
                value={settings.profile[field]}
                onChange={(e) =>
                  updateSettings((s) => ({
                    ...s,
                    profile: { ...s.profile, [field]: e.target.value },
                  }))
                }
                className="mt-1 w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-neon-purple/50"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Bio</span>
            <textarea
              value={settings.profile.bio}
              rows={3}
              onChange={(e) =>
                updateSettings((s) => ({
                  ...s,
                  profile: { ...s.profile, bio: e.target.value },
                }))
              }
              className="mt-1 w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-neon-purple/50"
            />
          </label>
          <button
            type="button"
            onClick={saveProfile}
            className="rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Save profile
          </button>
        </section>
      ) : null}

      {tab === "appearance" ? (
        <section className="glass rounded-2xl p-6 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Theme</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {(
                [
                  { id: "dark" as AppTheme, label: "Dark", icon: Moon },
                  { id: "light" as AppTheme, label: "Light", icon: Sun },
                  { id: "system" as AppTheme, label: "System", icon: Palette },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    settings.theme === opt.id
                      ? "border-neon-purple/50 bg-neon-purple/10 ring-1 ring-neon-purple/30"
                      : "border-border/60 hover:border-neon-cyan/30"
                  }`}
                >
                  <opt.icon className="size-5 text-neon-cyan" />
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Globe className="size-3.5" /> Language
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  { id: "en" as AppLanguage, label: "English" },
                  { id: "hi" as AppLanguage, label: "हिन्दी" },
                  { id: "ta" as AppLanguage, label: "தமிழ்" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    settings.language === lang.id
                      ? "bg-gradient-aurora text-white shadow-glow"
                      : "border border-border/60 text-muted-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "notifications" ? (
        <section className="glass rounded-2xl p-6 space-y-4">
          {(
            [
              ["scholarshipReminders", "Scholarship reminders", "Deadlines and saved grant check-ins"],
              ["roadmapReminders", "Roadmap reminders", "Milestone nudges from your career path"],
              ["achievementAlerts", "Achievement alerts", "XP, badges, and streak milestones"],
              ["weeklyDigest", "Weekly digest", "Summary of progress across modules"],
              ["emailDigest", "Email digest (demo)", "Simulated email — not sent"],
              ["pushEnabled", "In-app toasts", "Sonner toasts for new notifications"],
            ] as const
          ).map(([key, title, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4 border-b border-border/40 pb-4 last:border-0">
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={settings.notifications[key]}
                onCheckedChange={(checked) =>
                  updateSettings((s) => ({
                    ...s,
                    notifications: { ...s.notifications, [key]: checked },
                  }))
                }
              />
            </div>
          ))}
        </section>
      ) : null}

      {tab === "ai" ? (
        <section className="glass rounded-2xl p-6 space-y-5">
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">AI tone</span>
            <select
              value={settings.ai.tone}
              onChange={(e) =>
                updateSettings((s) => ({
                  ...s,
                  ai: { ...s.ai, tone: e.target.value as typeof settings.ai.tone },
                }))
              }
              className="mt-1 w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="coach">Coach</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Detail level</span>
            <select
              value={settings.ai.detailLevel}
              onChange={(e) =>
                updateSettings((s) => ({
                  ...s,
                  ai: { ...s.ai, detailLevel: e.target.value as typeof settings.ai.detailLevel },
                }))
              }
              className="mt-1 w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm"
            >
              <option value="concise">Concise</option>
              <option value="balanced">Balanced</option>
              <option value="deep">Deep</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Career focus</span>
            <input
              value={settings.ai.careerFocus}
              onChange={(e) =>
                updateSettings((s) => ({
                  ...s,
                  ai: { ...s.ai, careerFocus: e.target.value },
                }))
              }
              className="mt-1 w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm"
            />
          </label>
          {(
            [
              ["useAssessmentContext", "Use assessment context"],
              ["suggestScholarships", "Suggest scholarships in mentor"],
              ["mockInterviewCoaching", "Mock interview coaching hints"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <Switch
                checked={settings.ai[key]}
                onCheckedChange={(checked) =>
                  updateSettings((s) => ({
                    ...s,
                    ai: { ...s.ai, [key]: checked },
                  }))
                }
              />
            </div>
          ))}
        </section>
      ) : null}

      {tab === "account" ? (
        <section className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-factor auth (demo)</p>
              <p className="text-xs text-muted-foreground">Simulated security toggle</p>
            </div>
            <Switch
              checked={settings.account.twoFactorEnabled}
              onCheckedChange={(checked) =>
                updateSettings((s) => ({
                  ...s,
                  account: { ...s.account, twoFactorEnabled: checked },
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Public profile</p>
              <p className="text-xs text-muted-foreground">Show on mock leaderboard</p>
            </div>
            <Switch
              checked={settings.account.publicProfile}
              onCheckedChange={(checked) =>
                updateSettings((s) => ({
                  ...s,
                  account: { ...s.account, publicProfile: checked },
                }))
              }
            />
          </div>
          <button
            type="button"
            onClick={() => {
              updateSettings((s) => ({
                ...s,
                account: { ...s.account, dataExportRequested: true },
              }));
              toast.info("Data export queued (demo)");
            }}
            className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Request data export
          </button>
          <button
            type="button"
            onClick={() => toast.message("Password change uses your auth provider in production.")}
            className="rounded-full border border-neon-purple/40 px-4 py-2 text-sm text-neon-purple"
          >
            Change password
          </button>
          <button
            type="button"
            onClick={() => {
              resetOnboarding();
              toast.success("Onboarding will show on next dashboard visit");
            }}
            className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground"
          >
            Replay onboarding tour
          </button>
        </section>
      ) : null}
    </div>
  );
}
