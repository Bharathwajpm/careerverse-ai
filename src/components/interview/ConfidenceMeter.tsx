import { motion } from "framer-motion";
import { Activity } from "lucide-react";

type Props = {
  value: number;
  label?: string;
};

export function ConfidenceMeter({ value, label = "Confidence" }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  const color =
    clamped >= 80 ? "text-neon-cyan" : clamped >= 60 ? "text-neon-purple" : "text-amber-400";

  return (
    <motion.div layout className="glass rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Activity className="size-3.5" />
          {label}
        </p>
        <p className={`font-display text-lg font-semibold ${color}`}>{clamped}%</p>
      </div>
      <motion.div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-aurora"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
        />
      </motion.div>
      <motion.p
        key={clamped}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-2 text-[10px] text-muted-foreground"
      >
        {clamped >= 80
          ? "Projected vocal steadiness and posture alignment are strong."
          : clamped >= 60
            ? "Moderate signal — slow down and structure your opener."
            : "Take a breath; use bullet points before speaking."}
      </motion.p>
    </motion.div>
  );
}
