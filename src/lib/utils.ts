import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Combina classes Tailwind com resolução de conflitos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata data ISO → dd/MM/yyyy (equivalente ao FMT_BR do Java)
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  try {
    return format(parseISO(isoDate), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return isoDate;
  }
}

// Formata horas decimais → "2h 30min" (equivalente ao formatarHoras do Java)
export function formatHoras(horas: number): string {
  const totalMin = Math.round(horas * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

// Formata porcentagem de presença
export function formatPresenca(presentes: number, total: number): string {
  if (total === 0) return "—";
  return `${presentes}/${total} (${Math.round((presentes / total) * 100)}%)`;
}

// Normaliza nome → base de email (equivalente ao emailBase() do AlunosView.java)
export function emailBase(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "");
}
