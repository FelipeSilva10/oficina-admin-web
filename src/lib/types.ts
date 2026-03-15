// ─────────────────────────────────────────────────────────────────────────────
// tipos.ts — equivalente TypeScript de todo o pacote core/ do Java
// Mantém os mesmos nomes de campo snake_case do banco +
// aliases camelCase para uso no frontend.
// ─────────────────────────────────────────────────────────────────────────────

// ── Sessão ────────────────────────────────────────────────────────────────────
export type Role = "ADMIN" | "TEACHER";

export interface UsuarioSessao {
  id: string;
  nome: string;
  role: Role;
}

// ── Escola ─────────────────────────────────────────────────────────────────────
export type EscolaTipo = "PUBLICA" | "PRIVADA";

export interface Escola {
  id: string;
  nome: string;
  status: string;
  tipo: EscolaTipo;
  tipoLabel: string; // "Pública" | "Privada"
}

// ── Turma ──────────────────────────────────────────────────────────────────────
export interface Turma {
  id: string;
  escolaId: string;
  nome: string;
  anoLetivo: string;
  escolaNome: string;
  professorNome: string;
  professorId: string | null;
}

// ── Professor ──────────────────────────────────────────────────────────────────
export interface Professor {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

// ── Aluno ──────────────────────────────────────────────────────────────────────
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  senha: string;
  turmaId: string;
  turmaNome: string;
  escolaNome: string;
}

// ── Cronograma ─────────────────────────────────────────────────────────────────
export type TipoAula = "AULA" | "REUNIÃO" | "AULA_SUBSTITUTA";
export type DiaSemana = "SEGUNDA" | "TERÇA" | "QUARTA" | "QUINTA" | "SEXTA" | "SÁBADO" | "DOMINGO";
export type CriadoPor = "ADMIN" | "PROFESSOR";

export interface CronogramaAula {
  id: string;
  professorId: string;
  professorNome: string;
  turmaId: string;
  turmaNome: string;
  diaSemana: DiaSemana;
  horarioInicio: string; // "HH:MM"
  horarioFim: string;    // "HH:MM"
  tipo: TipoAula;
  dataInicio: string | null; // ISO date
  dataFim: string | null;    // ISO date
  criadoPor: CriadoPor;
}

// Agrupamento de dias da mesma aula (equivale ao GrupoCronograma.java)
export interface GrupoCronograma {
  ids: string[];
  professorId: string;
  professorNome: string;
  turmaId: string;
  turmaNome: string;
  dias: DiaSemana[];
  horarioInicio: string;
  horarioFim: string;
  dataInicio: string | null;
  dataFim: string | null;
  tipo: TipoAula;
  criadoPor: CriadoPor;
}

// ── Chamada ────────────────────────────────────────────────────────────────────
export interface ChamadaPresenca {
  id: string | null;    // null antes de persistir
  chamadaId: string | null;
  alunoId: string;
  alunoNome: string;
  presente: boolean;
}

export interface Chamada {
  id: string;
  professorId: string;
  turmaId: string;
  turmaNome: string;
  cronogramaId: string | null;
  dataAula: string;       // ISO date
  horarioInicio: string;
  horarioFim: string;
  totalAlunos: number;
  totalPresentes: number;
}

export interface ResumoTurma {
  turmaId: string;
  turmaNome: string;
  escolaNome: string;
  totalChamadas: number;
  mediaPresenca: number; // 0-100
  ultimaChamada: string | null; // ISO date
}

// ── Diário de Aulas ────────────────────────────────────────────────────────────
export interface DiarioAula {
  id: string;
  professorId: string;
  turmaId: string;
  turmaNome: string;
  escolaNome: string;
  dataAula: string; // ISO date
  titulo: string;
  conteudo: string;
  observacoes: string;
}

// ── Registro de Horas ──────────────────────────────────────────────────────────
export interface RegistroHoras {
  chamadaId: string;
  professorId: string;
  professorNome: string;
  turmaId: string;
  turmaNome: string;
  escolaNome: string;
  escolaTipo: EscolaTipo;
  dataAula: string;       // ISO date
  horarioInicio: string;
  horarioFim: string;
  tipoAula: TipoAula;
  horasMinistradas: number;
  totalAlunos: number;
  totalPresentes: number;
  totalAusentes: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
export const DIAS_SEMANA: DiaSemana[] = [
  "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO",
];

export const ABREV_DIA: Record<DiaSemana, string> = {
  SEGUNDA: "Seg", "TERÇA": "Ter", QUARTA: "Qua",
  QUINTA: "Qui", SEXTA: "Sex", "SÁBADO": "Sáb", DOMINGO: "Dom",
};

export const TIPO_LABEL: Record<TipoAula, string> = {
  AULA: "Aula",
  "REUNIÃO": "Reunião",
  AULA_SUBSTITUTA: "Substituta",
};
