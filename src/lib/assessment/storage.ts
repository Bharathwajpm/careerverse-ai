import type { AssessmentProgress, AssessmentResult } from "./types";

const RESULT_KEY = "cv_assessment_result";
const PROGRESS_KEY = "cv_assessment_progress";

export function loadAssessmentResult(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AssessmentResult;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveAssessmentResult(result: AssessmentResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
  clearAssessmentProgress();
}

export function clearAssessmentResult(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESULT_KEY);
}

export function loadAssessmentProgress(): AssessmentProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentProgress;
  } catch {
    return null;
  }
}

export function saveAssessmentProgress(progress: AssessmentProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function clearAssessmentProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_KEY);
}
