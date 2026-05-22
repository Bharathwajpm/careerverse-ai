/** Shared Recharts tooltip styling and formatters */
export const CHART_TOOLTIP_STYLE = {
  background: "oklch(0.16 0.025 270)",
  border: "1px solid oklch(0.35 0.04 270 / 0.6)",
  borderRadius: 12,
  fontSize: 12,
} as const;

export function formatChartInr(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  if (Number.isNaN(n)) return "₹0";
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
  return `₹${Math.round(n)}`;
}
