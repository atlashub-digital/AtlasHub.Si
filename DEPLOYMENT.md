# Publicação e ligação da Clara

A landing e a simulação funcionam num alojamento estático. O formulário usa exclusivamente **POST /api/lead** na mesma origem. Sucesso: **202** com **{ id, route: "human" }**. A implementação atual não agenda nem consulta CRM/agenda. `meeting_url` é null; não existem ligações para clara.atlashub.si, chatclara.atlashub.si ou agenda.atlashub.si.

`api/lead.js` é uma função Node compatível com Vercel (Node >=22). Para receção real, definir no servidor LEAD_WEBHOOK_URL (HTTPS), LEAD_WEBHOOK_TOKEN e PUBLIC_ORIGIN. O webhook é o adaptador de persistência/entrega; não fica exposto no browser. Validar e deduplicar requestId, persistir lead/consentimento/diagnóstico e só então devolver 202 {id,route:"human"}. O endpoint devolve 503 se não houver destino configurado, 502 em falha do destino e nunca inventa receção. O browser não mostra sucesso sem o contrato completo.

Para reuniões, o formulário exige janela preferida. O pedido é sempre humano; reunião depende de confirmação posterior por WhatsApp/email. Os contactos comerciais continuam null em clara-config.json porque o utilizador ainda não forneceu valores verificáveis. Não preencher com contactos de NexTrustX ou contas pessoais.

Antes da ativação real: configurar rate limiting/antiabuso no gateway, responsável pela retenção/eliminação, aviso de privacidade e testar entrega ponta a ponta. Origin e honeypot não substituem proteção contra bots. `npm test` testa validação e respostas com mocks, sem enviar leads. A preview `python -m http.server 3104` serve o simulador, mas não executa a função Node; o envio requer o alojamento de funções.

O diagnóstico pode ser concluído e descarregado sem contactos. A Clara é uma simulação guiada por regras. Para conversação LLM e execução n8n reais, adicionar credenciais, fontes aprovadas, avaliação e limites específicos por processo.
