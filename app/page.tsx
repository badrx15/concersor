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

      {/* SEO CONTENT — Texto visible rico en keywords para Google */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
            calculadora de edad, generador qr, zona horaria, numeros a letras.
          </p>
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
