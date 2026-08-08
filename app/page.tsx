import Link from 'next/link';
import { CONVERTERS, CATEGORIES, getConvertersByCategory } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';
import { AnimatedCounter } from '@/components/animated-counter';
import { HeroQuickConverter } from '@/components/hero-quick-converter';
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

// Featured advanced tools to showcase on the landing page
const FEATURED_SLUGS = [
  'precio-de-la-luz',
  'calculadora-gasto-electrico',
  'generador-contrasenas',
  'calculadora-imc',
  'calculadora-descuentos',
  'calculadora-porcentaje',
  'calculadora-iva',
  'calculadora-edad',
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

  const featured = FEATURED_SLUGS.map((s) => CONVERTERS.find((c) => c.slug === s))
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

      {/* ================================================================ */}
      {/* HERO SECTION — Animated background + Quick Converter + Stats */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[120px] animate-pulse-slow" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[120px] animate-pulse-slow animation-delay-2000" />
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse-slow animation-delay-4000" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        {/* Floating decorative icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          <span className="absolute top-20 left-[15%] text-3xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>📏</span>
          <span className="absolute top-40 right-[20%] text-4xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>💱</span>
          <span className="absolute top-60 left-[10%] text-2xl opacity-15 animate-float" style={{ animationDelay: '3s' }}>📁</span>
          <span className="absolute top-32 right-[10%] text-3xl opacity-20 animate-float" style={{ animationDelay: '0.8s' }}>🔤</span>
          <span className="absolute bottom-40 left-[25%] text-2xl opacity-15 animate-float" style={{ animationDelay: '2.2s' }}>🌡️</span>
          <span className="absolute bottom-60 right-[15%] text-3xl opacity-15 animate-float" style={{ animationDelay: '4s' }}>⚡</span>
          <span className="absolute top-1/2 left-[5%] text-2xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🔒</span>
          <span className="absolute top-1/3 right-[5%] text-2xl opacity-10 animate-float" style={{ animationDelay: '3.5s' }}>🛡️</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>{CONVERTERS.length}+ conversores</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Sin registro</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>100% privado</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-up">
              Conversores
              <span className="bg-gradient-to-r from-brand-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block sm:inline">
                {' '}online gratis
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Convierte <strong className="text-white">unidades, divisas, archivos y texto</strong> — gratis, sin registro.
              <strong className="text-white"> Tus archivos nunca salen de tu navegador.</strong>
            </p>

            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              Longitud, peso, temperatura, volumen, velocidad · EUR, USD, GBP, JPY · PDF, JPG, PNG, WebP · Mayúsculas, palabras, JSON, CSV
            </p>

            {/* Quick Converter — inline working converter */}
            <div className="mt-10 animate-fade-in-up animation-delay-400">
              <HeroQuickConverter />
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animation-delay-500">
              <Link
                href="/conversores"
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Ver todos los conversores</span>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <span className="ml-2 relative z-10 inline-block group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/privacidad"
                className="px-8 py-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-500 text-white font-semibold text-base transition-all duration-300 hover:scale-105"
              >
                🔒 Privacidad primero
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top ad slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AdSlot slotId="home-top" format="horizontal" />
        </div>
      </div>

      {/* ================================================================ */}
      {/* STATS COUNTERS — Animated on scroll */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatedCounter
            icon="🛠️"
            end={CONVERTERS.length}
            suffix="+"
            label="Herramientas y conversores"
            duration={2200}
          />
          <AnimatedCounter
            icon="📂"
            end={CATEGORIES.length}
            label="Categorías de conversión"
            duration={2000}
          />
          <AnimatedCounter
            icon="🔒"
            end={100}
            suffix="%"
            label="Procesamiento en tu navegador"
            decimals={0}
            duration={2500}
          />
          {/* Static "100% Gratis" badge */}
          <div className="flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-green-900/30 to-green-950/30 border border-green-800/60 backdrop-blur-sm">
            <span className="text-3xl mb-2">💰</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-green-400">€0</span>
            <span className="text-sm text-green-400/80 mt-1 text-center font-medium">Precio — Siempre gratis</span>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURED ADVANCED TOOLS */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">Herramientas destacadas</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">Las más potentes</h2>
          <p className="text-slate-400 mt-2">Herramientas avanzadas que te ayudarán en tu día a día</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((c) => {
            const cat = CATEGORIES.find((cat) => cat.id === c.category);
            return (
              <Link
                key={c.slug}
                href={`/conversor/${c.slug}`}
                className="featured-card group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col h-full overflow-hidden"
                style={{ '--tool-color': c.color } as React.CSSProperties}
              >
                {/* Color accent bar on top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: c.color }}
                />

                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{c.icon}</span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: c.color + '25', color: c.color }}
                  >
                    {cat?.name}
                  </span>
                </div>

                <h3 className="font-bold text-base mb-2 text-white group-hover:text-brand-300 transition-colors">
                  {c.name}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed flex-1">
                  {c.metaDescription.slice(0, 90)}...
                </p>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  <span>Probar ahora</span>
                  <span className="text-sm">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* CATEGORIES */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">Categorías</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">Explora por categoría</h2>
          <p className="text-slate-400 mt-2">{CATEGORIES.length} categorías con los conversores más usados</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = getConvertersByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.id}`}
                className="cat-card group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-transparent transition-all duration-300 overflow-hidden"
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: `radial-gradient(ellipse at top, ${cat.color}, transparent 70%)` }}
                />
                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${cat.color}40` }}
                />

                <div className="relative flex items-center gap-4 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                  <div>
                    <span className="font-bold text-lg" style={{ color: cat.color }}>{cat.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="h-1 w-1 rounded-full" style={{ background: cat.color }} />
                      <span className="text-xs text-slate-500">{count} conversores</span>
                    </div>
                  </div>
                </div>

                <p className="relative text-sm text-slate-400">{cat.description}</p>

                <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: cat.color }}>
                  <span>Explorar categoría</span>
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* POPULAR CONVERTERS */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">Más usados</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">Los favoritos de la comunidad</h2>
          <p className="text-slate-400 mt-2">Acceso rápido a los conversores más utilizados</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((c) => (
            <ConverterCard key={c.slug} converter={c} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/conversores"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-brand-500/50 text-white font-semibold text-sm transition-all duration-300"
          >
            Ver todos los {CONVERTERS.length} conversores
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHY CONVERTERPRO — Trust signals */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 border border-slate-800/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-600/10 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-600/10 blur-[100px]" />

          <div className="relative">
            <div className="text-center mb-10">
              <span className="text-5xl mb-4 block">🔒</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Privado por diseño</h2>
              <p className="text-slate-200 text-lg max-w-2xl mx-auto">
                Cada herramienta procesa tu archivo <strong>dentro de tu navegador</strong>.
                No se sube nada a ningún servidor. No necesitas cuenta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-800/50 hover:border-brand-500/30 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <div className="font-bold mb-2 text-white">100% en tu navegador</div>
                <div className="text-slate-400 text-sm leading-relaxed">PDF, imagen, texto... todo se procesa localmente con JavaScript y Canvas API. Tus archivos nunca salen de tu dispositivo.</div>
              </div>

              <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-800/50 hover:border-brand-500/30 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💸</span>
                </div>
                <div className="font-bold mb-2 text-white">Gratis sin límites</div>
                <div className="text-slate-400 text-sm leading-relaxed">Sin registro, sin paywall, sin tarjeta de crédito. Usa todas las herramientas las veces que quieras.</div>
              </div>

              <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-800/50 hover:border-brand-500/30 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="font-bold mb-2 text-white">Rápido y preciso</div>
                <div className="text-slate-400 text-sm leading-relaxed">Resultados instantáneos sin recargar la página. Tecnología optimizada para máxima velocidad.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEO CONTENT — Texto visible rico en keywords para Google */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose-seo max-w-4xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 text-white">Conversores online gratis — todo lo que necesitas</h2>

          <h3>Convierte unidades de medida online y gratis</h3>
          <p>
            Nuestro <strong>conversor de unidades online</strong> te permite convertir cualquier medida al instante.
            Tanto si necesitas <strong>convertir kilometros a millas</strong> para un viaje por carretera en Estados Unidos,
            como si quieres <strong>pasar metros a pies</strong> para calcular la altura de una persona, o
            <strong>convertir centimetros a pulgadas</strong> para saber el tamaño de una pantalla,
            nuestras herramientas de <strong>conversion de unidades</strong> son rápidas, precisas y funcionan 100% en tu navegador.
          </p>
          <p>
            La <strong>tabla de conversion de unidades</strong> incluida en cada herramienta te muestra las equivalencias más comunes,
            como pasar de <strong>kilogramos a libras</strong> para el peso en el gimnasio,
            <strong>gramos a onzas</strong> para recetas de cocina americanas, o
            <strong>celsius a fahrenheit</strong> para entender el pronóstico del tiempo en países anglosajones.
            También puedes <strong>convertir litros a galones</strong> para combustible y
            <strong>km/h a mph</strong> para velocidad en carretera.
          </p>

          <h3>Conversor de divisas en tiempo real</h3>
          <p>
            ¿Necesitas <strong>convertir euros a dolares</strong> para un viaje a Estados Unidos?
            ¿O quizás <strong>cambiar libras a euros</strong> al hacer compras online en Reino Unido?
            Nuestro <strong>conversor de divisas</strong> actualiza las tasas de cambio en tiempo real
            para que siempre tengas el <strong>tipo de cambio</strong> más preciso.
            Soporta las principales monedas del mundo: <strong>EUR, USD, GBP, JPY, CHF, CAD, AUD, MXN</strong> y muchas más.
          </p>
          <p>
            El <strong>cambio de moneda online</strong> se actualiza periódicamente mediante APIs públicas.
            Ya sea que necesites la <strong>cotizacion del dolar</strong>, el
            <strong>precio del euro</strong>, o quieras saber a cuánto está el
            <strong>cambio de divisas hoy</strong>, nuestra herramienta te da la respuesta al instante.
          </p>

          <h3>Herramientas para archivos PDF online gratis</h3>
          <p>
            Trabaja con documentos PDF sin instalar nada. Puedes <strong>comprimir PDF</strong> para reducir su tamaño
            sin perder calidad, <strong>unir PDF</strong> para combinar varios documentos en uno solo,
            o <strong>dividir PDF</strong> para extraer páginas específicas. También puedes
            <strong>convertir imagenes a PDF</strong> para crear documentos desde tus fotos,
            o <strong>pasar PDF a imagenes</strong> para extraer cada página como PNG.
          </p>
          <p>
            ¿Necesitas <strong>proteger PDF con contraseña</strong> para mantener tus documentos seguros?
            ¿O <strong>desbloquear PDF</strong> para poder editarlos?
            Tenemos herramientas para <strong>reordenar paginas PDF</strong>,
            <strong>numerar paginas PDF</strong>, y
            añadir <strong>marca de agua PDF</strong>.
            También convertimos entre formatos: <strong>Word a PDF</strong>,
            <strong>Excel a PDF</strong>, <strong>PowerPoint a PDF</strong>,
            <strong>HTML a PDF</strong> y viceversa —
            <strong>PDF a Word</strong>, <strong>PDF a Excel</strong>, <strong>PDF a PowerPoint</strong>.
          </p>

          <h3>Convierte imagenes online sin subir archivos</h3>
          <p>
            Cambia el formato de tus fotos e imágenes al instante. Puedes
            <strong>convertir PNG a JPG</strong> para imágenes más ligeras,
            <strong>pasar imagenes a WebP</strong> para optimizar tu web y mejorar los Core Web Vitals,
            o <strong>comprimir imagen</strong> para reducir su peso sin perder calidad visible.
            Todo el procesamiento es 100% local en tu navegador — tus archivos nunca se suben a ningún servidor.
          </p>

          <h3>Herramientas de texto y datos</h3>
          <p>
            Trabaja con texto y datos de forma eficiente. Convierte entre
            <strong>mayusculas y minusculas</strong>,
            usa nuestro <strong>contador de palabras y caracteres</strong> para medir la longitud de tu texto,
            o <strong>convierte JSON a CSV</strong> (y CSV a JSON) para trabajar con datos estructurados.
            Ideal para desarrolladores, escritores, estudiantes y profesionales del marketing digital.
          </p>

          <h3>Nuevas herramientas útiles</h3>
          <p>
            Hemos añadido herramientas muy solicitadas:
            <strong>calculadora de edad</strong> que te dice exactamente cuántos años, meses, días, horas,
            minutos y segundos has vivido, con datos curiosos como tu signo zodiacal;
            <strong>generador de codigos QR</strong> para crear códigos personalizados con colores y
            descargarlos en PNG; <strong>conversor de zona horaria</strong> para saber la hora exacta
            en cualquier ciudad del mundo; y <strong>numeros a letras</strong> que escribe cualquier
            número en español, ideal para cheques, contratos y documentos formales.
          </p>

          <p>
            También contamos con herramientas avanzadas como el <strong>precio de la luz hoy</strong> en España
            para saber cuándo es más barata la electricidad, una <strong>calculadora de gasto eléctrico</strong>
            que te dice cuánto consume cada electrodoméstico, un <strong>generador de contraseñas seguras</strong>,
            <strong>calculadora de IMC</strong>, <strong>calculadora de descuentos</strong>,
            <strong>calculadora de porcentaje</strong>, y mucho más. Todo gratis, sin registro y 100% privado.
          </p>

          <h3>Privacidad total — sin registro, sin servidores</h3>
          <p>
            Todas nuestras <strong>herramientas online gratis</strong> procesan tu información
            directamente en tu navegador, usando JavaScript y tecnologías web modernas como
            Canvas API, jsPDF, pdf-lib y PDF.js. Tus archivos, textos y datos
            <strong>nunca abandonan tu dispositivo</strong>. No necesitas crear una cuenta,
            no te pedimos tu email y no guardamos ningún archivo en nuestros servidores.
            La única excepción es el conversor de divisas, que consulta una API pública de
            tasas de cambio — sin enviar ningún dato personal.
          </p>
          <p className="text-sm text-slate-500">
            Palabras clave relacionadas: conversor online, convertir unidades, conversor de divisas,
            conversor pdf, convertir archivos, herramientas online gratis, calculadora online,
            conversion de unidades, cambio de moneda, convertir imagen, unir pdf, comprimir pdf,
            km a millas, euros a dolares, celsius a fahrenheit, kilos a libras, metros a pies,
            png a jpg, mayusculas a minusculas, contador de palabras, json a csv,
            calculadora de edad, generador qr, zona horaria, numeros a letras,
            precio de la luz hoy, calculadora gasto electrico, generador contraseñas seguras.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FAQ */}
      {/* ================================================================ */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">Preguntas frecuentes</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Resolvemos tus dudas</h2>
            <p className="text-slate-400 mt-2">Todo lo que necesitas saber sobre nuestras herramientas gratuitas</p>
          </div>
          <div className="space-y-3">
            {LANDING_FAQ.map((f, i) => (
              <details
                key={i}
                className="faq-item bg-slate-900/60 border border-slate-800 rounded-xl p-5 group transition-all duration-200 hover:border-brand-500/30 open:border-brand-500/40 open:bg-slate-900/80"
              >
                <summary className="font-semibold flex justify-between items-center cursor-pointer text-white">
                  {f.q}
                  <span className="text-slate-400 faq-arrow transition-transform duration-200 text-sm">▼</span>
                </summary>
                <p className="text-slate-300 mt-3 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400">
              ¿Tienes más preguntas?{' '}
              <Link href="/contacto" className="text-brand-400 hover:underline font-medium">
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ALL CONVERTERS — enlaces directos a todas las herramientas (SEO) */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 sm:p-10">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-brand-400 uppercase tracking-widest">Índice completo</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3">Todas las herramientas gratis</h2>
            <p className="text-slate-400 mt-2">
              {CONVERTERS.length} conversores y calculadoras accesibles desde aquí, sin registro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((cat) => {
              const items = getConvertersByCategory(cat.id);
              return (
                <div key={cat.id}>
                  <Link
                    href={`/categoria/${cat.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold mb-3 hover:opacity-80 transition"
                    style={{ color: cat.color }}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                    <span className="text-slate-500 font-normal">({items.length})</span>
                  </Link>
                  <ul className="space-y-1">
                    {items.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/conversor/${c.slug}`}
                          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition group py-0.5"
                        >
                          <span className="shrink-0">{c.icon}</span>
                          <span className="truncate group-hover:translate-x-0.5 transition-transform">{c.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Converter Card component */
/* ------------------------------------------------------------------ */
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
