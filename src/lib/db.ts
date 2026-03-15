// ─────────────────────────────────────────────────────────────────────────────
// db.ts — conexão PostgreSQL server-side (equivalente ao ConexaoBD.java)
//
// Usa a biblioteca `postgres` (postgres.js), que é mais idiomática para
// Next.js do que o JDBC/HikariCP do Java.
//
// O fallback de porta 5432 → 6543 do Java é resolvido aqui via DATABASE_URL:
//   - Em produção (Vercel): use a URL do pooler (porta 6543) na env var.
//   - Em desenvolvimento local: pode usar 5432 direta se não houver firewall.
//
// Esta instância é um SINGLETON. O Next.js mantém o módulo em cache entre
// requests no mesmo processo, então o pool é reutilizado.
// ─────────────────────────────────────────────────────────────────────────────

import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não definida. Copie .env.local.example para .env.local e preencha."
  );
}

// Declaração global para evitar múltiplas conexões em dev (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var _sql: ReturnType<typeof postgres> | undefined;
}

function createConnection() {
  return postgres(connectionString, {
    max: 10,           // tamanho do pool (equivalente ao HikariCP maxPoolSize)
    idle_timeout: 30,  // segundos até fechar conexões ociosas
    connect_timeout: 15,
    ssl: "require",    // equivalente ao sslmode=require do Java
    prepare: false,    // necessário para o pooler do Supabase (pgBouncer)
    // prepare: false é OBRIGATÓRIO ao usar a porta 6543 (transaction mode)
    // No Java isso era transparente pois o HikariCP lidava com isso
  });
}

// Em desenvolvimento, reutiliza a instância entre hot reloads
export const sql =
  process.env.NODE_ENV === "development"
    ? (global._sql ?? (global._sql = createConnection()))
    : createConnection();

export default sql;
