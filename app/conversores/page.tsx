import Link from 'next/link';
import type { Metadata } from 'next';
import { CONVERTERS, CATEGORIES } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Todos los conversores online gratis | ConversorPro',
  description: 'Lista completa de conversores: unidades, divisas, archivos y texto. Gratis, sin registro, 100% en tu navegador.',
  alternates: { canonical: '/conversores' },
};

export default function ConversoresPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Conversores', item: `${siteConfig.url}/conversores` },
    ],
  };

  return (
    <div className="view-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={breadcrumbLd} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos los conversores</h1>
        <p className="text-slate-400">{CONVERTERS.length} conversores online gratis · Sin registro · 100% privados</p>
      </div>

      {/* Category sections */}
      {CATEGORIES.map((cat) => {
        const tools = CONVERTERS.filter((c) => c.category === cat.id);
        if (tools.length === 0) return null;
        return (
          <section key={cat.id} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: cat.color }}>{cat.name}</h2>
                <p className="text-sm text-slate-400">{cat.description}</p>
              </div>
              <Link href={`/categoria/${cat.id}`} className="ml-auto text-sm text-brand-400 hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map((c) => (
                <Link
                  key={c.slug}
                  href={`/conversor/${c.slug}`}
                  className="tool-card bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1 h-full"
                  style={{ ['--tool-color' as string]: c.color }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{c.icon}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: c.color + '33', color: c.color }}>
                      {cat.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-1">{c.name}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed flex-1">{c.metaDescription.slice(0, 90)}...</p>
                  <span className="text-xs text-brand-400 font-semibold mt-2">Usar conversor →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-8">
        <AdSlot slotId="conversores-bottom" format="horizontal" />
      </div>
    </div>
  );
}
