# Integración v0.9.7 · Quiz Balón + Registros Sheets (3 pestañas) + GTM/GA4 + reCAPTCHA + SEO/AI-SEO

**Fecha:** 9-jul-2026 · **Acumulativa:** incluye y reemplaza TODO lo de v0.9.6 (descartar ese zip). Requiere v0.9.5 en producción.

## 1 · Inventario del paquete

| Archivo | Estado | Qué es |
|---|---|---|
| `src/config-registros.ts` | actualizado | Config central: 3 pestañas, reCAPTCHA, GTM/GA4, video, WhatsApp, rutas. |
| `src/components/FormularioValoracion.astro` | actualizado | Modal pre-Calendly global (ahora con hook reCAPTCHA). |
| `src/components/landing/QuizBalon.astro` | nuevo | Mini-quiz de candidatura al balón (spec L4 completa). |
| `src/components/VideoDraModal.astro` | nuevo | Popup del video de la Dra. (hero del home). |
| `src/components/AnalyticsHead.astro` | nuevo | GTM-55C96K63 + GA4 G-X5XX8MNDJ2 para el `<head>`. |
| `src/components/GtmNoScript.astro` | nuevo | Noscript de GTM para después de `<body>`. |
| `src/components/RevisadoPor.astro` | nuevo | Sello E-E-A-T "revisado por la Dra." + fecha (SEO/AI-SEO). |
| `src/pages/gracias.astro` | nuevo | Thank You page post-Calendly. |
| `src/scripts/captcha-cliente.ts` | nuevo | Helper reCAPTCHA v3 compartido (timeout 3 s, nunca bloquea). |
| `scripts/apps-script-registros.gs` | actualizado | Apps Script v2: router de 3 pestañas + verificación captcha. |
| `public/llms.txt` | nuevo | Perfil del sitio para motores de IA (llmstxt.org). |
| `public/robots.txt` | **reemplaza el actual** | Bots de IA permitidos + `Disallow: /gracias/` + sitemap. |

## 2 · Campos por pestaña (confirmación solicitada)

**"Registros Valoración 15 Min"** (formulario pre-Calendly, todo el sitio):
Fecha y hora (Bogotá) · Nombres · Teléfono/WhatsApp · Email · País · Motivo de consulta · Página de origen · URL completa · Referrer · utm_source · utm_medium · utm_campaign · utm_content · utm_term · gclid · fbclid · Captcha.

**"Registros Landing Balón Gástrico"** (mini-quiz L4):
Fecha y hora · Nombre · WhatsApp · Peso (kg) · Estatura (cm) · IMC · Cirugía previa · Reflujo/hernia · Ruta (A–E) · Rango IMC (<25 | 25–32 | >32) · Página de origen · URL completa · Referrer · utm_* (5) · gclid · fbclid · Captcha.
El "Rango IMC" permite leer el sensor de calidad de tráfico sin fórmulas: si la mayoría cae en B/C/D, la pauta del grupo Balón atrae al público equivocado.

**"Registros Landing Quizz"** (quiz completo L2):
Fecha y hora · Nombre · WhatsApp · País · Correo · Recomendación · Motivo · Intentos previos · Patrón alimentario · IMC · Salud · Reflujo · Freno principal · Página de origen · URL completa · Referrer · utm_* (5) · gclid · fbclid · Captcha.
Mapeo 1:1 con los campos que el quiz L2 ya envía hoy (nombre, whatsapp, pais, correo, recomendacion, motivo, intentos, patron, imc, salud, reflujo, freno) — así la migración es mínima (ver Paso F).

Las tres pestañas y sus encabezados **los crea el Apps Script solo** en el primer envío; no hay que preparar nada a mano (si ya existen creadas vacías, escribe los encabezados y sigue).

## 3 · Pasos de integración

### Paso A · Video
`find public -type f -name '*.mp4'` → si la ruta difiere de `/videos/dra-elika.mp4`, ajustar `videoDra` en `src/config-registros.ts`.

### Paso B · Base.astro (medición + formulario global + noindex)
1. **Quitar** los bloques actuales de GTM-MMMK2ZD (script del head y noscript del body). ⚠️ Confirmar con Hernando que ese contenedor se abandona.
2. Frontmatter: `import AnalyticsHead from '../components/AnalyticsHead.astro';` · `import GtmNoScript from '../components/GtmNoScript.astro';` · `import FormularioValoracion from '../components/FormularioValoracion.astro';`
3. `<AnalyticsHead />` lo más arriba del `<head>` · `<GtmNoScript />` justo tras `<body>` · `<FormularioValoracion />` antes de `</body>`.
4. Soporte noindex: añadir prop `noindex` a Base y, si es true, `<meta name="robots" content="noindex, nofollow" />` en el head. `gracias.astro` la usará (mientras tanto, robots.txt ya la excluye).

