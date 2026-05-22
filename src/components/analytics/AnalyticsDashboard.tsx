import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Flame, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { ChartPanel } from "@/components/ui/chart-panel";
import { DashboardPageSkeleton } from "@/components/shared/LoadingSkeletons";
import { loadAnalyticsSnapshot, refreshAnalytics } from "@/lib/analytics/storage";
import type { AnalyticsSnapshot } from "@/lib/analytics/types";

const BAR_COLORS = ["oklch(0.68 0.27 295)", "oklch(0.82 0.16 200)", "oklch(0.75 0.22 345)"];

export function AnalyticsDashboard() {
  const [snap, setSnap] = useState<AnalyticsSnapshot | null>(null);

  useEffect(() => {
    setSnap(loadAnalyticsSnapshot());
  }, []);

  if (!snap) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-neon-purple">// analytics</p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Deep analytics</h1>
          <p className="text-sm text-muted-foreground">
            Growth, skills, streaks, and recommendation signals — persisted locally.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSnap(refreshAnalytics())}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm hover:text-foreground"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </motion.header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            l: "Career growth",
            v: `${snap.growthHistory[snap.growthHistory.length - 1]?.score ?? 0}`,
            c: "text-gradient",
          },
          { l: "Day streak", v: String(snap.streakDays), c: "text-neon-cyan", icon: Flame },
          {
            l: "Rec. accuracy",
            v: `${snap.recommendationAccuracy}%`,
            c: "text-neon-purple",
            icon: Sparkles,
          },
          { l: "Modules active", v: String(snap.modulesUsed.length), c: "text-neon-pink" },
        ].map((card, i) => (
          <motion.div
            key={card.l}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-5"
          >
            {card.icon ? <card.icon className="size-4 text-neon-cyan" /> : null}
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {card.l}
            </p>
            <p className={`font-display mt-1 text-3xl font-semibold ${card.c}`}>{card.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
            <TrendingUp className="size-3.5 text-neon-cyan" />
            Growth trajectory (8 weeks)
          </p>
          <ChartPanel className="mt-4">
              <AreaChart data={snap.growthHistory}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.27 295)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.68 0.27 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 270 / 0.4)" />
                <XAxis dataKey="week" tick={{ fill: "oklch(0.65 0.02 260)", fontSize: 10 }} />
                <YAxis domain={[40, 100]} tick={{ fill: "oklch(0.65 0.02 260)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.03 270)",
                    border: "1px solid oklch(0.4 0.05 270)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.68 0.27 295)"
                  fill="url(#growthGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
          </ChartPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-4 sm:p-6"
        >
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Skill analytics</p>
          <ChartPanel className="mt-4" heightClass="h-56 sm:h-64 md:h-72">
              <BarChart data={snap.skillScores} layout="vertical" margin={{ left: 4, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 270 / 0.4)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "oklch(0.65 0.02 260)" }} />
                <YAxis
                  type="category"
                  dataKey="skill"
                  width={72}
                  tick={{ fontSize: 10, fill: "oklch(0.78 0.02 260)" }}
                />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {snap.skillScores.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
          </ChartPanel>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 sm:p-6"
        >
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Weekly activity</p>
          <ChartPanel className="mt-4" heightClass="h-44 sm:h-52 md:h-56">
              <BarChart data={snap.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 270 / 0.4)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.65 0.02 260)" }} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.65 0.02 260)" }} />
                <Tooltip />
                <Bar dataKey="minutes" fill="oklch(0.82 0.16 200)" radius={[4, 4, 0, 0]} />
              </BarChart>
          </ChartPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase text-muted-foreground">
            Recommendation analytics
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-neon-purple/30 bg-neon-purple/10 p-4">
              <p className="text-sm font-medium">Career match confidence</p>
              <p className="font-display mt-2 text-4xl font-semibold text-gradient">
                {snap.recommendationAccuracy}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on assessment vector vs career corpus (demo).
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Modules contributing data</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {snap.modulesUsed.length ? (
                  snap.modulesUsed.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-xs"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Complete assessment or an interview to populate signals.
                  </span>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Last sync: {new Date(snap.updatedAt).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
