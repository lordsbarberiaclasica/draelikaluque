# draelikaluque.com

Sitio institucional + 6 landings de captación de la **Dra. Elika Luque**
(cirugía bariátrica, Barranquilla).

Stack: **Astro 5 + Tailwind CSS 4** · fuentes self-hosted (@fontsource).
Servidor: VM con Apache, carpeta `/var/www/draelikaluque`, detrás de Cloudflare.

> Datos del servidor, accesos y base de datos: ver `HANDOFF.md` en el repo
> privado del panel (`Dev-Lords8812/draelikaluque-panel`). No se copian aquí.

## Local

```bash
npm install
npm run dev       # http://localhost:4321
```

Requisitos: Node 20+.

## Formularios y leads

Los formularios envían a **`/api/lead.php`** (ruta relativa, ver
`src/config-registros.ts`). Ese archivo vive en el repo del panel y guarda en
MariaDB. El campo `hoja` indica el formulario (`Registros Valoración 15 Min`,
`Registros Landing Balón`, `Registros Landing Quizz`; con sufijo ` (EN)` en inglés).
**Nunca** volver a apuntar a Google Apps Script.

## Cómo publicar

Desde **Google Cloud Shell** (no necesita claves: `gcloud` las crea la primera vez):

```bash
git clone https://github.com/lordsbarberiaclasica/draelikaluque.git
cd draelikaluque
DEPLOY_VM=<vm> DEPLOY_ZONA=<zona> DEPLOY_PROYECTO=<proyecto> bash scripts/deploy-web.sh
```

(VM, zona y proyecto: en el `HANDOFF.md` del repo del panel.) También funciona con
SSH directo: `DEPLOY_DESTINO=usuario@servidor bash scripts/deploy-web.sh`.

El script compila, verifica que los formularios vayan a `/api/lead.php`, sube el
build, enlaza la política en las páginas en inglés y deja permisos de Apache.

- **Sin `--delete`.** La versión en inglés (`/en/`) existe solo como build en el
  servidor, con CSS/JS viejos de `_astro/`. Borrarlos la rompe.
- **Nunca tocar `/api/`**: se publica desde el repo del panel.
- El HTML sale sin caché; JS/CSS tienen hash en el nombre, no hace falta purgar Cloudflare.

## Páginas

| Página | URL |
| --- | --- |
| L1 Prevaloración | `/prevaloracion/` |
| L2 Quiz | `/quiz/` |
| L3 Seguridad | `/seguridad/` (`?h=` seguridad · miedo · rebote · reflujo) |
| L4 Balón gástrico | `/balon-gastrico/` (`?h=` balon · dias · post · agenda) |
| L5 Reflujo | `/reflujo/` (`?h=` reflujo · nocturno · antiacidos · decision) |
| L6 Incluye y pagos | `/incluye-y-pagos/` (`?h=` proceso · balon · cirugia · internacional) |
| Política de datos | `/politica-de-privacidad/` · `/en/privacy-policy/` |

Inglés publicado: `/en/` + `pre-assessment`, `quiz`, `safety`, `gastric-balloon`,
`reflux`, `included-and-pricing`, etc. Solo `/en/privacy-policy/` tiene fuente en
`src/pages/en/`; el resto está pendiente de migrar a Astro.

## Datos operativos

Todo en `src/config.ts` (única fuente de verdad): WhatsApp **+57 321 821 1819**
(`wa.me/573218211819`, único número), Calendly, GTM `GTM-55C96K63`, redes.

## Reglas de compliance (no negociables)

Sin promesas de resultados, sin "100% seguro", precios solo en landings
(nunca en anuncios), quiz como orientación (no diagnóstico), antes/después
solo en sitio orgánico (landings de pauta: solo video).
