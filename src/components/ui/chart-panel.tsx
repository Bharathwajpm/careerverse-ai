import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type ChartPanelProps = {
  children: ReactElement;
  className?: string;
  /** Tailwind height class, e.g. h-56 sm:h-64 */
  heightClass?: string;
};

/**
 * Responsive chart wrapper — parent gets min-width:0 so flex/grid children don't overflow on mobile.
 */
export function ChartPanel({
  children,
  className,
  heightClass = "h-52 sm:h-60 md:h-64 lg:h-72",
}: ChartPanelProps) {
  return (
    <div className={cn("chart-panel w-full min-w-0", heightClass, className)}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
