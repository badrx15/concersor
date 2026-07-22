import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Política de Privacidad — ConversorPro',
  description: 'Tus archivos se procesan en tu navegador y nunca se suben a ningún servidor. Política de privacidad completa sobre cookies, AdSense, Analytics y procesamiento de datos.',
  keywords: ['privacidad', 'politica privacidad', 'proteccion datos', 'cookies', 'procesamiento local', 'seguridad'],
  alternates: { canonical: '/privacidad' },
  openGraph: {
    title: 'Política de Privacidad — ConversorPro',
    description: 'Tus archivos nunca salen de tu navegador. Conoce nuestra política de privacidad completa.',
    url: `${siteConfig.url}/privacidad`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="view-fade max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-6">Política de Privacidad</h1>

      <div className="prose-seo">
        <h2>Resumen</h2>
        <p>
          Esta web no recoge datos personales tuyos más allá de los que Google AdSense y Google Analytics
          necesitan para funcionar. Tus archivos se procesan en tu navegador y no se suben a ningún servidor.
        </p>

        <h2>Procesamiento client-side</h2>
        <p>
          Los conversores de archivos (imágenes, PDFs) y de texto procesan tu información localmente en tu
          dispositivo, usando JavaScript estándar del navegador. Cuando subes una imagen, un PDF o pegas texto,
          ese contenido nunca abandona tu navegador. No se almacena en nuestros servidores.
        </p>

        <h2>Anuncios (Google AdSense)</h2>
        <p>
          Esta web muestra anuncios mediante Google AdSense. Google puede usar cookies para personalizar los
          anuncios según tu navegación previa en otros sitios. Puedes gestionar las cookies de personalización
          en{' '}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener" className="text-brand-400 hover:underline">
            adssettings.google.com
          </a>.
        </p>

        <h2>Analítica (Google Analytics 4)</h2>
        <p>
          Utilizamos Google Analytics 4 para entender cómo se usa la web (páginas visitadas, tiempo de permanencia,
          dispositivo). Los datos son anónimos y agregados. No se asocia tu actividad con tu identidad personal.
        </p>

        <h2>Conversor de divisas</h2>
        <p>
          El conversor de moneda consulta una API pública (exchangerate.host, frankfurter.app) para obtener
          tasas de cambio en vivo. No se envía ningún dato personal, solo se solicita la tabla de tasas. El
          resultado se cachea en el servidor durante varias horas para optimizar el rendimiento.
        </p>

        <h2>Cookies de terceros</h2>
        <p>
          Google AdSense y Google Analytics pueden establecer cookies en tu navegador. Estas cookies son
          gestionadas por Google y se rigen por su propia política de privacidad. Puedes bloquearlas
          configurando tu navegador o usando extensiones de bloqueo de anuncios.
        </p>

        <h2>Datos que NO recogemos</h2>
        <ul className="list-disc pl-6 space-y-1 text-slate-300">
          <li>No registramos direcciones IP.</li>
          <li>No guardamos los archivos que conviertes.</li>
          <li>No pedimos registro ni email.</li>
          <li>No vendemos datos a terceros.</li>
        </ul>

        <h2>Contacto</h2>
        <p>
          Preguntas sobre privacidad: <Link href="/contacto" className="text-brand-400 hover:underline">/contacto</Link> o
          escribe a <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-400 hover:underline">{siteConfig.contactEmail}</a>.
        </p>

        <p className="text-sm text-slate-500 mt-8">Última actualización: {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
