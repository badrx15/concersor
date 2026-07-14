import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, CONVERTERS, getConvertersByCategory } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return (async () => {
    const { id } = await params;
    const cat = CATEGORIES.find((c) => c.id === id);
    if (!cat) return {};
    return {
      title: `Conversores de ${cat.name} — Gratis | ConversorPro`,
      description: `${cat.description} ${getConvertersByCategory(cat.id).length} conversores disponibles. Gratis y sin registro.`,
      alternates: { canonical: `/categoria/${id}` },
      openGraph: {
        title: `Conversores de ${cat.name}`,
        description: cat.description,
        url: `${siteConfig.url}/categoria/${id}`,
      },
    };
  })();
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) notFound();

  const tools = getConvertersByCategory(cat.id);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Conversores', item: `${siteConfig.url}/conversores` },
      { '@type': 'ListItem', position: 3, name: cat.name, item: `${siteConfig.url}/categoria/${cat.id}` },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Conversores de ${cat.name}`,
    description: cat.description,
    url: `${siteConfig.url}/categoria/${cat.id}`,
    hasPart: tools.map((t) => ({
      '@type': 'WebApplication',
      name: t.name,
      url: `${siteConfig.url}/conversor/${t.slug}`,
    })),
  };

  return (
    <div className="view-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={[breadcrumbLd, collectionLd]} />

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 flex items-center gap-2 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white">Inicio</Link>
        <span>/</span>
        <Link href="/conversores" className="hover:text-white">Conversores</Link>
        <span>/</span>
        <span className="text-slate-200">{cat.name}</span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{cat.icon}</span>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: cat.color }}>{cat.name}</h1>
          <p className="text-slate-400 mt-1">{cat.description}</p>
        </div>
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
            </div>
            <h3 className="font-bold text-base mb-1">{c.name}</h3>
            <p className="text-slate-400 text-xs leading-relaxed flex-1">{c.metaDescription.slice(0, 90)}...</p>
            <span className="text-xs text-brand-400 font-semibold mt-2">Usar conversor →</span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AdSlot slotId={`cat-${cat.id}`} format="horizontal" />
      </div>

      {/* Cross-category links */}
      <div className="mt-12 pt-8 border-t border-slate-800">
        <h2 className="text-xl font-bold mb-4">Otras categorías</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.id !== cat.id).map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.id}`}
              className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-brand-500 text-sm font-medium transition"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
