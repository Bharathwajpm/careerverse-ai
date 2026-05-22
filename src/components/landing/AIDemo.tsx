import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Languages, Send } from "lucide-react";

const conversation = [
  { role: "user", text: "Analyze my growth this quarter and find scholarships I qualify for." },
  { role: "ai", text: "Booting CareerVerse modules…\n[+] Skills: +24% in Distributed Systems\n[+] Mock interviews: top 5%\n[!] 3 scholarships detected — 92% eligibility match for the Genesis $10K Grant.\n\nWould you like me to draft your application?" },
];

function Typewriter({ text, speed = 14 }: { text: string; speed?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) return;
    const t = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed]);
  return <span className="whitespace-pre-wrap">{text.slice(0, i)}{i < text.length && <span className="animate-blink">▌</span>}</span>;
}

export function AIDemo() {
  return (
    <section id="mentor" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-neon-purple">// AI Mentor</div>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Your career, debugged in real time.
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-2 shadow-2xl"
        >
          <div className="rounded-2xl bg-background/80 ring-1 ring-border/60">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-muted" />
                <div className="size-2.5 rounded-full bg-muted" />
                <div className="size-2.5 rounded-full bg-muted" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">careerverse_terminal v4.0</div>
              <div className="flex items-center gap-1 text-[10px] text-neon-cyan">
                <span className="size-1.5 animate-pulse rounded-full bg-neon-cyan" /> live
              </div>
            </div>

            <div className="space-y-6 p-6 font-mono text-sm md:p-8">
              {conversation.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.4 }}
                  className="flex gap-4"
                >
                  <span className={`shrink-0 ${m.role === "user" ? "text-neon-cyan" : "text-neon-purple"}`}>
                    {m.role === "user" ? "you →" : "cv_ai:"}
                  </span>
                  <div className={m.role === "user" ? "text-foreground" : "text-muted-foreground"}>
                    {i === 1 ? <Typewriter text={m.text} /> : m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-border/50 p-4">
              <div className="flex gap-2">
                {["EN", "हि", "த"].map((l) => (
                  <button key={l} className="rounded-md border border-border/60 px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-neon-purple/50 transition">
                    {l}
                  </button>
                ))}
              </div>
              <div className="ml-2 flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2">
                <Languages className="size-4 text-muted-foreground" />
                <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask CareerVerse anything…" />
                <button className="grid size-7 place-items-center rounded-full bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25">
                  <Mic className="size-3.5" />
                </button>
                <button className="grid size-7 place-items-center rounded-full bg-gradient-aurora text-white shadow-glow">
                  <Send className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
