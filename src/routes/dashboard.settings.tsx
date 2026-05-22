import { createFileRoute } from "@tanstack/react-router";
import { SettingsDashboard } from "@/components/settings/SettingsDashboard";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsDashboard,
});
