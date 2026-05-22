import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Flame, Sparkles, Trophy, Zap } from "lucide-react";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import {
  awardXp,
  clearPendingUnlock,
  progressToNextLevel,
  syncGamificationFromModules,
} from "@/lib/gamification/engine";
import { loadGamification, mockLeaderboard } from "@/lib/gamification/storage";
import type { GamificationState } from "@/lib/gamification/types";

export function GamificationHub() {
  const { settings } = useAppPreferences();
  const [state, setState] = useState<GamificationState>(() => loadGamification());
  const [unlockVisible, setUnlockVisible] = useState(false);

  useEffect(() => {
    const synced = syncGamificationFromModules();
    setState(synced);
    if (synced.pendingUnlock) setUnlockVisible(true);
  }, []);

  const leaderboard = mockLeaderboard(
    settings.profile.displayName,
    state.xp,
    state.streakDays,
  );
  const levelPct = progressToNextLevel(state.xp, state.level);

  const claimDemoXp = useCallback(() => {
    const next = awardXp(25, "Daily check-in");
    setState(next);
  }, []);

  const dismissUnlock = useCallback(() => {
    setUnlockVisible(false);
    setState(clearPendingUnlock());
  }, []);

  const pendingBadge = state.badges.find((b) => b.id === state.pendingUnlock);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-pink">// rewards</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Gamification hub</h1>
        <p className="text-sm text-muted-foreground">
          XP, badges, streaks, and leaderboard — synced from your CareerVerse activity.
        </p>
      </motion.header>

      <AnimatePresence>
        {unlockVisible && pendingBadge ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.6 }}
              className="glass-strong max-w-sm rounded-3xl p-8 text-center shadow-glow"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mx-auto text-5xl"
              >
                {pendingBadge.icon}
              </motion.div>
              <p className="mt-4 text-[10px] font-bold uppercase text-neon-pink">Badge unlocked</p>
              <h2 className="font-display mt-1 text-2xl font-semibold">{pendingBadge.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{pendingBadge.description}</p>
              <button
                type="button"
                onClick={dismissUnlock}
                className="mt-6 rounded-full bg-gradient-aurora px-6 py-2 text-sm font-semibold text-white"
              >
                Collect
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div className="glass rounded-2xl p-5" whileHover={{ y: -2 }}>
          <Zap className="size-5 text-neon-cyan" />
          <p className="font-display mt-3 text-3xl font-semibold text-gradient">{state.xp}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-5">
          <Trophy className="size-5 text-neon-purple" />
          <p className="font-display mt-3 text-3xl font-semibold">Lv {state.level}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-aurora"
              animate={{ width: `${levelPct}%` }}
            />
          </div>
        </motion.div>
        <motion.div className="glass rounded-2xl p-5">
          <Flame className="size-5 text-neon-pink" />
          <p className="font-display mt-3 text-3xl font-semibold">{state.streakDays}d</p>
          <p className="text-xs text-muted-foreground">Activity streak</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-5">
          <Award className="size-5 text-neon-blue" />
          <p className="font-display mt-3 text-3xl font-semibold">
            {state.badges.filter((b) => b.unlockedAt).length}/{state.badges.length}
          </p>
          <p className="text-xs text-muted-foreground">Badges</p>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Achievement badges
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {state.badges.map((b) => (
              <motion.div
                key={b.id}
                layout
                className={`rounded-xl border p-3 text-center transition ${
                  b.unlockedAt
                    ? "border-neon-purple/40 bg-neon-purple/10"
                    : "border-border/40 opacity-50 grayscale"
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <p className="mt-2 text-xs font-semibold">{b.name}</p>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={claimDemoXp}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 px-4 py-2 text-sm text-neon-cyan"
          >
            <Sparkles className="size-4" /> Daily +25 XP
          </button>
        </section>

        <section className="glass rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Leaderboard (demo)
          </p>
          <ul className="mt-4 space-y-2">
            {leaderboard.map((e) => (
              <li
                key={e.rank}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  e.isYou ? "bg-neon-cyan/10 ring-1 ring-neon-cyan/30" : "bg-card/30"
                }`}
              >
                <span className="w-6 font-mono text-sm text-muted-foreground">#{e.rank}</span>
                <span className="flex-1 text-sm font-medium">{e.name}</span>
                <span className="text-xs text-neon-purple">{e.xp} XP</span>
                <span className="text-xs text-muted-foreground">{e.streak}d</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Recent rewards
        </p>
        {state.recentRewards.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Complete modules to earn XP.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.recentRewards.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm"
              >
                <span>{r.label}</span>
                <span className="font-mono text-neon-cyan">+{r.xp} XP</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
