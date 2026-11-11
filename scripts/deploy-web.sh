#!/usr/bin/env bash
# Publica la web en la VM (/var/www/draelikaluque).
#
# Opción A — Google Cloud Shell (recomendada, no necesita claves: gcloud las crea):
#   DEPLOY_VM=nombre-vm DEPLOY_ZONA=zona bash scripts/deploy-web.sh
#   (opcional: DEPLOY_PROYECTO=id-proyecto si Cloud Shell no lo tiene configurado)
#
# Opción B — SSH directo:
#   DEPLOY_DESTINO=usuario@servidor bash scripts/deploy-web.sh
#
# Nombre de la VM, zona y proyecto: ver HANDOFF.md del repo privado del panel.
#
# Reglas:
#  - SIN --delete: /en/ (salvo /en/privacy-policy/) y sus CSS/JS viejos de _astro/
#    existen solo en el servidor. Un --delete rompería la versión en inglés.
#  - Nunca toca /api/: lead.php se publica desde el repo del panel.
#  - Se niega a publicar si el build todavía envía leads a Google Sheets.
set -euo pipefail

REMOTO="${DEPLOY_CARPETA:-/var/www/draelikaluque}"
cd "$(dirname "$0")/.."

if [ -z "${DEPLOY_VM:-}" ] && [ -z "${DEPLOY_DESTINO:-}" ] && [ -z "${DEPLOY_PRUEBA_LOCAL:-}" ]; then
  echo "Define DEPLOY_VM y DEPLOY_ZONA (Cloud Shell) o DEPLOY_DESTINO=usuario@servidor." >&2
  exit 1
fi

[ -d node_modules ] || npm ci
npm run build

if grep -rq "script.google.com" dist/; then
  echo "ERROR: el build contiene URLs de Google Apps Script. Los leads deben ir a /api/lead.php." >&2
  exit 1
fi
if ! grep -rq "/api/lead.php" dist/_astro/; then
  echo "ERROR: el build no envía los formularios a /api/lead.php." >&2
  exit 1
fi

# Paquete único: build + script de enlaces del inglés.
PAQUETE="$(mktemp -d)/draelika-web.tgz"
PAQ_REMOTO="${DEPLOY_PAQ_REMOTO:-/tmp/draelika-web.tgz}"
cp scripts/enlazar-politica-en.sh dist/.enlazar-politica-en.sh
tar -czf "$PAQUETE" -C dist .
rm -f dist/.enlazar-politica-en.sh

# En el servidor: descomprimir ENCIMA de lo publicado (sin borrar nada: equivale
# a no usar --delete), sin tocar /api/, enlazar la política en /en/ y dejar
# permisos de Apache.
INSTALAR="set -e
T=\$(mktemp -d)
tar -xzf $PAQ_REMOTO -C \"\$T\" ./.enlazar-politica-en.sh
sudo tar -xzf $PAQ_REMOTO -C $REMOTO --exclude=./api --exclude=./.enlazar-politica-en.sh
sudo bash \"\$T/.enlazar-politica-en.sh\" $REMOTO/en
sudo chown -R www-data:www-data $REMOTO
rm -rf \"\$T\" $PAQ_REMOTO
echo 'Servidor actualizado.'"

if [ -n "${DEPLOY_PRUEBA_LOCAL:-}" ]; then
  # Solo para probar el script sin servidor: instala en DEPLOY_CARPETA local.
  cp "$PAQUETE" "$PAQ_REMOTO"
  bash -c "$INSTALAR"
  exit 0
fi

if [ -n "${DEPLOY_VM:-}" ]; then
  ZONA="${DEPLOY_ZONA:?Define DEPLOY_ZONA (zona de la VM)}"
  PROY=()
  [ -n "${DEPLOY_PROYECTO:-}" ] && PROY=(--project "$DEPLOY_PROYECTO")
  gcloud compute scp "${PROY[@]}" --zone "$ZONA" "$PAQUETE" "$DEPLOY_VM:$PAQ_REMOTO"
  gcloud compute ssh "${PROY[@]}" --zone "$ZONA" "$DEPLOY_VM" --command "$INSTALAR"
else
  scp -q "$PAQUETE" "$DEPLOY_DESTINO:$PAQ_REMOTO"
  ssh "$DEPLOY_DESTINO" "$INSTALAR"
fi

rm -f "$PAQUETE"
echo "Publicado. Revisa: https://draelikaluque.com/politica-de-privacidad/ y https://draelikaluque.com/en/privacy-policy/"
