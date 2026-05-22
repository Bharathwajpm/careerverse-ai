import { motion } from "framer-motion";
import { Mic, Video, VideoOff } from "lucide-react";

type Props = {
  active: boolean;
  confidence: number;
};

export function WebcamPlaceholder({ active, confidence }: Props) {
  return (
    <motion.div className="relative aspect-video overflow-hidden rounded-2xl border border-neon-purple/30 bg-gradient-to-br from-card/80 to-background">
      <motion.div
        className="absolute inset-0 grid-bg opacity-40"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {active ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="grid size-20 place-items-center rounded-full border-2 border-neon-cyan/50 bg-neon-cyan/10"
            >
              <Video className="size-8 text-neon-cyan" />
            </motion.div>
            <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">Webcam · demo mode</p>
            <p className="text-[10px] text-muted-foreground">No video leaves your browser</p>
          </>
        ) : (
          <>
            <VideoOff className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Camera preview</p>
          </>
        )}
      </div>
      <motion.div
        className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs"
        animate={active ? { opacity: 1 } : { opacity: 0.6 }}
      >
        <Mic className={`size-3.5 ${active ? "text-neon-cyan" : "text-muted-foreground"}`} />
        {active ? "Listening…" : "Muted"}
      </motion.div>
      <motion.div className="absolute right-3 top-3 rounded-full border border-neon-purple/40 bg-neon-purple/20 px-2 py-0.5 text-[10px] font-bold text-neon-purple">
        LIVE
      </motion.div>
      <motion.div className="absolute bottom-3 right-3 h-1 w-24 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-gradient-aurora"
          animate={{ width: `${confidence}%` }}
          transition={{ type: "spring", stiffness: 80 }}
        />
      </motion.div>
    </motion.div>
  );
}
