import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

type Props = {
  title: string;
  description: string;
  onRetry?: () => void;
  code?: string;
};

export function SystemErrorPage({ title, description, onRetry, code }: Props) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="glass-strong relative max-w-md rounded-3xl p-8 text-center">
        {code ? (
          <p className="font-display text-6xl font-bold text-gradient opacity-80">{code}</p>
        ) : (
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/15">
            <AlertTriangle className="size-7 text-destructive" />
          </div>
        )}
        <h1 className="font-display mt-4 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              <RefreshCw className="size-4" /> Try again
            </button>
          ) : null}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm"
          >
            <Home className="size-4" /> Home
          </Link>
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="inline-flex items-center gap-2 rounded-full border border-neon-purple/40 px-4 py-2 text-sm text-neon-purple"
          >
            Reload app
          </button>
        </div>
      </div>
    </div>
  );
}
