# AtlasHub — Assets oficiais e maquetes V1

## Organização desejada
```
assets/
  brand/
    Logo_Oficial_AtlasHub.png
  screens/
    01_site_home.png
    02_enterprise_transformation.png
    03_ai_workforce.png
    04_agent_library.png
    05_app_dashboard.png
    06_clara_agent_detail.png
    07_missions_operations.png
    08_editions_knowledge.png
  concepts/
    AtlasHub_SI_Homepage_Conceito.png
    App_AtlasHub_SI_Dashboard_Conceito.png
```

## Procedimento de importação
1. Obter da direção o ZIP visual gerado juntamente com este pack.
2. Extrair para esta pasta mantendo `brand/`, `screens/` e `concepts/`.
3. Confirmar que existem 11 PNGs, proporções corretas e nenhum ficheiro corrompido.
4. Conferir SHA256 com `assets/SHA256SUMS.txt` gerado no ZIP, depois `sha256sum -c assets/SHA256SUMS.txt` a partir da raiz do visual pack.
5. Criar commit só dos binários revistos e abrir PR separada ou atualizar a PR de design.
6. Se os binários não estiverem no GitHub, o Claude Code deve solicitar o ZIP em vez de usar os mockups como imagens de produção.

## Importante
As maquetes são **referências de composição**. Textos gerados por IA podem estar incorretos. Nomes, métricas e percentagens não são dados reais. Nunca copiar/recortar o logo gerado na maquete; usar o ficheiro oficial.

O conector usado para criar o PR de especificação suporta ficheiros UTF-8. A transferência dos PNGs será confirmada por um commit separado, não inferida a partir dos screenshots visíveis nesta conversa.
