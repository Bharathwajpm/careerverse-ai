import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell, NeonInput, NeonButton } from "@/components/auth/AuthShell";
import { authApi } from "@/lib/api";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — CareerVerse AI" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset link.");
      return;
    }
    setPending(true);
    try {
      await authApi.resetPassword({ token, password });
      toast.success("Password updated. Sign in with your new password.");
      await navigate({ to: "/login" });
    } catch (err) {
      toast.error(getAuthErrorMessage(err, "Could not reset password"));
    } finally {
      setPending(false);
    }
  }

  if (!token) {
    return (
      <AuthShell
        title="Invalid link."
        subtitle="Request a new reset from the sign-in page."
        footer={
          <>
            <Link to="/login" className="text-neon-cyan hover:underline">
              Back to sign in
            </Link>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This reset link is missing a token or has expired.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password."
      subtitle="Use at least 8 characters with a letter and a number."
      footer={
        <>
          <Link to="/login" className="text-neon-cyan hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="contents" onSubmit={onSubmit}>
        <div className="contents space-y-4 [&>*]:block">
          <NeonInput
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="8+ chars, letter + number"
            minLength={8}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
          <NeonButton type="submit" disabled={pending}>
            {pending ? "Updating…" : "Update password"}
          </NeonButton>
        </div>
      </form>
    </AuthShell>
  );
}
