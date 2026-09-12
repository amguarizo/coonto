# Infraestrutura e Deploy do Coonto (Produção, Dev e Main)

## Visão Geral da Infraestrutura

Os ambientes estão hospedados no mesmo servidor Ubuntu LTS utilizando **Caddy** (via Docker `altdesk_caddy`) como Proxy Reverso com gerenciamento automático de certificados SSL (Let's Encrypt):

| Ambiente | Domínio Público | Branch Git / Origem | Workflow GitHub Actions | Caminho no Host (VPS) | Caminho no Container Caddy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Produção (Principal)** | `https://coonto.com` | `main` | `.github/workflows/deploy.yml` | `/opt/altdesk/deploy/static/coonto-alpha` | `/var/www/static/coonto-alpha` |
| **Desenvolvimento / Testes** | `https://dev.coonto.com` | `develop` | `.github/workflows/deploy-dev.yml` | `/opt/altdesk/deploy/static/coonto-dev` | `/var/www/static/coonto-dev` |
| **Main (Em Construção)** | `https://main.coonto.com` | Estático (`deploy/holding-page`) | Manual / Cópia direta | `/opt/altdesk/deploy/static/coonto-main` | `/var/www/static/coonto-main` |
| **Redirecionamentos** | `coonto.co`, `coonto.com.br` (+ `www`) | N/A | Caddy 308 redirect | N/A | N/A |

- **DNS**: Entradas do tipo `A` apontando para o IP da VPS (`191.252.110.173`).
- **Servidor Web**: Caddy (Docker) com HTTPS automático para todos os domínios.

---

## 1. Configuração de DNS

No painel de gerenciamento de DNS de cada domínio (Locaweb / Registro.br / etc.), certifique-se de que as entradas apontem para o IP da VPS (`191.252.110.173`):

### Domínio `coonto.com`:
1. **Domínio Principal e WWW**:
   - **Tipo**: `A` | **Host / Nome**: `@` | **Destino**: `191.252.110.173`
   - **Tipo**: `CNAME` ou `A` | **Host / Nome**: `www` | **Destino**: `coonto.com.` ou `191.252.110.173`
2. **Subdomínio Dev (Ambiente de Teste)**:
   - **Tipo**: `A` | **Host / Nome**: `dev` | **Destino**: `191.252.110.173`
3. **Subdomínio Main (Em Construção)**:
   - **Tipo**: `A` | **Host / Nome**: `main` | **Destino**: `191.252.110.173`

### Domínios Redirecionados (`coonto.co` e `coonto.com.br`):
- Apontar `@` e `www` de ambos os domínios como tipo `A` para `191.252.110.173`.

---

## 2. Configuração no Caddyfile da VPS

O Caddyfile principal fica localizado no host em:
```text
/opt/altdesk/deploy/caddy/Caddyfile
```

### Bloco do Coonto:

```caddyfile
# ═══════════════════════════════════════════════════
# COONTO — DOMÍNIOS & REDIRECIONAMENTOS
# ═══════════════════════════════════════════════════

# --- REDIRECIONAMENTOS PARA DOMÍNIO PRINCIPAL (Permanente 308) ---
coonto.co, www.coonto.co, coonto.com.br, www.coonto.com.br, www.coonto.com {
    redir https://coonto.com{uri} permanent
}

# --- COONTO PRODUÇÃO (Domínio Principal) ---
coonto.com {
    root * /var/www/static/coonto-alpha
    encode gzip zstd
    file_server
    try_files {path} /index.html
}

# --- COONTO DEV / TESTES (Branch develop) ---
dev.coonto.com {
    root * /var/www/static/coonto-dev
    encode gzip zstd
    file_server
    try_files {path} /index.html
}

# --- COONTO MAIN (Em Construção) ---
main.coonto.com {
    root * /var/www/static/coonto-main
    encode gzip zstd
    file_server
    try_files {path} /index.html
}
```

### Recarregar o Caddy sem reiniciar containers:
```bash
docker exec -w /etc/caddy altdesk_caddy caddy reload
```

---

## 3. Estratégia de Deploy Contínuo (CI/CD)

### GitHub Actions

O repositório possui automação para deploy contínuo em cada branch:

- **`main`**: executa `.github/workflows/deploy.yml` e envia o código para `/opt/altdesk/deploy/static/coonto-alpha` (servindo em `coonto.com`).
- **`develop`**: executa `.github/workflows/deploy-dev.yml` e envia o código para `/opt/altdesk/deploy/static/coonto-dev` (servindo em `dev.coonto.com`).

#### Secrets do Repositório (GitHub Settings > Secrets and variables > Actions):

| Secret | Obrigatório | Descrição | Valor Padrão / Exemplo |
| :--- | :--- | :--- | :--- |
| `SERVER_HOST` | Sim | IP público da VPS | `191.252.110.173` |
| `SERVER_USER` | Sim | Usuário SSH (ex: `deploy`) | `deploy` |
| `SSH_PRIVATE_KEY` | Sim | Chave privada SSH autorizada | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `DEPLOY_PATH` | Sim (Produção) | Caminho no host para a branch main | `/opt/altdesk/deploy/static/coonto-alpha` |
| `DEV_DEPLOY_PATH` | Opcional (Dev) | Caminho no host para a branch develop | `/opt/altdesk/deploy/static/coonto-dev` |

---

## 4. Pastas e Permissões na VPS

Como o Caddy monta `/opt/altdesk/deploy/static` como somente leitura (`:ro`), as pastas de cada ambiente devem existir no host:

```bash
# 1. Criar as pastas no host
sudo mkdir -p /opt/altdesk/deploy/static/coonto-alpha
sudo mkdir -p /opt/altdesk/deploy/static/coonto-dev
sudo mkdir -p /opt/altdesk/deploy/static/coonto-main

# 2. Copiar a página de Em Construção (holding page) para o main.coonto.com
# (Copie o arquivo deploy/holding-page/index.html do repositório para o servidor)
# Exemplo via scp:
# scp deploy/holding-page/index.html deploy@191.252.110.173:/opt/altdesk/deploy/static/coonto-main/index.html

# 3. Garantir permissões para o usuário de deploy e leitura para o Caddy
sudo chown -R deploy:deploy /opt/altdesk/deploy/static/coonto-dev /opt/altdesk/deploy/static/coonto-main
sudo chmod -R 755 /opt/altdesk/deploy/static/coonto-dev /opt/altdesk/deploy/static/coonto-main
```
