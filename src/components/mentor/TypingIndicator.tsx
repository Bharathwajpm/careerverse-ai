import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TypingIndicator({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-aurora shadow-glow">
        <Sparkles className="size-3.5 text-white" />
      </div>
      <div className="glass-strong flex items-center gap-2 rounded-2xl rounded-tl-sm px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-neon-cyan"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    </motion.div>
  );
}
