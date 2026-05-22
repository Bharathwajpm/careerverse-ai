import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-border/40 px-6 py-16">
      <div className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-neon-purple/60 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 size-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-neon-purple/10 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-12 md:grid-cols-4">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-aurora">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold">CareerVerse<span className="text-neon-cyan">AI</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The sovereign student operating system. Designed for the generation that builds the future.
          </p>
          <div className="mt-6 flex gap-3">
            {[Github, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" className="grid size-9 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-neon-purple/50 hover:text-foreground">
                <I className="size-4" />
              </a>
            ))}
          </div>
        </div>
        {[
          { h: "Platform", l: ["Assessment", "AI Mentor", "Roadmaps", "Resume"] },
          { h: "Resources", l: ["Scholarships", "Mock Interviews", "Finance", "Community"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground">{c.h}</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {c.l.map((it) => <li key={it}><a href="#" className="hover:text-foreground transition-colors">{it}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-[10px] font-mono text-muted-foreground md:flex-row">
        <span>© 2026 CAREERVERSE_AI · ALL SYSTEMS NOMINAL</span>
        <span>STATUS: OPTIMAL · LATENCY 14ms</span>
      </div>
    </footer>
  );
}
