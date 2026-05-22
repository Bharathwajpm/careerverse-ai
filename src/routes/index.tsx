import { createFileRoute } from "@tanstack/react-router";
import { AuroraBackground } from "@/components/landing/Background";
import { LandingNav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AIDemo } from "@/components/landing/AIDemo";
import { Analytics } from "@/components/landing/Analytics";
import { Testimonials } from "@/components/landing/Testimonials";
import { LandingFooter } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerVerse AI — The Operating System for Modern Students" },
      { name: "description", content: "AI-powered career, scholarship, placement & financial guidance ecosystem. Take the assessment, find scholarships, get an AI mentor and grow." },
      { property: "og:title", content: "CareerVerse AI — The Operating System for Modern Students" },
      { property: "og:description", content: "AI-powered career, scholarship and placement intelligence for students." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AuroraBackground />
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <AIDemo />
        <Analytics />
        <Testimonials />
      </main>
      <LandingFooter />
    </div>
  );
}
