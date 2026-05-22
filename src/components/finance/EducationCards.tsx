import { motion } from "framer-motion";
import { BookOpen, PiggyBank, Shield, TrendingUp } from "lucide-react";
import { FINANCE_EDUCATION } from "@/lib/finance/education";

const ICONS = {
  piggy: PiggyBank,
  shield: Shield,
  book: BookOpen,
  trending: TrendingUp,
} as const;

export function EducationCards() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Student finance education
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FINANCE_EDUCATION.map((card, i) => {
          const Icon = ICONS[card.icon];
          return (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 transition hover:border-neon-purple/30"
            >
              <Icon className="size-5 text-neon-purple" />
              <h3 className="font-display mt-3 text-sm font-semibold">{card.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{card.summary}</p>
              <p className="mt-2 text-[10px] text-neon-cyan">Tip: {card.tip}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
