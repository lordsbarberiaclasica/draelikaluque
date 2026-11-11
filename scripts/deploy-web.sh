#!/usr/bin/env bash
# Publica la web en la VM (/var/www/draelikaluque).
#
# Uso:  DEPLOY_DESTINO=usuario@servidor bash scripts/deploy-web.sh
#       (el servidor y el acceso SSH están en el HANDOFF del repo del panel)
#
# Reglas (ver README → "Cómo publicar"):
#  - SIN --delete: /en/ (salvo /en/privacy-policy/) y sus CSS/JS viejos de _astro/
#    existen solo en el servidor. Un --delete rompería la versión en inglés.
#  - Nunca toca /api/: lead.php se publica desde el repo del panel.
#  - Se niega a publicar si el build todavía envía leads a Google Sheets.
set -euo pipefail

DEST="${DEPLOY_DESTINO:?Define DEPLOY_DESTINO=usuario@servidor}"
REMOTO="/var/www/draelikaluque"
cd "$(dirname "$0")/.."

npm run build

if grep -rq "script.google.com" dist/; then
  echo "ERROR: el build contiene URLs de Google Apps Script. Los leads deben ir a /api/lead.php." >&2
  exit 1
fi
if ! grep -rq "/api/lead.php" dist/_astro/; then
  echo "ERROR: el build no envía los formularios a /api/lead.php." >&2
  exit 1
fi

rsync -az --exclude 'api/' --rsync-path="sudo rsync" dist/ "$DEST:$REMOTO/"

# Enlaza la política en las páginas en inglés que no tienen fuente (idempotente).
scp -q scripts/enlazar-politica-en.sh "$DEST:/tmp/enlazar-politica-en.sh"
ssh "$DEST" "sudo bash /tmp/enlazar-politica-en.sh $REMOTO/en && rm -f /tmp/enlazar-politica-en.sh && sudo chown -R www-data:www-data $REMOTO"

echo "Publicado. Revisa: https://draelikaluque.com/politica-de-privacidad/ y https://draelikaluque.com/en/privacy-policy/"
