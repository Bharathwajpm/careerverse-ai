import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, X } from "lucide-react";

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function ResumeUpload({ onFile, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((f: File) => {
    const ok =
      f.type === "application/pdf" ||
      f.name.toLowerCase().endsWith(".pdf") ||
      f.type === "application/msword" ||
      f.name.toLowerCase().endsWith(".docx");
    if (!ok) return "Please upload a PDF or DOCX resume.";
    if (f.size > 5 * 1024 * 1024) return "File must be under 5 MB.";
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const err = validate(f);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setFile(f);
      onFile(f);
    },
    [onFile, validate],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [disabled, handleFile],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong relative overflow-hidden rounded-3xl p-8 md:p-12"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <label
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-14 transition ${
          dragging
            ? "border-neon-cyan bg-neon-cyan/10"
            : "border-border/60 bg-card/30 hover:border-neon-purple/50 hover:bg-neon-purple/5"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <motion.div
          animate={dragging ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
          className="grid size-16 place-items-center rounded-2xl bg-gradient-aurora shadow-glow"
        >
          <Upload className="size-7 text-white" />
        </motion.div>
        <h2 className="font-display mt-6 text-xl font-semibold md:text-2xl">
          Drop your resume here
        </h2>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          PDF or DOCX · Max 5 MB · Demo ATS scan (no file leaves your browser)
        </p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-white shadow-glow">
          <FileText className="size-4" /> Browse files
        </span>
      </label>

      {file ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-4 flex items-center justify-between gap-3 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-neon-cyan" />
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(file.size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="grid size-8 place-items-center rounded-lg hover:bg-background/50"
            aria-label="Clear file"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      ) : null}

      {error ? <p className="relative mt-3 text-center text-sm text-destructive">{error}</p> : null}
    </motion.div>
  );
}
