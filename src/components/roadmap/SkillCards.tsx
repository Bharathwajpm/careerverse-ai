import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import type { RoadmapProgress, SkillCard } from "@/lib/roadmap/types";

type Props = {
  skills: SkillCard[];
  progress: RoadmapProgress;
  onToggle: (id: string) => void;
};

const LEVEL_COLOR = {
  beginner: "text-neon-cyan",
  intermediate: "text-neon-purple",
  advanced: "text-neon-pink",
} as const;

export function SkillCards({ skills, progress, onToggle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Skill stack</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {skills.map((skill, i) => {
          const done = progress.skillCompleted[skill.id];
          return (
            <motion.button
              key={skill.id}
              type="button"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onToggle(skill.id)}
              className={`rounded-xl border p-4 text-left transition ${
                done
                  ? "border-neon-cyan/40 bg-neon-cyan/10"
                  : "border-border/40 bg-card/40 hover:border-neon-purple/40"
              }`}
            >
              <motion.div
                className="flex items-start justify-between gap-2"
                whileHover={{ scale: 1.01 }}
              >
                <motion.div>
                  <p className="font-display font-semibold">{skill.name}</p>
                  <p className={`text-[10px] font-bold uppercase ${LEVEL_COLOR[skill.level]}`}>
                    {skill.level}
                  </p>
                </motion.div>
                <div
                  className={`grid size-6 place-items-center rounded-full border ${
                    done ? "border-neon-cyan bg-neon-cyan/20" : "border-border/60"
                  }`}
                >
                  {done ? <Check className="size-3 text-neon-cyan" /> : null}
                </div>
              </motion.div>
              <p className="mt-2 text-xs text-muted-foreground">{skill.category}</p>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-3" /> ~{skill.hours}h
              </p>
              <ul className="mt-2 space-y-0.5">
                {skill.resources.slice(0, 2).map((r) => (
                  <li key={r} className="text-[10px] text-neon-purple/80">
                    • {r}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
