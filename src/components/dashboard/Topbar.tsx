import { Link } from "@tanstack/react-router";
import { Menu, Search, Sparkles, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useDashboardLayout } from "@/context/DashboardLayoutContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardTopbar() {
  const { user, logout } = useAuth();
  const { toggleMobileNav } = useDashboardLayout();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 px-3 backdrop-blur-xl sm:gap-3 sm:px-4 md:h-16 md:px-6">
      <button
        type="button"
        onClick={toggleMobileNav}
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/60 bg-card/50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="relative hidden min-w-0 flex-1 items-center sm:flex md:max-w-md">
          <Search className="absolute left-3 size-4 text-muted-foreground" />
          <input
            placeholder="Ask CareerVerse anything…"
            className="w-full rounded-full border border-border/60 bg-card/50 py-2 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/30"
          />
          <kbd className="absolute right-3 hidden rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground lg:block">
            ⌘K
          </kbd>
        </div>
        <Link
          to="/dashboard/mentor"
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-aurora px-3 py-2 text-xs font-semibold text-white shadow-glow sm:hidden"
        >
          <Sparkles className="size-3.5 shrink-0" />
          <span className="truncate">AI Mentor</span>
        </Link>
      </div>

      <button
        type="button"
        className="hidden items-center gap-2 rounded-full bg-gradient-aurora px-3.5 py-2 text-xs font-semibold text-white shadow-glow md:inline-flex"
      >
        <Sparkles className="size-3.5" /> Quick AI
      </button>
      <NotificationCenter />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="Account"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-neon-purple to-neon-blue text-xs font-semibold text-white outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-neon-purple/60"
          >
            {initial}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[12rem]">
          {user ? (
            <div className="border-b border-border/60 px-2 py-2">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          ) : null}
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings" className="cursor-pointer gap-2">
              <Settings className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => {
              void logout().catch(() => toast.error("Could not sign out"));
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
