import { motion } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";
import type { RoadmapPhase, RoadmapProgress } from "@/lib/roadmap/types";

type Props = {
  phases: RoadmapPhase[];
  progress: RoadmapProgress;
};

export function RoadmapTimeline({ phases, progress }: Props) {
  let weekOffset = 0;

  return (
    <div className="glass overflow-x-auto rounded-2xl p-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline</p>
      <motion.div
        className="mt-6 flex min-w-[640px] gap-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {phases.map((phase, phaseIdx) => {
          const startWeek = weekOffset;
          weekOffset += phase.durationWeeks;
          const phaseDone = phase.milestones.every(
            (m) => progress.milestoneStatus[m.id] === "done",
          );
          const phaseActive = phase.milestones.some(
            (m) => progress.milestoneStatus[m.id] === "in_progress",
          );

          return (
            <div key={phase.id} className="relative flex flex-1 flex-col items-center">
              {phaseIdx > 0 ? (
                <motion.div
                  className="absolute left-0 top-5 h-0.5 w-full -translate-x-1/2 bg-border/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: phaseIdx * 0.15 }}
                  style={{ transformOrigin: "left" }}
                />
              ) : null}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: phaseIdx * 0.1, type: "spring" }}
                className={`relative z-10 grid size-10 place-items-center rounded-full border-2 ${
                  phaseDone
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : phaseActive
                      ? "border-neon-purple bg-neon-purple/20 text-neon-purple"
                      : "border-border/60 bg-card/60 text-muted-foreground"
                }`}
              >
                {phaseDone ? (
                  <Check className="size-4" />
                ) : phaseActive ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Circle className="size-3" />
                )}
              </motion.div>
              <div className="mt-3 max-w-[140px] text-center">
                <p className="font-display text-sm font-semibold">{phase.title}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Wk {startWeek + 1}–{weekOffset}
                </p>
                <p className="mt-1 text-[10px] text-neon-purple">{phase.durationWeeks} weeks</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
