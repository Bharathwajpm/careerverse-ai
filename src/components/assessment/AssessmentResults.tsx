import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bot, RefreshCw, Sparkles } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { AssessmentResult } from "@/lib/assessment/types";

type Props = {
  result: AssessmentResult;
  onRetake: () => void;
};

export function AssessmentResults({ result, onRetake }: Props) {
  const completed = new Date(result.completedAt).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// assessment complete</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          Your career constellation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Completed {completed} · Top match {result.topMatches[0]?.compatibility}% compatibility
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {result.topMatches.map((match, idx) => (
          <motion.article
            key={match.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12 }}
            className="glass relative overflow-hidden rounded-2xl p-6"
          >
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-neon-purple/20 blur-3xl" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Match #{idx + 1}
            </p>
            <h3 className="font-display mt-2 text-xl font-semibold md:text-2xl">{match.title}</h3>
            <p className="font-display mt-3 text-4xl font-semibold text-gradient">{match.compatibility}%</p>
            <p className="mt-2 text-xs text-neon-cyan">compatibility index</p>
            <p className="mt-3 text-sm text-muted-foreground">{match.summary}</p>
            <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
              {match.strengths.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="text-neon-cyan">+</span> {s}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Domain radar
          </p>
          <div className="mt-4 h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={result.radarData}>
                <PolarGrid stroke="oklch(0.4 0.05 270 / 0.45)" />
                <PolarAngleAxis
                  dataKey="domain"
                  tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="oklch(0.68 0.27 295)"
                  fill="oklch(0.68 0.27 295)"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {result.domainScores.map((d) => (
              <div key={d.domain} className="rounded-lg border border-border/40 bg-card/40 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.label}</p>
                <p className="font-display text-lg font-semibold">{d.score}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Personality analysis
          </p>
          <h3 className="font-display mt-3 text-2xl font-semibold">{result.personality.archetype}</h3>
          <p className="mt-1 text-sm text-neon-cyan">{result.personality.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.personality.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.personality.traits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 text-neon-purple">
          <Sparkles className="size-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest">AI career narrative</p>
        </div>
        <div className="prose prose-invert mt-4 max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground">
          {result.aiNarrative.split("\n\n").map((para) => (
            <p key={para.slice(0, 40)}>
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
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/dashboard/mentor"
          search={{ prompt: `Build a 30-day roadmap for ${result.topMatches[0]?.title ?? "my top career match"}` }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Bot className="size-4" /> Ask AI Mentor
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <RefreshCw className="size-4" /> Retake assessment
        </button>
      </div>
    </div>
  );
}
