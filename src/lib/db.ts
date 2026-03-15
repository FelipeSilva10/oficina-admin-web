import postgres from "postgres";
import path from "path";
import fs from "fs";

declare global {
  // eslint-disable-next-line no-var
  var _sql: ReturnType<typeof postgres> | undefined;
}

// Lê o .env.local manualmente do diretório do projeto
// Necessário porque o Next.js detecta /home/felipe/ como workspace root
// e pode carregar o .env.local errado
function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    // Só define se ainda não estiver definida (não sobrescreve vars reais)
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

function createConnection() {
  // Garante que as variáveis do projeto estão carregadas
  loadEnvFile();

  const host = process.env.DB_HOST ?? "aws-0-sa-east-1.pooler.supabase.com";
  const port = Number(process.env.DB_PORT ?? "6543");
  const user = process.env.DB_USER ?? "";
  const pass = process.env.DB_PASS ?? "";
  const db   = process.env.DB_NAME ?? "postgres";

  // Log para diagnóstico (remova após confirmar que funciona)
  console.log("[db] host:", host);
  console.log("[db] port:", port);
  console.log("[db] user:", user);
  console.log("[db] pass definida:", pass.length > 0);
  console.log("[db] cwd:", process.cwd());

  if (!user || !pass) {
    throw new Error(
      "Credenciais de banco não encontradas.\n" +
      `CWD: ${process.cwd()}\n` +
      "Verifique se o .env.local está na raiz do projeto com DB_USER e DB_PASS definidos."
    );
  }

  return postgres({
    host,
    port,
    user,
    password: pass,
    database: db,
    max: 10,
    idle_timeout: 30,
    connect_timeout: 15,
    ssl: "require",
    prepare: false,
  });
}

export const sql =
  process.env.NODE_ENV === "development"
    ? (global._sql ?? (global._sql = createConnection()))
    : createConnection();

export default sql;