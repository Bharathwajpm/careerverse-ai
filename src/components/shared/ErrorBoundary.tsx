import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { env } from "@/lib/env";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (env.isDev) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="glass-strong mx-auto flex max-w-lg flex-col items-center rounded-3xl p-8 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-destructive/15">
          <AlertTriangle className="size-7 text-destructive" />
        </div>
        <h2 className="font-display mt-5 text-xl font-semibold">
          {this.props.fallbackTitle ?? "Something went wrong"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {this.state.message ?? "This section hit an unexpected error. Try again or return home."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: undefined })}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white"
          >
            <RefreshCw className="size-4" /> Try again
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-border/60 px-4 py-2 text-sm"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }
}
