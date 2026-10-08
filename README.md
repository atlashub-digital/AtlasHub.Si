# AtlasHub.Si

Site institucional AtlasHub, com áreas de atuação, casos de aplicação e o diagnóstico guiado Clara.

## Tecnologia e desenvolvimento

Next.js 16 App Router, React 19, TypeScript e Node.js 24.x. Fontes alojadas no próprio site (Inter, Figtree e Barlow Semi Condensed): o build não depende do Google Fonts. A apresentação aprovada é preservada em componentes; a Clara funciona no cliente e o endpoint de contactos no servidor.

```sh
npm ci
npm run dev
```

Qualidade: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build`. Produção local: `npm start`.

## Linguagem visual nas restantes páginas

Tudo o que não é ecrã 1:1 (versão móvel < 900 px, Clara, laboratório, rodapé) segue a linguagem das maquetes através de `app/theme.css` (carregado depois de `globals.css` e `tokens.css`; nunca toca nas classes `.mk-*`): Figtree no texto, Barlow Semi Condensed na navegação e nos botões, botões em pílula ciano `#16D8ED` com texto escuro, pílulas com contorno ciano, cartões com borda fina e brilho azul, eyebrows em maiúsculas espaçadas, números de etapa em círculos com brilho e entradas em fade/rise (respeitam `prefers-reduced-motion`). Destinos ainda sem página própria vão para o WhatsApp oficial (+55 62 99190-3462).

## Visual Pack V1 — ecrãs 1:1 com as maquetes

Em ecrãs com pelo menos 900 px de largura, a home (`/`), `/solucoes/enterprise-transformation` e `/solucoes/ai-workforce` mostram as maquetes aprovadas reproduzidas 1:1:

- **Fundo** (`public/mockups/*.webp`): a própria maquete, com o texto removido.
- **Texto real por cima** (`lib/mockups/*.json`): cada linha tem tipo de letra, tamanho, posição e cor medidos na maquete. Usa Figtree e Barlow Semi Condensed, alojadas em `public/fonts` (OFL).
- **Links reais** nas zonas clicáveis (navegação, CTAs, cartões, simuladores do app).
- **Escala**: tudo escala com a largura através de container queries, por isso a composição mantém-se idêntica de 900 a 1920 px.

Abaixo dos 900 px continua o site responsivo. A Clara (`#clara`) e o rodapé são partilhados pelas duas versões.

O componente está em `components/MockupCanvas.tsx` e os estilos em `app/mockup.css`. Os dados mostrados são os da maquete e destinam-se a apresentação a clientes como simulação. Para regenerar a partir de uma maquete nova, ver `design/visual-pack-v1/fidelity/README.md`.

## Publicação

Consultar [DEPLOYMENT.md](DEPLOYMENT.md) para Vercel, variáveis de ambiente, contrato da API e validação. A homepage e o simulador não exigem credenciais. A entrega real de contactos exige um destino autenticado e configurado.

O desenvolvimento é publicado no main de atlashub-digital/AtlasHub.Si. Editions permanece uma aplicação independente.
