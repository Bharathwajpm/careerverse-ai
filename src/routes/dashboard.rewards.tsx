import { createFileRoute } from "@tanstack/react-router";
import { GamificationHub } from "@/components/gamification/GamificationHub";

export const Route = createFileRoute("/dashboard/rewards")({
  component: GamificationHub,
});
