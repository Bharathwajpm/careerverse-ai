import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { CertificationSuggestion } from "@/lib/roadmap/types";

export function CertificationsPanel({ certifications }: { certifications: CertificationSuggestion[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl p-6"
    >
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Award className="size-3.5 text-neon-cyan" />
        Certification suggestions
      </p>
      <ul className="mt-4 space-y-3">
        {certifications.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/40 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.provider}</p>
            </div>
            <motion.div className="text-right">
              <p className="font-display text-lg font-semibold text-gradient">{c.relevance}%</p>
              <p className="text-[10px] text-muted-foreground">~{c.estimatedMonths} mo</p>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
