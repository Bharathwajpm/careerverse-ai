import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Flag } from "lucide-react";
import type { RoadmapPhase, RoadmapProgress } from "@/lib/roadmap/types";

type Props = {
  phases: RoadmapPhase[];
  progress: RoadmapProgress;
  onToggleMilestone: (id: string) => void;
};

const STATUS_LABEL = {
  pending: "Start",
  in_progress: "Complete",
  done: "Reset",
} as const;

const STATUS_STYLE = {
  pending: "border-border/60 bg-card/40",
  in_progress: "border-neon-purple/50 bg-neon-purple/15 text-neon-purple",
  done: "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan line-through opacity-80",
} as const;

export function PhaseAccordion({ phases, progress, onToggleMilestone }: Props) {
  const [openId, setOpenId] = useState(phases[0]?.id ?? "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Phases & milestones
      </p>
      <div className="mt-4 space-y-2">
        {phases.map((phase) => {
          const open = openId === phase.id;
          return (
            <motion.div
              key={phase.id}
              layout
              className="overflow-hidden rounded-xl border border-border/40 bg-card/30"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? "" : phase.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div>
                  <p className="font-display font-semibold">{phase.title}</p>
                  <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
                </div>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open ? (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 border-t border-border/30 px-4 pb-4 pt-2"
                  >
                    {phase.milestones.map((m) => {
                      const status = progress.milestoneStatus[m.id] ?? "pending";
                      return (
                        <li
                          key={m.id}
                          className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-background/40 p-3"
                        >
                          <motion.div
                            className="flex gap-2"
                            initial={{ x: -6, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            <Flag className="mt-0.5 size-3.5 shrink-0 text-neon-purple" />
                            <div>
                              <p className="text-sm font-medium">{m.title}</p>
                              <p className="text-xs text-muted-foreground">{m.description}</p>
                              <p className="mt-1 text-[10px] text-neon-cyan">~{m.estimatedWeeks} wks</p>
                            </div>
                          </motion.div>
                          <button
                            type="button"
                            onClick={() => onToggleMilestone(m.id)}
                            className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${STATUS_STYLE[status]}`}
                          >
                            {STATUS_LABEL[status]}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
