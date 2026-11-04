# Segurança e permissões

- A landing page não cria utilizadores e não inicia sessões.
- O endpoint público usa exclusivamente a chave publishable/anon do Supabase.
- A chave service_role nunca é utilizada no cliente nem armazenada neste repositório.
- A tabela leads não possui política de leitura pública.
- O visitante apenas pode inserir um novo lead com consentimento e origem landing_page.
- Um trigger interno cria os interesses no mesmo transaction do lead; a função está num schema não exposto e não pode ser chamada directamente pelos papéis públicos.
- As tabelas operacionais exigem sessão autenticada.
- O registo público de utilizadores no Supabase Auth deve permanecer desactivado. Criar contas internas manualmente.
- Antes de abrir o CRM a uma equipa maior, substituir a política genérica de utilizadores autenticados por controlo de permissões por função (admin, comercial, leitura), e adicionar limitação de pedidos / protecção anti-spam ao endpoint público.
