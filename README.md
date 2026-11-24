# Aleixo Fretes

Site institucional estático em português brasileiro para apresentar os serviços da Aleixo Fretes e facilitar pedidos de orçamento.

## Instalação e prévia local

Use Node.js 24 com npm. O projeto usa HTML, CSS e JavaScript nativo, sem dependências npm para instalar.

Na raiz da pasta, execute:

```sh
npm run build
npm run preview
```

Abra [http://127.0.0.1:4173](http://127.0.0.1:4173). Use Ctrl+C para encerrar a prévia. Execute o build novamente depois de editar os arquivos. No PowerShell, se a política local bloquear `npm.ps1`, substitua `npm` por `npm.cmd`.

## Build para entrega

`npm run build` cria `dist/` com a página, CSS, módulos, imagens, favicon, manifest, `robots.txt` e `_headers`. Com o domínio definitivo configurado, gera também `sitemap.xml`, canonical e as URLs absolutas de compartilhamento. A prévia serve a saída do build com os cabeçalhos HTTP do projeto.

A hospedagem final deve servir o conteúdo de `dist/` na raiz HTTPS e encaminhar as variantes de protocolo e host para a URL canônica. Aplique os valores de `_headers` na configuração do provedor quando ele usar outro formato. Consulte [PLANO.md](docs/PLANO.md) para os detalhes dos cabeçalhos.

## Substituir a fotografia do hero

1. Coloque a foto real em `assets/images/`. Exporte uma versão WebP ampla e, se disponível, uma versão menor com a mesma proporção. Use nomes descritivos, sem espaços.
2. Em `src/config/business.js`, atualize `heroImage.path`, `width` e `height` com o arquivo e as dimensões reais. Em `small`, informe `path` e `width` da versão menor. Se só houver uma versão, use `small: null`.
3. Ajuste `desktopPosition` e `mobilePosition` para manter o caminhão no enquadramento. Em `index.html`, atualize o `alt` de `#hero-image` para descrever a foto e retire a legenda provisória quando usar a foto real.
4. Atualize `socialImagePath` para uma imagem de compartilhamento aprovada. O build usa o texto alternativo do hero para a imagem social, então escolha uma versão representativa da mesma foto.
5. Rode o build e confira o recorte e o contraste na prévia em celular e desktop.

As imagens ilustrativas geradas para os serviços, a embalagem e a chamada de orçamento estão em `assets/images/editorial/`. Para substituí-las, atualize os caminhos das imagens no `index.html` e revise o enquadramento e os textos alternativos quando aplicável. A fonte Sora e sua licença estão em `assets/fonts/`.

## Alterar dados da empresa

Edite `src/config/business.js`. Use o endereço HTTPS definitivo da página inicial em `siteUrl`. Para configurar os botões de orçamento, informe `whatsappNumber` com DDI, DDD e número, apenas dígitos. `googleMapsUrl` habilita o link de localização. `instagramUrl` alimenta os links e o schema.

Para atualizar a galeria, adicione as mídias em `assets/` e edite os itens da seção `#galeria` no `index.html`. Use texto alternativo nas fotos e um título nos vídeos.

Em `testimonials`, use o texto aprovado em `quote`, a atribuição aprovada em `author`, se houver, e `authorized: true` após autorização. A seção de depoimentos aparece quando há conteúdo aprovado.

Os campos locais reservados serão incorporados ao conteúdo e ao JSON-LD após a validação dos dados públicos. Veja [PENDENCIAS-CLIENTE.md](docs/PENDENCIAS-CLIENTE.md) e [ENTREGA.md](docs/ENTREGA.md).
