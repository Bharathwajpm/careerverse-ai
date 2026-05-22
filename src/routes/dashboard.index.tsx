import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, Flame, Target, GraduationCap, Mic, ArrowUpRight, Sparkles, Zap } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, AreaChart, Area, Tooltip } from "recharts";
import { ChartPanel } from "@/components/ui/chart-panel";
import { useAuth } from "@/context/AuthContext";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import { loadGamification } from "@/lib/gamification/storage";
import { loadSavedScholarshipIds } from "@/lib/scholarship/storage";
import { loadInterviewState } from "@/lib/interview/storage";
import { fadeUp, springGentle, staggerContainer, staggerItem } from "@/lib/motion-presets";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const trend = Array.from({ length: 14 }).map((_, i) => ({ d: i, v: 30 + i * 4 + Math.sin(i) * 6 }));
const skills = [
  { skill: "AI/ML", v: 88 },
  { skill: "Cloud", v: 92 },
  { skill: "DSA", v: 81 },
  { skill: "Systems", v: 76 },
  { skill: "Comm", v: 70 },
  { skill: "Design", v: 64 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  delta: string;
  tone: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5"
    >
      <div className={`absolute -top-8 -right-8 size-28 rounded-full ${tone} blur-3xl opacity-60`} />
      <div className="flex items-center justify-between">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-[10px] font-semibold text-neon-cyan">{delta}</span>
      </div>
      <div className="font-display mt-3 text-2xl font-semibold sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function DashboardHome() {
  const { user } = useAuth();
  const { settings } = useAppPreferences();
  const g = loadGamification();
  const savedGrants = loadSavedScholarshipIds().length;
  const interviewScore = loadInterviewState().sessions[0]?.scores.overall;
  const firstName = settings.profile.displayName.split(" ")[0] || user?.name?.split(" ")[0] || "Operator";

  return (
    <motion.div
      className="mx-auto max-w-7xl section-stack"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div variants={fadeUp} transition={springGentle} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-neon-purple">// command center</p>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground">
            Lv {g.level} · {g.xp} XP · {g.streakDays}d streak · {savedGrants || 0} saved grants
          </p>
        </div>
        <Link
          to="/dashboard/mentor"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-aurora px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
        >
          <Sparkles className="size-4" /> Ask AI Mentor
        </Link>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Career Score" value="94.2" delta="+4.1%" tone="bg-neon-purple/30" />
        <StatCard icon={Flame} label="Learning Streak" value={`${g.streakDays}d`} delta="+XP" tone="bg-neon-pink/30" />
        <StatCard
          icon={Target}
          label="Interview Ready"
          value={interviewScore ? `${interviewScore}%` : "—"}
          delta={interviewScore ? "Live" : "Start"}
          tone="bg-neon-blue/30"
        />
        <StatCard icon={GraduationCap} label="Saved Grants" value={String(savedGrants)} delta="Intel" tone="bg-neon-cyan/30" />
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div variants={fadeUp} className="glass rounded-2xl p-4 sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Skill growth · 14 days
              </p>
              <p className="font-display mt-1 text-xl font-semibold sm:text-2xl">Trajectory</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-semibold text-neon-cyan sm:text-2xl">+42%</p>
              <p className="text-xs text-muted-foreground">vs last sprint</p>
            </div>
          </div>
          <ChartPanel className="mt-4" heightClass="h-48 sm:h-56 md:h-64">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.27 295)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.68 0.27 295)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0.025 270)",
                  border: "1px solid oklch(0.3 0.03 270)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area dataKey="v" stroke="oklch(0.68 0.27 295)" fill="url(#sk)" strokeWidth={2} />
            </AreaChart>
          </ChartPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="glass rounded-2xl p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Skill radar</p>
          <ChartPanel className="mt-3" heightClass="h-48 sm:h-56">
            <RadarChart data={skills}>
              <PolarGrid stroke="oklch(0.4 0.05 270 / 0.4)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 10 }} />
              <Radar dataKey="v" stroke="oklch(0.82 0.16 200)" fill="oklch(0.82 0.16 200)" fillOpacity={0.4} />
            </RadarChart>
          </ChartPanel>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={fadeUp} className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 text-neon-cyan">
            <GraduationCap className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Scholarships</span>
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { n: "Genesis Grant", a: "₹4,00,000", d: "6d left", m: "92%" },
              { n: "Kalpana Award", a: "₹1,50,000", d: "12d left", m: "84%" },
            ].map((s) => (
              <li
                key={s.n}
                className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-card/40 p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.n}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {s.a} · {s.d}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-neon-cyan/15 px-2 py-1 text-[10px] font-bold text-neon-cyan">
                  {s.m}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/dashboard/scholarships" className="mt-4 inline-flex items-center gap-1 text-xs text-neon-cyan hover:underline">
            Open intelligence <ArrowUpRight className="size-3" />
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 text-neon-purple">
            <Mic className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Interview ready</span>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { l: "Communication", v: 88 },
              { l: "Technical depth", v: interviewScore ?? 76 },
              { l: "Confidence", v: 92 },
            ].map((r) => (
              <div key={r.l}>
                <div className="flex justify-between text-xs">
                  <span>{r.l}</span>
                  <span className="text-muted-foreground">{r.v}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-aurora"
                    initial={{ width: 0 }}
                    animate={{ width: `${r.v}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/interviews"
            className="mt-5 inline-flex items-center gap-1 text-xs text-neon-purple hover:underline"
          >
            Run mock interview <ArrowUpRight className="size-3" />
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="glass relative overflow-hidden rounded-2xl p-4 sm:p-6 md:col-span-2 lg:col-span-1">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-neon-pink/20 blur-3xl" />
          <div className="flex items-center gap-2 text-neon-pink">
            <Zap className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI signal</span>
          </div>
          <p className="font-display relative mt-4 text-lg leading-snug sm:text-xl">
            Your OS synced {g.badges.filter((b) => b.unlockedAt).length} badges — next unlock at {g.level * 200} XP.
          </p>
          <Link to="/dashboard/rewards" className="relative mt-4 inline-flex items-center gap-1 text-xs text-neon-pink hover:underline">
            Rewards hub <ArrowUpRight className="size-3" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
