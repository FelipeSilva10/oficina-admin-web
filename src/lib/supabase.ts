// ─────────────────────────────────────────────────────────────────────────────
// supabase.ts — clientes Supabase separados por contexto
//
// Java original: SupabaseAuthDAO.java fazia chamadas HTTP manuais.
// Aqui usamos o SDK oficial @supabase/supabase-js.
//
// Dois clientes distintos:
//  - createBrowserClient  → componentes Client (browser)
//  - createServerClient   → Server Components, API Routes, middleware
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Browser ────────────────────────────────────────────────────────────────────
// Use em componentes marcados com "use client"
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Server ─────────────────────────────────────────────────────────────────────
// Use em Server Components e API routes (route handlers)
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado em Server Components (só API Routes podem setar cookies)
          }
        },
      },
    }
  );
}

// ── Admin (service role) ───────────────────────────────────────────────────────
// Equivalente ao SupabaseAuthDAO.java — usa a service role key.
// NUNCA importe este em componentes client-side.
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
