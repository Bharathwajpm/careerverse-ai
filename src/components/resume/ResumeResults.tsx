import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Bot, Check, RefreshCw, Sparkles, X } from "lucide-react";
import type { ResumeAnalysisResult } from "@/lib/resume/types";

type Props = {
  result: ResumeAnalysisResult;
  onReset: () => void;
};

const GRADE_COLOR = {
  A: "text-neon-cyan",
  B: "text-neon-purple",
  C: "text-amber-400",
  D: "text-destructive",
} as const;

const IMPACT_STYLE = {
  high: "border-destructive/40 bg-destructive/10 text-destructive",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  low: "border-border/60 bg-card/40 text-muted-foreground",
} as const;

export function ResumeResults({ result, onReset }: Props) {
  const foundCount = result.keywords.filter((k) => k.found).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// analysis complete</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Resume insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.fileName} · {new Date(result.analyzedAt).toLocaleString()}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.article
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass relative overflow-hidden rounded-2xl p-6 sm:col-span-2"
        >
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-neon-purple/20 blur-3xl" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            ATS score (demo)
          </p>
          <p className="font-display mt-2 text-5xl font-semibold text-gradient">{result.atsScore}</p>
          <p className={`mt-1 text-sm font-bold ${GRADE_COLOR[result.atsGrade]}`}>
            Grade {result.atsGrade}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Simulated parser score — not a guarantee of recruiter outcomes.
          </p>
        </motion.article>

        {[
          { label: "Keywords matched", value: `${foundCount}/${result.keywords.length}` },
          { label: "Skill gaps", value: String(result.skillGaps.length) },
          { label: "Tips", value: String(result.recommendations.length) },
        ].map((card, i) => (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06 }}
            className="glass rounded-2xl p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {card.label}
            </p>
            <p className="font-display mt-2 text-2xl font-semibold">{card.value}</p>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Section radar
          </p>
          <motion.div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={result.chartData}>
                <PolarGrid stroke="oklch(0.4 0.05 270 / 0.45)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 10 }} />
                <Radar
                  dataKey="score"
                  stroke="oklch(0.82 0.16 200)"
                  fill="oklch(0.82 0.16 200)"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Bar breakdown
          </p>
          <motion.div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 270 / 0.4)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "oklch(0.65 0.02 260)", fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.03 270)",
                    border: "1px solid oklch(0.4 0.05 270)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {result.chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i % 2 === 0 ? "oklch(0.68 0.27 295)" : "oklch(0.82 0.16 200)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Keyword analysis
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.keywords.map((k) => (
            <span
              key={k.term}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                k.found
                  ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan"
                  : "border-border/60 bg-card/40 text-muted-foreground"
              }`}
            >
              {k.found ? <Check className="size-3" /> : <X className="size-3 opacity-50" />}
              {k.term}
              <span className="text-[9px] uppercase opacity-60">{k.importance}</span>
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <div className="glass rounded-2xl p-6">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <AlertTriangle className="size-3.5 text-amber-400" />
            Skill gaps
          </p>
          <ul className="mt-4 space-y-3">
            {result.skillGaps.map((g) => (
              <li
                key={g.skill}
                className="rounded-xl border border-border/40 bg-card/40 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{g.skill}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      g.priority === "critical"
                        ? "bg-destructive/15 text-destructive"
                        : g.priority === "recommended"
                          ? "bg-neon-purple/15 text-neon-purple"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {g.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{g.reason}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Improvement recommendations
          </p>
          <ul className="mt-4 space-y-3">
            {result.recommendations.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-border/40 bg-card/40 px-4 py-3"
              >
                <motion.div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{r.title}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${IMPACT_STYLE[r.impact]}`}
                  >
                    {r.impact} impact
                  </span>
                </motion.div>
                <p className="mt-1 text-xs text-muted-foreground">{r.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 text-neon-purple">
          <Sparkles className="size-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest">AI feedback (demo)</p>
        </div>
        <motion.div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {result.aiFeedback.split("\n\n").map((para) => (
            <p key={para.slice(0, 36)}>
              {para.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={i} className="font-semibold text-foreground">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  part
                ),
              )}
            </p>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/dashboard/mentor"
          search={{ prompt: "Rewrite my top 3 resume bullets with metrics" }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Bot className="size-4" /> Ask AI Mentor
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-4" /> Analyze another
        </button>
      </div>
    </div>
  );
}
