import type { MetadataRoute } from 'next';
import { CONVERTERS, CATEGORIES } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteConfig.url}/conversores`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/sobre-nosotros`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteConfig.url}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${siteConfig.url}/categoria/${cat.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const converterPages: MetadataRoute.Sitemap = CONVERTERS.map((c) => ({
    url: `${siteConfig.url}/conversor/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...converterPages];
}
