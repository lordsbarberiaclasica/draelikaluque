#!/usr/bin/env bash
# Descarga la portada (og:image) de cada reel de testimonios a
# public/images/testimonios/{codigo}.jpg — correr LOCALMENTE:
#   bash scripts/fetch-reel-covers.sh
set -e
DIR="public/images/testimonios"
mkdir -p "$DIR"
UA="facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
REELS="DUWvaoVjC63 CsZSBERRe1- DAb6AGGSHkt DOKJklljA78 Csg50a-L8y_ DNWgi5LNqz3 DMOfDgoRJYQ"

for code in $REELS; do
  echo "-> $code"
  html=$(curl -sL -A "$UA" "https://www.instagram.com/reel/$code/")
  img=$(printf '%s' "$html" | grep -o 'property="og:image" content="[^"]*"' | head -1 | sed 's/.*content="//;s/"$//' | sed 's/&amp;/\&/g')
  if [ -n "$img" ]; then
    curl -sL -A "$UA" "$img" -o "$DIR/$code.jpg" && echo "   OK $DIR/$code.jpg"
  else
    echo "   No se pudo extraer automaticamente. Descarga manual: captura del reel guardada como $DIR/$code.jpg"
  fi
done
echo ""
echo "Listo. Corre npm run dev y las portadas apareceran en la galeria."
