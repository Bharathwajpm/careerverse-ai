import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-neon-purple/30 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 size-[420px] rounded-full bg-neon-cyan/20 blur-[120px] animate-pulse-glow [animation-delay:2s]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bg-gradient-aurora shadow-glow">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold">CareerVerse<span className="text-neon-cyan">AI</span></span>
          </Link>
          <div className="space-y-6">
            <div className="font-mono text-xs uppercase tracking-widest text-neon-purple">// Operating System v4.0</div>
            <div className="font-display text-4xl font-semibold leading-tight tracking-tight">
              Boot up your future<br /><span className="text-gradient">in three minutes.</span>
            </div>
            <div className="glass max-w-sm rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs text-neon-cyan">
                <span className="size-1.5 animate-pulse rounded-full bg-neon-cyan" /> Live student
              </div>
              <p className="mt-3 text-sm text-foreground/90">
                "Found ₹6L in scholarships and 3 internships in my first week. CareerVerse is unreal."
              </p>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">— Aanya R · IIT Madras</div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 -z-10 lg:hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-32 -right-32 size-[400px] rounded-full bg-neon-purple/20 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-2xl"
        >
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-aurora">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-display font-semibold">CareerVerse<span className="text-neon-cyan">AI</span></span>
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8 space-y-4">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}

export function NeonInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/20"
      />
    </label>
  );
}

export function NeonButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="w-full rounded-xl bg-gradient-aurora px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      {children}
    </button>
  );
}