### Paso C · Hero del home
`import VideoDraModal from '../VideoDraModal.astro';` + junto al CTA principal: `<button type="button" class="btn btn-ghost-light" data-open-video-dra>Conoce a la Dra.</button>` (usar la variante ghost clara existente) + `<VideoDraModal />` al final del componente.

### Paso D · Apps Script v2 (registro en Sheets)
1. Abrir la hoja → Extensiones → Apps Script → archivo nuevo `registros-web` → pegar `scripts/apps-script-registros.gs`. **No tocar el script del quiz.**
2. Implementar → Nueva implementación → **Aplicación web** → Ejecutar como: tú → Acceso: **Cualquier usuario**.
3. Autorizar permisos → copiar la URL `/exec` → pegarla en `config-registros.ts` → `appsScriptUrl`.
4. Probar con el curl del chat (una fila por pestaña).
5. Ediciones futuras del .gs: Administrar implementaciones → ✏️ → **Versión: Nueva** (si no, no salen a producción).
6. **reCAPTCHA (cuando se active):** en el editor de Apps Script → ⚙️ Configuración del proyecto → Propiedades del script → Añadir: `RECAPTCHA_SECRET` = la clave secreta. La SITE KEY (pública) va en `config-registros.ts` → `recaptchaSiteKey`. Con ambas puestas, todo queda activo sin más cambios. Registrar el dominio draelikaluque.com al crear las claves en https://www.google.com/recaptcha/admin (tipo: **v3**).

### Paso E · Quiz de balón en la landing
En `src/pages/balon-gastrico.astro` (o el componente de la sección `#candidato`): `import QuizBalon from '../components/landing/QuizBalon.astro';` y **reemplazar el formulario de solo-captura** de "¿Soy candidata al balón?" por `<QuizBalon />`. El CTA del hero que ancla a `#candidato` no cambia.

### Paso F · Migrar el quiz L2 a la pestaña "Registros Landing Quizz"
En el código del quiz (`/quiz/`), dos cambios: (1) apuntar el POST a `REGISTROS.appsScriptUrl` (en vez del Apps Script viejo) y (2) añadir `hoja: 'Registros Landing Quizz'` al payload. Los nombres de campo actuales ya coinciden con el mapeo. Hacerlo **después** de verificar el Paso D con el curl; mientras tanto el quiz sigue escribiendo donde siempre, sin riesgo.

