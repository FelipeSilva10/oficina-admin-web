import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
 
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await sql`DELETE FROM cronograma_aulas WHERE id = ${id}::uuid`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/cronograma/[id]]", error);
    return NextResponse.json({ error: "Erro ao excluir." }, { status: 500 });
  }
}