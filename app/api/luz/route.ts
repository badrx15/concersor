import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELECZ_BASE = 'https://elecz.com/signal';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let cache: { ts: number; data: LuzResponse } | null = null;

interface CheapHour {
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
    cheapest_hours: CheapHour[];
    best_3h_window: {
      start: string;
      end: string;
      avg_price: number;
    } | null;
    recommendation: string;
  };
}

async function fetchElecz<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${ELECZ_BASE}/${endpoint}?zone=ES`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Elecz HTTP ${res.status}`);
  return res.json();
}

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
        cheapest_hours: CheapHour[];
        best_3h_window: { start: string; end: string; avg_price: number } | null;
        recommendation: string;
      }>('cheapest-hours'),
    ]);

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