### Paso G · Calendly → /gracias/
Evento → Confirmation Page → **Redirect to an external site** → `https://draelikaluque.com/gracias/` + activar **Pass event details**. ⚠️ El evento actual es el genérico de Hemma: el redirect afectaría a cualquiera que lo use, y hay que verificar que el plan permita redirect externo. Lo limpio es activarlo al crear el Calendly propio (pendiente 🟡 #5). Preguntas personalizadas del evento: #1 WhatsApp (a1), #2 País (a2), #3 Motivo (a3) — el sitio ya las envía; Calendly ignora las que no existan.

## 4 · SEO on-page · titles y descriptions propuestos (aplicar en cada página)

| Página | `<title>` propuesto | Meta description propuesta |
|---|---|---|
| `/` | Cirugía Bariátrica en Barranquilla \| Dra. Elika Luque | Cirujana bariátrica y laparoscópica con formación en IRCAD (Francia) y Bruselas. Balón, manga y bypass con acompañamiento de 1 año. Valoración de 15 min sin costo. |
| `/procedimientos-bariaticos/` | Balón, Manga y Bypass Gástrico en Barranquilla \| Dra. Elika Luque | Conoce las diferencias entre balón gástrico, manga y bypass: en qué consiste cada uno y para quién está indicado. Orientación con la Dra. Elika Luque. |
| `/soy-candidato/` | ¿Soy candidato a cirugía bariátrica? Calcula tu IMC \| Dra. Elika Luque | Calcula tu IMC en segundos y descubre si eres candidato(a) a balón, manga o bypass gástrico. El primer paso hacia tu nueva vida. |
| `/agendamiento-y-contacto/` | Agenda tu valoración en Barranquilla \| Dra. Elika Luque | Agenda tu valoración con la Dra. Elika Luque en Torre Médica del Mar o Clínica Portoazul. WhatsApp, correo y calendario en línea. |
| `/dra-elika-luque-2/` | Dra. Elika Luque · Cirujana Bariátrica y Laparoscópica | Más de 10 años de experiencia. Universidad El Bosque, IRCAD Estrasburgo y Saint-Pierre Bruselas. Miembro de ACC, FELAC y American College of Surgeons. |
| `/prevaloracion/` | Prevaloración bariátrica de 15 minutos sin costo \| Dra. Elika Luque | Reserva tu prevaloración de 15 minutos sin costo: resuelve tus dudas y descubre tu mejor ruta con la Dra. Elika Luque. Cupos Lun–Vie. |
| `/quiz/` | Test: ¿balón, manga o bypass? Descúbrelo en 2 minutos | Responde 7 preguntas y recibe una orientación inicial sobre el procedimiento más indicado para ti. Educativo, sin costo y sin compromiso. |
| `/seguridad/` | ¿Es segura la cirugía bariátrica? Protocolo y acompañamiento | Protocolo riguroso que minimiza riesgos: clínicas certificadas, equipo completo y 7 controles durante el primer año. Conoce cómo cuidamos cada caso. |
| `/balon-gastrico/` | Balón Gástrico en Barranquilla: sin cirugía mayor \| Dra. Elika Luque | El balón gástrico es temporal y sin cirugía mayor. Haz el test de candidatura en 1 minuto y agenda tu valoración sin costo con la Dra. Elika Luque. |
| `/reflujo/` | Reflujo y exceso de peso: ¿manga o bypass? \| Dra. Elika Luque | Si tienes reflujo o hernia hiatal, la elección entre manga y bypass cambia. La Dra. Elika Luque te explica cuál conviene según tu caso. |
| `/incluye-y-pagos/` | Qué incluye tu cirugía bariátrica y formas de pago | Transparencia total: qué incluye el valor, formas de pago disponibles y por qué no cobramos anticipado. Valor referencial desde 19 millones COP. |

Reglas aplicadas: title ≤ 60 caracteres con keyword + ciudad + marca; description 140–160 con beneficio y CTA; sin promesas de resultados (compliance).

## 5 · Checklist AI-SEO (estado)

Hecho en este paquete: `llms.txt` ✅ · robots.txt con bots de IA permitidos ✅ · `Disallow: /gracias/` ✅ · componente de atribución experta + fecha (`RevisadoPor`) ✅ · JSON-LD Physician ya existía ✅.
Para la pasada de contenido (requiere el repo): párrafo-respuesta directo de 40–60 palabras bajo el H1 de cada landing · H2/H3 fraseados como preguntas reales · FAQPage schema activo cuando la Dra. valide las FAQs (bloqueante 🔴 #2) · tabla comparativa balón vs. manga vs. bypass en `/procedimientos-bariaticos/` (formato más citado por IA: ~33%) · `<RevisadoPor />` insertado en las 6 landings + páginas clínicas.
Fuera del código (recomendaciones): crear/reclamar el **Google Business Profile** de la Dra. (crítico para AI Overviews locales) · pedir a Google Search Console la reindexación tras el deploy · los videos de testimonios ya en IG suman presencia de terceros.

## 6 · Eventos dataLayer (para configurar en GTM)

`valoracion_form_abierto` · `valoracion_form_enviado` {motivo, pais} · `valoracion_destino` {destino} · `agendamiento_confirmado` (/gracias/ — **conversión dura**) · `quiz_balon_inicio` · `quiz_balon_completado` {ruta, imc_rango} · `quiz_balon_destino` {destino, ruta} · `video_dra_abierto` · `ig_follow_click` · (existente) `hero_variant`.

## 7 · ⚠️ Pendientes que este paquete toca

1. Checkboxes de Habeas Data (formulario de valoración y quiz de balón) apuntan a `#` — bloqueante 🔴 #1 con dos lugares nuevos esperando la página real.
2. GTM-MMMK2ZD → GTM-55C96K63: confirmar el abandono del contenedor viejo antes del deploy.
3. Los copys de las 5 rutas del quiz de balón vienen del documento aprobado; cualquier ajuste de matiz lo valida la Dra.
4. El CTA secundario de la Ruta B enlaza a `/procedimientos-bariaticos/` (la URL real del sitio; la spec decía `/procedimientos#manga`). Verificar si existe el ancla `#manga` para enlazar directo a la sección.
5. `public/robots.txt` del paquete **reemplaza** al actual — revisar en el diff de git que no se pierda ninguna regla que existiera.
