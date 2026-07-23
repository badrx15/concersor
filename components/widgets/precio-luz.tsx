'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface CheapHour {
  hour: string;
  price: number;
  unit: string;
}

interface LuzData {
  current: {
    price: number;
    unit: string;
    currency: string;
    timestamp: string;
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
    best_3h_window: { start: string; end: string; avg_price: number } | null;
    recommendation: string;
  };
}

function getHourLabel(hourStr: string): string {
  const d = new Date(hourStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });
}

function getPriceColor(price: number): string {
  if (price <= 10) return 'text-green-400';
  if (price <= 20) return 'text-amber-400';
  if (price <= 30) return 'text-orange-400';
  return 'text-red-400';
}

function getPriceBgColor(price: number): string {
  if (price <= 10) return 'bg-green-500/20 border-green-500/30';
  if (price <= 20) return 'bg-amber-500/20 border-amber-500/30';
  if (price <= 30) return 'bg-orange-500/20 border-orange-500/30';
  return 'bg-red-500/20 border-red-500/30';
}

function getSignalLabel(signal: string): { label: string; color: string; icon: string } {
  switch (signal) {
    case 'very_low': case 'low': return { label: 'Muy barato', color: '#22c55e', icon: '🟢' };
    case 'medium': return { label: 'Precio medio', color: '#eab308', icon: '🟡' };
    case 'high': return { label: 'Caro', color: '#f97316', icon: '🟠' };
    case 'very_high': case 'critical': return { label: 'Muy caro', color: '#ef4444', icon: '🔴' };
    default: return { label: signal || 'Desconocido', color: '#94a3b8', icon: '⚪' };
  }
}

function getRecommendationLabel(rec: string): { text: string; icon: string } {
  switch (rec) {
    case 'optimal_usage': return { text: 'Momento óptimo para usar electrodomésticos', icon: '✅' };
    case 'normal_usage': return { text: 'Precios normales. Usa electrodomésticos con moderación.', icon: 'ℹ️' };
    case 'reduce_usage': return { text: 'Precios altos. Evita usar electrodomésticos ahora.', icon: '⚠️' };
    case 'avoid_usage': return { text: '¡Precios muy altos! Apaga lo que no sea necesario.', icon: '🚫' };
    default: return { text: rec, icon: 'ℹ️' };
  }
}

export function PrecioLuzWidget() {
  const [data, setData] = useState<LuzData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/luz');
      if (!res.ok) throw new Error('Error al obtener datos');
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      setError('No se pudieron cargar los precios. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchData]);

  const signal = data ? getSignalLabel(data.cheapest.current_hour_signal) : null;
  const maxPrice = useMemo(() => {
    if (!data?.cheapest.cheapest_hours?.length) return 20;
    return Math.max(...data.cheapest.cheapest_hours.map(h => h.price)) * 1.2;
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h3 className="text-lg font-bold">Precio de la luz hoy</h3>
        </div>
        <button onClick={fetchData} disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 hover:text-white transition disabled:opacity-50">
          {loading ? '↻ Actualizando...' : '↻ Actualizar'}
        </button>
      </div>

      {/* Loading */}
      {loading && !data && (
        <div className="animate-pulse space-y-3">
          <div className="h-24 bg-slate-800/50 rounded-xl" />
          <div className="h-12 bg-slate-800/30 rounded-xl" />
          <div className="h-20 bg-slate-800/30 rounded-xl" />
        </div>
      )}

      {/* Error */}
      {error && !data && (
        <div className="p-5 rounded-xl bg-red-500/20 border border-red-500/30 text-center">
          <p className="text-red-300 text-sm mb-3">❌ {error}</p>
          <button onClick={fetchData}
            className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm">
            Reintentar
          </button>
        </div>
      )}

      {data && (
        <>
          {/* Current Price Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 text-center">
            <div className="text-sm text-slate-400 mb-1">Precio actual</div>
            <div className={`text-5xl font-black tabular-nums ${getPriceColor(data.current.price)}`}>
              {data.current.price.toFixed(2)}
              <span className="text-xl font-semibold ml-1">{data.current.unit}</span>
            </div>

            {/* Signal badge */}
            {signal && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: signal.color + '20', color: signal.color, borderColor: signal.color + '40', borderWidth: 1 }}>
                <span>{signal.icon}</span>
                <span>{signal.label}</span>
              </div>
            )}

            {/* Price rank */}
            <div className="mt-3 text-xs text-slate-500">
              Hora más cara del día: posición <span className="font-semibold text-slate-300">#{data.cheapest.current_hour_rank + 1}</span> de 24
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-4 rounded-xl text-sm ${getPriceBgColor(data.current.price)}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getRecommendationLabel(data.cheapest.recommendation).icon}</span>
              <span className="text-slate-200">{getRecommendationLabel(data.cheapest.recommendation).text}</span>
            </div>
          </div>

          {/* Next cheap hour */}
          {data.cheapest.hours_until_next_cheap > 0 && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-green-300 mb-0.5">⏳ Próxima hora barata</div>
                  <div className="text-lg font-bold text-green-400">
                    en {data.cheapest.hours_until_next_cheap}h
                    {data.cheapest.next_cheap_hour && (
                      <span className="text-sm font-normal text-green-300 ml-2">
                        ({getHourLabel(data.cheapest.next_cheap_hour)})
                      </span>
                    )}
                  </div>
                </div>
                {data.cheapest.cheap_hours_remaining_today > 0 && (
                  <div className="text-right">
                    <div className="text-xs text-green-300 mb-0.5">Quedan</div>
                    <div className="text-lg font-bold text-green-400">{data.cheapest.cheap_hours_remaining_today}h</div>
                    <div className="text-xs text-green-300">baratas hoy</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cheapest hours chart */}
          {data.cheapest.cheapest_hours?.length > 0 && (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📊</span>
                <h4 className="font-semibold">Precios por hora (más baratos)</h4>
              </div>

              <div className="space-y-2">
                {[...data.cheapest.cheapest_hours]
                  .sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime())
                  .map((h, i) => {
                    const pct = (h.price / maxPrice) * 100;
                    const isCheap = h.price <= 15;
                    const isMedium = h.price > 15 && h.price <= 25;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-16 shrink-0">
                          {getHourLabel(h.hour)}
                        </span>
                        <div className="flex-1 h-7 rounded-lg bg-slate-800/60 relative overflow-hidden">
                          <div
                            className={`h-full rounded-lg transition-all duration-500 ${
                              isCheap ? 'bg-gradient-to-r from-green-600/40 to-green-500/60' :
                              isMedium ? 'bg-gradient-to-r from-amber-600/40 to-amber-500/60' :
                              'bg-gradient-to-r from-red-600/40 to-red-500/60'
                            }`}
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold font-mono w-20 text-right shrink-0 ${getPriceColor(h.price)}`}>
                          {h.price.toFixed(2)} c€
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Best 3-hour window */}
          {data.cheapest.best_3h_window && (
            <div className="p-4 rounded-xl bg-brand-600/10 border border-brand-500/20">
              <div className="text-xs text-brand-300 mb-1">🏆 Mejor ventana de 3h</div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">
                  De <span className="font-bold text-white">{getHourLabel(data.cheapest.best_3h_window.start)}</span> a{' '}
                  <span className="font-bold text-white">{getHourLabel(data.cheapest.best_3h_window.end)}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-300">{data.cheapest.best_3h_window.avg_price.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">c€/kWh media</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-[10px] text-slate-600 text-center">
            Datos: ENTSO-E vía Elecz.com · Actualizado: {lastUpdate || '...'}
          </div>
        </>
      )}
    </div>
  );
}
