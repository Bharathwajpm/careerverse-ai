import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { analyzeResume } from "@/lib/resume/analyzer";
import { loadResumeAnalysis, saveResumeAnalysis } from "@/lib/resume/storage";
import type { ResumeAnalysisResult } from "@/lib/resume/types";
import { ResumeProcessing } from "./ResumeProcessing";
import { ResumeResults } from "./ResumeResults";
import { ResumeUpload } from "./ResumeUpload";

type Phase = "upload" | "processing" | "results";

export function ResumeAnalyzer() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const stored = loadResumeAnalysis();
    if (stored) {
      setResult(stored);
      setPhase("results");
    }
  }, []);

  const runAnalysis = useCallback((file: File) => {
    setFileName(file.name);
    setPhase("processing");
    window.setTimeout(() => {
      const analysis = analyzeResume(file);
      saveResumeAnalysis(analysis);
      setResult(analysis);
      setPhase("results");
    }, 2000);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setPhase("upload");
  }, []);

  if (phase === "results" && result) {
    return <ResumeResults result={result} onReset={reset} />;
  }

  if (phase === "processing") {
    return <ResumeProcessing fileName={fileName} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-purple">// resume analyzer</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          ATS resume scanner
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Drag and drop your PDF for instant keyword analysis, skill gaps, and mock AI coaching — all
          processed locally in demo mode.
        </p>
      </motion.header>

      <ResumeUpload onFile={runAnalysis} />

      {loadResumeAnalysis() ? (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            const stored = loadResumeAnalysis();
            if (stored) {
              setResult(stored);
              setPhase("results");
            }
          }}
          className="text-sm text-neon-cyan hover:underline"
        >
          View last analysis
        </motion.button>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {[
          { icon: FileText, title: "ATS score", sub: "Simulated parser grade" },
          { icon: FileText, title: "Keywords", sub: "Role-specific term match" },
          { icon: FileText, title: "Charts", sub: "Radar + bar breakdown" },
        ].map((item) => (
          <div key={item.title} className="glass rounded-xl p-4">
            <item.icon className="size-4 text-neon-cyan" />
            <p className="mt-2 font-display text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </motion.div>

      <p className="text-center text-xs text-muted-foreground">
        No file is uploaded to a server.{" "}
        <Link to="/dashboard/assessment" className="text-neon-purple hover:underline">
          Complete assessment
        </Link>{" "}
        for personalized keyword packs.
      </p>
    </div>
  );
}
