import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
 
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { dataAula, titulo, conteudo, observacoes } = await request.json();
  try {
    await sql`
      UPDATE diario_aulas
      SET data_aula = ${dataAula}::date,
          titulo = ${titulo ?? ""},
          conteudo = ${conteudo ?? ""},
          observacoes = ${observacoes ?? ""}
      WHERE id = ${id}::uuid
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/diario/[id]]", error);
    return NextResponse.json({ error: "Erro ao atualizar." }, { status: 500 });
  }
}
 
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await sql`DELETE FROM diario_aulas WHERE id = ${id}::uuid`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/diario/[id]]", error);
    return NextResponse.json({ error: "Erro ao excluir." }, { status: 500 });
  }
}