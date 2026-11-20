# Entrega técnica — Aleixo Fretes

Site institucional de página única com HTML, CSS e JavaScript nativo. O build estático gera os arquivos de publicação em `dist/`. A entrega foi verificada localmente e a publicação aguarda autorização.

## Auditoria final

| Item | Resultado |
| --- | --- |
| 1. Identidade visual | Paleta verde, branca e grafite; tipografia do sistema, hierarquia editorial e composições distintas para serviços, diferenciais e processo. Hero conferido visualmente em mobile e desktop. |
| 2. Hero | Imagem provisória em WebP, com duas larguras, dimensões explícitas, prioridade alta e recortes ajustáveis em configuração. A substituição está documentada no README. |
| 3. Navegação | Header, faixa de confiança, âncoras, botões e rodapé revisados. No Chrome, o menu abriu por teclado, aceitou Tab e fechou com Escape devolvendo o foco ao acionador. |
| 4. Serviços | Mudanças residenciais, mudanças de casas e apartamentos, fretes, carretos e transportes. Diferenciais de embalagem de móveis e atendimento 24 horas. |
| 5. Orçamento | Sete campos, validação por campo, foco no primeiro erro e mensagem codificada. A navegação para `wa.me` foi interceptada localmente e o conteúdo foi conferido com dados de teste. |
| 6. WhatsApp ausente | Na configuração atual, o formulário fica oculto e o contato oferece o Instagram oficial. A entrega da mensagem no aplicativo depende do número confirmado. |
| 7. Instagram | O endereço fornecido no briefing é usado nos links e no `sameAs` do JSON-LD. |
| 8. Google Maps | Link ausente na configuração atual. O teste de ativação usou uma URL de Maps de teste. O destino da empresa segue pendente. |
| 9. Prova visual | Galeria e depoimentos ausentes por padrão. A renderização em teste confirmou imagem com texto alternativo, carregamento sob demanda e publicação de depoimento somente com autorização explícita. |
| 10. Fatos comerciais | Revisão do conteúdo contra o briefing. Cidade, endereço, preços, estatísticas, certificações e garantias seguem fora da página. |
| 11. SEO técnico | Title, description, H1 único, H2/H3, Open Graph, Twitter Cards, favicon, manifest e JSON-LD `MovingCompany`. Build com domínio de teste confirmou canonical, compartilhamento, sitemap e referência no robots.txt. |
| 12. SEO local | Sem dados locais presumidos no HTML ou schema. Pendências registradas em PENDENCIAS-CLIENTE.md. |
| 13. FAQ | Sete respostas factuais no HTML, com acordeão nativo e links para serviços e orçamento. O Google encerrou o resultado enriquecido de FAQ, e a página mantém as respostas sem `FAQPage`. [Google Search Central](https://developers.google.com/search/updates#may-2026) |
| 14. Qualidade | Verificações de segurança, teclado, foco, contraste, preferência de movimento reduzido, imagens responsivas e ausência de overflow. |
| 15. Build, lint e testes | Build e sintaxe JavaScript passaram. Testes avulsos de navegador e de saída estática passaram. O projeto não possui lint configurado nem suíte persistida. |

## Testes executados

- `npm run build` em Node.js 24 e `node --check` nos módulos do projeto.
- Prévia local por HTTP com resposta da página, MIME WebP e cabeçalhos de segurança conferidos.
- Chrome headless em 360, 390, 768, 1024 e 1440 px. Sem rolagem horizontal indesejada, erros de JavaScript ou violações de CSP. O LCP local ficou entre 52 e 216 ms, sem simulação de rede móvel. A medição real depende da hospedagem e do dispositivo.
- Foco visível, skip link, navegação mobile, FAQ, visibilidade condicional do formulário e do Maps, galeria e depoimentos, modo de movimento reduzido e geração da URL de WhatsApp. Os testes de ativação usaram dados efêmeros e interceptaram a requisição ao WhatsApp.
- Validação local da hierarquia HTML, dos destinos internos, do JSON-LD, da consistência de canonical, sitemap XML e robots.txt, e da presença do manifesto, ícones e cabeçalhos.

## Segurança e publicação

O site limita os campos e monta a mensagem no navegador para o visitante concluir o envio no WhatsApp. Não há backend de dados, armazenamento próprio dos valores do formulário, analytics ou pixels. A CSP permite os recursos da própria origem, com outros cabeçalhos definidos em `_headers`.

HTTPS, redirecionamentos, cabeçalhos finais, validação pública de SEO e teste com o WhatsApp oficial dependem da hospedagem e dos dados confirmados. A galeria e os depoimentos podem ficar ausentes até que o cliente forneça conteúdo aprovado.
