import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import type { ChamadaPresenca } from "@/lib/types";
 
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const rows = await sql`
      SELECT cp.id, cp.chamada_id, cp.aluno_id, p.nome AS aluno_nome, cp.presente
      FROM chamada_presencas cp
      JOIN perfis p ON p.id = cp.aluno_id
      WHERE cp.chamada_id = ${id}::uuid
      ORDER BY p.nome
    `;
    return NextResponse.json(
      rows.map((r) => ({
        id: r.id,
        chamadaId: r.chamada_id,
        alunoId: r.aluno_id,
        alunoNome: r.aluno_nome,
        presente: r.presente,
      }))
    );
  } catch (error) {
    console.error("[GET /api/chamada/[id]/presencas]", error);
    return NextResponse.json({ error: "Erro ao buscar presenças." }, { status: 500 });
  }
}
 
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { presencas } = await request.json() as { presencas: ChamadaPresenca[] };
  try {
    for (const p of presencas) {
      if (!p.id) continue;
      await sql`
        UPDATE chamada_presencas SET presente = ${p.presente}
        WHERE id = ${p.id}::uuid
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/chamada/[id]/presencas]", error);
    return NextResponse.json({ error: "Erro ao atualizar." }, { status: 500 });
  }
}