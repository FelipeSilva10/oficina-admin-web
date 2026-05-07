// ─────────────────────────────────────────────────────────────────────────────
// API route: POST /api/auth/login
// Equivalente ao AutenticacaoDAO.java
//
// Estratégia:
//  1. Tenta autenticar como Admin (tabela backoffice_admins)
//  2. Se não encontrar, tenta como Professor (tabela perfis, role='teacher')
//     — aceita tanto o campo `email` quanto o campo `login`
//     — verifica access_status = 'ATIVO'
//     — verifica temp_senha se a senha padrão não bater
//     — sinaliza must_change_senha no payload de sessão
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import type { UsuarioSessao } from "@/lib/types";

// ── Tipos internos ────────────────────────────────────────────────────────────

interface ProfRow {
  id: string;
  nome: string;
  senha: string;
  access_status: string;
  must_change_senha: boolean;
  temp_senha: string | null;
  temp_senha_expiry: string | null;
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { login, senha } = await request.json();

    if (!login?.trim() || !senha) {
      return NextResponse.json(
        { error: "Login e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const loginNorm = login.trim();
    let sessao: UsuarioSessao | null = null;

    // ── 1. Tenta Admin ────────────────────────────────────────────────────────
    const adminRows = await sql`
      SELECT id, nome
      FROM backoffice_admins
      WHERE login = ${loginNorm}
        AND senha = ${senha}
      LIMIT 1
    `;

    if (adminRows.length > 0) {
      sessao = {
        id:    adminRows[0].id as string,
        nome:  adminRows[0].nome as string,
        role:  "ADMIN",
      };
    }

    // ── 2. Tenta Professor ────────────────────────────────────────────────────
    if (!sessao) {
      // Aceita email OU o campo login (único), e já traz os campos de controle
      const profRows = await sql`
        SELECT id, nome, senha, access_status,
               must_change_senha, temp_senha, temp_senha_expiry
        FROM perfis
        WHERE role = 'teacher'
          AND (email = ${loginNorm} OR login = ${loginNorm})
        LIMIT 1
      `;

      if (profRows.length > 0) {
        const prof = profRows[0] as ProfRow;

        // 2a. Verifica bloqueio/suspensão
        if (prof.access_status !== "ATIVO") {
          return NextResponse.json(
            { error: "Conta suspensa ou bloqueada. Contate o administrador." },
            { status: 403 }
          );
        }

        // 2b. Compara senha — tenta senha normal primeiro, depois temp_senha
        const senhaOk      = prof.senha === senha;
        const agora        = new Date();
        const tempValida   =
          prof.temp_senha !== null &&
          prof.temp_senha === senha &&
          prof.temp_senha_expiry !== null &&
          new Date(prof.temp_senha_expiry) > agora;

        if (!senhaOk && !tempValida) {
          return NextResponse.json(
            { error: "Credenciais inválidas." },
            { status: 401 }
          );
        }

        // 2c. Monta sessão — sinaliza troca obrigatória de senha
        sessao = {
          id:              prof.id,
          nome:            prof.nome,
          role:            "TEACHER",
          mustChangeSenha: prof.must_change_senha || tempValida,
        };
      }
    }

    // ── 3. Nenhum match ───────────────────────────────────────────────────────
    if (!sessao) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // ── 4. Seta cookie httpOnly e retorna sessão ──────────────────────────────
    const response = NextResponse.json({ sessao });
    response.cookies.set("sag_session", JSON.stringify(sessao), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 8, // 8 horas
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error("[auth/login]", error);
    return NextResponse.json(
      { error: "Erro de conexão com o banco de dados." },
      { status: 500 }
    );
  }
}

// ── DELETE /api/auth/login → logout ──────────────────────────────────────────

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("sag_session");
  return response;
}