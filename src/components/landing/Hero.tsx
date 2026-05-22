import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, GraduationCap, FileCheck, Activity, Map } from "lucide-react";

const widgets = [
  { icon: TrendingUp, label: "Career Match", value: "94.2%", sub: "Systems Engineer", tone: "from-neon-blue to-neon-cyan", pos: "top-4 -left-4 md:top-10 md:-left-12" },
  { icon: GraduationCap, label: "Scholarship", value: "$12,500", sub: "3 grants eligible", tone: "from-neon-purple to-neon-pink", pos: "top-32 -right-2 md:top-24 md:-right-16" },
  { icon: FileCheck, label: "ATS Score", value: "88/100", sub: "Top 5% nationally", tone: "from-neon-cyan to-neon-blue", pos: "bottom-20 -left-2 md:bottom-12 md:-left-20" },
  { icon: Activity, label: "Skill Growth", value: "+24%", sub: "this quarter", tone: "from-neon-pink to-neon-purple", pos: "bottom-4 right-2 md:bottom-0 md:-right-12" },
  { icon: Map, label: "Roadmap", value: "7 / 10", sub: "AI Engineer track", tone: "from-neon-blue to-neon-purple", pos: "top-1/2 -right-6 md:-right-24" },
];

export function Hero() {
  return (
    <section className="relative px-4 pt-16 pb-24 sm:px-6 sm:pt-20 sm:pb-28 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-neon-purple"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-purple opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-neon-purple" />
          </span>
          System v4.0 — Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display mt-6 text-4xl font-semibold leading-[1] tracking-tight text-balance sm:mt-8 sm:text-5xl md:text-7xl lg:text-8xl"
        >
          The Operating System <br className="hidden md:block" />
          for <span className="text-gradient">Modern Students</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl"
        >
          A unified intelligence layer for your career, scholarships, placements, and financial growth.
          Boot up your future with CareerVerse AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
          >
            <Sparkles className="size-4" />
            Get Started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/dashboard/assessment"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-card/70"
          >
            Take Career Assessment
          </Link>
        </motion.div>
      </div>

      {/* Floating dashboard widget cluster */}
      <div className="relative mx-auto mt-24 max-w-5xl">
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-px bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-strong relative aspect-[16/9] rounded-3xl p-2 shadow-2xl"
        >
          <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-background/80">
            <div className="grid-bg absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/10 via-transparent to-neon-cyan/10" />
            <DashboardPreview />
          </div>
        </motion.div>

        {widgets.map((w, i) => (
          <motion.div
            key={w.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
            className={`glass animate-float-y absolute hidden md:block ${w.pos} w-52 rounded-2xl p-4 shadow-2xl`}
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <w.icon className="size-3.5" />
              {w.label}
            </div>
            <div className={`font-display mt-2 bg-gradient-to-r ${w.tone} bg-clip-text text-2xl font-semibold text-transparent`}>
              {w.value}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">{w.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="grid h-full grid-cols-12 gap-3 p-4">
      <div className="col-span-3 hidden flex-col gap-2 md:flex">
        {["Dashboard", "Assessment", "AI Mentor", "Roadmaps", "Resume", "Scholarships"].map((it, i) => (
          <div key={it} className={`rounded-lg px-3 py-2 text-xs ${i === 0 ? "bg-neon-purple/15 text-foreground border border-neon-purple/30" : "text-muted-foreground"}`}>
            {it}
          </div>
        ))}
      </div>
      <div className="col-span-12 grid grid-cols-3 gap-3 md:col-span-9">
        {[
          { label: "Career Score", v: "94.2", color: "text-neon-blue" },
          { label: "Streak", v: "21d", color: "text-neon-cyan" },
          { label: "Interview Ready", v: "87%", color: "text-neon-purple" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className={`font-display mt-2 text-2xl font-semibold ${s.color}`}>{s.v}</div>
          </div>
        ))}
        <div className="glass col-span-3 flex h-32 flex-col justify-end gap-1 rounded-xl p-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Skill Growth</div>
          <div className="flex h-full items-end gap-1">
            {[40, 55, 35, 70, 60, 85, 75, 92, 80, 95, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-neon-purple/40 to-neon-cyan/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
