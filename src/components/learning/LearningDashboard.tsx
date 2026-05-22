import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Bookmark, Calendar, Play, Target, Youtube } from "lucide-react";
import { personalizedCerts, YOUTUBE_RESOURCES } from "@/lib/learning/catalog";
import { loadLearningData, recordStudyActivity, saveLearningData } from "@/lib/learning/storage";
import type { LearningData } from "@/lib/learning/types";
import { DashboardPageSkeleton } from "@/components/shared/LoadingSkeletons";

export function LearningDashboard() {
  const [data, setData] = useState<LearningData | null>(null);
  const certs = personalizedCerts();

  useEffect(() => {
    setData(loadLearningData());
  }, []);

  const persist = useCallback((next: LearningData) => {
    const withStreak = recordStudyActivity(next);
    saveLearningData(withStreak);
    setData(withStreak);
  }, []);

  if (!data) {
    return <DashboardPageSkeleton />;
  }

  const avgProgress = Math.round(
    data.courses.reduce((s, c) => s + c.progress, 0) / data.courses.length,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// learning</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Learning dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {avgProgress}% avg course progress · {data.streakDays} day streak · {data.bookmarks.length}{" "}
          bookmarks
        </p>
      </motion.header>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Daily goals
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {data.dailyGoals.map((g, i) => {
            const pct =
              g.targetMinutes > 0
                ? Math.min(100, Math.round((g.completedMinutes / g.targetMinutes) * 100))
                : 0;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <Target className="size-4 shrink-0 text-neon-cyan" />
                  <input
                    type="checkbox"
                    checked={g.done}
                    onChange={() =>
                      persist({
                        ...data,
                        dailyGoals: data.dailyGoals.map((x) =>
                          x.id === g.id ? { ...x, done: !x.done } : x,
                        ),
                      })
                    }
                    className="size-4 accent-neon-purple"
                  />
                </div>
                <p className="mt-2 text-sm font-medium">{g.label}</p>
                <p className="text-xs text-muted-foreground">
                  {g.completedMinutes}/{g.targetMinutes} min
                </p>
                <motion.div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-gradient-aurora"
                    animate={{ width: `${pct}%` }}
                  />
                </motion.div>
                <button
                  type="button"
                  className="mt-2 text-[10px] text-neon-purple hover:underline"
                  onClick={() =>
                    persist({
                      ...data,
                      dailyGoals: data.dailyGoals.map((x) =>
                        x.id === g.id
                          ? {
                              ...x,
                              completedMinutes: Math.min(
                                x.targetMinutes,
                                x.completedMinutes + 15,
                              ),
                            }
                          : x,
                      ),
                    })
                  }
                >
                  +15 min
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Calendar className="size-3.5" />
          Study planner
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {data.planner.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() =>
                persist({
                  ...data,
                  planner: data.planner.map((p) =>
                    p.id === block.id ? { ...p, done: !p.done } : p,
                  ),
                })
              }
              className={`glass rounded-xl p-3 text-left transition ${
                block.done ? "border-neon-cyan/40 bg-neon-cyan/10" : ""
              }`}
            >
              <p className="text-[10px] font-bold text-neon-purple">{block.day}</p>
              <p className="mt-1 text-sm font-medium">{block.title}</p>
              <p className="text-xs text-muted-foreground">{block.minutes} min</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Course library
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.courses.map((course, i) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="glass group rounded-2xl p-5 transition hover:ring-1 hover:ring-neon-purple/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase">
                  {course.level}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const ids = data.bookmarks.includes(course.id)
                      ? data.bookmarks.filter((id) => id !== course.id)
                      : [...data.bookmarks, course.id];
                    persist({ ...data, bookmarks: ids });
                  }}
                  className={
                    data.bookmarks.includes(course.id) ? "text-neon-purple" : "text-muted-foreground"
                  }
                >
                  <Bookmark
                    className={`size-4 ${data.bookmarks.includes(course.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <h3 className="font-display mt-3 font-semibold group-hover:text-neon-cyan">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {course.provider} · {course.duration}
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-neon-cyan">{course.progress}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-gradient-aurora"
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 text-xs text-neon-purple hover:underline"
                  onClick={() =>
                    persist({
                      ...data,
                      courses: data.courses.map((c) =>
                        c.id === course.id
                          ? { ...c, progress: Math.min(100, c.progress + 10) }
                          : c,
                      ),
                    })
                  }
                >
                  +10% complete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
            <Award className="size-3.5" />
            Certification recommendations
          </p>
          <ul className="mt-3 space-y-2">
            {certs.map((c) => (
              <li
                key={c.id}
                className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.provider} · ~{c.hours}h</p>
                </div>
                <span className="font-display text-lg font-semibold text-gradient">
                  {c.relevance}%
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
            <Youtube className="size-3.5 text-red-400" />
            YouTube resources
          </p>
          <ul className="mt-3 space-y-2">
            {YOUTUBE_RESOURCES.map((yt) => (
              <li key={yt.id} className="glass flex gap-3 rounded-xl p-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-red-500/20">
                  <Play className="size-5 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{yt.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {yt.channel} · {yt.duration} · {yt.views} views
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${yt.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-[10px] text-neon-cyan hover:underline"
                  >
                    Open on YouTube
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
