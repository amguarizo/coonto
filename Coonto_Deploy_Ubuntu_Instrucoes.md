# Coonto Alpha — Publicação em `alpha.coonto.com.br`

## Objetivo

Publicar o **Coonto Alpha v0.3** em um servidor **Ubuntu**, usando **Nginx**, com acesso pelo endereço:

```text
https://alpha.coonto.com.br
```

O domínio `coonto.com.br` está utilizando os nameservers da Locaweb:

```text
ns1.locaweb.com.br
ns2.locaweb.com.br
```

Portanto, o DNS do subdomínio deve ser configurado **no painel da Locaweb**, e não diretamente no Registro.br.

---

## 1. Configuração DNS na Locaweb

Acessar o painel da Locaweb e abrir o gerenciamento de DNS do domínio:

```text
coonto.com.br
```

Criar um novo registro DNS com os seguintes dados:

```text
Tipo: A
Nome/Host: alpha
Destino/Valor: IP_PUBLICO_DO_SERVIDOR_UBUNTU
TTL: padrão da Locaweb
```

### Importante

Não alterar os nameservers no Registro.br.

Eles devem continuar apontando para a Locaweb.

---

## 2. Validar propagação do DNS

Depois de criar o registro `A`, validar se:

```text
alpha.coonto.com.br
```

já está apontando para o IP público correto do servidor.

Pode ser testado com:

```bash
dig +short alpha.coonto.com.br
```

ou:

```bash
nslookup alpha.coonto.com.br
```

O resultado deve ser o IP público do servidor Ubuntu.

Exemplo:

```text
200.xxx.xxx.xxx
```

---

## 3. Pacote do Coonto Alpha

Utilizar o arquivo:

```text
Coonto_Deploy_Ubuntu_v0_3.zip
```

Enviar esse arquivo para o servidor Ubuntu.

Depois, no terminal do servidor:

```bash
unzip Coonto_Deploy_Ubuntu_v0_3.zip
cd Coonto_Deploy_Ubuntu_v0_3
sudo bash INSTALAR_COONTO_UBUNTU.sh
```

---

## 4. O que o instalador faz

O script `INSTALAR_COONTO_UBUNTU.sh` foi preparado para:

- atualizar os pacotes do Ubuntu;
- instalar Nginx;
- instalar ferramentas auxiliares;
- criar o diretório do site;
- publicar os arquivos do Alpha;
- configurar permissões;
- criar o virtual host do Nginx;
- configurar `alpha.coonto.com.br`;
- reiniciar o Nginx;
- verificar o DNS;
- tentar ativar HTTPS automaticamente com Let's Encrypt quando o DNS já estiver correto.

---

## 5. Diretório do site

O Alpha será publicado em:

```text
/var/www/coonto-alpha
```

Estrutura esperada:

```text
/var/www/coonto-alpha/
├── index.html
├── styles.css
├── app.js
└── assets/
    ├── images/
    └── audio/
```

---

## 6. Configuração do Nginx

O arquivo de configuração principal ficará em:

```text
/etc/nginx/sites-available/coonto-alpha
```

Configuração base:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name alpha.coonto.com.br;

    root /var/www/coonto-alpha;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

O site deve estar habilitado em:

```text
/etc/nginx/sites-enabled/coonto-alpha
```

Caso seja necessário criar o link manualmente:

```bash
sudo ln -sf /etc/nginx/sites-available/coonto-alpha /etc/nginx/sites-enabled/coonto-alpha
```

Depois validar:

```bash
sudo nginx -t
```

O comando deve retornar algo equivalente a:

```text
syntax is ok
test is successful
```

Em seguida:

```bash
sudo systemctl reload nginx
```

---

## 7. Firewall

Se o servidor estiver utilizando UFW:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

As portas necessárias são:

```text
80/tcp
443/tcp
```

Porta `80`:

```text
HTTP
```

Porta `443`:

```text
HTTPS
```

---

## 8. Teste inicial em HTTP

Depois que o Nginx estiver configurado, testar:

```text
http://alpha.coonto.com.br
```

Se o DNS já estiver propagado e o servidor estiver acessível, o Coonto Alpha deverá abrir.

---

## 9. Configuração HTTPS

Depois que:

```text
alpha.coonto.com.br
```

estiver resolvendo corretamente para o IP público do servidor, instalar o Certbot:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

