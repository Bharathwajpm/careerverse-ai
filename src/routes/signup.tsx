import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell, NeonInput, NeonButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { assertGuest } from "@/lib/auth-guard";

export const Route = createFileRoute("/signup")({
  beforeLoad: async () => {
    await assertGuest();
  },
  head: () => ({
    meta: [
      { title: "Create account — CareerVerse AI" },
      { name: "description", content: "Boot up your CareerVerse AI student profile." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await register({ name, email, password });
      toast.success("Account created — welcome aboard");
      await navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(getAuthErrorMessage(err, "Could not create account"));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      title="Boot your profile."
      subtitle="Three minutes. One operating system. Infinite trajectory."
      footer={
        <>
          Already on CareerVerse?{" "}
          <Link to="/login" className="text-neon-cyan hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="contents" onSubmit={onSubmit}>
        <div className="contents space-y-4 [&>*]:block">
          <NeonInput
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Jane Operator"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
          />
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
          <NeonInput
            label="Password"
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
            {pending ? "Creating…" : "Create account"}
          </NeonButton>
          <p className="text-[11px] text-muted-foreground">
            By continuing you agree to the CareerVerse Protocol & Privacy.
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
