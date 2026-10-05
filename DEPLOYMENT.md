# AtlasHub.Si — Next.js e publicação

Next.js 16 App Router, React 19, TypeScript e Node.js 24.x. Landing em Server Components; Clara e interações em Client Components. Imagens em public/assets, API em app/api/lead/route.ts. A Clara é uma simulação guiada por regras.

## Local e validação

Executar npm ci, npm run typecheck, npm run lint, npm test e npm run build. Produção local: npm start. Desenvolvimento: npm run dev -- --port 3104. O antigo servidor Python já não serve a aplicação. Os testes de entrega usam mocks e não enviam contactos reais.

## Vercel

Importar o repositório, Production Branch main, Root Directory na raiz, Framework Preset Next.js. Instalação npm ci, build npm run build, Output Directory padrão Next.js. Retirar overrides anteriores de Other, diretório ponto ou build vazio. O vercel.json identifica o framework; o package.json fixa Node 24.x.

Validar o preview em desktop e telemóvel, oito entradas da Clara, diagnóstico descarregável, âncoras e estados do formulário. Depois associar atlashub.si e configurar o DNS indicado pela Vercel. Um commit no GitHub não confirma o deploy nem a resolução do domínio.

## Contactos e entrega

O browser usa exclusivamente POST /api/lead na mesma origem. Sucesso: 202 com { id, route: "human" }. meeting_url é null. Recolhe a janela preferida; a reunião depende de confirmação posterior por WhatsApp/email. Não há ligações para subdomínios Clara ou agenda inativos.

Variáveis de servidor: LEAD_WEBHOOK_URL (HTTPS), LEAD_WEBHOOK_TOKEN e PUBLIC_ORIGIN (origem exata, sem barra final, por exemplo https://atlashub.si). Para testar o formulário num preview, configurar a origem exata desse preview e um destino de teste nesse ambiente.

O webhook deve deduplicar requestId, guardar lead, consentimento e diagnóstico e só depois devolver 202 {id,route:"human"}. Sem configuração, a API devolve 503; se o destino não confirmar, 502. A Clara não inventa receção, encaminhamento, consulta a CRM/agenda nem marcação.

WhatsApp oficial: +55 62 99190-3462, configurado em public/clara-config.json. O email continua por definir. O contacto WhatsApp funciona sem webhook e só envia a mensagem após ação do visitante. O formulário de entrega automática só é apresentado quando LEAD_WEBHOOK_URL e LEAD_WEBHOOK_TOKEN estão definidos no build; após os configurar, fazer novo deploy. Nunca colocar tokens nesse ficheiro público. LEAD_WEBHOOK_TOKEN fica apenas nas variáveis de servidor da Vercel.

Antes de ativar a recolha real: configurar rate limiting/antiabuso, responsável por retenção/eliminação, aviso de privacidade e validar entrega ponta a ponta. Origin e honeypot não substituem proteção contra bots.

## Contribuição futura

Main de desenvolvimento: nexflowx-hub/AtlasHub.Si. Produção segue por contribuição e PR para atlashub-digital, merge após checks e deploy na Vercel atlashub1, sem substituir histórico nem fazer force push. Editions continua num repositório e projeto Vercel separado.

