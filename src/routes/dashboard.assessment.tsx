import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AssessmentIntro } from "@/components/assessment/AssessmentIntro";
import { AssessmentProcessing } from "@/components/assessment/AssessmentProcessing";
import { AssessmentQuiz } from "@/components/assessment/AssessmentQuiz";
import { AssessmentResults } from "@/components/assessment/AssessmentResults";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";
import { isAssessmentComplete, scoreAssessment } from "@/lib/assessment/scoring";
import {
  clearAssessmentProgress,
  clearAssessmentResult,
  loadAssessmentProgress,
  loadAssessmentResult,
  saveAssessmentProgress,
  saveAssessmentResult,
} from "@/lib/assessment/storage";
import type { AssessmentResult, LikertValue } from "@/lib/assessment/types";

export const Route = createFileRoute("/dashboard/assessment")({
  head: () => ({ meta: [{ title: "Career Assessment — CareerVerse AI" }] }),
  component: AssessmentPage,
});

type Phase = "intro" | "quiz" | "processing" | "results";

function AssessmentPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, LikertValue>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [savedResult, setSavedResult] = useState<AssessmentResult | null>(null);
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const stored = loadAssessmentResult();
    const progress = loadAssessmentProgress();
    setSavedResult(stored);
    setHasProgress(Boolean(progress && progress.currentIndex > 0));
    if (stored && !progress) {
      setResult(stored);
      setPhase("results");
    }
  }, []);

  const persistProgress = useCallback((nextIndex: number, nextAnswers: Record<string, LikertValue>) => {
    const now = new Date().toISOString();
    saveAssessmentProgress({
      currentIndex: nextIndex,
      answers: nextAnswers,
      startedAt: loadAssessmentProgress()?.startedAt ?? now,
      updatedAt: now,
    });
    setHasProgress(nextIndex > 0);
  }, []);

  const startFresh = useCallback(() => {
    clearAssessmentProgress();
    setAnswers({});
    setIndex(0);
    setPhase("quiz");
    setHasProgress(false);
    persistProgress(0, {});
  }, [persistProgress]);

  const resume = useCallback(() => {
    const progress = loadAssessmentProgress();
    if (!progress) {
      startFresh();
      return;
    }
    setAnswers(progress.answers);
    setIndex(Math.min(progress.currentIndex, ASSESSMENT_QUESTIONS.length - 1));
    setPhase("quiz");
  }, [startFresh]);

  const finish = useCallback((finalAnswers: Record<string, LikertValue>) => {
    setPhase("processing");
    window.setTimeout(() => {
      const scored = scoreAssessment(finalAnswers);
      saveAssessmentResult(scored);
      setResult(scored);
      setSavedResult(scored);
      setPhase("results");
    }, 2200);
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, value: LikertValue) => {
      const nextAnswers = { ...answers, [questionId]: value };
      setAnswers(nextAnswers);
      const nextIndex = index + 1;
      if (nextIndex >= ASSESSMENT_QUESTIONS.length) {
        if (isAssessmentComplete(nextAnswers)) {
          finish(nextAnswers);
        }
        return;
      }
      window.setTimeout(() => {
        setIndex(nextIndex);
        persistProgress(nextIndex, nextAnswers);
      }, 280);
    },
    [answers, index, finish, persistProgress],
  );

  const handleBack = useCallback(() => {
    if (index === 0) return;
    const prev = index - 1;
    setIndex(prev);
    persistProgress(prev, answers);
  }, [index, answers, persistProgress]);

  const handleSkip = useCallback(() => {
    const q = ASSESSMENT_QUESTIONS[index];
    const nextAnswers = { ...answers, [q.id]: answers[q.id] ?? 3 };
    setAnswers(nextAnswers);
    const nextIndex = index + 1;
    if (nextIndex >= ASSESSMENT_QUESTIONS.length) {
      finish(nextAnswers);
      return;
    }
    setIndex(nextIndex);
    persistProgress(nextIndex, nextAnswers);
  }, [index, answers, finish, persistProgress]);

  const retake = useCallback(() => {
    clearAssessmentResult();
    setResult(null);
    startFresh();
  }, [startFresh]);

  if (phase === "intro") {
    return (
      <AssessmentIntro
        onStart={startFresh}
        onResume={hasProgress ? resume : undefined}
        hasProgress={hasProgress}
        savedResult={Boolean(savedResult)}
        onViewResults={() => {
          if (savedResult) {
            setResult(savedResult);
            setPhase("results");
          }
        }}
      />
    );
  }

  if (phase === "quiz") {
    return (
      <AssessmentQuiz
        index={index}
        answers={answers}
        onAnswer={handleAnswer}
        onBack={handleBack}
        onSkip={handleSkip}
      />
    );
  }

  if (phase === "processing") {
    return <AssessmentProcessing />;
  }

  if (result) {
    return <AssessmentResults result={result} onRetake={retake} />;
  }

  return null;
}
