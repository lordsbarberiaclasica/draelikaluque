/**
 * Fuente única de verdad de datos operativos.
 * ⚠️ TODO antes de lanzar: URL real del evento de Calendly.
 * ⚠️ PENDIENTE CONFIRMAR: el sitio actual publica DOS números:
 *    WhatsApp (+57) 321 8211819  ·  Teléfono (+57) 310 7005772
 *    ¿Cuál es la línea oficial de leads (asesoras)? Mientras tanto,
 *    el botón global usa 310 700 5772 y la página de contacto muestra ambos.
 */
export const SITE = {
  name: 'Dra. Elika Luque',
  title: 'Dra. Elika Luque · Cirugía Bariátrica y Laparoscopia Avanzada en Barranquilla',
  description:
    'Cirugía bariátrica en Barranquilla con la Dra. Elika Luque: balón gástrico, manga y bypass con formación europea (IRCAD Estrasburgo, Saint-Pierre Bruselas), protocolo riguroso y acompañamiento de un año.',
  url: 'https://draelikaluque.com',

  calendly: 'https://calendly.com/TODO-prevaloracion',

  whatsapp: '573107005772',
  whatsappAlt: '573218211819', // publicado como "WhatsApp" en el sitio actual
  whatsappMsg: 'Hola, quiero agendar una valoración con la Dra. Elika Luque.',
  phone: '+57 310 700 5772',
  phoneAlt: '+57 321 821 1819',
  email: 'dra.elikaluque@gmail.com',

  gtmId: 'GTM-MMMK2ZD',

  horario: 'Lunes, martes, jueves y viernes · 3:00 – 7:00 p. m.',

  instagram: 'https://www.instagram.com/draelikaluque',
  facebook: 'https://www.facebook.com/draelikaluque',
};

export const waLink = (msg: string = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
