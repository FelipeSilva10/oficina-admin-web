// API route: /api/turmas — equivalente ao TurmaDAO.java

import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import type { Turma } from "@/lib/types";

function mapTurma(r: Record<string, unknown>): Turma {
  return {
    id: r.id as string,
    escolaId: r.escola_id as string,
    nome: r.nome as string,
    anoLetivo: r.ano_letivo as string,
    escolaNome: r.escola_nome as string,
    professorNome: (r.prof_nome as string) ?? "Sem Professor",
    professorId: (r.professor_id as string) ?? null,
  };
}

// GET /api/turmas?professorId=xxx  ou  ?escolaId=xxx  ou sem parâmetro (todas)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const professorId = searchParams.get("professorId");
  const escolaId = searchParams.get("escolaId");

  try {
    let rows;

    if (professorId) {
      rows = await sql`
        SELECT t.id, t.escola_id, t.nome, t.ano_letivo, t.professor_id,
               e.nome AS escola_nome, p.nome AS prof_nome
        FROM turmas t
        JOIN escolas e ON e.id = t.escola_id
        LEFT JOIN perfis p ON p.id = t.professor_id
        WHERE t.professor_id = ${professorId}::uuid
        ORDER BY e.nome, t.nome
      `;
    } else if (escolaId) {
      rows = await sql`
        SELECT t.id, t.escola_id, t.nome, t.ano_letivo, t.professor_id,
               e.nome AS escola_nome, p.nome AS prof_nome
        FROM turmas t
        JOIN escolas e ON e.id = t.escola_id
        LEFT JOIN perfis p ON p.id = t.professor_id
        WHERE t.escola_id = ${escolaId}::uuid
        ORDER BY t.created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT t.id, t.escola_id, t.nome, t.ano_letivo, t.professor_id,
               e.nome AS escola_nome, p.nome AS prof_nome
        FROM turmas t
        JOIN escolas e ON e.id = t.escola_id
        LEFT JOIN perfis p ON p.id = t.professor_id
        ORDER BY t.created_at DESC
      `;
    }

    return NextResponse.json(rows.map(mapTurma));
  } catch (error) {
    console.error("[GET /api/turmas]", error);
    return NextResponse.json({ error: "Erro ao buscar turmas." }, { status: 500 });
  }
}

// POST /api/turmas
export async function POST(request: NextRequest) {
  try {
    const { escolaId, nome, anoLetivo, professorId } = await request.json();

    if (!escolaId || !nome?.trim() || !anoLetivo) {
      return NextResponse.json({ error: "Escola, nome e ano letivo são obrigatórios." }, { status: 400 });
    }

    await sql`
      INSERT INTO turmas (escola_id, nome, ano_letivo)
      VALUES (${escolaId}::uuid, ${nome.trim()}, ${anoLetivo})
    `;

    // Vincula professor se informado
    if (professorId) {
      await sql`
        UPDATE turmas SET professor_id = ${professorId}::uuid
        WHERE escola_id = ${escolaId}::uuid AND nome = ${nome.trim()} AND ano_letivo = ${anoLetivo}
      `;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/turmas]", error);
    return NextResponse.json({ error: "Erro ao criar turma." }, { status: 500 });
  }
}
