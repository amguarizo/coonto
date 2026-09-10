# Infraestrutura e Deploy do Coonto Alpha

## Visão Geral da Infraestrutura

- **Domínio Público do Alpha**: `https://alpha.coonto.com.br`
- **DNS**: Gerenciado no painel da **Locaweb** (Nameservers `ns1.locaweb.com.br` e `ns2.locaweb.com.br`).
  - Entrada: `Tipo A`
  - Host/Nome: `alpha`
  - Destino: `IP_PUBLICO_DO_SERVIDOR_UBUNTU`
- **Servidor Web**: Ubuntu LTS com Nginx.
- **SSL**: Certificado Let's Encrypt (Certbot).

---

## Estratégia de Deploy

### 1. Deploy Automático (GitHub Actions)
Toda alteração mesclada na branch `main` dispara o workflow `.github/workflows/deploy.yml`.

#### Configuração de Secrets no Repositório GitHub:
Acesse **Settings > Secrets and variables > Actions > New repository secret**:
1. `SERVER_HOST`: IP público do servidor Ubuntu.
2. `SERVER_USER`: Usuário SSH (ex: `ubuntu`).
3. `SSH_PRIVATE_KEY`: Conteúdo da chave privada SSH que tem acesso ao servidor.
4. `DEPLOY_PATH`: Caminho no servidor (ex: `/var/www/alpha.coonto.com.br`).

### 2. Deploy Manual via Terminal Ubuntu
Caso opte por atualizar manualmente pelo servidor:

```bash
cd /var/www/alpha.coonto.com.br
git pull origin main
sudo systemctl reload nginx
```

---

## Configuração do Nginx

O arquivo de configuração do site no servidor deve residir em `/etc/nginx/sites-available/alpha.coonto.com.br`:

```nginx
server {
    listen 80;
    server_name alpha.coonto.com.br;

    root /var/www/alpha.coonto.com.br;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|mp3)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Para habilitar e obter certificado HTTPS:
```bash
sudo ln -s /etc/nginx/sites-available/alpha.coonto.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d alpha.coonto.com.br
```
