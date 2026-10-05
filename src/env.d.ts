/// <reference types="astro/client" />

interface Window {
  gtag?: (command: string, name: string, options: Record<string, unknown>) => void;
  zincAdsConversionLabel?: string;
}

declare namespace App {
  interface Locals {
    /** The signed-in Supabase user on admin and API requests, else null. */
    user: { id: string; email: string } | null;
    /** Set by middleware from staff_role(); null for anyone who is not owner or editor. */
    staff: import('./lib/auth').Staff | null;
  }
}
