# ConversorPro — Web de conversores online multi-herramienta

Web de conversión multi-herramienta (unidades, divisas, archivos, texto) construida con **Next.js 16**, **React 19**, **TypeScript** y **Tailwind CSS v4**. Optimizada para SEO con SSG, datos estructurados (Schema.org), sitemap dinámico y Core Web Vitals en verde. Monetizable con Google AdSense.

## ✨ Características

- **SSG por defecto**: cada página de conversor se pre-renderiza en build time → Google lee el HTML sin JS.
- **SEO completo**: metadata dinámica por página, canonical, OG tags, JSON-LD (WebApplication + FAQPage + BreadcrumbList).
- **Sitemap y robots automáticos**: se generan con `app/sitemap.ts` y `app/robots.ts`.
- **Arquitectura config-driven**: añade conversores desde un único archivo `lib/converters.ts`.
- **Privacidad total**: los conversores de archivos procesan 100% en el navegador (Canvas API, jsPDF, pdf-lib, pdf.js).
- **Divisas en tiempo real**: API con 3 niveles de resiliencia (memoria → exchangerate.host → frankfurter.app).
- **AdSense ready**: ad slots con dimensiones reservadas (sin CLS). Solo pega tu publisher ID.
- **GA4 ready**: pega tu ID de Google Analytics 4 y listo.
- **i18n ready**: arquitectura preparada para multiidioma (futura versión en inglés).
- **Responsive mobile-first**: optimizado para tráfico móvil mayoritario.

## 🚀 Quick start

```bash
cd conversores-web
npm install
npm run dev
```

Abre `http://localhost:3000`.

### Variables de entorno

