#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Coonto Alpha v0.3"
echo "Arquivos prontos para servir por Nginx/Apache."
python3 -m http.server 8000
