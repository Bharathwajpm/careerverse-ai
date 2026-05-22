import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Database, FileText, GraduationCap, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";
import { ChartPanel } from "@/components/ui/chart-panel";
import { DashboardPageSkeleton } from "@/components/shared/LoadingSkeletons";
import {
  fetchAdminContent,
  fetchAdminOverview,
  fetchAdminScholarships,
  fetchAdminUsers,
  toggleContentPublish,
  updateScholarshipStatus,
} from "@/lib/admin/mockApi";
import type { AdminContentRow, AdminOverview, AdminScholarshipRow, AdminUser } from "@/lib/admin/types";

const TABS = ["overview", "users", "scholarships", "content"] as const;
type AdminTab = (typeof TABS)[number];

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [scholarships, setScholarships] = useState<AdminScholarshipRow[]>([]);
  const [content, setContent] = useState<AdminContentRow[]>([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [o, u, s, c] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminUsers(),
        fetchAdminScholarships(),
        fetchAdminContent(),
      ]);
      setOverview(o);
      setUsers(u);
      setScholarships(s);
      setContent(c);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-neon-cyan">// admin</p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Mock APIs · demo operator console</p>
        </div>
        <button
          type="button"
          onClick={() => void loadAll()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${
              tab === t
                ? "bg-neon-cyan/15 ring-1 ring-neon-cyan/40"
                : "border border-border/60 text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && !overview ? <DashboardPageSkeleton /> : null}

      {tab === "overview" && overview ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total users", value: overview.totalUsers.toLocaleString(), icon: Users },
              { label: "Active today", value: overview.activeToday.toLocaleString(), icon: Database },
              { label: "Assessments", value: overview.assessmentsCompleted.toLocaleString(), icon: FileText },
              { label: "MRR (demo)", value: `₹${(overview.revenueMrr / 1000).toFixed(0)}k`, icon: GraduationCap },
            ].map((s) => (
              <motion.div key={s.label} className="glass rounded-2xl p-5">
                <s.icon className="size-4 text-muted-foreground" />
                <p className="font-display mt-2 text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="glass rounded-2xl p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">User growth</p>
              <ChartPanel className="mt-2">
                <LineChart data={overview.growthSeries}>
                  <CartesianGrid stroke="oklch(0.3 0.03 270 / 0.3)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.68 0.03 260)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.68 0.03 260)" }} />
                  <Tooltip contentStyle={{ background: "oklch(0.16 0.025 270)", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="users" stroke="oklch(0.82 0.16 200)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartPanel>
            </div>
            <div className="glass rounded-2xl p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Module usage</p>
              <ChartPanel className="mt-2" heightClass="h-56 sm:h-64 md:h-72">
                <BarChart data={overview.moduleUsage} layout="vertical">
                  <CartesianGrid stroke="oklch(0.3 0.03 270 / 0.3)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.68 0.03 260)" }} />
                  <YAxis dataKey="module" type="category" width={72} tick={{ fontSize: 10, fill: "oklch(0.68 0.03 260)" }} />
                  <Tooltip contentStyle={{ background: "oklch(0.16 0.025 270)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="count" fill="oklch(0.68 0.27 295)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartPanel>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "users" ? (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-border/60 text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Modules</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Last active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{u.plan}</td>
                  <td className="px-4 py-3">{u.modulesUsed}</td>
                  <td className="px-4 py-3 text-neon-cyan">{u.xp}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : null}

      {tab === "scholarships" ? (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-border/60 text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Grant</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Applications</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((s) => (
                <tr key={s.id} className="border-b border-border/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.provider}</p>
                  </td>
                  <td className="px-4 py-3">{s.amount}</td>
                  <td className="px-4 py-3">{s.applications}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={(e) => {
                        void updateScholarshipStatus(s.id, e.target.value as AdminScholarshipRow["status"]).then(
                          (rows) => {
                            setScholarships(rows);
                            toast.success("Scholarship updated");
                          },
                        );
                      }}
                      className="rounded-lg border border-border/60 bg-card/40 px-2 py-1 text-xs"
                    >
                      <option value="active">active</option>
                      <option value="draft">draft</option>
                      <option value="archived">archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : null}

      {tab === "content" ? (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-border/60 text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {content.map((c) => (
                <tr key={c.id} className="border-b border-border/30">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 capitalize">{c.type}</td>
                  <td className="px-4 py-3">{c.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        void toggleContentPublish(c.id).then((rows) => {
                          setContent(rows);
                          toast.success("Content status updated");
                        });
                      }}
                      className="rounded-full border border-neon-purple/40 px-3 py-1 text-xs capitalize"
                    >
                      {c.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
