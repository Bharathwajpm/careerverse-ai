import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell, NeonInput, NeonButton } from "@/components/auth/AuthShell";
import { assertGuest } from "@/lib/auth-guard";
import { submitDemoForgotPassword, DEMO_CREDENTIALS } from "@/lib/demo-auth";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: async () => {
    await assertGuest();
  },
  head: () => ({ meta: [{ title: "Reset access — CareerVerse AI" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await submitDemoForgotPassword(email);
      setDemoMessage(res.message);
      setSent(true);
      toast.success("Reset link simulated (demo mode)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox (demo)."
        subtitle="In production this would email a secure reset link."
        footer={
          <>
            <Link to="/login" className="text-neon-cyan hover:underline">
              Back to sign in
            </Link>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">{demoMessage}</p>
        <p className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4 text-xs text-muted-foreground">
          Quick demo sign-in:{" "}
          <span className="font-mono text-foreground">{DEMO_CREDENTIALS.email}</span> /{" "}
          <span className="font-mono text-foreground">{DEMO_CREDENTIALS.password}</span>
        </p>
        <Link
          to="/login"
          className="mt-6 block w-full rounded-xl border border-neon-cyan/40 py-3 text-center text-sm font-semibold text-neon-cyan transition hover:bg-neon-cyan/10"
        >
          Return to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Recover access."
      subtitle="Demo mode: we'll simulate sending a reset signal (no email required)."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-neon-cyan hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="contents" onSubmit={onSubmit}>
        <div className="contents space-y-4 [&>*]:block">
          <NeonInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <NeonButton type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </NeonButton>
        </div>
      </form>
    </AuthShell>
  );
}
