import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Brain,
  Bot,
  Map,
  FileText,
  GraduationCap,
  Wallet,
  Mic,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  Trophy,
  Shield,
} from "lucide-react";

export const sidebarItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/assessment", label: "Assessment", icon: Brain },
  { to: "/dashboard/mentor", label: "AI Mentor", icon: Bot },
  { to: "/dashboard/roadmaps", label: "Roadmaps", icon: Map },
  { to: "/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/dashboard/scholarships", label: "Scholarships", icon: GraduationCap },
  { to: "/dashboard/finance", label: "Finance", icon: Wallet },
  { to: "/dashboard/interviews", label: "Interviews", icon: Mic, shortLabel: "Interviews" },
  { to: "/dashboard/learning", label: "Learning", icon: BookOpen },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/rewards", label: "Rewards", icon: Trophy },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/admin", label: "Admin", icon: Shield },
] as const;

type Props = {
  onNavigate?: () => void;
  compact?: boolean;
};

export function SidebarNav({ onNavigate, compact }: Props) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border/40 px-4 lg:h-16 lg:px-5">
        <div className="grid size-8 place-items-center rounded-lg bg-gradient-aurora shadow-glow">
          <Sparkles className="size-4 text-white" />
        </div>
        <span className="font-display text-base font-semibold tracking-tight">
          CareerVerse<span className="text-neon-cyan">AI</span>
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3">
        {sidebarItems.map((it) => {
          const active = "exact" in it && it.exact ? path === it.to : path.startsWith(it.to);
          const label = compact && "shortLabel" in it ? it.shortLabel : it.label;
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-neon-purple/15 text-foreground ring-1 ring-neon-purple/30 shadow-glow"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <it.icon className={`size-4 shrink-0 ${active ? "text-neon-purple" : ""}`} />
              <span className="truncate">{label}</span>
              {active ? (
                <span className="ml-auto size-1.5 shrink-0 rounded-full bg-neon-purple shadow-glow" />
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-xl border border-neon-purple/30 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 p-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-neon-purple">
          Pro Operator
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Unlock AI mock interviews and unlimited mentor chats.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-gradient-aurora py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-95"
        >
          Upgrade
        </button>
      </div>
    </>
  );
}