Crea `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

Si no configuras `ADSENSE_CLIENT` o `GA4_ID`, los scripts no se cargan (perfecto para desarrollo).

## 📦 Build y despliegue

```bash
npm run build
npm start
```

### Despliegue en Vercel

1. Sube el repo a GitHub.
2. Importa el proyecto en [vercel.com](https://vercel.com).
3. Configura las variables de entorno.
4. Despliega. Vercel detecta Next.js automáticamente.

## 🛠️ Cómo añadir un nuevo conversor

Todo se controla desde `lib/converters.ts`. Para añadir un conversor nuevo:

### 1. Añade el objeto al array `CONVERTERS`

```typescript
{
  slug: 'mi-nuevo-conversor',           // URL: /conversor/mi-nuevo-conversor
  name: 'Mi Nuevo Conversor',
  category: 'unidades',                  // unidades | divisas | archivos | texto
  icon: '🔧',
  color: '#3b82f6',
  widget: 'unit-converter',              // tipo de widget a renderizar
  widgetConfig: { unitCategory: 'length', defaultFrom: 'metro', defaultTo: 'kilometro' },

  // SEO — se inyectan en <head> server-side
  metaTitle: 'Mi Conversor — Gratis | ConversorPro',
  metaDescription: 'Descripción de 150-160 caracteres para SEO.',

  // Contenido SEO — se renderiza en la página (visible sin JS)
  explanation: [
    'Primer párrafo explicando cómo funciona la conversión.',
    'Segundo párrafo con contexto o uso común.',
  ],
  equivalences: [
    { from: '1 unidad', to: 'X equivalencia' },
    { from: '10 unidades', to: 'Y equivalencia' },
  ],
  faq: [
    { q: '¿Pregunta 1?', a: 'Respuesta 1.' },
    { q: '¿Pregunta 2?', a: 'Respuesta 2.' },
  ],

  // Enlazado interno — slugs de conversores relacionados
  related: ['kilometros-a-millas', 'metros-a-pies'],

  // Keywords para meta tags
  keywords: ['mi conversor', 'convertir X a Y'],
}
```

### 2. Si necesitas un widget nuevo

Si tu conversor necesita una interfaz que no existe:

1. Crea `components/widgets/mi-widget.tsx` con `'use client'`.
2. Añade el caso en `components/converter-widget.tsx`.
3. Usa los helpers de `components/widgets/shared.tsx` (FileDrop, DownloadButton, etc.).

### 3. Automático

Al añadir el conversor al array, automáticamente se generan:
- ✅ Página en `/conversor/[slug]` (SSG)
- ✅ Entrada en el sitemap.xml
- ✅ Metadata dinámica (title, description, canonical, OG)
- ✅ JSON-LD (WebApplication + FAQPage)
- ✅ Página en la categoría correspondiente
- ✅ Enlaces relacionados desde otros conversores

**No necesitas tocar nada más.** El sitemap, el routing y el SEO se actualizan solos.

## 📁 Estructura

```
conversores-web/
├── app/
│   ├── layout.tsx              # Layout raíz: nav, footer, GA4, AdSense
│   ├── page.tsx                # Landing (/)
│   ├── sitemap.ts              # Sitemap dinámico
│   ├── robots.ts               # Robots.txt dinámico
│   ├── conversor/
│   │   └── [slug]/page.tsx     # Página de conversor (SSG + SEO + JSON-LD)
│   ├── conversores/page.tsx    # Lista de todos los conversores
│   ├── categoria/
│   │   └── [id]/page.tsx       # Página por categoría (SSG)
│   ├── sobre-nosotros/         # Página "Sobre nosotros"
│   ├── privacidad/             # Política de privacidad
│   ├── contacto/               # Contacto
│   └── api/
│       └── rates/route.ts      # API de divisas con cache
├── components/
│   ├── navbar.tsx              # Navegación responsive
│   ├── footer.tsx              # Footer con enlaces
│   ├── ad-slot.tsx             # Ad slot con dimensiones reservadas
│   ├── adsense-script.tsx      # Script de AdSense
│   ├── analytics.tsx           # GA4
│   ├── json-ld.tsx             # Inyección de Schema.org
│   ├── converter-widget.tsx    # Dispatcher de widgets
│   └── widgets/                # Widgets cliente de cada conversor
│       ├── unit-converter.tsx
│       ├── currency-converter.tsx
│       ├── png-to-jpg.tsx
│       ├── image-to-webp.tsx
│       ├── compress-image.tsx
│       ├── image-to-pdf.tsx
│       ├── pdf-to-images.tsx
│       ├── compress-pdf.tsx
│       ├── case-converter.tsx
│       ├── word-counter.tsx
│       ├── json-csv.tsx
│       └── shared.tsx          # Helpers compartidos (FileDrop, etc.)
├── lib/
│   ├── site-config.ts          # Configuración global
│   ├── converters.ts           # REGISTRO de conversores (config-driven)
│   └── units.ts                # Tablas de unidades y funciones
├── package.json
└── next.config.ts
```

## 🔍 SEO Checklist

- [x] Meta tags únicos por página (title, description)
- [x] URLs amigables: `/conversor/kilometros-a-millas`
- [x] Datos estructurados: WebApplication, FAQPage, BreadcrumbList
- [x] Sitemap.xml generado automáticamente
- [x] robots.txt con sitemap referenciado
- [x] Etiquetas canónicas en cada página
- [x] Contenido textual por conversor (explicación + tabla + FAQ)
- [x] Enlazado interno entre conversores relacionados
- [x] Ad slots con dimensiones reservadas (sin CLS)
- [x] Renderizado SSG (Google lee HTML sin JS)
- [x] Mobile-first responsive

## 📊 Core Web Vitals

- **LCP**: fuentes cargadas con `next/font` (display: swap), sin imágenes pesadas en hero.
- **CLS**: ad slots con `min-height` fijo, sin contenido dinámico sin reservar espacio.
- **FID/INP**: widgets cliente ligeros, librerías CDN cargadas lazy solo cuando se usa.

## 📝 Licencia

MIT
# concersor
