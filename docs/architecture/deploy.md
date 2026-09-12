# Infraestrutura e Deploy do Coonto (Produção e Dev)

## Visão Geral da Infraestrutura

Os ambientes estão hospedados no mesmo servidor Ubuntu LTS utilizando **Caddy** (via Docker) como Proxy Reverso com gerenciamento automático de certificados SSL (Let's Encrypt):

| Ambiente | Domínio Público | Branch Git | Workflow GitHub Actions | Caminho no Host (VPS) | Caminho no Container Caddy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Produção / Alpha** | `https://coonto.co` | `main` | `.github/workflows/deploy.yml` | `/opt/altdesk/deploy/static/coonto-alpha` | `/var/www/static/coonto-alpha` |
| **Desenvolvimento / Dev** | `https://dev.coonto.co` | `develop` | `.github/workflows/deploy-dev.yml` | `/opt/altdesk/deploy/static/coonto-dev` | `/var/www/static/coonto-dev` |

- **DNS**: Gerenciado no painel da **Locaweb** (Nameservers `ns1.locaweb.com.br`, `ns2.locaweb.com.br` e `ns3.locaweb.com.br`).
- **Servidor Web**: Caddy (Docker) com HTTPS automático para todos os domínios.

---

## 1. Configuração de DNS na Locaweb

No painel de gerenciamento de DNS do domínio `coonto.co` na Locaweb, certifique-se de que as entradas apontem para o IP da VPS (`191.252.110.173`):

1. **Domínio Principal e WWW**:
   - **Tipo**: `A`
   - **Host / Nome**: `@` (ou vazio)
   - **Destino**: `191.252.110.173`
   - **Tipo**: `CNAME`
   - **Host / Nome**: `www`
   - **Destino**: `coonto.co.`
2. **Subdomínio Dev**:
   - **Tipo**: `A` (ou Apontamento)
   - **Host / Nome**: `dev`
   - **Destino**: `191.252.110.173`

---

## 2. Configuração no Caddyfile da VPS

O Caddyfile principal fica localizado no host em:
```text
/opt/altdesk/deploy/caddy/Caddyfile
```

### Blocos do Coonto:

```caddyfile
# --- COONTO PRODUCAO ---
coonto.co, www.coonto.co {
        root * /var/www/static/coonto-alpha
        encode gzip zstd
        file_server
        try_files {path} /index.html
}

# --- COONTO DEV ---
dev.coonto.co {
        root * /var/www/static/coonto-dev
        encode gzip zstd
        file_server
        try_files {path} /index.html
}
```

### Recarregar o Caddy sem reiniciar containers:
```bash
docker exec -w /etc/caddy $(docker ps -q --filter "name=caddy") caddy reload
```

---

## 3. Estratégia de Deploy Contínuo (CI/CD)

### GitHub Actions

O repositório possui automação para deploy contínuo em cada branch:

- **`main`**: executa `.github/workflows/deploy.yml` e envia o código para `/opt/altdesk/deploy/static/coonto-alpha`.
- **`develop`**: executa `.github/workflows/deploy-dev.yml` e envia o código para `/opt/altdesk/deploy/static/coonto-dev`.

#### Secrets do Repositório (GitHub Settings > Secrets and variables > Actions):

| Secret | Obrigatório | Descrição | Valor Padrão / Exemplo |
| :--- | :--- | :--- | :--- |
| `SERVER_HOST` | Sim | IP público da VPS | `IP_DA_VPS` |
| `SERVER_USER` | Sim | Usuário SSH (ex: `deploy`) | `deploy` |
| `SSH_PRIVATE_KEY` | Sim | Chave privada SSH autorizada | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `DEPLOY_PATH` | Sim (Alpha) | Caminho no host para a branch main | `/opt/altdesk/deploy/static/coonto-alpha` |
| `DEV_DEPLOY_PATH` | Opcional (Dev) | Caminho no host para a branch develop | `/opt/altdesk/deploy/static/coonto-dev` |

---

## 4. Permissões de Pasta na VPS

Como o Caddy monta `/opt/altdesk/deploy/static` como somente leitura (`:ro`), a pasta de dev precisa existir no host e ter permissão de leitura para o Caddy e de escrita para o usuário `deploy`:

```bash
# 1. Criar a pasta do dev no host
sudo mkdir -p /opt/altdesk/deploy/static/coonto-dev

# 2. Garantir permissões para o usuário de deploy e leitura para o Caddy
sudo chown -R $USER:$USER /opt/altdesk/deploy/static/coonto-dev
sudo chmod -R 755 /opt/altdesk/deploy/static/coonto-dev
```
