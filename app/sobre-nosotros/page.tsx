import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Sobre nosotros — ConversorPro',
  description: 'Por qué construimos conversores online 100% gratis, privados y sin registro.',
  alternates: { canonical: '/sobre-nosotros' },
};

export default function AboutPage() {
  return (
    <div className="view-fade max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-6">Sobre nosotros</h1>

      <div className="prose-seo">
        <p>
          <strong>{siteConfig.name}</strong> es un proyecto de herramientas online gratuitas que respetan
          tu privacidad y tu tiempo. No necesitas cuenta, no necesitas instalar nada, y no te rastreamos
          más allá de lo que Google AdSense necesita para mostrar anuncios relevantes.
        </p>

        <h2>Nuestra misión</h2>
        <p>
          Creemos que las herramientas básicas de conversión deberían ser accesibles para todos, gratis,
          sin barreras y sin comprometer la privacidad. Por eso construimos cada conversor para que
          funcione enteramente en tu navegador.
        </p>

        <h2>Procesamiento 100% local</h2>
        <p>
          Todas las herramientas disponibles procesan tu información localmente en tu dispositivo, usando
          JavaScript estándar del navegador. Cuando subes una imagen, un PDF, o pegas texto, ese contenido
          <strong> nunca abandona tu navegador</strong>. La única excepción es el conversor de divisas,
          que consulta una API pública para tasas en vivo (sin enviar ningún archivo).
        </p>

        <h2>Tecnología</h2>
        <p>
          Esta web está construida con <strong>Next.js</strong> (React) y <strong>Tailwind CSS</strong>,
          con renderizado del lado del servidor (SSG) para que Google pueda indexar todo el contenido
          sin ejecutar JavaScript pesado. La arquitectura está preparada para escalar a más conversores
          y soportar multiidioma en el futuro.
        </p>

        <h2>Contacto</h2>
        <p>
          Si encuentras un bug o quieres sugerir una herramienta nueva,{' '}
          <Link href="/contacto" className="text-brand-400 hover:underline">escríbenos</Link>.
        </p>
      </div>
    </div>
  );
}
