"use client";

// src/app/auto-login/page.tsx  (OficinaAdmin — Next.js)
//
// Esta rota é chamada EXCLUSIVAMENTE pela WebviewWindow do Tauri.
// Ela recebe ?access_token=...&refresh_token=... na URL,
// autentica o professor via supabase.setSession() e redireciona
// para /escolas (página inicial do dashboard).
//
// Se acessada sem tokens ou por um usuário sem role 'teacher',
// redireciona para /login normalmente.

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";

export default function AutoLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      const accessToken  = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      // Sem tokens → login normal
      if (!accessToken || !refreshToken) {
        router.replace("/login");
        return;
      }

      const supabase = getSupabaseBrowser();

      // Estabelece a sessão com os tokens recebidos do Tauri
      const { data, error } = await supabase.auth.setSession({
        access_token:  accessToken,
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        setStatus("error");
        setErrorMsg("Sessão inválida ou expirada. Feche esta janela e tente novamente.");
        return;
      }

      // Verifica se o usuário é professor na tabela perfis
      const { data: perfil, error: perfilError } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      if (perfilError || perfil?.role !== "teacher") {
        // Não é professor — desloga e mostra erro
        await supabase.auth.signOut();
        setStatus("error");
        setErrorMsg("Acesso restrito a professores.");
        return;
      }

      // Tudo certo — redireciona para o dashboard
      // Usa replace para não deixar a rota /auto-login no histórico
      router.replace("/escolas");
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── UI de loading / erro ───────────────────────────────────────────────────

  if (status === "error") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
        background: "#f0f2f5", fontFamily: "system-ui, sans-serif",
      }}>
        <span style={{ fontSize: "3rem" }}>🚫</span>
        <h2 style={{ color: "#2f3542", fontWeight: 900, fontSize: "1.4rem", margin: 0 }}>
          Acesso negado
        </h2>
        <p style={{ color: "#7f8c8d", fontWeight: 700, textAlign: "center", maxWidth: 320 }}>
          {errorMsg}
        </p>
        <button
          onClick={() => router.replace("/login")}
          style={{
            marginTop: "8px", padding: "12px 28px",
            background: "#2b6cb0", color: "white",
            border: "none", borderRadius: "12px",
            fontWeight: 800, fontSize: "1rem", cursor: "pointer",
          }}
        >
          Ir para o Login
        </button>
      </div>
    );
  }

  // Estado "loading" — tela simples enquanto autentica
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
      background: "#f0f2f5", fontFamily: "system-ui, sans-serif",
    }}>
      <span style={{ fontSize: "3rem", animation: "spin 1s linear infinite" }}>⚙️</span>
      <p style={{ color: "#2f3542", fontWeight: 800, fontSize: "1.1rem" }}>
        Conectando ao painel…
      </p>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}