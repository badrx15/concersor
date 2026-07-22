import Link from 'next/link';
import { CONVERTERS, CATEGORIES, getConvertersByCategory } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversores online gratis — unidades, divisas, archivos | ConversorPro',
  description: siteConfig.description,
  keywords: [
    'conversor online gratis',
    'convertir unidades online',
    'conversor de divisas gratis',
    'herramientas online',
    'convertir archivos gratis',
    'conversor de moneda',
    'convertir pdf online',
    'conversor de temperatura',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Conversores online gratis — unidades, divisas, archivos y texto',
    description: siteConfig.description,
    url: siteConfig.url,
    type: 'website',
  },
};

const POPULAR_SLUGS = [
  'kilometros-a-millas',
  'celsius-a-fahrenheit',
  'euros-a-dolares',
  'png-a-jpg',
  'comprimir-pdf',
  'contador-palabras',
  'json-a-csv',
  'mayusculas-a-minusculas',
];

const LANDING_FAQ = [
  {
    q: '¿Mis archivos se suben a algún servidor?',
    a: 'No. El procesamiento de archivos (imágenes, PDFs) es 100% local en tu navegador. Tus archivos nunca salen de tu dispositivo. La única excepción es el conversor de divisas, que consulta una API pública para tasas en vivo.',
  },
  {
    q: '¿Necesito instalar algo?',
    a: 'No. Funciona en cualquier navegador moderno (Chrome, Firefox, Safari, Edge) sin instalar nada. En móvil también, sin app nativa.',
  },
  {
    q: '¿Hay límite de uso?',
    a: 'No. Puedes usar todas las herramientas las veces que quieras, sin registro y sin límite.',
  },
  {
    q: '¿Por qué hay anuncios?',
    a: 'Las herramientas son gratis gracias a Google AdSense. Los anuncios no afectan al procesamiento de tus archivos.',
  },
];

export default function HomePage() {
  const popular = POPULAR_SLUGS.map((s) => CONVERTERS.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/conversores?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    foundingDate: '2024',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Todas las herramientas son completamente gratuitas',
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: LANDING_FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="view-fade">
      <JsonLd data={[websiteLd, organizationLd, faqLd]} />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            {CONVERTERS.length}+ conversores · Sin registro · 100% privado
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Conversores
            <span className="bg-gradient-to-r from-brand-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"> online gratis</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Convierte <strong className="text-white">unidades, divisas, archivos y texto</strong> — gratis, sin registro.
            <strong className="text-white"> Tus archivos nunca salen de tu navegador.</strong>
          </p>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Longitud, peso, temperatura, volumen, velocidad · EUR, USD, GBP, JPY · PDF, JPG, PNG, WebP · Mayúsculas, palabras, JSON, CSV
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/conversores"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:scale-105 transition-all"
            >
              Ver todos los conversores →
            </Link>
            <Link
              href="/privacidad"
              className="px-8 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-white font-semibold text-base transition"
            >
              🔒 Privacidad primero
            </Link>
          </div>
        </div>

        {/* Top ad slot */}
        <div className="mt-16 max-w-4xl mx-auto">
          <AdSlot slotId="home-top" format="horizontal" />
        </div>

        {/* Categories */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-2">Explora por categoría</h2>
          <p className="text-center text-slate-400 mb-10">{CATEGORIES.length} categorías con los conversores más usados</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const count = getConvertersByCategory(cat.id).length;
              return (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.id}`}
                  className="cat-chip group p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500 transition flex flex-col gap-1"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-bold text-lg" style={{ color: cat.color }}>{cat.name}</span>
                  </div>
                  <p className="text-sm text-slate-400">{cat.description}</p>
                  <span className="text-xs text-brand-400 font-semibold mt-2">{count} conversores →</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular converters */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-2">Los más usados</h2>
          <p className="text-center text-slate-400 mb-10">Acceso rápido a los conversores favoritos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((c) => (
              <ConverterCard key={c.slug} converter={c} />
            ))}
          </div>
        </div>

        {/* Privacy banner */}
        <div className="mt-24 max-w-4xl mx-auto bg-gradient-to-br from-brand-600/20 to-cyan-500/20 border border-brand-500/30 rounded-3xl p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center">🔒 Privado por diseño</h2>
          <p className="text-slate-200 text-center text-lg mb-6">
            Cada herramienta procesa tu archivo <strong>dentro de tu navegador</strong>.
            No se sube nada a ningún servidor. No necesitas cuenta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
            <div className="bg-slate-950/50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🏠</div>
              <div className="font-bold mb-1">100% en tu navegador</div>
              <div className="text-slate-400">PDF, imagen, texto... todo se procesa localmente</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💸</div>
              <div className="font-bold mb-1">Gratis sin límites</div>
              <div className="text-slate-400">Sin registro, sin paywall, sin tarjeta</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold mb-1">Rápido y preciso</div>
              <div className="text-slate-400">Resultados instantáneos, sin esperas</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">Preguntas frecuentes</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Resolvemos tus dudas</h2>
          </div>
          <div className="space-y-3">
            {LANDING_FAQ.map((f, i) => (
              <details key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 group">
                <summary className="font-semibold flex justify-between items-center">
                  {f.q}
                  <span className="text-slate-400 faq-arrow">▼</span>
                </summary>
                <p className="text-slate-300 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ConverterCard({ converter }: { converter: (typeof CONVERTERS)[0] }) {
  const cat = CATEGORIES.find((c) => c.id === converter.category);
  return (
    <Link
      href={`/conversor/${converter.slug}`}
      className="tool-card bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1 h-full"
      style={{ ['--tool-color' as string]: converter.color }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl">{converter.icon}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: converter.color + '33', color: converter.color }}>
          {cat?.name}
        </span>
      </div>
      <h3 className="font-bold text-base mb-1">{converter.name}</h3>
      <p className="text-slate-400 text-xs leading-relaxed flex-1">{converter.metaDescription.slice(0, 80)}...</p>
      <span className="text-xs text-brand-400 font-semibold mt-2">Usar conversor →</span>
    </Link>
  );
}
