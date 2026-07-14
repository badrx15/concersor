/**
 * Configuración global del sitio.
 * Editar estos valores para personalizar el despliegue.
 */
export const siteConfig = {
  name: 'Conversor Pro',
  shortName: 'ConversorPro',
  description:
    'Conversores online gratis: unidades, divisas, archivos y texto. Rápido, preciso y sin registro. Procesamiento 100% en tu navegador.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://conversoresweb.vercel.app',
  locale: 'es-ES',
  // Google AdSense — sustituir con tu publisher ID real tras la aprobación
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-8885324906798080',
  // Google Analytics 4 — dejar vacío para desactivar
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || '',
  contactEmail: 'soporte@conversorpro.com',
  // Para futuras versiones: activar i18n con inglés
  defaultLang: 'es',
} as const;

export type SiteConfig = typeof siteConfig;
