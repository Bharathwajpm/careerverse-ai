import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, MessageCircle, Mic, Sparkles, Square } from "lucide-react";
import { evaluateInterview } from "@/lib/interview/evaluation";
import { getQuestionsForMode } from "@/lib/interview/questions";
import { addInterviewSession, loadInterviewState } from "@/lib/interview/storage";
import type {
  InterviewMode,
  InterviewPhase,
  InterviewQuestion,
  InterviewSession,
  InterviewState,
} from "@/lib/interview/types";
import { WebcamPlaceholder } from "./WebcamPlaceholder";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { ScoreDashboard } from "./ScoreDashboard";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function MockInterviewApp() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [mode, setMode] = useState<InterviewMode>("technical");
  const [history, setHistory] = useState<InterviewState>(() => loadInterviewState());
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [totalAnswerChars, setTotalAnswerChars] = useState(0);
  const [confidence, setConfidence] = useState(58);
  const [sessionResult, setSessionResult] = useState<InterviewSession | null>(null);
  const startTime = useRef(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "live") return;
    tickRef.current = window.setInterval(() => {
      setConfidence((c) => {
        const bump = Math.random() > 0.5 ? 1 : -1;
        return Math.min(92, Math.max(48, c + bump));
      });
    }, 1200);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [phase]);

  const startSession = useCallback((selected: InterviewMode) => {
    setMode(selected);
    setQuestions(getQuestionsForMode(selected, 4));
    setQIndex(0);
    setAnswer("");
    setTotalAnswerChars(0);
    setConfidence(62);
    startTime.current = Date.now();
    setPhase("live");
  }, []);

  const finishSession = useCallback(() => {
    setPhase("evaluating");
    const duration = Math.round((Date.now() - startTime.current) / 1000);
    const { scores, feedback, highlights, improvements } = evaluateInterview(
      mode,
      totalAnswerChars + answer.length,
      duration,
      qIndex + 1,
    );
    window.setTimeout(() => {
      const session: InterviewSession = {
        id: uid(),
        mode,
        completedAt: new Date().toISOString(),
        durationSeconds: duration,
        questionsAnswered: qIndex + 1,
        scores,
        feedback,
        highlights,
        improvements,
      };
      const next = addInterviewSession(session);
      setHistory(next);
      setSessionResult(session);
      setPhase("results");
    }, 2200);
  }, [mode, totalAnswerChars, answer.length, qIndex]);

  const nextQuestion = useCallback(() => {
    setTotalAnswerChars((t) => t + answer.length);
    setAnswer("");
    if (qIndex + 1 >= questions.length) {
      finishSession();
      return;
    }
    setQIndex((i) => i + 1);
    setConfidence((c) => Math.min(90, c + 4));
  }, [answer.length, qIndex, questions.length, finishSession]);

  if (phase === "results" && sessionResult) {
    return (
      <motion.div className="mx-auto max-w-5xl">
        <ScoreDashboard session={sessionResult} onAgain={() => setPhase("setup")} />
      </motion.div>
    );
  }

  if (phase === "evaluating") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="grid size-16 place-items-center rounded-full border border-neon-purple/40 bg-neon-purple/10"
        >
          <Sparkles className="size-7 text-neon-purple" />
        </motion.div>
        <h2 className="font-display mt-6 text-xl font-semibold">AI evaluating your session</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Scoring confidence, clarity, structure, and domain depth…
        </p>
      </div>
    );
  }

  if (phase === "live" && questions[qIndex]) {
    const q = questions[qIndex];
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <motion.div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">
            {mode} · Q{qIndex + 1}/{questions.length}
          </p>
          <button
            type="button"
            onClick={finishSession}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/40 px-3 py-1 text-xs text-destructive"
          >
            <Square className="size-3" /> End session
          </button>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <WebcamPlaceholder active confidence={confidence} />
          <div className="space-y-4">
            <ConfidenceMeter value={confidence} />
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-2xl p-5"
              >
                <p className="text-[10px] font-bold uppercase text-neon-purple">{q.difficulty}</p>
                <h3 className="font-display mt-2 text-lg font-semibold leading-snug">{q.text}</h3>
                <p className="mt-3 text-xs text-muted-foreground">Coach tip: {q.tip}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Your answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            placeholder="Type or speak your answer (demo)…"
            className="mt-2 w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm outline-none focus:border-neon-cyan/50"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={nextQuestion}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-white shadow-glow"
            >
              {qIndex + 1 >= questions.length ? "Finish" : "Next question"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground"
              onClick={() => setAnswer((a) => (a ? a : "I would structure my answer using STAR: situation, task, action, result."))}
            >
              <Mic className="size-4" /> Demo fill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-purple">// mock interviews</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">AI mock interviews</h1>
        <p className="text-sm text-muted-foreground">
          Webcam placeholder, confidence meter, and demo AI scoring · {history.sessions.length} sessions ·{" "}
          {history.streakDays} day streak
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => startSession("technical")}
          className="glass group rounded-2xl p-6 text-left transition hover:ring-1 hover:ring-neon-cyan/40"
        >
          <Code2 className="size-8 text-neon-cyan" />
          <h3 className="font-display mt-4 text-xl font-semibold group-hover:text-neon-cyan">Technical</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            System design, debugging, APIs — 4 adaptive questions.
          </p>
        </button>
        <button
          type="button"
          onClick={() => startSession("hr")}
          className="glass group rounded-2xl p-6 text-left transition hover:ring-1 hover:ring-neon-purple/40"
        >
          <MessageCircle className="size-8 text-neon-purple" />
          <h3 className="font-display mt-4 text-xl font-semibold group-hover:text-neon-purple">HR / Behavioral</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            STAR stories, culture fit, career narrative.
          </p>
        </button>
      </div>

      {history.sessions[0] ? (
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Last session</p>
          <p className="mt-1 font-display text-2xl font-semibold">
            {history.sessions[0].scores.overall}/100 · {history.sessions[0].mode}
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}
