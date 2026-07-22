/**
 * Configuración global del sitio.
 * Editar estos valores para personalizar el despliegue.
 */
export const siteConfig = {
  name: 'Conversor Pro',
  shortName: 'ConversorPro',
  tagline: 'Conversores online gratis — unidades, divisas, archivos y texto',
  description:
    'Conversores online gratis: unidades, divisas, archivos y texto. Rápido, preciso y sin registro. Procesamiento 100% en tu navegador. Más de 50 herramientas gratuitas.',
  longDescription:
    'La mejor colección de conversores online gratis. Convierte unidades de longitud, peso, temperatura, volumen y velocidad. Cambia divisas con tasas en tiempo real. Procesa archivos PDF e imágenes sin subirlos a servidores. Convierte texto entre formatos. Todo gratis, sin registro y 100% privado.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://conversoresweb.vercel.app',
  locale: 'es-ES',
  // Google AdSense — sustituir con tu publisher ID real tras la aprobación
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-8885324906798080',
  // Google Analytics 4 — dejar vacío para desactivar
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || '',
  contactEmail: 'soporte@conversorpro.com',
  // Para futuras versiones: activar i18n con inglés
  defaultLang: 'es',
  social: {
    twitter: '@conversorpro',
  },
  keywords: [
    'conversor online',
    'convertir unidades',
    'conversor de divisas',
    'conversor pdf',
    'convertir archivos',
    'herramientas online gratis',
    'conversor de moneda',
    'convertir imagen',
    'calcular edad',
    'generador qr',
    'conversor zona horaria',
    'numeros a letras',
    'convertir temperatura',
    'conversor longitud',
    'conversor peso',
    'gratis',
    'sin registro',
    'privacidad online',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
