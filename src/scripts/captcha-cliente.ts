/**
 * captcha-cliente.ts · v0.9.7
 * Helper compartido de reCAPTCHA v3 (invisible) para todos los formularios.
 *
 * Regla de oro: el captcha JAMÁS bloquea una conversión. Si la site key está
 * vacía, si la red falla o si Google tarda más de 3 s, devuelve '' y el
 * formulario continúa normal (el Apps Script marcará la fila como
 * "sin token" / "sin verificar" en la columna Captcha).
 */
import { REGISTROS } from '../config-registros';

let carga: Promise<void> | null = null;

function cargarApi(siteKey: string): Promise<void> {
  if (carga) return carga;
  carga = new Promise((resolver, rechazar) => {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.onload = () => resolver();
    s.onerror = () => rechazar(new Error('recaptcha no cargó'));
    document.head.appendChild(s);
  });
  return carga;
}

export async function tokenCaptcha(accion: string): Promise<string> {
  const siteKey = REGISTROS.recaptchaSiteKey;
  if (!siteKey) return '';

  const intento = (async () => {
    await cargarApi(siteKey);
    const g = (window as any).grecaptcha;
    await new Promise<void>((r) => g.ready(() => r()));
    return (await g.execute(siteKey, { action: accion })) as string;
  })();

  const limite = new Promise<string>((r) => window.setTimeout(() => r(''), 3000));

  try {
    return await Promise.race([intento, limite]);
  } catch (_e) {
    return '';
  }
}
