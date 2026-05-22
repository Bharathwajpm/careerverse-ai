import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const radarData = [
  { skill: "AI/ML", v: 88 },
  { skill: "Systems", v: 76 },
  { skill: "Cloud", v: 92 },
  { skill: "DSA", v: 81 },
  { skill: "Comm", v: 70 },
  { skill: "Design", v: 64 },
];

const trendData = Array.from({ length: 12 }).map((_, i) => ({
  m: ["J","F","M","A","M","J","J","A","S","O","N","D"][i],
  salary: 40 + i * 6 + Math.sin(i) * 5,
  growth: 30 + i * 5,
}));

export function Analytics() {
  return (
    <section id="analytics" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-neon-blue">// Analytics</div>
          <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Decisions backed by your data.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 lg:col-span-1"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Career Compatibility</div>
            <div className="font-display mt-1 text-2xl font-semibold">Skill Radar</div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.4 0.05 270 / 0.4)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 11 }} />
                  <Radar dataKey="v" stroke="oklch(0.68 0.27 295)" fill="oklch(0.68 0.27 295)" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Salary Trajectory</div>
                <div className="font-display mt-1 text-2xl font-semibold">Projected growth · 12 months</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold text-neon-cyan">+187%</div>
                <div className="text-xs text-muted-foreground">forecast accuracy 92%</div>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.82 0.16 200)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.82 0.16 200)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.68 0.27 295)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.68 0.27 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="oklch(0.55 0.02 260)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.16 0.025 270)", border: "1px solid oklch(0.3 0.03 270)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="salary" stroke="oklch(0.82 0.16 200)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="growth" stroke="oklch(0.68 0.27 295)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
