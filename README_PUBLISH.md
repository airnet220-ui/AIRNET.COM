# Publicação do site AirNet

Este repositório contém um site estático em HTML, CSS e JavaScript.

## 🚀 Novas Funcionalidades

### 📱 Canal WhatsApp Integrado
- **Página dedicada**: `canal-whatsapp.html`
- **Link direto**: https://whatsapp.com/channel/0029VbCHgsNAInPdXh5l8k1M
- **Botão flutuante**: Disponível na página inicial
- **Menu de navegação**: Link "WhatsApp" em todas as páginas

#### Funcionalidades do Canal:
- ✅ Visualizar posts recentes do canal
- ✅ Compartilhar mensagens diretamente no WhatsApp
- ✅ Estatísticas do canal (seguidores, posts)
- ✅ Simulação de sincronização bidirecional
- ✅ Links diretos para o canal oficial

## Como tornar o site disponível no Chrome

### 1. Abrir localmente
1. Abra a pasta `AirNet--Startap` no Explorador de Ficheiros.
2. Clique duas vezes em `Index.html`.
3. O Chrome irá abrir o site localmente.

> Observação: desta forma o site funciona apenas no seu computador.

### 2. Publicar no GitHub Pages (recomendado)

1. Crie uma conta no GitHub (se ainda não tiver).
2. Crie um novo repositório.
3. No seu computador, abra uma linha de comandos na pasta do projeto.
4. Execute os comandos abaixo (se tiver `git` instalado):

```bash
git init
git add .
git commit -m "Publicar site AirNet"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

5. No GitHub, vá ao repositório > Settings > Pages.
6. Selecione a branch `main` e a pasta `root` e clique em `Save`.
7. Aguarde alguns minutos. O GitHub Pages mostrará a URL do site.

### 3. Usar Netlify ou Vercel

- Netlify: `https://www.netlify.com/`
- Vercel: `https://vercel.com/`

Estes serviços permitem publicar sites estáticos diretamente do repositório.

### 4. Nota importante

Neste ambiente eu não consigo publicar automaticamente, porque não tenho acesso ao `git` ou a uma conta de deploy. Mas o site já está pronto no ficheiro local e pode ser publicado seguindo os passos acima.

## 📱 Sobre a Integração WhatsApp

A página `canal-whatsapp.html` simula uma integração completa com o canal do WhatsApp. Para uma integração real bidirecional, seria necessário:

1. **WhatsApp Business API** (aprovada pela Meta)
2. **Webhook** para receber mensagens
3. **Backend** para processar e armazenar posts
4. **Autenticação** e segurança adequada

A versão atual oferece uma experiência interativa e demonstra como funcionaria uma integração real.




