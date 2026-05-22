import { motion } from "framer-motion";

type Tone = "purple" | "cyan" | "blue";
const toneMap: Record<Tone, { glow: string; bg: string; ring: string; text: string }> = {
  purple: { glow: "bg-neon-purple/15", bg: "from-neon-purple/40 to-neon-purple/10", ring: "ring-neon-purple/30", text: "text-neon-purple" },
  cyan:   { glow: "bg-neon-cyan/15",   bg: "from-neon-cyan/40 to-neon-cyan/10",     ring: "ring-neon-cyan/30",   text: "text-neon-cyan" },
  blue:   { glow: "bg-neon-blue/15",   bg: "from-neon-blue/40 to-neon-blue/10",     ring: "ring-neon-blue/30",   text: "text-neon-blue" },
};

const items: { name: string; role: string; quote: string; tone: Tone }[] = [
  { name: "Aanya Rao", role: "B.Tech CSE · IIT Madras", quote: "CareerVerse mapped a 4-year trajectory I hadn't even considered. The scholarship engine alone unlocked ₹6L in funding.", tone: "purple" },
  { name: "Marcus Thorne", role: "CS Major · Stanford", quote: "The mock interview module is terrifyingly accurate. It caught the exact phrases I overuse when nervous.", tone: "cyan" },
  { name: "Joon Park", role: "UX Researcher · Seoul", quote: "Feels like a student OS from 2030. Every screen is intelligent and weirdly emotional.", tone: "blue" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-neon-pink">// Operators</div>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Trusted by the next generation.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t, i) => {
            const s = toneMap[t.tone];
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass relative overflow-hidden rounded-2xl p-8"
              >
                <div className={`absolute -top-10 -right-10 size-40 rounded-full ${s.glow} blur-3xl`} />
                <p className="text-foreground/90 leading-relaxed text-pretty">"{t.quote}"</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className={`grid size-10 place-items-center rounded-full bg-gradient-to-br ${s.bg} ring-1 ${s.ring} text-sm font-semibold`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold">{t.name}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${s.text}`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
