/**
 * Registros Web · draelikaluque.com · v2 (jul 2026)
 * ------------------------------------------------
 * Apps Script NUEVO e independiente del que hoy usa el quiz L2 (ese no se
 * toca hasta migrar). Recibe POSTs del sitio y escribe cada lead como una
 * fila en la pestaña indicada por el parámetro `hoja`. Si la pestaña no
 * existe, la CREA con sus encabezados.
 *
 * Hoja destino:
 * https://docs.google.com/spreadsheets/d/1vbKpMXqxwGkLhpVEfQnIMJSkMP7LjiG4MW4u6YMqbxA
 *
 * Pestañas atendidas:
 *   1. "Registros Valoración 15 Min"        ← formulario pre-Calendly (todo el sitio)
 *   2. "Registros Landing Balón Gástrico"   ← mini-quiz de /balon-gastrico/
 *   3. "Registros Landing Quizz"            ← quiz completo de /quiz/ (L2, al migrar)
 *
 * reCAPTCHA v3 (opcional): si en Configuración del proyecto → Propiedades del
 * script existe la propiedad RECAPTCHA_SECRET, cada envío se verifica contra
 * Google y el resultado queda en la columna "Captcha" (score 0–1). La fila se
 * registra SIEMPRE — nunca se descarta un lead por un falso positivo; la
 * columna sirve para que las asesoras detecten spam de un vistazo.
 */

var SPREADSHEET_ID = '1vbKpMXqxwGkLhpVEfQnIMJSkMP7LjiG4MW4u6YMqbxA';
var HOJA_DEFECTO = 'Registros Valoración 15 Min';

var CAMPOS_ORIGEN = ['pagina', 'url_completa', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid'];
var ENCABEZADOS_ORIGEN = ['Página de origen', 'URL completa', 'Referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid'];

var HOJAS = {
  'Registros Valoración 15 Min': {
    encabezados: ['Fecha y hora', 'Nombres', 'Teléfono / WhatsApp', 'Email', 'País', 'Motivo de consulta']
      .concat(ENCABEZADOS_ORIGEN).concat(['Captcha']),
    campos: ['nombres', 'telefono', 'email', 'pais', 'motivo'].concat(CAMPOS_ORIGEN)
  },
  'Registros Landing Balón Gástrico': {
    encabezados: ['Fecha y hora', 'Nombre', 'WhatsApp', 'Peso (kg)', 'Estatura (cm)', 'IMC',
      'Cirugía previa', 'Reflujo / hernia', 'Ruta', 'Rango IMC']
      .concat(ENCABEZADOS_ORIGEN).concat(['Captcha']),
    campos: ['nombre', 'whatsapp', 'peso', 'estatura', 'imc',
      'cirugia_previa', 'reflujo', 'ruta', 'imc_rango'].concat(CAMPOS_ORIGEN)
  },
  'Registros Landing Quizz': {
    encabezados: ['Fecha y hora', 'Nombre', 'WhatsApp', 'País', 'Correo', 'Recomendación',
      'Motivo', 'Intentos previos', 'Patrón alimentario', 'IMC', 'Salud', 'Reflujo', 'Freno principal']
      .concat(ENCABEZADOS_ORIGEN).concat(['Captcha']),
    campos: ['nombre', 'whatsapp', 'pais', 'correo', 'recomendacion',
      'motivo', 'intentos', 'patron', 'imc', 'salud', 'reflujo', 'freno'].concat(CAMPOS_ORIGEN)
  }
};

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var nombreHoja = (p.hoja && HOJAS[p.hoja]) ? p.hoja : HOJA_DEFECTO;
    var config = HOJAS[nombreHoja];

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var hoja = ss.getSheetByName(nombreHoja);
    if (!hoja) {
      hoja = ss.insertSheet(nombreHoja);
    }
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(config.encabezados);
      hoja.setFrozenRows(1);
      hoja.getRange(1, 1, 1, config.encabezados.length).setFontWeight('bold');
    }

    var fila = [Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm:ss')];
    for (var i = 0; i < config.campos.length; i++) {
      fila.push(p[config.campos[i]] || '');
    }
    fila.push(verificarCaptcha(p.recaptcha_token));

    hoja.appendRow(fila);
    return salidaJson({ ok: true, hoja: nombreHoja });
  } catch (err) {
    return salidaJson({ ok: false, error: String(err) });
  }
}

/**
 * Devuelve el texto para la columna "Captcha":
 *   'sin verificar' → no hay RECAPTCHA_SECRET configurada (captcha apagado)
 *   'sin token'     → hay secret pero el navegador no envió token
 *   'score 0.9'     → verificado; <0.3 suele ser bot, revisar
 *   'fallido'       → Google rechazó el token
 */
function verificarCaptcha(token) {
  var secret = PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET');
  if (!secret) return 'sin verificar';
  if (!token) return 'sin token';
  try {
    var resp = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: secret, response: token },
      muteHttpExceptions: true
    });
    var r = JSON.parse(resp.getContentText());
    if (!r.success) return 'fallido';
    return (typeof r.score === 'number') ? 'score ' + r.score : 'ok';
  } catch (err) {
    return 'error verificación';
  }
}

/** Prueba rápida en el navegador: abrir la URL /exec debe mostrar este JSON. */
function doGet() {
  return salidaJson({ ok: true, servicio: 'registros-web-draelikaluque', version: 2 });
}

function salidaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
