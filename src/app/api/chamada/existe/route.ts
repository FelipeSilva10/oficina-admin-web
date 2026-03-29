import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
 
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const professorId = searchParams.get("professorId");
  const turmaId = searchParams.get("turmaId");
  const data = searchParams.get("data");
 
  if (!professorId || !turmaId || !data) {
    return NextResponse.json({ existe: false });
  }
 
  try {
    const rows = await sql`
      SELECT 1 FROM chamadas
      WHERE professor_id = ${professorId}::uuid
        AND turma_id = ${turmaId}::uuid
        AND data_aula = ${data}::date
      LIMIT 1
    `;
    return NextResponse.json({ existe: rows.length > 0 });
  } catch {
    return NextResponse.json({ existe: false });
  }
}