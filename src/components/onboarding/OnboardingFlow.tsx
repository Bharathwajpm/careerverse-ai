import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Brain, Sparkles, X } from "lucide-react";
import { completeOnboarding, isOnboardingComplete } from "@/lib/onboarding/storage";
import { fadeUp, springGentle } from "@/lib/motion-presets";

const STEPS = [
  {
    title: "Welcome to CareerVerse OS",
    body: "Your AI operating system for careers, scholarships, interviews, and financial clarity — built for student founders and hackathon demos.",
    icon: Sparkles,
    cta: null,
  },
  {
    title: "Start with assessment",
    body: "Our psychometric engine maps strengths to career tracks and powers every recommendation downstream.",
    icon: Brain,
    cta: { label: "Take assessment", to: "/dashboard/assessment" as const },
  },
  {
    title: "Meet your AI mentor",
    body: "Coach-style chat in English, Hindi, or Tamil — with context from your profile and goals.",
    icon: Bot,
    cta: { label: "Open mentor", to: "/dashboard/mentor" as const },
  },
  {
    title: "You're demo-ready",
    body: "Explore scholarships, roadmaps, mock interviews, and analytics. Progress saves locally on this device.",
    icon: Sparkles,
    cta: { label: "Go to dashboard", to: "/dashboard" as const },
  },
];

export function OnboardingFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOnboardingComplete()) setOpen(true);
  }, []);

  const finish = () => {
    completeOnboarding();
    setOpen(false);
  };

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background/85 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            exit={fadeUp.exit}
            transition={springGentle}
            className="glass-strong relative w-full max-w-lg overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-neon-purple/25 blur-3xl" />
            <button
              type="button"
              onClick={finish}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Skip onboarding"
            >
              <X className="size-4" />
            </button>

            <div className="relative">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? "bg-gradient-aurora" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-6 grid size-14 place-items-center rounded-2xl bg-gradient-aurora shadow-glow">
                <Icon className="size-7 text-white" />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">{current.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.body}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-full border border-border/60 px-4 py-2 text-sm"
                  >
                    Back
                  </button>
                ) : null}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-white shadow-glow"
                  >
                    Continue <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finish}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-white shadow-glow"
                  >
                    Launch OS <ArrowRight className="size-4" />
                  </button>
                )}
                {current.cta ? (
                  <Link
                    to={current.cta.to}
                    onClick={finish}
                    className="inline-flex items-center rounded-full border border-neon-cyan/40 px-4 py-2 text-sm text-neon-cyan"
                  >
                    {current.cta.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
