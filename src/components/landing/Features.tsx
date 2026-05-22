import { motion } from "framer-motion";
import { Brain, FileText, GraduationCap, Bot, Wallet, Mic, BarChart3, Volume2, type LucideIcon } from "lucide-react";

type Tone = "purple" | "blue" | "cyan" | "pink";
const toneStyles: Record<Tone, { glow: string; bg: string; ring: string; text: string }> = {
  purple: { glow: "bg-neon-purple/20", bg: "bg-neon-purple/15", ring: "ring-neon-purple/30", text: "text-neon-purple" },
  blue:   { glow: "bg-neon-blue/20",   bg: "bg-neon-blue/15",   ring: "ring-neon-blue/30",   text: "text-neon-blue" },
  cyan:   { glow: "bg-neon-cyan/20",   bg: "bg-neon-cyan/15",   ring: "ring-neon-cyan/30",   text: "text-neon-cyan" },
  pink:   { glow: "bg-neon-pink/20",   bg: "bg-neon-pink/15",   ring: "ring-neon-pink/30",   text: "text-neon-pink" },
};

const features: { icon: LucideIcon; title: string; desc: string; tone: Tone }[] = [
  { icon: Brain, title: "AI Career Guidance", desc: "Deep psychometric modeling aligns your strengths with emerging market roles.", tone: "purple" },
  { icon: FileText, title: "Resume Analyzer", desc: "Real-time ATS scoring with keyword and structure optimization.", tone: "blue" },
  { icon: GraduationCap, title: "Scholarship Finder", desc: "Discover thousands of grants matched to your unique profile.", tone: "cyan" },
  { icon: Bot, title: "AI Mentor Chatbot", desc: "24/7 multilingual mentor — Tamil, Hindi, English voice & text.", tone: "pink" },
  { icon: Wallet, title: "Financial Guidance", desc: "Education loan planner, EMI calculators, and budget intelligence.", tone: "purple" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Webcam + voice analysis with confidence and clarity scoring.", tone: "blue" },
  { icon: BarChart3, title: "Skill Analytics", desc: "Visualize growth across 50+ professional competencies.", tone: "cyan" },
  { icon: Volume2, title: "Voice AI Assistant", desc: "Hands-free navigation across the entire CareerVerse OS.", tone: "pink" },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// Subsystems</div>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Eight intelligent modules,<br />one continuous intelligence layer.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const t = toneStyles[f.tone];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:border-neon-purple/40"
              >
                <div className={`absolute -top-12 -right-12 size-32 rounded-full ${t.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl ${t.bg} ${t.text} ring-1 ${t.ring}`}>
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
