# 🌐 OficinaAdmin — Web

Versão web do painel de gestão **Oficina do Amanhã**, construída com **Next.js 15 + TypeScript + Tailwind CSS**.

Substitui o app JavaFX (Windows-only) por uma aplicação web que roda em qualquer navegador — incluindo os Chromebooks do projeto.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) + React 19 |
| Linguagem | TypeScript 5 |
| Estilos | Tailwind CSS 3 |
| Banco de dados | PostgreSQL via Supabase (mesmo BD do app Java) |
| Auth | Supabase Auth + cookies httpOnly |
| Estado | Zustand (sessão) |
| Deploy | Vercel (gratuito) |

---

## Setup local

### 1. Clone e instale as dependências

```bash
git clone https://github.com/seu-usuario/oficina-admin-web
cd oficina-admin-web
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Abra `.env.local` e preencha:

```env
# Pooler do Supabase (porta 6543 — funciona em redes escolares)
DATABASE_URL=postgresql://postgres.SEU_ID:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require

# Chaves do Supabase (Settings > API no painel do Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://SEU_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Segredo para cookies (gere com: openssl rand -base64 32)
AUTH_SECRET=seu_segredo_aqui
```

> ⚠️ **Nunca commite `.env.local`** — ele está no `.gitignore`.

### 3. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## Deploy na Vercel

1. Faça push para o GitHub
2. Importe o repositório na [Vercel](https://vercel.com)
3. Adicione as variáveis de ambiente no painel da Vercel
4. Deploy automático a cada push na `main`

> Use a URL do **pooler (6543)** no `DATABASE_URL` da Vercel — a porta 5432 pode ser bloqueada na infraestrutura da Vercel.

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/login/          # Tela de login
│   ├── (dashboard)/           # Layout com sidebar + todas as páginas
│   │   ├── escolas/           # ✅ Implementado (Fase 1)
│   │   ├── turmas/            # 🔄 Fase 2
│   │   ├── alunos/            # 🔄 Fase 2
│   │   ├── professores/       # 🔄 Fase 2
│   │   ├── cronograma/        # 🔄 Fase 3
│   │   ├── chamada/           # 🔄 Fase 3
│   │   ├── diario/            # 🔄 Fase 3
│   │   └── horas/             # 🔄 Fase 3
│   └── api/
│       ├── auth/login/        # POST (login) / DELETE (logout)
│       ├── escolas/           # GET, POST, PATCH/:id, DELETE/:id
│       └── ...                # demais rotas (Fase 2+)
├── components/
│   └── ui/                    # Button, Input, Select, Table, SidePanel, Badge, Modal...
├── hooks/
│   └── useEscolas.ts          # ✅ Hook de dados para escolas
├── lib/
│   ├── db.ts                  # Conexão PostgreSQL (postgres.js)
│   ├── supabase.ts            # Clientes Supabase (browser / server / admin)
│   ├── types.ts               # Tipos TypeScript (espelha o pacote core/ Java)
│   └── utils.ts               # cn(), formatDate(), formatHoras(), emailBase()...
├── middleware.ts              # Proteção de rotas (redireciona para /login)
└── store/
    └── session.ts             # Estado global da sessão (Zustand)
```

---

## Correspondência Java → TypeScript

| Java | TypeScript / Next.js |
|---|---|
| `ConexaoBD.java` (HikariCP) | `src/lib/db.ts` (postgres.js pool) |
| `SupabaseAuthDAO.java` | `src/lib/supabase.ts` + SDK oficial |
| `AutenticacaoDAO.java` | `src/app/api/auth/login/route.ts` |
| `EscolasDAO.java` | `src/app/api/escolas/route.ts` |
| `MainFX.java` (sessão, RBAC) | `src/store/session.ts` + middleware |
| `LoginFX.java` | `src/app/(auth)/login/page.tsx` |
| `EscolasView.java` | `src/app/(dashboard)/escolas/page.tsx` |
| `core/Escola.java` etc. | `src/lib/types.ts` |

---

## Parte da plataforma

```
Oficina do Amanhã
├── OficinaAdmin Web  ← você está aqui
├── OficinaAdmin Java ← legado (será descontinuado)
└── OficinaCode       ← ambiente do aluno (Tauri/Rust — independente)
```
