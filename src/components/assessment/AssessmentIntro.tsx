import { motion } from "framer-motion";
import { Brain, Clock, Sparkles, BarChart3 } from "lucide-react";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";

type Props = {
  onStart: () => void;
  onResume?: () => void;
  hasProgress: boolean;
  savedResult?: boolean;
  onViewResults?: () => void;
};

export function AssessmentIntro({ onStart, onResume, hasProgress, savedResult, onViewResults }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// psychometric engine v2</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          AI Career Assessment
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {ASSESSMENT_QUESTIONS.length} research-backed items map your strengths across six domains, then
          CareerVerse AI generates career matches, compatibility scores, and a personalized narrative.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Brain, label: "30 questions", sub: "Likert-scale psychometrics" },
          { icon: Clock, label: "~8 minutes", sub: "Save & resume anytime" },
          { icon: BarChart3, label: "6 domains", sub: "Radar + top 3 careers" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <item.icon className="size-5 text-neon-purple" />
            <p className="mt-3 font-display font-semibold">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {hasProgress && onResume ? (
          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            <Sparkles className="size-4" /> Resume assessment
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            <Sparkles className="size-4" /> Begin assessment
          </button>
        )}
        <button
          type="button"
          onClick={onStart}
          className="rounded-full border border-border/60 px-6 py-3 text-sm text-muted-foreground transition hover:border-neon-purple/50 hover:text-foreground"
        >
          Start fresh
        </button>
        {savedResult && onViewResults ? (
          <button
            type="button"
            onClick={onViewResults}
            className="rounded-full border border-neon-cyan/40 px-6 py-3 text-sm text-neon-cyan transition hover:bg-neon-cyan/10"
          >
            View last results
          </button>
        ) : null}
      </div>
    </div>
  );
}
