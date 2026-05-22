import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, GraduationCap } from "lucide-react";
import { formatDeadlineLabel } from "@/lib/scholarship/search";
import type { ScoredScholarship } from "@/lib/scholarship/types";

type Props = {
  scholarship: ScoredScholarship;
  saved: boolean;
  onToggleSave: () => void;
  index?: number;
};

export function ScholarshipCard({ scholarship, saved, onToggleSave, index = 0 }: Props) {
  const deadlineLabel = formatDeadlineLabel(scholarship.deadline);
  const urgent = deadlineLabel !== "Closed" && parseInt(deadlineLabel, 10) <= 14;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass group flex flex-col gap-4 rounded-2xl p-5 transition hover:border-neon-purple/40 lg:flex-row lg:items-center"
    >
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/30">
        <GraduationCap className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold">{scholarship.name}</h3>
          <span className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 text-[10px] font-bold uppercase text-neon-purple">
            {scholarship.matchScore}% match
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{scholarship.provider}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{scholarship.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {scholarship.level} · {scholarship.tags.join(" · ")}
        </p>
        <p className="mt-1 text-[10px] text-neon-cyan">
          Requires: {scholarship.requirements.slice(0, 3).join(", ")}
          {scholarship.requirements.length > 3 ? "…" : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</p>
          <p className="font-display text-lg font-semibold">{scholarship.amountDisplay}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deadline</p>
          <p
            className={`font-display text-lg font-semibold ${urgent ? "text-neon-pink" : "text-foreground"}`}
          >
            {deadlineLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? "Unsave" : "Save scholarship"}
            className={`grid size-9 place-items-center rounded-full border transition ${
              saved
                ? "border-neon-purple bg-neon-purple/20 text-neon-purple"
                : "border-border/60 text-muted-foreground hover:border-neon-purple/50 hover:text-neon-purple"
            }`}
          >
            <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-gradient-aurora px-4 py-2 text-xs font-semibold text-white shadow-glow"
          >
            Apply <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
