/**
 * Fuente única de verdad de datos operativos.
 * WhatsApp oficial en TODA la web: +57 321 821 1819 (wa.me/573218211819).
 * Los números 310 413 9307 y 310 700 5772 ya NO se usan.
 */
export const SITE = {
  name: 'Dra. Elika Luque',
  title: 'Dra. Elika Luque · Cirugía Bariátrica y Laparoscopia Avanzada en Barranquilla',
  description:
    'Cirugía bariátrica en Barranquilla con la Dra. Elika Luque: balón gástrico, manga y bypass con formación europea (IRCAD Estrasburgo, Saint-Pierre Bruselas), protocolo riguroso y acompañamiento de un año.',
  url: 'https://draelikaluque.com',

  // Evento de prevaloración en la cuenta de Calendly de la Dra.
  calendly: 'https://calendly.com/dra-elika-luque/prevaloracion',

  whatsapp: '573218211819',
  whatsappAlt: '573218211819',
  whatsappQuiz: '573218211819',
  whatsappMsg: 'Hola, quiero agendar una valoración con la Dra. Elika Luque.',
  phone: '+57 321 821 1819',
  phoneAlt: '+57 321 821 1819',
  email: 'dra.elikaluque@gmail.com',

  gtmId: 'GTM-55C96K63',

  horario: 'Lunes, martes, jueves y viernes · 3:00 – 7:00 p. m.',
  // ⚠️ El mockup de L1 dice "Lun-Mar-Jue-Vie 2:00-6:00 pm · Mié 9am-6pm".
  // Se usa el horario CONFIRMADO por la Dra. (3-7pm, sin miércoles) hasta nueva orden.
  horarioWhatsapp: 'Lunes a viernes · 9:00 a. m. – 6:00 p. m.',

  instagram: 'https://www.instagram.com/dra.elikaluque',
  facebook: 'https://www.facebook.com/draelikaluque',
};

/** Política de tratamiento de datos personales (Ley 1581 de 2012). */
export const URL_POLITICA_DATOS = '/politica-de-privacidad/';
export const URL_POLITICA_DATOS_EN = '/en/privacy-policy/';

export const waLink = (msg: string = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
