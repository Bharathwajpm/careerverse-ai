import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardSidebar, MobileSidebar } from "@/components/dashboard/Sidebar";
import { DashboardLayoutProvider } from "@/context/DashboardLayoutContext";
import { DashboardTopbar } from "@/components/dashboard/Topbar";
import { AuroraBackground } from "@/components/landing/Background";
import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen";
import { AppPreferencesProvider } from "@/context/AppPreferencesContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { assertAuthenticated } from "@/lib/auth-guard";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareerVerse AI" }] }),
  beforeLoad: async () => {
    await assertAuthenticated();
  },
  component: Layout,
});

function Layout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen label="Loading your dashboard…" />;
  }

  if (!isAuthenticated) {
    return <AuthLoadingScreen label="Redirecting to sign in…" />;
  }

  return (
    <AppPreferencesProvider>
      <NotificationProvider>
        <DashboardLayoutProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <AuroraBackground />
            <MobileSidebar />
            <div className="flex">
              <DashboardSidebar />
              <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <DashboardTopbar />
                <main className="page-container flex-1">
                  <OnboardingFlow />
                  <ErrorBoundary fallbackTitle="Dashboard module error">
                    <Outlet />
                  </ErrorBoundary>
                </main>
              </div>
            </div>
          </div>
        </DashboardLayoutProvider>
      </NotificationProvider>
    </AppPreferencesProvider>
  );
}
