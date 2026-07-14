import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CONVERTERS, getConverter, getRelatedConverters, CATEGORIES } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';
import { JsonLd } from '@/components/json-ld';
import { AdSlot } from '@/components/ad-slot';
import { ConverterWidget } from '@/components/converter-widget';

export const dynamicParams = false;

export function generateStaticParams() {
  return CONVERTERS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const converter = getConverter(slug);
    if (!converter) return {};

    return {
      title: converter.metaTitle.replace(new RegExp(`\\s*[|—]\\s*${siteConfig.name}\\s*$`), '').trim(),
      description: converter.metaDescription,
      keywords: converter.keywords,
      alternates: { canonical: `/conversor/${slug}` },
      openGraph: {
        title: converter.metaTitle,
        description: converter.metaDescription,
        url: `${siteConfig.url}/conversor/${slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: converter.metaTitle,
        description: converter.metaDescription,
      },
    };
  })();
}

export default async function ConverterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const converter = getConverter(slug);
  if (!converter) notFound();

  const cat = CATEGORIES.find((c) => c.id === converter.category)!;
  const related = getRelatedConverters(slug, 6);

  // Schema.org WebApplication
  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: converter.name,
    description: converter.metaDescription,
    url: `${siteConfig.url}/conversor/${converter.slug}`,
    applicationCategory: cat.name,
    operatingSystem: 'Any (browser-based)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };

  // Schema.org FAQPage
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: converter.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="view-fade">
      <JsonLd data={[webAppLd, faqLd]} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-slate-400 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Inicio</Link>
          <span>/</span>
          <Link href="/conversores" className="hover:text-white">Conversores</Link>
          <span>/</span>
          <Link href={`/categoria/${converter.category}`} className="hover:text-white">{cat.name}</Link>
          <span>/</span>
          <span className="text-slate-200">{converter.name}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-8">
        <div className="flex items-start gap-4">
          <div
            className="text-5xl sm:text-6xl rounded-2xl p-3 sm:p-4 shrink-0"
            style={{ background: converter.color + '22' }}
          >
            {converter.icon}
          </div>
          <div>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: converter.color }}
            >
              {cat.icon} {cat.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">{converter.name}</h1>
          </div>
        </div>
      </header>

      {/* Main grid: tool + sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tool card */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Conversor</h2>
            <ConverterWidget converter={converter} />
          </div>

          {/* Sidebar: ad + privacy note */}
          <aside className="lg:col-span-1 space-y-4">
            <AdSlot slotId="converter-sidebar" format="rectangle" />
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100 mb-1">🔒 Privacidad total</div>
              <p>
                Tu archivo o texto se procesa en tu navegador. Nunca se sube a ningún servidor.
                Cierra la pestaña y desaparece.
              </p>
            </div>
          </aside>
        </div>

        {/* Mid-page ad */}
        <div className="mt-8">
          <AdSlot slotId="converter-mid" format="horizontal" />
        </div>

        {/* SEO: Explanation */}
        <section className="mt-12 prose-seo max-w-4xl">
          <h2>Cómo convertir {converter.name.toLowerCase()}</h2>
          {converter.explanation.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        {/* SEO: Equivalence table */}
        <section className="mt-10 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Tabla de equivalencias</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-200">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-200">Equivalencia</th>
                </tr>
              </thead>
              <tbody>
                {converter.equivalences.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-300 font-mono">{row.from}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{row.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SEO: FAQ with Schema */}
        <section className="mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {converter.faq.map((f, i) => (
              <details key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 group">
                <summary className="font-semibold flex justify-between items-center text-slate-100">
                  {f.q}
                  <span className="text-slate-400 faq-arrow shrink-0 ml-4">▼</span>
                </summary>
                <p className="text-slate-300 mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related converters */}
        <section className="mt-16 pt-8 border-t border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Conversores relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/conversor/${c.slug}`}
                className="tool-card bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1 h-full"
                style={{ ['--tool-color' as string]: c.color }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.color + '33', color: c.color }}>
                    {CATEGORIES.find((cat) => cat.id === c.category)?.name}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1">{c.name}</h3>
                <span className="text-xs text-brand-400 font-semibold mt-auto">Usar conversor →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
