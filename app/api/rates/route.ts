import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache (per server instance)
let memCache: { ts: number; base: string; data: Record<string, number> } | null = null;

const RATES_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

interface RatesResponse {
  base: string;
  date?: string;
  rates: Record<string, number>;
}

async function fetchJson(url: string, timeoutMs = 5000): Promise<RatesResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    // exchangerate.host format: { base, rates, date }
    // frankfurter.app format: { amount, base, date, rates }
    if (data.rates) {
      return { base: data.base || '', date: data.date, rates: data.rates };
    }
    throw new Error('Formato de respuesta no válido');
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const base = (params.get('base') || 'EUR').toUpperCase();
  const now = Date.now();

  // 1. Memory cache
  if (memCache && memCache.base === base && now - memCache.ts < RATES_CACHE_TTL) {
    return NextResponse.json({
      base,
      rates: memCache.data,
      cached: true,
      source: 'memory',
      cacheAgeMin: Math.round((now - memCache.ts) / 60000),
    });
  }

  // 2. Try exchangerate.host, then frankfurter.app
  const providers: { name: string; url: string }[] = [
    { name: 'exchangerate.host', url: `https://api.exchangerate.host/latest?base=${base}` },
    { name: 'frankfurter.app', url: `https://api.frankfurter.app/latest?from=${base}` },
  ];

  for (const provider of providers) {
    try {
      const data = await fetchJson(provider.url);
      if (data.rates && Object.keys(data.rates).length > 0) {
        // Include base currency as 1:1 for convenience
        const rates = { ...data.rates, [base]: 1 };
        memCache = { ts: now, base, data: rates };
        return NextResponse.json({
          base,
          date: data.date,
          rates,
          cached: false,
          source: provider.name,
        });
      }
    } catch (e) {
      console.warn(`[rates] ${provider.name} failed:`, e);
    }
  }

  // 3. Return stale memory cache if available
  if (memCache) {
    return NextResponse.json({
      base: memCache.base,
      rates: memCache.data,
      cached: true,
      source: 'stale-memory',
      cacheAgeMin: Math.round((now - memCache.ts) / 60000),
    });
  }

  return NextResponse.json(
    { error: 'No se pudieron obtener tasas. Intenta en unos minutos.' },
    { status: 503 }
  );
}
