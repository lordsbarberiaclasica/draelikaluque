/**
 * Registros Web · draelikaluque.com · v5 vinculado (jul 2026) — DESPLEGADO
 * ------------------------------------------------------------------------
 * Este es el codigo que corre en produccion. Vive VINCULADO a la hoja
 * oficial (Drive de Lords: 1D5hI8vIudoAZFy4TqHPwTjxaHBQKXjvjqornKYjIE40),
 * creado desde Extensiones -> Apps Script con scope minimo
 * (spreadsheets.currentonly) para esquivar el bloqueo de apps no verificadas.
 *
 * URL de produccion (cableada en src/config-registros.ts):
 * https://script.google.com/macros/s/AKfycbzHV0WPklm49rvX_d5cHYz9u2OSBMfOwl7pB60F4ehSr8dSPdnZgrQO6zqbXX9TxZTF/exec
 *
 * Manifest (appsscript.json) del proyecto:
 * {
 *   "timeZone": "America/Bogota",
 *   "exceptionLogging": "STACKDRIVER",
 *   "runtimeVersion": "V8",
 *   "oauthScopes": ["https://www.googleapis.com/auth/spreadsheets.currentonly"],
 *   "webapp": { "executeAs": "USER_DEPLOYING", "access": "ANYONE_ANONYMOUS" }
 * }
 *
 * Para editar en el futuro: cambiar el codigo -> Guardar -> Implementar ->
 * ADMINISTRAR implementaciones -> lapiz -> Version: Nueva -> Implementar
 * (nunca "Nueva implementacion": cambiaria la URL).
 */

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
  'Registros Landing Balón': {
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

    var ss = SpreadsheetApp.getActiveSpreadsheet();
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
      fila.push(textoSeguro(p[config.campos[i]] || ''));
    }
    fila.push('captcha desactivado');

    hoja.appendRow(fila);
    return salidaJson({ ok: true, hoja: nombreHoja });
  } catch (error) {
    return salidaJson({ ok: false, error: String(error) });
  }
}

/**
 * Blindaje anti-#ERROR!: si un valor empieza con + = - o @, Sheets lo
 * interpreta como formula y rompe la celda. Anteponer un apostrofo lo
 * fuerza a texto literal (el apostrofo no se muestra en la celda).
 * Aplica a TODOS los campos de TODAS las pestanas.
 */
function textoSeguro(v) {
  var s = String(v);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

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
 * API de lectura para el panel (panel.draelikaluque.com).
 * Credenciales en Configuracion del proyecto -> Propiedades del script:
 *   PANEL_USUARIO y PANEL_CLAVE (nunca en el codigo).
 */
function doGet(e) {
  var p = (e && e.parameter) || {};

  if (p.accion === 'login') {
    if (credencialesValidas(p.usuario, p.clave)) return salidaJson({ ok: true });
    Utilities.sleep(800);
    return salidaJson({ ok: false, error: 'credenciales' });
  }

  if (p.accion === 'leer') {
    if (!credencialesValidas(p.usuario, p.clave)) {
      Utilities.sleep(800);
      return salidaJson({ ok: false, error: 'credenciales' });
    }
    var nombre = (p.hoja && HOJAS[p.hoja]) ? p.hoja : HOJA_DEFECTO;
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
    if (!hoja || hoja.getLastRow() === 0) {
      return salidaJson({ ok: true, hoja: nombre, encabezados: HOJAS[nombre].encabezados, filas: [] });
    }
    var datos = hoja.getDataRange().getDisplayValues();
    return salidaJson({ ok: true, hoja: nombre, encabezados: datos[0], filas: datos.slice(1) });
  }

  return salidaJson({ ok: true, servicio: 'registros-web-draelikaluque', version: 5 });
}

function credencialesValidas(u, c) {
  var props = PropertiesService.getScriptProperties();
  var pu = props.getProperty('PANEL_USUARIO');
  var pc = props.getProperty('PANEL_CLAVE');
  return !!(u && c && pu && pc && u === pu && c === pc);
}

function salidaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
