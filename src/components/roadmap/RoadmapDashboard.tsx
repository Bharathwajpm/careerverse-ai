import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Brain, RefreshCw, Sparkles } from "lucide-react";
import { generateCareerRoadmap, ROADMAP_TRACKS, suggestTrackFromAssessment } from "@/lib/roadmap/generator";
import { computeRoadmapStats, toggleMilestone } from "@/lib/roadmap/progress";
import {
  clearRoadmapData,
  createEmptyProgress,
  loadRoadmap,
  loadRoadmapProgress,
  saveRoadmap,
  saveRoadmapProgress,
} from "@/lib/roadmap/storage";
import type { CareerRoadmap, RoadmapProgress, RoadmapTrackId } from "@/lib/roadmap/types";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { PhaseAccordion } from "./PhaseAccordion";
import { SkillCards } from "./SkillCards";
import { CertificationsPanel } from "./CertificationsPanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { LearningPathTree } from "./LearningPathTree";

export function RoadmapDashboard() {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [progress, setProgress] = useState<RoadmapProgress | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<RoadmapTrackId | null>(null);

  useEffect(() => {
    const stored = loadRoadmap();
    const prog = loadRoadmapProgress();
    if (stored) {
      setRoadmap(stored);
      setProgress(prog ?? createEmptyProgress(stored.trackId));
    }
    const suggested = suggestTrackFromAssessment();
    if (suggested) setSelectedTrack(suggested);
  }, []);

  const generate = useCallback((trackId: RoadmapTrackId) => {
    setGenerating(true);
    window.setTimeout(() => {
      const next = generateCareerRoadmap(trackId);
      const prog = createEmptyProgress(trackId);
      saveRoadmap(next);
      saveRoadmapProgress(prog);
      setRoadmap(next);
      setProgress(prog);
      setGenerating(false);
    }, 1400);
  }, []);

  const updateProgress = useCallback((next: RoadmapProgress) => {
    saveRoadmapProgress(next);
    setProgress(next);
  }, []);

  const stats =
    roadmap && progress ? computeRoadmapStats(roadmap, progress) : null;

  if (!roadmap) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl space-y-8"
      >
        <header>
          <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// roadmap generator</p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
            AI career roadmaps
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Phases, milestones, skills, certifications, and projects — generated for your track and saved locally.
          </p>
        </header>

        {suggestTrackFromAssessment() ? (
          <div className="glass flex flex-wrap items-center gap-3 rounded-2xl border border-neon-cyan/30 p-4">
            <Brain className="size-5 text-neon-cyan" />
            <p className="flex-1 text-sm text-muted-foreground">
              Based on your assessment, we recommend the{" "}
              <strong className="text-foreground">
                {ROADMAP_TRACKS.find((t) => t.id === suggestTrackFromAssessment())?.label}
              </strong>{" "}
              track.
            </p>
            <Link to="/dashboard/assessment" className="text-xs text-neon-cyan hover:underline">
              View assessment
            </Link>
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ROADMAP_TRACKS.map((track, i) => (
            <button
              key={track.id}
              type="button"
              disabled={generating}
              onClick={() => {
                setSelectedTrack(track.id);
                generate(track.id);
              }}
              className={`glass group rounded-2xl p-5 text-left transition hover:ring-1 hover:ring-neon-purple/40 ${
                selectedTrack === track.id ? "ring-1 ring-neon-purple/50" : ""
              }`}
            >
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-3xl"
              >
                {track.emoji}
              </motion.span>
              <h3 className="font-display mt-3 font-semibold group-hover:text-neon-cyan">{track.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{track.description}</p>
            </button>
          ))}
        </motion.div>

        {generating ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Sparkles className="size-4 animate-pulse text-neon-purple" />
            Generating phases, milestones, and learning path…
          </div>
        ) : null}
      </motion.div>
    );
  }

  if (!progress) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// active roadmap</p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">{roadmap.title}</h1>
            <p className="mt-1 text-sm text-neon-purple">{roadmap.tagline}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {roadmap.totalWeeks} weeks · {roadmap.phases.length} phases · Generated{" "}
              {new Date(roadmap.generatedAt).toLocaleDateString()}
            </p>
          </motion.div>
          <button
            type="button"
            onClick={() => {
              clearRoadmapData();
              setRoadmap(null);
              setProgress(null);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-4" /> New track
          </button>
        </div>

        {stats ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Overall progress", value: `${stats.percent}%`, accent: "text-gradient" },
              { label: "Milestones", value: `${stats.doneMilestones}/${stats.totalMilestones}` },
              { label: "Skills", value: `${stats.doneSkills}/${stats.totalSkills}` },
              { label: "Projects", value: `${stats.doneProjects}/${stats.totalProjects}` },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-xl p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {card.label}
                </p>
                <p className={`font-display mt-1 text-2xl font-semibold ${card.accent ?? ""}`}>
                  {card.value}
                </p>
                {card.label === "Overall progress" ? (
                  <motion.div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                    initial={false}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-aurora"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percent}%` }}
                      transition={{ type: "spring", stiffness: 80 }}
                    />
                  </motion.div>
                ) : null}
              </motion.div>
            ))}
          </div>
        ) : null}
      </motion.header>

      <RoadmapTimeline phases={roadmap.phases} progress={progress} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PhaseAccordion
          phases={roadmap.phases}
          progress={progress}
          onToggleMilestone={(id) => updateProgress(toggleMilestone(progress, id))}
        />
        <SkillCards
          skills={roadmap.skills}
          progress={progress}
          onToggle={(skillId) =>
            updateProgress({
              ...progress,
              skillCompleted: {
                ...progress.skillCompleted,
                [skillId]: !progress.skillCompleted[skillId],
              },
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </div>

      <motion.div className="grid gap-6 lg:grid-cols-2">
        <CertificationsPanel certifications={roadmap.certifications} />
        <ProjectsPanel
          projects={roadmap.projects}
          progress={progress}
          onToggle={(projectId) =>
            updateProgress({
              ...progress,
              projectCompleted: {
                ...progress.projectCompleted,
                [projectId]: !progress.projectCompleted[projectId],
              },
              updatedAt: new Date().toISOString(),
            })
          }
        />
      </motion.div>

      <LearningPathTree items={roadmap.learningPath} />
    </div>
  );
}
