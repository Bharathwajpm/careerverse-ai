import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { env } from "@/lib/env";

const clientId = env.googleClientId;

export function GoogleAuthGate({ children }: { children: ReactNode }) {
  if (!clientId) return <>{children}</>;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
