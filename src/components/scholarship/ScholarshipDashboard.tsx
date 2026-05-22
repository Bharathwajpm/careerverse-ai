import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  filterScholarships,
  recommendScholarships,
  scoreScholarship,
  totalOpportunityInr,
} from "@/lib/scholarship/search";
import { DashboardPageSkeleton } from "@/components/shared/LoadingSkeletons";
import {
  loadSavedScholarshipIds,
  loadScholarshipProfile,
  saveScholarshipProfile,
  toggleSavedScholarship,
} from "@/lib/scholarship/storage";
import type { ScholarshipFilters, ScholarshipProfile } from "@/lib/scholarship/types";
import { ScholarshipCard } from "./ScholarshipCard";
import { ScholarshipFiltersPanel } from "./ScholarshipFilters";

const DEFAULT_FILTERS: ScholarshipFilters = {
  query: "",
  state: "",
  caste: "any",
  income: "any",
  category: "all",
  savedOnly: false,
};

export function ScholarshipDashboard() {
  const [profile, setProfile] = useState<ScholarshipProfile>(() => loadScholarshipProfile());
  const [filters, setFilters] = useState<ScholarshipFilters>({
    ...DEFAULT_FILTERS,
    state: profile.state === "All India" ? "" : profile.state,
    caste: profile.caste,
    income: profile.income,
  });
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSavedIds(loadSavedScholarshipIds());
    setHydrated(true);
  }, []);

  const syncProfile = useCallback((next: ScholarshipProfile) => {
    setProfile(next);
    saveScholarshipProfile(next);
    setFilters((f) => ({
      ...f,
      state: next.state === "All India" ? "" : next.state,
      caste: next.caste,
      income: next.income,
    }));
  }, []);

  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);

  const filtered = useMemo(() => {
    const list = filterScholarships(filters, savedSet);
    return list
      .map((s) => scoreScholarship(s, profile))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [filters, savedSet, profile]);

  const recommended = useMemo(() => recommendScholarships(profile, 3), [profile]);
  const recommendedIds = useMemo(() => new Set(recommended.map((r) => r.id)), [recommended]);
  const listWithoutDupes = useMemo(
    () => filtered.filter((s) => !recommendedIds.has(s.id)),
    [filtered, recommendedIds],
  );

  const stats = useMemo(
    () => ({
      total: filtered.length,
      opportunity: totalOpportunityInr(filtered),
      saved: savedIds.length,
      avgMatch:
        filtered.length > 0
          ? Math.round(filtered.reduce((s, x) => s + x.matchScore, 0) / filtered.length)
          : 0,
    }),
    [filtered, savedIds.length],
  );

  if (!hydrated) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// scholarship intelligence</p>
        <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Funding intelligence</h1>
        <p className="text-sm text-muted-foreground">
          {stats.total} matches · {stats.opportunity} total opportunity · demo AI recommendations
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Total opportunity", v: stats.opportunity, c: "text-neon-cyan" },
          { l: "Saved", v: String(stats.saved), c: "text-neon-purple" },
          { l: "Active matches", v: String(stats.total), c: "text-neon-blue" },
          { l: "Avg match", v: `${stats.avgMatch}%`, c: "text-neon-pink" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className={`font-display mt-2 text-2xl font-semibold sm:text-3xl ${s.c}`}>{s.v}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-neon-purple/20 p-4 md:p-5"
      >
        <div className="flex items-center gap-2 text-neon-purple">
          <Sparkles className="size-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Your profile (for recommendations)</p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            State
            <select
              value={profile.state}
              onChange={(e) => syncProfile({ ...profile, state: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-2 py-2 text-sm"
            >
              <option value="All India">All India</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </label>
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Caste
            <select
              value={profile.caste}
              onChange={(e) =>
                syncProfile({ ...profile, caste: e.target.value as ScholarshipProfile["caste"] })
              }
              className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-2 py-2 text-sm"
            >
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="ews">EWS</option>
            </select>
          </label>
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Income
            <select
              value={profile.income}
              onChange={(e) =>
                syncProfile({ ...profile, income: e.target.value as ScholarshipProfile["income"] })
              }
              className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-2 py-2 text-sm"
            >
              <option value="any">Any</option>
              <option value="below-2.5">Below ₹2.5L</option>
              <option value="2.5-5">₹2.5–5L</option>
              <option value="5-8">₹5–8L</option>
              <option value="above-8">Above ₹8L</option>
            </select>
          </label>
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Level
            <select
              value={profile.level}
              onChange={(e) =>
                syncProfile({ ...profile, level: e.target.value as ScholarshipProfile["level"] })
              }
              className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-2 py-2 text-sm"
            >
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="PhD">PhD</option>
            </select>
          </label>
        </div>
      </motion.div>

      {recommended.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            AI recommended for you
          </p>
          {recommended.map((s, i) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              saved={savedSet.has(s.id)}
              index={i}
              onToggleSave={() => setSavedIds(toggleSavedScholarship(s.id))}
            />
          ))}
        </div>
      ) : null}

      <ScholarshipFiltersPanel filters={filters} onChange={setFilters} />

      <div className="space-y-3">
        {listWithoutDupes.length === 0 && recommended.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No scholarships match your filters. Try broadening state or income.
          </p>
        ) : (
          listWithoutDupes.map((s, i) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              saved={savedSet.has(s.id)}
              index={i}
              onToggleSave={() => setSavedIds(toggleSavedScholarship(s.id))}
            />
          ))
        )}
      </div>
    </div>
  );
}
