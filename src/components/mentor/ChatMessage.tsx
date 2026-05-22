import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { MentorMessage } from "@/lib/mentor/types";

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 ? <br /> : null}
      </span>
    ));
  });
}

function useTypewriter(text: string, enabled: boolean, onDone: () => void) {
  const [visible, setVisible] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setVisible(text);
      return;
    }
    setVisible("");
    let i = 0;
    const step = Math.max(1, Math.floor(text.length / 80));
    const id = window.setInterval(() => {
      i += step;
      if (i >= text.length) {
        setVisible(text);
        window.clearInterval(id);
        onDone();
      } else {
        setVisible(text.slice(0, i));
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [text, enabled, onDone]);

  return visible;
}

export function ChatMessage({ message }: { message: MentorMessage }) {
  const isUser = message.role === "user";
  const [animating, setAnimating] = useState(Boolean(message.animate));
  const displayed = useTypewriter(message.content, animating && !isUser, () => setAnimating(false));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "justify-end" : ""}`}
    >
      {!isUser ? (
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-aurora shadow-glow">
          <Sparkles className="size-3.5 text-white" />
        </div>
      ) : null}
      <div
        className={`max-w-[min(100%,36rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-gradient-aurora text-white shadow-glow"
            : "glass-strong rounded-tl-sm text-foreground"
        }`}
      >
        {isUser ? message.content : renderMarkdownLite(displayed)}
        {animating && !isUser ? (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-neon-cyan align-middle" />
        ) : null}
      </div>
    </motion.div>
  );
}
