import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ASSESSMENT_QUESTIONS, LIKERT_OPTIONS } from "@/lib/assessment/questions";
import type { LikertValue } from "@/lib/assessment/types";

type Props = {
  index: number;
  answers: Record<string, LikertValue>;
  onAnswer: (questionId: string, value: LikertValue) => void;
  onBack: () => void;
  onSkip: () => void;
};

export function AssessmentQuiz({ index, answers, onAnswer, onBack, onSkip }: Props) {
  const question = ASSESSMENT_QUESTIONS[index];
  const total = ASSESSMENT_QUESTIONS.length;
  const progress = ((index + (answers[question.id] ? 1 : 0)) / total) * 100;
  const selected = answers[question.id];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-1">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-widest text-neon-purple">
            Question {index + 1} / {total}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-aurora"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="mt-2 flex gap-1">
          {ASSESSMENT_QUESTIONS.map((q, i) => (
            <div
              key={q.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < index || answers[q.id]
                  ? "bg-neon-purple"
                  : i === index
                    ? "bg-neon-cyan/60"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-3xl p-6 md:p-10"
        >
          <div className="text-5xl md:text-6xl">{question.emoji}</div>
          <h2 className="font-display mt-6 text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            {question.text}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-5">
            {LIKERT_OPTIONS.map((opt) => {
              const active = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onAnswer(question.id, opt.value)}
                  className={`group rounded-xl border p-3 text-left text-xs font-medium transition-all sm:p-4 ${
                    active
                      ? "border-neon-purple bg-neon-purple/20 text-foreground shadow-glow"
                      : "border-border/60 bg-card/40 text-muted-foreground hover:border-neon-purple/50 hover:bg-neon-purple/10 hover:text-foreground"
                  }`}
                >
                  <div
                    className={`font-display text-lg ${active ? "text-neon-cyan" : "text-foreground/80 group-hover:text-neon-purple"}`}
                  >
                    {opt.value}
                  </div>
                  <div className="mt-1 leading-tight">{opt.label}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition disabled:opacity-40 hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 animate-pulse text-neon-cyan" />
          AI calibrating domain weights
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground transition hover:border-neon-cyan/50 hover:text-foreground"
        >
          Skip <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
