import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELECZ_BASE = 'https://elecz.com/signal';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  ts: number;
  data: LuzResponse;
}

let cache: CacheEntry | null = null;

/**
 * Compara si dos strings ISO pertenecen a la misma hora (ignora minutos/segundos).
 */
function sameHour(a: string, b: string): boolean {
  try {
    const da = new Date(a);
    const db = new Date(b);
    return (
      da.getUTCFullYear() === db.getUTCFullYear() &&
      da.getUTCMonth() === db.getUTCMonth() &&
      da.getUTCDate() === db.getUTCDate() &&
      da.getUTCHours() === db.getUTCHours()
    );
  } catch {
    return a.slice(0, 13) === b.slice(0, 13);
  }
}

// ================================================================
// Tipos
// ================================================================

interface HourPrice {
  hour: string;
  price: number;
  unit: string;
}

interface LuzResponse {
  current: {
    price: number;
    unit: string;
    currency: string;
    signal: string;
    timestamp: string;
    age_seconds: number;
  };
  cheapest: {
    available: boolean;
    energy_state: string;
    current_hour_signal: string;
    current_hour_is_cheap: boolean;
    current_hour_rank: number;
    next_cheap_hour: string | null;
    hours_until_next_cheap: number;
    cheap_hours_remaining_today: number;
    cheapest_hours: HourPrice[];
    best_3h_window: { start: string; end: string; avg_price: number } | null;
    recommendation: string;
  };
  allHours: HourPrice[];         // Todas las 24h ordenadas cronológicamente
  currentHourIndex: number;      // Índice de la hora actual en allHours
  stats: {
    average: number;             // Precio medio del día
    min: HourPrice | null;       // Hora más barata
    max: HourPrice | null;       // Hora más cara
    median: number;              // Precio mediano
    range: number;               // Rango (max - min)
    volatility: number;          // Desviación típica aproximada
    currentPercentile: number;   // Percentil de la hora actual (0-100)
    cheaperHours: number;        // Horas más baratas que ahora
    expensiveHours: number;      // Horas más caras que ahora
    isCheapestHour: boolean;     // ¿Es ahora la hora más barata?
    isMostExpensiveHour: boolean;// ¿Es ahora la hora más cara?
    cheapest3hAvg: number | null;// Media de las 3h más baratas consecutivas
    bestHourSlot: {              // La hora individual más barata del día
      hour: string;
      price: number;
    } | null;
    worstHourSlot: {             // La hora individual más cara del día
      hour: string;
      price: number;
    } | null;
  };
  trend: {
    direction: 'up' | 'down' | 'stable';  // Tendencia respecto a la hora anterior
    change: number;                        // Cambio absoluto
    changePercent: number;                 // Cambio porcentual
    nextHour: {                            // Previsión de la siguiente hora
      price: number;
      direction: 'up' | 'down' | 'stable';
    } | null;
    priceMovement: 'rapidly_rising' | 'rising' | 'stable' | 'falling' | 'rapidly_falling';
  };
  recommendation: {
    short: string;
    detail: string;
    color: string;
    icon: string;
  };
}

// ================================================================
// Helpers
// ================================================================

