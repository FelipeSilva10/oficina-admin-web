"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, Zap } from "lucide-react";
import { useSessionStore } from "@/store/session";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const setSessao = useSessionStore((s) => s.setSessao);

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!login.trim() || !senha) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim(), senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Credenciais inválidas.");
        return;
      }

      setSessao(data.sessao);
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next ?? "/dashboard");
    } catch {
      toast.error("Erro de conexão. Verifique a rede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col md:flex-row">

      {/* ── Left panel — brand / visual ─────────────────────────────────── */}
      <div
        className="relative hidden md:flex md:w-[420px] lg:w-[480px] flex-none flex-col overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <div
          className="absolute top-[-20%] right-[-10%] w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-10%] w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 justify-between">
          {/* Top: logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <span className="text-white font-black text-sm">OA</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg">SAG</span>
              <p className="text-slate-500 text-[11px] font-medium leading-tight">
                Bloquin
              </p>
            </div>
          </div>

          {/* Middle: headline */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/20">
                <Zap size={11} className="text-blue-400" />
                <span className="text-blue-400 text-[10px] font-bold tracking-wide uppercase">Plataforma educacional</span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Gestão escolar<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                simplificada
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Chamadas, diário, cronograma e relatórios de horas em um único lugar para professores de robótica.
            </p>
          </div>

          {/* Bottom: features */}
          <div className="space-y-3">
            {[
              { emoji: "📋", label: "Chamadas e presenças" },
              { emoji: "📅", label: "Cronograma semanal" },
              { emoji: "📒", label: "Diário de aulas" },
              { emoji: "⏱️", label: "Registro de horas" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 text-slate-400 text-sm">
                <span className="text-base">{f.emoji}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — login form ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-8 bg-slate-50">

        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-3 mb-10 self-start w-full max-w-sm mx-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-xs">OA</span>
          </div>
          <span className="text-slate-900 font-bold text-lg">SAG</span>
        </div>

        {/* Form card */}
        <div className="w-full max-w-sm mx-auto">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
              Bem-vindo de volta
            </h2>
            <p className="text-slate-500 text-sm">
              Entre com suas credenciais para acessar o painel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Login */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Usuário / E-mail
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="username"
                  autoFocus
                  className="
                    w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
                    text-slate-900 placeholder-slate-400 text-sm
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-400 transition-all duration-150
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Senha
              </label>
              <div className="relative">
                <input
                  type={senhaVisivel ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="
                    w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white
                    text-slate-900 placeholder-slate-400 text-sm
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-400 transition-all duration-150
                  "
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel((v) => !v)}
                  className="
                    absolute right-3.5 top-1/2 -translate-y-1/2
                    text-slate-400 hover:text-slate-600 p-1 rounded-lg
                    transition-colors
                  "
                  aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                >
                  {senhaVisivel
                    ? <EyeOff size={15} />
                    : <Eye size={15} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !login.trim() || !senha}
              className="
                w-full py-3 px-6 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800
                disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed
                shadow-md shadow-blue-500/25
                transition-all duration-150 active:scale-[0.98]
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            Plataforma SAG &mdash; Bloquin &mdash; v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
