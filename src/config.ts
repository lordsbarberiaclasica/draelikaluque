/**
 * Fuente única de verdad de datos operativos.
 * ⚠️ TODO antes de lanzar: URL real del evento de Calendly.
 * ⚠️ PENDIENTE CONFIRMAR: el sitio actual publica DOS números:
 *    WhatsApp (+57) 310 4139307  ·  Teléfono (+57) 310 7005772
 *    ¿Cuál es la línea oficial de leads (asesoras)? Mientras tanto,
 *    el botón global usa 310 413 9307 y la página de contacto muestra ambos.
 */
export const SITE = {
  name: 'Dra. Elika Luque',
  title: 'Dra. Elika Luque · Cirugía Bariátrica y Laparoscopia Avanzada en Barranquilla',
  description:
    'Cirugía bariátrica en Barranquilla con la Dra. Elika Luque: balón gástrico, manga y bypass con formación europea (IRCAD Estrasburgo, Saint-Pierre Bruselas), protocolo riguroso y acompañamiento de un año.',
  url: 'https://draelikaluque.com',

  // ⚠️ URL FUNCIONAL DE PRUEBA: es la cuenta de Hemma Usaquén (otro negocio
  // de Hernando) y el evento "nueva-reunion". ANTES DE LANZAR: reemplazar por
  // el evento de PREVALORACIÓN en la cuenta de la Dra. (Lun/Mar/Jue/Vie 3-7pm).
  calendly: 'https://calendly.com/dra-elika-luque/prevaloracion',

  whatsapp: '573104139307',
  whatsappAlt: '573104139307', // publicado como "WhatsApp" en el sitio actual
  // ⚠️ TERCER número detectado (prototipo del quiz). ¿Línea de asesoras? Confirmar.
  whatsappQuiz: '573104139307',
  // Google Apps Script que escribe en la hoja de leads del quiz (de Walter)
  quizSheetEndpoint: 'https://script.google.com/macros/s/AKfycby8AVZSZBIprh9DPcs2fTJY8mDkn5PDokvL1rVkr3tEdT_yZw-xt5AruvAAADLdqwPWcA/exec',
  whatsappMsg: 'Hola, quiero agendar una valoración con la Dra. Elika Luque.',
  phone: '+57 310 413 9307',
  phoneAlt: '+57 310 413 9307',
  email: 'dra.elikaluque@gmail.com',

  gtmId: 'GTM-55C96K63',

  horario: 'Lunes, martes, jueves y viernes · 3:00 – 7:00 p. m.',
  // ⚠️ El mockup de L1 dice "Lun-Mar-Jue-Vie 2:00-6:00 pm · Mié 9am-6pm".
  // Se usa el horario CONFIRMADO por la Dra. (3-7pm, sin miércoles) hasta nueva orden.
  horarioWhatsapp: 'Lunes a viernes · 9:00 a. m. – 6:00 p. m.',

  instagram: 'https://www.instagram.com/dra.elikaluque',
  facebook: 'https://www.facebook.com/draelikaluque',
};

export const waLink = (msg: string = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
