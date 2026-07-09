/**
 * Registros Web · draelikaluque.com · v3 (jul 2026)
 * --------------------------------------------------
 * REEMPLAZA el codigo del Apps Script EXISTENTE del quiz (misma URL /exec,
 * sin tocar el sitio). Atiende con UNA sola URL los tres formularios,
 * escribiendo cada lead en su pestana. Si la pestana no existe, la CREA
 * con sus encabezados.
 *
 * Hoja de calculo destino (la real, donde llegan los registros hoy):
 * https://docs.google.com/spreadsheets/d/1xae4I6KqQbvauBGSCLewrN5wEJ-mMlYAX1i3RrFZqjw
 *
 * Pestanas:
 *   "Registros Landing Quizz"           <- quiz completo de /quiz/ (DEFECTO:
 *                                          toda peticion sin campo `hoja` cae
 *                                          aqui = retrocompatible con el quiz)
 *   "Registros Valoración 15 Min"       <- formulario pre-Calendly (todo el sitio)
 *   "Registros Landing Balón Gástrico"  <- mini-quiz de /balon-gastrico/
 *
 * COMO ACTUALIZAR (conservando la URL):
 *   1. script.google.com -> abrir el proyecto del quiz -> borrar el codigo
 *      viejo -> pegar este completo -> Guardar.
 *   2. Implementar -> ADMINISTRAR implementaciones -> lapiz (editar) ->
 *      Version: "Nueva version" -> Implementar.  [NO crear "Nueva
 *      implementacion": eso cambia la URL y rompe el sitio.]
 *   3. Probar abriendo la URL /exec en el navegador: debe responder
 *      {"ok":true,"version":3}.
 */

var SPREADSHEET_ID = '1xae4I6KqQbvauBGSCLewrN5wEJ-mMlYAX1i3RrFZqjw';
var HOJA_DEFECTO = 'Registros Landing Quizz';

var CAMPOS_ORIGEN = ['pagina', 'url_completa', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid'];
var ENCABEZADOS_ORIGEN = ['Página de origen', 'URL completa', 'Referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid'];

var HOJAS = {
  'Registros Landing Quizz': {
    encabezados: ['Fecha y hora', 'Nombre', 'WhatsApp', 'País', 'Correo',
      'Recomendación', 'Motivo', 'Intentos previos', 'Patrón alimentario',
      'IMC', 'Salud', 'Reflujo', 'Freno principal']
      .concat(ENCABEZADOS_ORIGEN).concat(['Captcha']),
    campos: ['nombre', 'whatsapp', 'pais', 'correo', 'recomendacion',
      'motivo', 'intentos', 'patron', 'imc', 'salud', 'reflujo', 'freno']
      .concat(CAMPOS_ORIGEN)
  },
  'Registros Valoración 15 Min': {
    encabezados: ['Fecha y hora', 'Nombres', 'Teléfono / WhatsApp', 'Email',
      'País', 'Motivo de consulta']
      .concat(ENCABEZADOS_ORIGEN).concat(['Captcha']),
    campos: ['nombres', 'telefono', 'email', 'pais', 'motivo']
      .concat(CAMPOS_ORIGEN)
  },
  'Registros Landing Balón Gástrico': {
    encabezados: ['Fecha y hora', 'Nombre', 'WhatsApp', 'Peso (kg)',
      'Estatura (cm)', 'IMC', 'Cirugía previa', 'Reflujo / hernia',
      'Ruta', 'Rango IMC']
      .concat(ENCABEZADOS_ORIGEN).concat(['Captcha']),
    campos: ['nombre', 'whatsapp', 'peso', 'estatura', 'imc',
      'cirugia_previa', 'reflujo', 'ruta', 'imc_rango']
      .concat(CAMPOS_ORIGEN)
  }
};

function doPost(e) {
  try {
    var p = leerParametros(e);
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
  } catch (error) {
    return salidaJson({ ok: false, error: String(error) });
  }
}

/** Lectura robusta (patron de Walter): parametros -> JSON -> urlencoded. */
function leerParametros(e) {
  var p = {};
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    p = e.parameter;
  } else if (e && e.postData && e.postData.contents) {
    try {
      p = JSON.parse(e.postData.contents);
    } catch (parseError) {
      var parts = e.postData.contents.split('&');
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split('=');
        if (kv.length === 2) {
          p[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1].replace(/\+/g, ' '));
        }
      }
    }
  }
  return p;
}

/**
 * Columna "Captcha": 'sin verificar' = no hay RECAPTCHA_SECRET configurada;
 * 'sin token' = el navegador no envio token; 'score 0.9' = verificado
 * (<0.3 suele ser bot); 'fallido' = Google rechazo el token.
 * La fila se registra SIEMPRE: nunca se descarta un lead por falso positivo.
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

function doGet() {
  return salidaJson({ ok: true, servicio: 'registros-web-draelikaluque', version: 3 });
}

function salidaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
