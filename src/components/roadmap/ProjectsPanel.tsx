import { motion } from "framer-motion";
import { Check, Rocket } from "lucide-react";
import type { ProjectRecommendation, RoadmapProgress } from "@/lib/roadmap/types";

type Props = {
  projects: ProjectRecommendation[];
  progress: RoadmapProgress;
  onToggle: (id: string) => void;
};

const DIFF_STYLE = {
  starter: "bg-neon-cyan/15 text-neon-cyan",
  intermediate: "bg-neon-purple/15 text-neon-purple",
  capstone: "bg-neon-pink/15 text-neon-pink",
} as const;

export function ProjectsPanel({ projects, progress, onToggle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Rocket className="size-3.5 text-neon-purple" />
        Project recommendations
      </p>
      <ul className="mt-4 space-y-3">
        {projects.map((p, i) => {
          const done = progress.projectCompleted[p.id];
          return (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl border p-4 transition ${
                done ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-border/40 bg-card/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <motion.div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${DIFF_STYLE[p.difficulty]}`}
                  >
                    {p.difficulty}
                  </span>
                  <p className="mt-2 font-display font-semibold">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.outcome}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
                <button
                  type="button"
                  onClick={() => onToggle(p.id)}
                  className={`grid size-8 shrink-0 place-items-center rounded-lg border transition ${
                    done
                      ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                      : "border-border/60 hover:border-neon-purple/50"
                  }`}
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done ? <Check className="size-4" /> : null}
                </button>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
