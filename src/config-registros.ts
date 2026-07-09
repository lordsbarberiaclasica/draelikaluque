/**
 * config-registros.ts · v0.9.7
 * Configuración central de las piezas nuevas: formularios con registro en
 * Sheets, Thank You page, popup de video, analítica y reCAPTCHA.
 *
 * Archivo NUEVO para no tocar src/config.ts (que sigue gobernando el quiz L2
 * actual, redes, etc.). En la pasada de integración final se fusiona allí.
 */

export const REGISTROS = {
  /**
   * ⚠️ PEGAR AQUÍ la URL /exec del NUEVO Apps Script (docs/integracion-v0.9.7.md, Paso D).
   * Con el placeholder, los formularios funcionan igual para el paciente
   * (Calendly/WhatsApp), pero NO guardan en Sheets y avisan por console.warn.
   */
  appsScriptUrl: 'PEGAR_AQUI_URL_EXEC_DEL_APPS_SCRIPT',

  /** Pestañas destino en la hoja de Google Sheets (nombres EXACTOS). */
  hojaValoracion: 'Registros Valoración 15 Min',
  hojaBalon: 'Registros Landing Balón Gástrico',
  hojaQuizL2: 'Registros Landing Quizz',

  /**
   * reCAPTCHA v3 (invisible, sin fricción). Pegar aquí SOLO la SITE KEY
   * (pública). La SECRET KEY nunca va al repo: se guarda en las Propiedades
   * del Apps Script (Paso D.7). Vacío = captcha desactivado (queda el honeypot).
   */
  recaptchaSiteKey: '',

  /** Medición. El GTM nuevo REEMPLAZA a GTM-55C96K63 (ver doc, Paso F). */
  gtmId: 'GTM-55C96K63',
  ga4Id: 'G-X5XX8MNDJ2',

  /**
   * Video de la Dra. (el mismo del fondo del hero, sin recomprimir).
   * ⚠️ Verificar el nombre real con:  find public -type f -name '*.mp4'
   */
  videoDra: '/videos/hero-banner.mp4',

  /**
   * Calendly base para CTAs generados dinámicamente (resultado del quiz de
   * balón) y fallback del interceptor.
   * ⚠️ Handle temporal de Hemma — cambiar al crear el Calendly propio.
   */
  calendlyFallback: 'https://calendly.com/contacto-hemmausaquen/nueva-reunion',

  /**
   * WhatsApp que recibe los leads (Capa 3 · asesoras). Mismo número que ya
   * usa el quiz L2. ⚠️ Pendiente el veredicto final de los 3 números.
   */
  whatsappAsesoras: '573218960696',

  /** Rutas internas usadas por los CTAs secundarios del quiz de balón. */
  urlManga: '/procedimientos-bariaticos/',
  urlReflujo: '/reflujo/',

  /** Instagram oficial de la Dra. (handle con punto, confirmado). */
  instagramUrl: 'https://www.instagram.com/dra.elikaluque/',
  instagramHandle: '@dra.elikaluque',
} as const;
