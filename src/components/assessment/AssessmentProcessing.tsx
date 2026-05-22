import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

const STEPS = [
  "Aggregating Likert responses…",
  "Computing domain vectors…",
  "Matching career archetypes…",
  "Generating AI narrative…",
];

export function AssessmentProcessing() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-20 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="relative grid size-24 place-items-center rounded-full border border-neon-purple/30 bg-neon-purple/10"
      >
        <Brain className="size-10 text-neon-purple" />
        <motion.span
          className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full bg-gradient-aurora shadow-glow"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Sparkles className="size-4 text-white" />
        </motion.span>
      </motion.div>
      <h2 className="font-display mt-8 text-2xl font-semibold">Analyzing your profile</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Running psychometric scoring across 6 domains and 10 career vectors.
      </p>
      <ul className="mt-8 w-full space-y-2 text-left text-sm">
        {STEPS.map((step, i) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.45 }}
            className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/40 px-4 py-2"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-neon-cyan" />
            {step}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
