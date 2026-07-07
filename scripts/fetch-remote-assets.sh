#!/usr/bin/env bash
# Descarga los logos de credenciales del WordPress actual.
# Correr LOCALMENTE mientras el sitio siga en linea:
#   bash scripts/fetch-remote-assets.sh
set -e
DIR="public/images/credenciales"
mkdir -p "$DIR"
BASE="https://draelikaluque.com/wp-content/uploads"

curl -sSL "$BASE/2022/10/ACS-100-anos.svg"        -o "$DIR/acs.svg"
curl -sSL "$BASE/2022/10/Group-165.svg"           -o "$DIR/felac.svg"
curl -sSL "$BASE/2022/10/ACC-logo.svg"            -o "$DIR/acc.svg"
curl -sSL "$BASE/2022/10/IRCAD-FRANCE.svg"        -o "$DIR/ircad.svg"
curl -sSL "$BASE/2022/10/Uni-el-bosque-logo.svg"  -o "$DIR/el-bosque.svg"
curl -sSL "$BASE/2022/10/Logo-3.svg"              -o "public/images/logo-el.svg"
curl -sSL "$BASE/2026/04/Sello-Medico-Cirujano-Universidad-el-Bosque.png" -o "$DIR/sello-el-bosque.png"
curl -sSL "$BASE/2026/04/Sello-FELAC.png"         -o "$DIR/sello-felac.png"

echo "OK: assets descargados en $DIR"

# Fotos de clinicas (pagina de la Dra.)
curl -sSL "$BASE/2022/12/Rectangle-6.png" -o "public/images/clinica-portoazul.png"
