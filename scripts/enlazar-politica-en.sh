#!/usr/bin/env bash
# Enlaza /en/privacy-policy/ en las páginas en inglés YA PUBLICADAS.
#
# Por qué existe: /en/ no tiene código fuente en este repo (solo existe como
# build en el servidor), así que sus enlaces "Privacy Policy (coming soon)"
# apuntan a "#". Este script reemplaza esos enlaces en el HTML publicado.
# Se borra cuando el inglés se migre a src/pages/en/.
#
# Uso (en la VM):  sudo bash enlazar-politica-en.sh /var/www/draelikaluque/en
# Es idempotente: si se corre dos veces no cambia nada la segunda vez.
# Deja copia de cada archivo modificado como index.html.bak-politica.
set -euo pipefail

DIR="${1:?Indica la carpeta /en del sitio publicado}"
URL="/en/privacy-policy/"
cambiados=0

while IFS= read -r -d '' f; do
  case "$f" in */privacy-policy/*) continue ;; esac
  tmp=$(mktemp)
  cp -p "$f" "$tmp"
  perl -0pi -e '
    # Pie del sitio: "Privacy Policy & Data Protection (coming soon)"
    s{<a href="#" class="hover:text-dorado transition-colors" aria-disabled="true">Privacy Policy &(?:amp;)? Data Protection \(coming soon\)</a>}{<a href="'"$URL"'" class="hover:text-dorado transition-colors">Privacy Policy</a>}g;
    # Pie del sitio: "Terms & conditions (coming soon)" (no existe; se quita)
    s{<li><a href="#" class="hover:text-dorado transition-colors" aria-disabled="true">Terms &(?:amp;)? conditions \(coming soon\)</a></li>}{}g;
    # Pie de landings: "Data Protection (coming soon)"
    s{<a href="#" class="underline hover:text-dorado" aria-disabled="true">Data Protection \(coming soon\)</a>}{<a href="'"$URL"'" class="underline hover:text-dorado">Privacy Policy</a>}g;
    # Casillas de autorización (formulario, quiz balón, quiz L2)
    s{<a href="#"( target="_blank" rel="noopener"[^>]*)>((?:privacy policy|Privacy Policy)[^<]*)</a>}{<a href="'"$URL"'"$1>$2</a>}g;
    s{<a href="#" class="underline">(Privacy Policy[^<]*)</a>}{<a href="'"$URL"'" target="_blank" rel="noopener" class="underline">$1</a>}g;
  ' "$f"
  if cmp -s "$f" "$tmp"; then
    rm -f "$tmp"
  else
    [ -e "$f.bak-politica" ] || mv "$tmp" "$f.bak-politica"
    rm -f "$tmp"
    cambiados=$((cambiados + 1))
    echo "  enlazado: $f"
  fi
done < <(find "$DIR" -name index.html -print0)

echo "Archivos modificados: $cambiados"
echo "Enlaces que siguen en \"#\" con texto de privacidad (debe ser 0):"
{ grep -rhoiE '<a href="#"[^>]*>[^<]*(privacy|data protection|coming soon)[^<]*</a>' --include=index.html "$DIR" || true; } | wc -l
