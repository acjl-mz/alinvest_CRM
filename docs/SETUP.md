# Configuração inicial

## 1. Supabase
1. Crie ou seleccione o projecto Supabase que será a fonte única de dados.
2. Abra o SQL Editor e execute integralmente `supabase/migrations/202611040001_initial_crm.sql`.
3. Em Authentication, mantenha o registo público de utilizadores desactivado.
4. Crie manualmente as contas da equipa autorizada em Authentication → Users.
5. Confirme que a Data API está habilitada para o schema public.

A política inicial permite que visitantes criem leads apenas com consentimento e estado inicial. O CRM exige sessão autenticada. As contas internas devem ser criadas apenas por administradores de confiança.

## 2. Vercel
Configure:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Não configure uma service role key no frontend nem a versione no GitHub.

## 3. GitHub / Vercel
Ligue o repositório `acjl-mz/alinvest_CRM` à Vercel, framework Next.js, root directory `.`. Deploy a partir da branch `main`.

## 4. Rotas
- `/` landing page pública
- `/interesse` formulário de manifestação de interesse
- `/admin/login` autenticação da equipa
- `/admin` CRM de interessados
- `/api/leads` endpoint público de captação

## 5. Primeira validação
1. Execute a migration no Supabase.
2. Configure as variáveis na Vercel e publique.
3. Submeta um registo de teste na landing page.
4. Confirme a criação em `leads` e `lead_interests`.
5. Entre no CRM com uma conta interna e actualize o estado do contacto.
