# AtlasHub Francophonie — /fr (V1.0 / PR)
 
## Intenção e arquitetura
- A rota `/fr` integra o repositório institucional **AtlasHub.Si**, sem criar um segundo website.
- Duas jornadas: **Ateliers** para aprendizagem e **Qualification / Diagnostic** para serviços.
- Não existem pagamentos nem reservas automáticas nesta V1. O botão recolhe **interesse** ou **pedido de conversa**.
- Preços exibidos como hipóteses de piloto não homologadas: Atelier **79 €**, appel de qualification **gratuito (20 min)**, diagnostic **390 €**, intégration sur devis.
- A linguagem de venda foi redigida em francês. Um `<main lang="fr">` sinaliza o conteúdo da rota, mas o `<html lang>` global é ainda `pt-BR`: **alinhar estratégia de internationalisation/HTML raiz antes do rollout SEO definitivo**.

## Captação e controlo
- `POST /api/fr/lead` recebe formulário em francês (interesse, país, nome, e-mail, empresa, necessidade, janela, consentimentos separados).
- Honeypot; limites de tamanho; validação estrita; origin check e UUID para deduplicação. Não recebe segredos.
- Nenhum lead é reconhecido sem HTTP 202 / `{ id, route: "human" }` do webhook configurado.
- O endpoint fica **desativado por defeito**: exige `FR_LEAD_ENABLED=true` após aprovação de RGPD, texto de privacidade, subcontratantes, retenção, transferências e segurança.
- Configurar `FR_LEAD_WEBHOOK_URL` e `FR_LEAD_WEBHOOK_TOKEN` no servidor, ou reutilizar `LEAD_WEBHOOK_URL` e `LEAD_WEBHOOK_TOKEN` **apenas após confirmar compatibilidade do contrato CRM**.
- O payload mantém campos compatíveis com o CRM da Clara e inclui `source=atlashub-francophonie`, `market`, `offerInterest`, `requestDetails`, `consentMarketing`. Verificar que o backend aceita e persiste estes metadados, além do consentimento versionado, e impede uso de marketing sem opt-in.
- Sem webhook/ativação a resposta é 503; a UI mostra alternativa para iniciar manualmente uma mensagem WhatsApp. Nenhum envio automático para WhatsApp.
- Adicionar WAF/rate limiting, retenção, retirada de consentimento, DPA com fornecedores e canal de exercício de direitos **antes de ativar recolha real**.
- O texto curto de privacidade da landing não substitui a política jurídica completa. O responsável legal, e-mail para exercício de direitos, transferências internacionais, jurisdição e preços TTC/TVA carecem de validação.

## QA antes de merge e lançamento
1. `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
2. Verificar preview `/fr` em computador e mobile, navegação e acessibilidade.
3. Testar separadamente os quatro interesses no formulário e cada país.
4. Simular webhook 202 com ID, 502 sem confirmação, 503 sem configuração.
5. Confirmar destino no CRM, idempotência, tratamento de dados e resposta humana.
6. Validar preços, moedas/impostos, T&C B2C/B2B, cancelamento, política de privacidade e linguagem jurídica francesa.
7. Ligar checkout EUR **só quando** existir oferta/checkout homologado (Hotmart ou sistema Atlas), após ensaio completo de pagamento e acesso.
8. Rever SEO, `<html lang>`, sitemap, alternates e eventual redirecionamento `/fr-fr`.
9. Autorizar merge e validar domínio real `https://atlashub.si/fr`.

## AtlasClub para mercado francófono
**Arranque:** manter a mesma plataforma técnica e criar **conteúdos em francês com acesso separado por produto**; não duplicar ClubOS/DB/checkout nesta fase.

**Depois de validação:** na Hotmart é possível ter várias áreas de membros. Criar uma área `AtlasClub Francophonie` caso seja necessário um onboarding, comunidade, suporte e Tutor 100% franceses, com produtos EUR separados e regras de acesso por turma. No Atlas ClubOS, futuro `locale=fr`, cursos e comunidades específicas com direitos segregados; manter identidade de membro única e evitar duplicação de perfis.

A contratação e publicação de cursos exigem sempre verificações próprias e não se produzem automaticamente ao publicar a landing.
