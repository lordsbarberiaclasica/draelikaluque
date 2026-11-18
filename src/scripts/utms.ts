/**
 * Atribución de leads: lee los UTM de la PRIMERA visita, que guarda el script
 * inline de Base.astro en localStorage ("el_*", 30 días desde esa visita).
 *
 * Todos los formularios deben enviar los UTM con esta función, para que el
 * origen no se pierda si la persona entra por una landing (ej. /seguridad/)
 * y llena el formulario en otra página o más tarde.
 *
 * Si no hay nada guardado (almacenamiento bloqueado, modo privado estricto),
 * usa los de la URL actual.
 */
export const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const;

const PREFIJO = 'el_';

function leerGuardado(k: string): string {
  try { return localStorage.getItem(PREFIJO + k) || ''; } catch (_e) { return ''; }
}

export function leerUtms(): Record<string, string> {
  const out: Record<string, string> = {};
  const hayGuardado = CLAVES_UTM.some((k) => leerGuardado(k));
  const url = new URLSearchParams(location.search);
  for (const k of CLAVES_UTM) out[k] = hayGuardado ? leerGuardado(k) : url.get(k) || '';
  /* Página por la que entró en esa primera visita (ej. /seguridad/). */
  out.pagina_entrada = leerGuardado('landing') || location.pathname;
  return out;
}