Em seguida:

```bash
sudo certbot --nginx -d alpha.coonto.com.br
```

O Certbot poderá:

- emitir o certificado SSL;
- configurar HTTPS;
- configurar o redirecionamento automático de HTTP para HTTPS.

Ao final, validar:

```text
https://alpha.coonto.com.br
```

O navegador deve abrir sem alerta de certificado.

---

## 10. Script alternativo para ativação de HTTPS

O pacote também contém:

```text
ATIVAR_HTTPS.sh
```

Caso o DNS ainda não estivesse propagado no momento da primeira instalação, depois que ele estiver correto basta executar:

```bash
cd Coonto_Deploy_Ubuntu_v0_3
sudo bash ATIVAR_HTTPS.sh
```

---

## 11. Atualizações futuras do Alpha

Depois que o servidor estiver configurado, não será necessário reinstalar Nginx, mudar DNS ou refazer HTTPS a cada nova versão.

O pacote contém:

```text
ATUALIZAR_COONTO.sh
```

Para atualizar:

```bash
cd Coonto_Deploy_Ubuntu_v0_3
sudo bash ATUALIZAR_COONTO.sh
```

O script atualiza o conteúdo do site e recarrega o Nginx.

---

## 12. Atualização manual

Caso seja necessário fazer manualmente:

```bash
sudo rsync -av --delete site/ /var/www/coonto-alpha/
sudo chown -R www-data:www-data /var/www/coonto-alpha
sudo nginx -t
sudo systemctl reload nginx
```

---

## 13. Checklist de validação

A publicação pode ser considerada concluída quando todos os itens abaixo estiverem OK.

### DNS

```bash
dig +short alpha.coonto.com.br
```

Retorna o IP público correto do servidor.

### Nginx

```bash
sudo nginx -t
```

Retorna:

```text
syntax is ok
test is successful
```

### HTTP

```text
http://alpha.coonto.com.br
```

Abre o Coonto Alpha.

### HTTPS

```text
https://alpha.coonto.com.br
```

Abre o Coonto Alpha com certificado SSL válido.

---

## 14. Diagnóstico rápido

### Ver status do Nginx

```bash
sudo systemctl status nginx
```

### Reiniciar Nginx

```bash
sudo systemctl restart nginx
```

### Ver logs de erro

```bash
sudo tail -n 100 /var/log/nginx/error.log
```

### Ver logs de acesso

```bash
sudo tail -n 100 /var/log/nginx/access.log
```

### Conferir IP público do servidor

```bash
curl -4 https://api.ipify.org
```

### Conferir DNS do subdomínio

```bash
dig +short alpha.coonto.com.br
```

---

## 15. Arquitetura desta fase

Nesta fase, o Alpha pode funcionar como uma aplicação web estática hospedada pelo Nginx:

```text
Browser
   ↓
alpha.coonto.com.br
   ↓
Nginx
   ↓
/var/www/coonto-alpha
   ├── HTML
   ├── CSS
   ├── JavaScript
   ├── imagens
   └── áudio
```

Isso é suficiente para a evolução do protótipo visual e funcional.

Quando o Coonto precisar de recursos como:

- autenticação;
- contas de usuário;
- progresso persistente;
- analytics;
- paywall;
- pagamentos;
- controle de acesso;
- conteúdo protegido;
- painel de administração;
- banco de dados;

a arquitetura poderá evoluir para incluir backend e banco sem precisar alterar o domínio público do Alpha.

---

## 16. Observação sobre áudio

A estrutura atual já prevê:

```text
assets/audio/
```

Isso permite substituir futuramente a voz do navegador por arquivos profissionais, por exemplo:

```text
assets/audio/revolta-abertura.mp3
assets/audio/revolta-tensao.mp3
assets/audio/revolta-consequencia.mp3
assets/audio/revolta-machado.mp3
```

A interface do produto pode continuar mostrando apenas um ícone discreto de `play`, independentemente de a origem do áudio ser ElevenLabs ou outro serviço.

---

## 17. Resultado esperado

Ao final da configuração:

```text
https://alpha.coonto.com.br
```

deve abrir diretamente o **Coonto Alpha**, sem necessidade de:

- Python;
- localhost;
- arquivos `.bat`;
- instalação local;
- configuração no computador do usuário.

Esse ambiente passa a ser a base para a evolução contínua do Alpha.
