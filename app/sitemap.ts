import type { MetadataRoute } from 'next';
import { CONVERTERS, CATEGORIES } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: 'daily' },
    { url: `${siteConfig.url}/conversores`, changeFrequency: 'daily' },
    { url: `${siteConfig.url}/sobre-nosotros`, changeFrequency: 'daily' },
    { url: `${siteConfig.url}/privacidad`, changeFrequency: 'daily' },
    { url: `${siteConfig.url}/contacto`, changeFrequency: 'daily' },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${siteConfig.url}/categoria/${cat.id}`,
    changeFrequency: 'daily',
  }));

  const converterPages: MetadataRoute.Sitemap = CONVERTERS.map((c) => ({
    url: `${siteConfig.url}/conversor/${c.slug}`,
    changeFrequency: 'daily',
  }));

  return [...staticPages, ...categoryPages, ...converterPages];
}
