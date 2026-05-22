import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { INDIAN_STATES } from "@/lib/scholarship/dataset";
import type { CasteCategory, IncomeBracket, ScholarshipCategory, ScholarshipFilters } from "@/lib/scholarship/types";

type Props = {
  filters: ScholarshipFilters;
  onChange: (next: ScholarshipFilters) => void;
};

const CASTES: { value: CasteCategory | "any"; label: string }[] = [
  { value: "any", label: "All categories" },
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
];

const INCOMES: { value: IncomeBracket; label: string }[] = [
  { value: "any", label: "Any income" },
  { value: "below-2.5", label: "Below ₹2.5L" },
  { value: "2.5-5", label: "₹2.5–5L" },
  { value: "5-8", label: "₹5–8L" },
  { value: "above-8", label: "Above ₹8L" },
];

const CATEGORIES: { value: ScholarshipCategory | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "engineering", label: "Engineering" },
  { value: "women-stem", label: "Women in STEM" },
  { value: "research", label: "Research" },
  { value: "need-based", label: "Need-based" },
  { value: "merit", label: "Merit" },
  { value: "global", label: "Global" },
  { value: "minority", label: "Minority / Govt" },
];

export function ScholarshipFiltersPanel({ filters, onChange }: Props) {
  const set = (patch: Partial<ScholarshipFilters>) => onChange({ ...filters, ...patch });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass space-y-4 rounded-2xl p-4 md:p-5"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <SlidersHorizontal className="size-3.5" />
        Eligibility filters
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search scholarships, providers, tags…"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          className="w-full rounded-xl border border-border/60 bg-card/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neon-purple/50"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-[10px] font-bold uppercase text-muted-foreground">
          State
          <select
            value={filters.state}
            onChange={(e) => set({ state: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          >
            <option value="">All states</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[10px] font-bold uppercase text-muted-foreground">
          Caste / category
          <select
            value={filters.caste}
            onChange={(e) => set({ caste: e.target.value as CasteCategory | "any" })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          >
            {CASTES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[10px] font-bold uppercase text-muted-foreground">
          Family income
          <select
            value={filters.income}
            onChange={(e) => set({ income: e.target.value as IncomeBracket })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          >
            {INCOMES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[10px] font-bold uppercase text-muted-foreground">
          Scholarship type
          <select
            value={filters.category}
            onChange={(e) => set({ category: e.target.value as ScholarshipCategory | "all" })}
            className="mt-1 w-full rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.savedOnly}
          onChange={(e) => set({ savedOnly: e.target.checked })}
          className="size-4 rounded border-border accent-neon-purple"
        />
        Saved scholarships only
      </label>
    </motion.div>
  );
}
