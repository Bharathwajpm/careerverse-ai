import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import { ChartPanel } from "@/components/ui/chart-panel";
import type { InterviewSession } from "@/lib/interview/types";

type Props = {
  session: InterviewSession;
  onAgain: () => void;
};

export function ScoreDashboard({ session, onAgain }: Props) {
  const radar = [
    { skill: "Confidence", score: session.scores.confidence },
    { skill: "Clarity", score: session.scores.clarity },
    { skill: "Technical", score: session.scores.technicalDepth },
    { skill: "Communication", score: session.scores.communication },
    { skill: "Structure", score: session.scores.structure },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Overall score · {session.mode} mode
        </p>
        <p className="font-display mt-2 text-6xl font-semibold text-gradient">{session.scores.overall}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {session.questionsAnswered} questions · {Math.round(session.durationSeconds / 60)} min
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Skill radar
          </p>
          <ChartPanel className="mt-2">
            <RadarChart data={radar}>
              <PolarGrid stroke="oklch(0.4 0.05 270 / 0.45)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "oklch(0.78 0.02 260)", fontSize: 10 }} />
              <Radar
                dataKey="score"
                stroke="oklch(0.68 0.27 295)"
                fill="oklch(0.68 0.27 295)"
                fillOpacity={0.45}
              />
            </RadarChart>
          </ChartPanel>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase text-neon-cyan">Highlights</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {session.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-neon-cyan">+</span> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold uppercase text-neon-pink">Improve</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {session.improvements.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-neon-pink">→</span> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neon-purple">AI feedback</p>
        <div className="mt-3 space-y-3 text-sm text-muted-foreground">
          {session.feedback.map((f) => (
            <p key={f.slice(0, 40)}>{f.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onAgain}
        className="inline-flex rounded-full bg-gradient-aurora px-6 py-2.5 text-sm font-semibold text-white shadow-glow"
      >
        Start another session
      </button>
    </motion.div>
  );
}
