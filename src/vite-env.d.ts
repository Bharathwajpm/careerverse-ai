/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Dev-only: proxy target for `/api` when using Vite dev server (see vite.config.ts). */
  readonly VITE_DEV_API_PROXY?: string;
  /** Google Identity Services client ID (Web client) — must match server GOOGLE_CLIENT_ID. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
