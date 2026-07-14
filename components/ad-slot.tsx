'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/site-config';

interface AdSlotProps {
  slotId: string;
  adSlot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  showLabel?: boolean;
}

/**
 * Contenedor de anuncio con dimensiones reservadas fijas para evitar CLS.
 * Cuando AdSense no esté configurado, muestra un placeholder vacío del mismo tamaño.
 */
export function AdSlot({
  slotId,
  adSlot = '1234567890',
  format = 'auto',
  className = '',
  showLabel = true,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const minHeight = format === 'horizontal' ? 90 : format === 'vertical' ? 600 : 250;

  useEffect(() => {
    if (!siteConfig.adsenseClient || !insRef.current) return;
    try {
      // @ts-expect-error — adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script may not be loaded yet — silent
    }
  }, []);

  return (
    <div
      id={`ad-${slotId}`}
      className={`ad-slot relative bg-slate-900/40 border border-slate-800/60 rounded-xl ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Espacio publicitario"
    >
      {showLabel && (
        <span className="text-[10px] uppercase tracking-widest text-slate-600 absolute top-2 left-1/2 -translate-x-1/2">
          Publicidad
        </span>
      )}
      {siteConfig.adsenseClient && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={siteConfig.adsenseClient}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
