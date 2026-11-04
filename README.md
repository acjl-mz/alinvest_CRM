# ALINVEST CRM

Plataforma de captação, relacionamento e gestão de estudantes interessados nos cursos da ALINVEST.

## Stack
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, RLS)
- Zod
- Vercel

## Segmentos iniciais
- Normas ISO
- HSEE
- Negócios / Gestão

## Funcionalidades iniciais
- Landing page pública
- Formulário de manifestação de interesse sem conta
- Captação de vários segmentos por contacto
- CRM autenticado com pesquisa, filtros e actualização de estado
- Registo de interesses por segmento
- Estrutura de base para cursos, actividades e atribuição de responsáveis

## Princípios
- Supabase é a fonte única de dados.
- Não há armazenamento local nem Google Sheets em produção.
- Dados públicos só podem ser inseridos como novos interessados com consentimento.
- O CRM exige autenticação.
- Segredos nunca são versionados.

## Estrutura
- `app/` — páginas e endpoints
- `components/` — componentes partilhados
- `lib/` — Supabase e utilitários
- `modules/` — domínios funcionais (evolução)
- `supabase/migrations/` — schema, seeds e RLS
- `docs/` — arquitectura e operação

## Configuração
Ver [docs/SETUP.md](docs/SETUP.md) e [.env.example](.env.example).

## Desenvolvimento
`npm install` → `npm run dev`

## Build
`npm run build`
