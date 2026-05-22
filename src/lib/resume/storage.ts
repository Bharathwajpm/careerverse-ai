import type { ResumeAnalysisResult } from "./types";

const RESULT_KEY = "cv_resume_analysis";

export function loadResumeAnalysis(): ResumeAnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeAnalysisResult;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveResumeAnalysis(result: ResumeAnalysisResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function clearResumeAnalysis(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESULT_KEY);
}
