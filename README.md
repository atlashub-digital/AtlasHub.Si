# AtlasHub.Si

Site institucional AtlasHub, com áreas de atuação, casos de aplicação e o diagnóstico guiado Clara.

## Tecnologia e desenvolvimento

Next.js 16 App Router, React 19, TypeScript e Node.js 24.x. A apresentação aprovada é preservada em componentes; a Clara funciona no cliente e o endpoint de contactos no servidor.

```sh
npm ci
npm run dev
```

Qualidade: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build`. Produção local: `npm start`.

## Publicação

Consultar [DEPLOYMENT.md](DEPLOYMENT.md) para Vercel, variáveis de ambiente, contrato da API e validação. A homepage e o simulador não exigem credenciais. A entrega real de contactos exige um destino autenticado e configurado.

O desenvolvimento é publicado no main de nexflowx-hub/AtlasHub.Si. A contribuição para atlashub-digital será uma etapa posterior, por pull request. Editions permanece uma aplicação independente.
