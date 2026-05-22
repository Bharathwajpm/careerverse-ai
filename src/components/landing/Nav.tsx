import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-aurora shadow-glow">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            CareerVerse<span className="text-neon-cyan">AI</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">Platform</a>
          <a href="#mentor" className="hover:text-foreground transition-colors">AI Mentor</a>
          <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Stories</a>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
          >
            Launch OS
          </Link>
        </div>
      </div>
    </nav>
  );
}
