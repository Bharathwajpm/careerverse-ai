import { motion } from "framer-motion";
import { FileSearch, Sparkles } from "lucide-react";

const STEPS = [
  "Parsing document structure…",
  "Running ATS keyword scan…",
  "Detecting skill gaps…",
  "Generating AI feedback…",
];

export function ResumeProcessing({ fileName }: { fileName: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="relative grid size-20 place-items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10"
      >
        <FileSearch className="size-8 text-neon-cyan" />
        <motion.span
          className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-gradient-aurora"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Sparkles className="size-3.5 text-white" />
        </motion.span>
      </motion.div>
      <h2 className="font-display mt-6 text-xl font-semibold">Analyzing resume</h2>
      <p className="mt-1 truncate text-sm text-muted-foreground">{fileName}</p>
      <ul className="mt-8 w-full space-y-2 text-left text-sm">
        {STEPS.map((step, i) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35 }}
            className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/40 px-4 py-2"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-neon-purple" />
            {step}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
