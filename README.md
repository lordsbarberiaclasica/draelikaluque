# draelikaluque.com · Rediseño

Sitio institucional + sistema de 6 landings de captación para la
**Dra. Elika Luque** (cirugía bariátrica, Barranquilla).

Stack: **Astro 5 + Tailwind CSS 4** · Fuentes self-hosted (@fontsource) ·
Deploy: **GitHub Actions → cPanel (FTP)**.

## Instalación local

```bash
cd ~/Developer
# (descomprimir el zip aquí, o clonar cuando esté en GitHub)
cd draelikaluque
npm install
npm run dev       # http://localhost:4321
```

Requisitos: Node 20+.

## Subir a GitHub

```bash
cd ~/Developer/draelikaluque
git init && git add -A && git commit -m "feat: home institucional v1"
git branch -M main
git remote add origin git@github.com:TU_USUARIO/draelikaluque.git
git push -u origin main
```

## Deploy a cPanel

Automático con `.github/workflows/deploy.yml`: cada push a `main`
construye el sitio y sube `dist/` por FTP.

Configurar en GitHub → Settings → Secrets → Actions:

| Secret | Ejemplo |
|---|---|
| `FTP_SERVER` | ftp.draelikaluque.com |
| `FTP_USERNAME` | usuario cPanel |
| `FTP_PASSWORD` | contraseña |
| `FTP_SERVER_DIR` | /public_html/ |

Alternativa manual: `npm run build` y subir el contenido de `dist/` a `public_html`.

### Redirecciones 301
El mapa vive en `public/.htaccess` (comentado). **Descomentar solo al lanzar.**
Detalle completo en `docs/inventario-urls-301.md`.

## Pendientes antes de lanzar (⚠️)

- [ ] URL real del evento de Calendly → `src/config.ts`
- [ ] Correr `bash scripts/fetch-remote-assets.sh` (logos de credenciales, logo SVG)
- [ ] Textos legales: Política de privacidad / Habeas Data (footer)
- [ ] Testimonios reales (fotos con permiso + videos) → activar `<Testimonios />`
- [ ] Confirmar handles de Instagram/Facebook → `src/config.ts`
- [ ] Walter: verificar disparo de GTM (GTM-MMMK2ZD) y propagación de UTMs a Calendly

## Estructura

```
src/
├── config.ts              # Datos operativos (única fuente de verdad)
├── layouts/Base.astro     # SEO, fuentes, GTM, captura de UTMs
├── components/            # Header, Footer, StickyCtaMobile, WhatsAppFloat
│   └── sections/          # Secciones del home (reutilizables en landings)
├── pages/index.astro      # Home
└── styles/global.css      # Tokens de marca + componentes base
docs/                      # Inventario 301 + copy extraído del WordPress
```

## Reglas de compliance (no negociables)

Sin promesas de resultados, sin "100% seguro", precios solo en landings
(nunca en anuncios), quiz como orientación (no diagnóstico), antes/después
solo en sitio orgánico (landings de pauta: solo video).
