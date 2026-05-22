import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { AuthShell, NeonInput, NeonButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { assertGuest } from "@/lib/auth-guard";
import { getRememberMe, getSavedEmail, setRememberMe } from "@/lib/auth-storage";
import { DEMO_CREDENTIALS } from "@/lib/demo-auth";
import { env } from "@/lib/env";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async () => {
    await assertGuest();
  },
  head: () => ({
    meta: [
      { title: "Sign in — CareerVerse AI" },
      { name: "description", content: "Sign in to your CareerVerse AI student OS." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState(() => getSavedEmail());
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMeState] = useState(() => getRememberMe());
  const [pending, setPending] = useState(false);
  const googleClientId = env.googleClientId;

  async function goAfterAuth() {
    if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
      await navigate({ href: redirect });
      return;
    }
    await navigate({ to: "/dashboard" });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setRememberMe(rememberMe);
    try {
      await login(email, password, { rememberMe });
      toast.success("Signed in");
      await goAfterAuth();
    } catch (err) {
      toast.error(getAuthErrorMessage(err, "Sign in failed"));
    } finally {
      setPending(false);
    }
  }

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setRememberMeState(true);
    toast.info("Demo credentials filled — click Sign in");
  }

  return (
    <AuthShell
      title="Welcome back, operator."
      subtitle="Sign in to resume your trajectory."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-neon-cyan hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {googleClientId ? (
        <div className="flex w-full justify-center [&>div]:w-full [&_iframe]:mx-auto">
          <GoogleLogin
            onSuccess={async (cred) => {
              if (!cred.credential) {
                toast.error("Google sign-in did not return a credential.");
                return;
              }
              setPending(true);
              try {
                await loginWithGoogle(cred.credential);
                toast.success("Signed in with Google");
                await goAfterAuth();
              } catch (err) {
                toast.error(getAuthErrorMessage(err, "Google sign-in failed"));
              } finally {
                setPending(false);
              }
            }}
            onError={() => toast.error("Google sign-in was cancelled or failed.")}
            useOneTap={false}
            theme="filled_black"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="384"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => toast.info("Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-sm font-medium transition hover:bg-card/60"
        >
          <span className="size-4 rounded-full bg-gradient-to-br from-red-400 via-yellow-300 to-blue-400" />
          Continue with Google
        </button>
      )}
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <form className="contents" onSubmit={onSubmit}>
        <div className="contents space-y-4 [&>*]:block">
          <NeonInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="demo@careerverse.local"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <NeonInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
          <div className="flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                className="size-3.5 rounded border-border bg-background"
                checked={rememberMe}
                onChange={(ev) => setRememberMeState(ev.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-neon-cyan hover:underline">
              Forgot password?
            </Link>
          </div>
          <NeonButton type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Initialize session"}
          </NeonButton>
          <button
            type="button"
            onClick={fillDemo}
            className="w-full text-center text-xs text-muted-foreground transition hover:text-neon-cyan"
          >
            Use demo account
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
