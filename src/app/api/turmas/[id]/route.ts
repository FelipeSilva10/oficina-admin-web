import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { escolaId, nome, anoLetivo, professorId } = await request.json();

    await sql`
      UPDATE turmas
      SET escola_id = ${escolaId}::uuid, nome = ${nome}, ano_letivo = ${anoLetivo}
      WHERE id = ${id}::uuid
    `;

    // professorId null = remover professor
    if (professorId === null) {
      await sql`UPDATE turmas SET professor_id = NULL WHERE id = ${id}::uuid`;
    } else if (professorId) {
      await sql`UPDATE turmas SET professor_id = ${professorId}::uuid WHERE id = ${id}::uuid`;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/turmas/:id]", error);
    return NextResponse.json({ error: "Erro ao atualizar turma." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await sql`DELETE FROM turmas WHERE id = ${id}::uuid`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/turmas/:id]", error);
    return NextResponse.json({ error: "Erro ao excluir turma." }, { status: 500 });
  }
}
