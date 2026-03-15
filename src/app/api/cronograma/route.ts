// API route: /api/cronograma — equivalente ao CronogramaDAO.java

import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import type { CronogramaAula } from "@/lib/types";

function mapSlot(r: Record<string, unknown>): CronogramaAula {
  return {
    id: r.id as string,
    professorId: r.professor_id as string,
    professorNome: r.professor_nome as string,
    turmaId: r.turma_id as string,
    turmaNome: r.turma_nome as string,
    diaSemana: r.dia_semana as CronogramaAula["diaSemana"],
    horarioInicio: r.horario_inicio as string,
    horarioFim: r.horario_fim as string,
    tipo: (r.tipo as CronogramaAula["tipo"]) ?? "AULA",
    dataInicio: r.data_inicio as string | null,
    dataFim: r.data_fim as string | null,
    criadoPor: (r.criado_por as CronogramaAula["criadoPor"]) ?? "ADMIN",
  };
}

const BASE_SELECT = `
  SELECT ca.id, ca.professor_id, pf.nome AS professor_nome,
         ca.turma_id, t.nome AS turma_nome,
         ca.dia_semana,
         TO_CHAR(ca.horario_inicio, 'HH24:MI') AS horario_inicio,
         TO_CHAR(ca.horario_fim,    'HH24:MI') AS horario_fim,
         ca.tipo, ca.criado_por,
         ca.data_inicio::text AS data_inicio,
         ca.data_fim::text    AS data_fim
  FROM cronograma_aulas ca
  JOIN turmas t  ON t.id  = ca.turma_id
  JOIN perfis pf ON pf.id = ca.professor_id
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const professorId = searchParams.get("professorId");

  try {
    let rows;
    if (professorId) {
      rows = await sql`
        SELECT ca.id, ca.professor_id, pf.nome AS professor_nome,
               ca.turma_id, t.nome AS turma_nome, ca.dia_semana,
               TO_CHAR(ca.horario_inicio,'HH24:MI') AS horario_inicio,
               TO_CHAR(ca.horario_fim,'HH24:MI') AS horario_fim,
               ca.tipo, ca.criado_por,
               ca.data_inicio::text AS data_inicio,
               ca.data_fim::text AS data_fim
        FROM cronograma_aulas ca
        JOIN turmas t  ON t.id  = ca.turma_id
        JOIN perfis pf ON pf.id = ca.professor_id
        WHERE ca.professor_id = ${professorId}::uuid
        ORDER BY
          CASE ca.dia_semana
            WHEN 'SEGUNDA' THEN 1 WHEN 'TERÇA'  THEN 2
            WHEN 'QUARTA'  THEN 3 WHEN 'QUINTA' THEN 4
            WHEN 'SEXTA'   THEN 5 WHEN 'SÁBADO' THEN 6
          END, ca.horario_inicio
      `;
    } else {
      rows = await sql`
        SELECT ca.id, ca.professor_id, pf.nome AS professor_nome,
               ca.turma_id, t.nome AS turma_nome, ca.dia_semana,
               TO_CHAR(ca.horario_inicio,'HH24:MI') AS horario_inicio,
               TO_CHAR(ca.horario_fim,'HH24:MI') AS horario_fim,
               ca.tipo, ca.criado_por,
               ca.data_inicio::text AS data_inicio,
               ca.data_fim::text AS data_fim
        FROM cronograma_aulas ca
        JOIN turmas t  ON t.id  = ca.turma_id
        JOIN perfis pf ON pf.id = ca.professor_id
        ORDER BY pf.nome,
          CASE ca.dia_semana
            WHEN 'SEGUNDA' THEN 1 WHEN 'TERÇA'  THEN 2
            WHEN 'QUARTA'  THEN 3 WHEN 'QUINTA' THEN 4
            WHEN 'SEXTA'   THEN 5 WHEN 'SÁBADO' THEN 6
          END, ca.horario_inicio
      `;
    }
    return NextResponse.json(rows.map(mapSlot));
  } catch (error) {
    console.error("[GET /api/cronograma]", error);
    return NextResponse.json({ error: "Erro ao buscar cronograma." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { professorId, turmaId, diaSemana, horarioInicio, horarioFim,
            tipo, dataInicio, dataFim, criadoPor } = await request.json();

    await sql`
      INSERT INTO cronograma_aulas
        (professor_id, turma_id, dia_semana, horario_inicio, horario_fim,
         tipo, data_inicio, data_fim, criado_por)
      VALUES (
        ${professorId}::uuid, ${turmaId}::uuid, ${diaSemana},
        ${horarioInicio}::time, ${horarioFim}::time,
        ${tipo ?? "AULA"},
        ${dataInicio ?? null}::date,
        ${dataFim ?? null}::date,
        ${criadoPor ?? "ADMIN"}
      )
    `;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/cronograma]", error);
    return NextResponse.json({ error: "Erro ao criar horário." }, { status: 500 });
  }
}
