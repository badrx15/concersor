import Script from 'next/script';
import { siteConfig } from '@/lib/site-config';

export function Analytics() {
  if (!siteConfig.ga4Id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${siteConfig.ga4Id}');
        `}
      </Script>
    </>
  );
}
