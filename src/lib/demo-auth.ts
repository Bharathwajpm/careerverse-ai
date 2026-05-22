/**
 * Simulated forgot-password for demo mode (no email/SMTP required).
 */
export async function submitDemoForgotPassword(email: string): Promise<{ message: string }> {
  await new Promise((r) => setTimeout(r, 700));
  const trimmed = email.trim().toLowerCase();
  return {
    message: trimmed
      ? `Demo: If ${trimmed} were registered, a reset link would be sent. For instant access, sign in with demo@careerverse.local and password DemoPass123!`
      : "Demo: Enter your email to simulate a reset. Use demo@careerverse.local / DemoPass123! to sign in.",
  };
}

export const DEMO_CREDENTIALS = {
  email: "demo@careerverse.local",
  password: "DemoPass123!",
} as const;
