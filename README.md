# Coonto Alpha

Plataforma interativa de aprendizagem e literatura. O vertical slice atual do Alpha é focado na obra **O Alienista**, de Machado de Assis.

- **Ambiente de Produção (Principal)**: [https://coonto.com](https://coonto.com)
- **Ambiente de Desenvolvimento (Dev/Testes)**: [https://dev.coonto.com](https://dev.coonto.com)
- **Ambiente Main (Em Construção)**: [https://main.coonto.com](https://main.coonto.com)
- **Domínios com Redirecionamento**: `coonto.co` e `coonto.com.br` redirecionam permanentemente para `https://coonto.com`.
- **Repositório Oficial**: [https://github.com/amguarizo/coonto](https://github.com/amguarizo/coonto)

---

## 📌 Estrutura de Branches & Fluxo de Trabalho

O projeto adota o seguinte modelo de branching:

```text
feature/* ──► develop ──► dev.coonto.com ──► homologação ──► main ──► deploy automático ──► coonto.com
```

- **`main`**: Versão estável e publicada. O conteúdo desta branch reflete exatamente o que está rodando em produção (`https://coonto.com`).
- **`develop`**: Versão em evolução contínua. Publicada automaticamente em (`https://dev.coonto.com`).
- **`feature/*`**: Branches de curta duração para desenvolvimento isolado (ex: `feature/audio`, `feature/mapa`, `feature/engine`).

---

## 🚀 Execução Local

O projeto atual roda diretamente no navegador, podendo ser servido por qualquer servidor HTTP estático:

### Usando o script batch (Windows):
Dê um duplo clique no arquivo `INICIAR_COONTO.bat` ou execute no terminal:
```cmd
INICIAR_COONTO.bat
```

### Usando Python:
```bash
python -m http.server 8080
```
Acesse em: `http://localhost:8080`

### Usando Node.js / npx:
```bash
npx serve .
```

---

## 🏗️ Estrutura do Repositório

```text
coonto/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de deploy automático (CI/CD)
├── assets/
│   └── images/                 # Imagens históricas e narrativas
├── docs/                       # Documentação técnica e de produto
│   ├── product/                # Visão e objetivos
│   ├── architecture/           # Learning Engine, deploy e infra
│   ├── narrative/              # Roteiro e ramificações de O Alienista
│   └── ux/                     # Diretrizes visuais e mapa de decisões
├── index.html                  # Interface do Alpha v0.3
├── styles.css                  # Estilos do Alpha
├── app.js                      # Mecânica narrativa e lógica do vertical slice
├── nginx-alpha.coonto.com.br.conf # Modelo de configuração Nginx para Ubuntu
└── README.md                   # Este arquivo
```

---

## 🚢 Deploy para `coonto.com`

### 1. Deploy Automático (GitHub Actions)
O repositório conta com o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) acionado a cada `push` na branch `main`.

Para ativá-lo, cadastre as seguintes variáveis em **Settings > Secrets and variables > Actions** no repositório:
- `SERVER_HOST`: IP público do servidor Ubuntu.
- `SERVER_USER`: Usuário de acesso SSH (ex: `ubuntu`).
- `SSH_PRIVATE_KEY`: Chave privada SSH autorizada no servidor.
- `DEPLOY_PATH`: Diretório raiz do site no servidor (ex: `/var/www/alpha.coonto.com.br`).

### 2. Deploy Manual no Servidor Ubuntu
Consulte o guia completo em [`docs/architecture/deploy.md`](docs/architecture/deploy.md) e [`Coonto_Deploy_Ubuntu_Instrucoes.md`](Coonto_Deploy_Ubuntu_Instrucoes.md).

---

## 📚 Documentação Adicional

- [Visão do Produto](docs/product/visao.md)
- [Arquitetura do Learning Engine](docs/architecture/learning-engine.md)
- [Guia de Deploy e Infraestrutura](docs/architecture/deploy.md)
- [Roteiro Narrativo: O Alienista](docs/narrative/o-alienista.md)
- [Diretrizes de UX e Design (v0.3)](docs/ux/alpha-v0.3.md)
