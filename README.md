# ALINVEST CRM

Plataforma de captação, relacionamento e gestão de estudantes interessados nos cursos da ALINVEST.

## Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, RLS)
- React Hook Form + Zod
- Vercel

## Segmentos iniciais
- Normas ISO
- HSEE
- Negócios / Gestão

## Princípios
- A landing page e a manifestação de interesse são públicas e não exigem conta.
- O CRM é reservado a utilizadores autenticados.
- Supabase é a fonte única de dados; não há armazenamento local ou Google Sheets em produção.
- Um contacto pode manifestar interesse em vários cursos.
- Dados pessoais e operações administrativas são protegidos por RLS.
- Segredos nunca são versionados.

## Estrutura
- `app/` — páginas e endpoints
- `components/` — componentes partilhados
- `lib/` — Supabase, validação e utilitários
- `modules/` — domínios de captação e CRM
- `supabase/migrations/` — schema e políticas
- `docs/` — arquitectura e operação

## Configuração
Ver `docs/SETUP.md` e `.env.example`.

## Desenvolvimento
`npm install` → `npm run dev`

## Build
`npm run build`
