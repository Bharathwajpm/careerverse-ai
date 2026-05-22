import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthLoadingScreen({ label = "Verifying session…" }: { label?: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong relative flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-14 place-items-center rounded-2xl bg-gradient-aurora shadow-glow"
        >
          <Sparkles className="size-7 text-white" />
        </motion.div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <div className="w-full space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="mx-auto h-2 w-4/5" />
        </div>
      </motion.div>
    </div>
  );
}
