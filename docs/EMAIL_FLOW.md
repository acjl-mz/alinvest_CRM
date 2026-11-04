# Fluxo de notificações ALINVEST

O canal utiliza a landing page, o endpoint Next.js e um Web App do Google Apps Script.

1. O estudante submete o formulário e aceita o tratamento dos dados para resposta ao pedido.
2. O servidor valida o formulário e envia o conteúdo ao Web App com uma chave privada.
3. O Apps Script verifica a chave e os segmentos seleccionados.
4. O Gmail envia uma mensagem formatada para o endereço ALINVEST definido nas Script Properties.
5. O e-mail recebido constitui o registo operacional. A aplicação não guarda o contacto.

Não há base de dados, autenticação, área de gestão, nem folha de cálculo.

## Configuração necessária
- Vercel: ALINVEST_EMAIL_WEBHOOK_URL e ALINVEST_WEBHOOK_SECRET.
- Apps Script: ALINVEST_NOTIFICATION_EMAIL e ALINVEST_WEBHOOK_SECRET.
\n## Links de campanhas\n- /interesse/normas-iso\n- /interesse/hsee\n- /interesse/negocios-gestao\n\nO segmento de origem é encaminhado no campo campaign_segment e incluído na notificação por e-mail, separadamente das outras áreas de interesse que o estudante possa seleccionar.\n