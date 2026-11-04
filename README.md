# ALINVEST — Captação de Formandos

Landing page e formulário de manifestação de interesse para os três segmentos de formação:
- Normas ISO
- HSEE
- Negócios / Gestão

## Arquitectura simples: notificação por e-mail
- Next.js 15, React 19 e TypeScript.
- Vercel para alojamento.
- Google Apps Script Web App para encaminhar notificações através do Gmail.
- Sem Supabase, base de dados, autenticação, Google Sheets ou armazenamento de leads.

## Funcionamento
1. O visitante preenche o formulário em /interesse.
2. O endpoint /api/leads valida os dados.
3. O endpoint envia os dados ao Apps Script com um segredo de servidor.
4. O Apps Script valida o segredo e envia uma notificação para o endereço ALINVEST configurado.
5. O visitante recebe a confirmação de envio.

O e-mail é o registo operacional da manifestação de interesse. A aplicação não mantém cópias dos dados.

## Configuração
Consultar docs/SETUP.md. As variáveis necessárias são ALINVEST_EMAIL_WEBHOOK_URL e ALINVEST_WEBHOOK_SECRET.
