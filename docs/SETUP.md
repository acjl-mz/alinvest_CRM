# Configuração — ALINVEST por notificações de e-mail

Não é necessário criar projecto Supabase, base de dados, Google Sheets ou contas de utilizador.

## Google Apps Script
1. Abra https://script.google.com/ e crie um projecto autónomo.
2. Copie google-apps-script/Code.gs para Code.gs.
3. Em Project Settings → Script Properties, crie ALINVEST_NOTIFICATION_EMAIL (destinatário) e ALINVEST_WEBHOOK_SECRET (chave aleatória longa).
4. Execute authorizeMail no editor e conceda a autorização de envio de e-mails.
5. Em Deploy → New deployment → Web app, escolha executar como a sua conta e disponibilize o acesso ao endpoint.
6. Copie o URL do Web App terminado em /exec.

O script apenas valida o pedido e envia o e-mail. Não cria folhas de cálculo nem guarda contactos.

## Vercel
Configure ALINVEST_EMAIL_WEBHOOK_URL (URL /exec) e ALINVEST_WEBHOOK_SECRET (o mesmo segredo). São variáveis exclusivamente de servidor; não use NEXT_PUBLIC_ e não coloque segredos no GitHub. Depois de guardar, faça novo deployment.

## Teste
Submeta uma manifestação em /interesse e confirme a recepção no endereço configurado. Em caso de falha, consulte Executions no Apps Script e os logs da Vercel. Sempre que alterar o Apps Script, publique uma nova versão do Web App.

## Dados
Não existe persistência no site, Sheets ou base de dados. O e-mail é o registo operacional. Restrinja o acesso à caixa de correio à equipa autorizada.
