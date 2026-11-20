# Plano técnico — Aleixo Fretes

## Estado do repositório

A raiz contém apenas `CLAUDE.md`, lido integralmente. A pasta não está inicializada como repositório Git. Ainda não existem código do site, componentes, assets, manifesto de dependências, configuração de hospedagem ou scripts de execução, build, lint e testes. Nesta etapa, somente este documento foi criado.

## Arquitetura proposta

Site estático de página única, em português brasileiro, com HTML semântico, CSS mobile-first e JavaScript nativo em módulos. O conteúdo institucional ficará no HTML para leitura e indexação imediatas. O JavaScript cuidará do menu mobile, do formulário e da exibição de blocos condicionados à configuração. A hospedagem servirá arquivos estáticos via HTTPS. Essa estrutura dispensa framework, backend, banco de dados, painel administrativo e login.

| Caminho proposto | Responsabilidade |
| --- | --- |
| `index.html` | Página, navegação por âncoras, seções institucionais e metadados básicos. |
| `src/config/business.js` | Nome, Instagram confirmado, WhatsApp, cidade/UF, área atendida, endereço, Google Maps, domínio e referências para logo, hero, galeria e depoimentos. Usar `null` para valores pendentes e listas vazias para coleções. |
| `src/styles/main.css` | Variáveis de cor, tipografia e espaçamento, layout responsivo e estados de interação. Aplicar a paleta verde do briefing e manter foco visível e contraste adequado. |
| `src/main.js` e `src/quote-form.js` | Inicialização do menu e dos blocos condicionais, validação do formulário e preparação do link de WhatsApp. |
| `assets/images/` | Imagem provisória do hero, fotos reais otimizadas e logotipo quando disponível. |

A página terá cabeçalho e menu acessível, hero com CTA de orçamento, faixa de informações confirmadas, Sobre, Serviços, Diferenciais, Como funciona, galeria, depoimentos, bloco de orçamento, localização, FAQ e rodapé. Os CTAs levarão ao bloco de orçamento e poderão pré-selecionar o serviço. Galeria, depoimentos e localização serão exibidos quando houver conteúdo validado. A marca textual será usada até a entrega do logotipo, se existir.

## Dados pendentes e comportamento

| Dado | Tratamento |
| --- | --- |
| WhatsApp | Solicitar número com DDI e DDD. Até a confirmação, ocultar os links de WhatsApp e os campos de coleta e oferecer o Instagram oficial como contato. Com o número configurado, validar e limitar os campos do formulário, montar a mensagem com `encodeURIComponent` e abrir `wa.me`. A pessoa conclui o envio no WhatsApp. Exibir erros de validação e confirmação de preparação, sem armazenar os dados. |
| Cidade, UF e área atendida | Omitir referências locais no conteúdo, nos metadados e nos dados estruturados até confirmar a cobertura. |
| Endereço e Google Maps | Ocultar o bloco de localização até validar os dados. Incorporar o mapa somente com o link correto e publicar apenas o endereço fornecido. |
| Domínio | Manter o campo vazio. Gerar canonical, URLs absolutas de compartilhamento e sitemap na publicação após definir o domínio final. |
| Imagens reais | Usar no desenvolvimento uma foto provisória de caminhão adequado a mudanças residenciais, com licença de uso e sem atribuí-la à empresa. Centralizar o caminho para substituição e manter a galeria oculta até receber material real. |
| Depoimentos | Manter a seção oculta até confirmar que o cliente deseja publicá-la e receber os textos reais e a autorização. |

## Execução e qualidade

Para desenvolvimento, servir a raiz por HTTP local. Para conferir o HTML com metadados completos e preparar a publicação, executar `npm run build` com Node.js 24 e servir ou publicar o conteúdo de `dist/`. O build gera o JSON-LD e o robots.txt, além de canonical, URLs de compartilhamento e sitemap quando `siteUrl` estiver configurado. As pendências de publicação constam em [PENDENCIAS-CLIENTE.md](PENDENCIAS-CLIENTE.md).

Antes de publicar, verificar navegação por teclado e menu mobile, layout em 360, 390, 768 e 1024 px e em desktop amplo, links e formulário com WhatsApp configurado e ausente. Conferir a hierarquia de títulos, metadados, FAQ visível e JSON-LD de empresa de mudanças com dados confirmados. Otimizar a imagem do hero e carregar as imagens abaixo da dobra sob demanda.

A implementação pode começar com as informações confirmadas no briefing. A ativação do fluxo principal de orçamento depende do WhatsApp confirmado. Domínio, cobertura, localização, fotos, logo e depoimentos podem ser definidos em paralelo, conforme a disponibilidade do cliente.

## Cabeçalhos e HTTPS

O build copia `_headers` para `dist/`. Em hospedagem compatível com esse formato, como Cloudflare Pages, o arquivo é usado para enviar CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy e X-Frame-Options. Em outros provedores, aplique os mesmos valores na configuração de headers HTTP do serviço. Ative o certificado e o redirecionamento HTTP para HTTPS na hospedagem e verifique os cabeçalhos na resposta pública. [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/)

A política carrega CSS, JavaScript, imagens e manifest da própria origem. Mantenha as imagens reais da galeria em `assets/images/`. Instagram, WhatsApp e Google Maps são links de saída. Uma futura incorporação do Maps precisará de uma regra de CSP específica para o iframe. A política bloqueia envio nativo de formulário, e o fluxo atual abre o WhatsApp por navegação.