function calcStats(allHours: HourPrice[]): LuzResponse['stats'] {
  if (!allHours.length) {
    return {
      average: 0, min: null, max: null, median: 0, range: 0,
      volatility: 0, currentPercentile: 50, cheaperHours: 0,
      expensiveHours: 0, isCheapestHour: false, isMostExpensiveHour: false,
      cheapest3hAvg: null, bestHourSlot: null, worstHourSlot: null,
    };
  }

  const prices = allHours.map(h => h.price);
  const sorted = [...prices].sort((a, b) => a - b);
  const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
  const minPrice = sorted[0];
  const maxPrice = sorted[sorted.length - 1];
  const range = maxPrice - minPrice;

  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  // Volatility (std dev)
  const variance = prices.reduce((s, p) => s + Math.pow(p - avg, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);

  // Current hour percentile — compare using Date objects for robustness
  const now = new Date();
  const nowIso = now.toISOString();
  const currentPriceEntry = allHours.find(h => sameHour(h.hour, nowIso));
  let currentPrice = prices[prices.length - 1]; // fallback to last hour
  if (currentPriceEntry) {
    currentPrice = currentPriceEntry.price;
  }

  const cheaperHours = sorted.filter(p => p < currentPrice).length;
  const expensiveHours = sorted.filter(p => p > currentPrice).length;
  const currentPercentile = sorted.length > 0
    ? Math.round((cheaperHours / sorted.length) * 100)
    : 50;

  const isCheapestHour = currentPrice <= minPrice + 0.001;
  const isMostExpensiveHour = currentPrice >= maxPrice - 0.001;

  // Best 3 consecutive hours
  let best3hAvg: number | null = null;
  for (let i = 0; i <= allHours.length - 3; i++) {
    const sum = allHours[i].price + allHours[i + 1].price + allHours[i + 2].price;
    const avg3 = sum / 3;
    if (best3hAvg === null || avg3 < best3hAvg) {
      best3hAvg = avg3;
    }
  }

  // Best and worst individual hours
  const bestHourSlot = allHours.reduce((best, h) => h.price < best.price ? h : best);
  const worstHourSlot = allHours.reduce((worst, h) => h.price > worst.price ? h : worst);

  return {
    average: parseFloat(avg.toFixed(2)),
    min: { hour: allHours.find(h => h.price === minPrice)?.hour || '', price: minPrice, unit: 'c/kWh' },
    max: { hour: allHours.find(h => h.price === maxPrice)?.hour || '', price: maxPrice, unit: 'c/kWh' },
    median: parseFloat(median.toFixed(2)),
    range: parseFloat(range.toFixed(2)),
    volatility: parseFloat(volatility.toFixed(2)),
    currentPercentile,
    cheaperHours,
    expensiveHours,
    isCheapestHour,
    isMostExpensiveHour,
    cheapest3hAvg: best3hAvg !== null ? parseFloat(best3hAvg.toFixed(2)) : null,
    bestHourSlot: { hour: bestHourSlot.hour, price: bestHourSlot.price },
    worstHourSlot: { hour: worstHourSlot.hour, price: worstHourSlot.price },
  };
}

function calcTrend(allHours: HourPrice[]): LuzResponse['trend'] {
  if (allHours.length < 2) {
    return {
      direction: 'stable', change: 0, changePercent: 0,
      nextHour: null, priceMovement: 'stable',
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const currentIdx = allHours.findIndex(h => sameHour(h.hour, nowIso));

  if (currentIdx <= 0) {
    return {
      direction: 'stable', change: 0, changePercent: 0,
      nextHour: allHours.length > currentIdx + 1
        ? { price: allHours[currentIdx + 1].price, direction: 'stable' }
        : null,
      priceMovement: 'stable',
    };
  }

  const currentP = allHours[currentIdx].price;
  const prevP = allHours[currentIdx - 1].price;
  const change = parseFloat((currentP - prevP).toFixed(2));
  const changePercent = prevP > 0 ? parseFloat(((change / prevP) * 100).toFixed(1)) : 0;

  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (change > 0.05) direction = 'up';
  else if (change < -0.05) direction = 'down';

  // Next hour forecast
  let nextHour = null;
  if (currentIdx < allHours.length - 1) {
    const next = allHours[currentIdx + 1];
    const nextChange = next.price - currentP;
    const nextDir: 'up' | 'down' | 'stable' = nextChange > 0.05 ? 'up' : nextChange < -0.05 ? 'down' : 'stable';
    nextHour = { price: next.price, direction: nextDir };
  }

  // Price movement description (looking at last 3 hours)
  let priceMovement: LuzResponse['trend']['priceMovement'] = 'stable';
  if (currentIdx >= 3) {
    const recent = allHours.slice(currentIdx - 2, currentIdx + 1).map(h => h.price);
    const avgChange = (recent[2] - recent[0]) / 2;
    if (avgChange > 1) priceMovement = 'rapidly_rising';
    else if (avgChange > 0.3) priceMovement = 'rising';
    else if (avgChange < -1) priceMovement = 'rapidly_falling';
    else if (avgChange < -0.3) priceMovement = 'falling';
  }

  return { direction, change, changePercent, nextHour, priceMovement };
}

function buildRecommendation(
  data: Pick<LuzResponse['current'], 'price'>,
  stats: LuzResponse['stats'],
  trend: LuzResponse['trend'],
  signal: string
): LuzResponse['recommendation'] {
  const isCheap = signal === 'very_low' || signal === 'low';
  const isExpensive = signal === 'high' || signal === 'very_high' || signal === 'critical';
  const isRising = trend.direction === 'up';
  const isFalling = trend.direction === 'down';

  if (isCheap && isFalling) {
    return {
      short: '⚡ ¡Precio bajando! Buen momento',
      detail: 'El precio está en zona barata y sigue bajando. Es el mejor momento para poner electrodomésticos de alto consumo como lavadora, lavavajillas o secadora.',
      color: '#22c55e',
      icon: '✅',
    };
  }
  if (isCheap) {
    return {
      short: '✅ Precio barato. Aprovecha ahora',
      detail: 'El precio de la luz está en zona económica. Es buen momento para usar electrodomésticos y cargar dispositivos.',
      color: '#22c55e',
      icon: '✅',
    };
  }
  if (isExpensive && isRising) {
    return {
      short: '🚫 ¡Precio disparado! Evita gastar',
      detail: 'El precio es muy alto y sigue subiendo. Apaga todo lo que no sea estrictamente necesario. Espera a horas más baratas.',
      color: '#ef4444',
      icon: '🚫',
    };
  }
  if (isExpensive) {
    return {
      short: '⚠️ Precio alto. Reduce consumo',
      detail: 'El precio de la luz es elevado. Si puedes, espera a horas más baratas para usar electrodomésticos.',
      color: '#f97316',
      icon: '⚠️',
    };
  }
  if (isRising) {
    return {
      short: '📈 Precio subiendo. Si vas a usar algo, hazlo ahora',
      detail: 'El precio está en tendencia alcista. Si necesitas usar electrodomésticos, cuanto antes mejor.',
      color: '#eab308',
      icon: '📈',
    };
  }
  return {
    short: 'ℹ️ Precios normales. Uso moderado',
    detail: 'Los precios están en rangos normales. Puedes usar electrodomésticos con moderación, pero mira las horas más baratas para consumos grandes.',
    color: '#94a3b8',
    icon: 'ℹ️',
  };
}

// ================================================================
// Fetch helpers
// ================================================================

async function fetchElecz<T>(endpoint: string): Promise<T> {
  // Handle endpoints that already have query params
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${ELECZ_BASE}/${endpoint}${separator}zone=ES`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Elecz HTTP ${res.status}`);
  return res.json();
}

// ================================================================
// GET handler
// ================================================================

export async function GET() {
  const now = Date.now();

  // Return cached data if fresh
  if (cache && now - cache.ts < CACHE_TTL) {
    return NextResponse.json({ ...cache.data, cached: true });
  }

  try {
    const [spot, cheapest] = await Promise.all([
      fetchElecz<{
        signal: string;
        zone: string;
        currency: string;
        price: number;
        unit: string;
        timestamp: string;
        age_seconds: number;
      }>('spot'),
      fetchElecz<{
        available: boolean;
        energy_state: string;
        current_hour_signal: string;
        current_hour_is_cheap: boolean;
        current_hour_rank: number;
        next_cheap_hour: string | null;
        hours_until_next_cheap: number;
        cheap_hours_remaining_today: number;
        cheapest_hours: HourPrice[];
        best_3h_window: { start: string; end: string; avg_price: number } | null;
        recommendation: string;
      }>('cheapest-hours?hours=24'),
    ]);

    // Build allHours sorted chronologically
    const allHours: HourPrice[] = [...cheapest.cheapest_hours]
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // Compute enriched stats
    const stats = calcStats(allHours);
    const trend = calcTrend(allHours);
    const recommendation = buildRecommendation(
      { price: spot.price },
      stats,
      trend,
      cheapest.current_hour_signal
    );

    // Find current hour index
  const nowIso = new Date().toISOString();
  const currentHourIndex = allHours.findIndex(h => sameHour(h.hour, nowIso));

  const data: LuzResponse = {
      current: {
        price: spot.price,
        unit: spot.unit,
        currency: spot.currency,
        signal: spot.signal,
        timestamp: spot.timestamp,
        age_seconds: spot.age_seconds,
      },
      cheapest: {
        available: cheapest.available,
        energy_state: cheapest.energy_state,
        current_hour_signal: cheapest.current_hour_signal,
        current_hour_is_cheap: cheapest.current_hour_is_cheap,
        current_hour_rank: cheapest.current_hour_rank,
        next_cheap_hour: cheapest.next_cheap_hour,
        hours_until_next_cheap: cheapest.hours_until_next_cheap,
        cheap_hours_remaining_today: cheapest.cheap_hours_remaining_today,
        cheapest_hours: cheapest.cheapest_hours,
        best_3h_window: cheapest.best_3h_window,
        recommendation: cheapest.recommendation,
      },
      allHours,
      currentHourIndex: currentHourIndex >= 0 ? currentHourIndex : Math.floor(allHours.length / 2),
      stats,
      trend,
      recommendation,
    };

    cache = { ts: now, data };

    return NextResponse.json({ ...data, cached: false });
  } catch (error) {
    // Return stale cache if available
    if (cache) {
      return NextResponse.json({
        ...cache.data,
        cached: true,
        stale: true,
        error: 'Usando datos en caché. No se pudieron actualizar.',
      });
    }

    return NextResponse.json(
      { error: 'No se pudieron obtener los precios de la luz. Intenta de nuevo más tarde.' },
      { status: 503 }
    );
  }
}
