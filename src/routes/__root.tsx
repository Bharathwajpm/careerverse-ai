import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAuthGate } from "@/components/auth/GoogleAuthGate";
import { AuthProvider } from "@/context/AuthContext";
import { SystemErrorPage } from "@/components/shared/SystemErrorPage";

function NotFoundComponent() {
  return (
    <SystemErrorPage
      code="404"
      title="Page not found"
      description="This route isn't part of CareerVerse OS yet. Head home or open your dashboard."
    />
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  if (import.meta.env.DEV) {
    console.error(error);
  }

  return (
    <SystemErrorPage
      title="This page didn't load"
      description="Something interrupted the experience. Retry or return to a safe route."
      onRetry={() => reset()}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CareerVerse AI — The Operating System for Modern Students" },
      {
        name: "description",
        content:
          "AI-powered career, scholarship, placement & financial guidance ecosystem for the next generation of students.",
      },
      { name: "author", content: "CareerVerse AI" },
      { property: "og:title", content: "CareerVerse AI" },
      { property: "og:description", content: "AI Operating System For Students" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleAuthGate>
        <AuthProvider>
          <Outlet />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </GoogleAuthGate>
    </QueryClientProvider>
  );
}
