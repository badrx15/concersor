'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// ================================================================
// Tipos
// ================================================================

interface HourPrice {
  hour: string;
  price: number;
  unit: string;
}

interface LuzData {
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
  allHours: HourPrice[];
  currentHourIndex: number;
  stats: {
    average: number;
    min: HourPrice | null;
    max: HourPrice | null;
    median: number;
    range: number;
    volatility: number;
    currentPercentile: number;
    cheaperHours: number;
    expensiveHours: number;
    isCheapestHour: boolean;
    isMostExpensiveHour: boolean;
    cheapest3hAvg: number | null;
    bestHourSlot: { hour: string; price: number } | null;
    worstHourSlot: { hour: string; price: number } | null;
  };
  trend: {
    direction: 'up' | 'down' | 'stable';
    change: number;
    changePercent: number;
    nextHour: { price: number; direction: 'up' | 'down' | 'stable' } | null;
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

function getHourLabel(hourStr: string): string {
  try {
    const d = new Date(hourStr);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });
  } catch {
    return hourStr.slice(11, 16);
  }
}

function getShortHour(hourStr: string): string {
  return hourStr.slice(11, 13) + 'h';
}

function getPriceColor(price: number, avg: number): string {
  if (price <= avg * 0.7) return 'text-green-400';
  if (price <= avg * 0.9) return 'text-emerald-400';
  if (price <= avg * 1.1) return 'text-amber-400';
  if (price <= avg * 1.3) return 'text-orange-400';
  return 'text-red-400';
}

function getBarColor(price: number, avg: number): string {
  if (price <= avg * 0.7) return 'bg-gradient-to-t from-green-600 to-green-400';
  if (price <= avg * 0.9) return 'bg-gradient-to-t from-emerald-600 to-emerald-400';
  if (price <= avg * 1.1) return 'bg-gradient-to-t from-amber-600 to-amber-400';
  if (price <= avg * 1.3) return 'bg-gradient-to-t from-orange-600 to-orange-400';
  return 'bg-gradient-to-t from-red-600 to-red-400';
}

function getMovementLabel(movement: string): { label: string; icon: string; color: string } {
  switch (movement) {
    case 'rapidly_rising': return { label: 'Subiendo rápidamente', icon: '📈', color: 'text-red-400' };
    case 'rising': return { label: 'En tendencia alcista', icon: '↗️', color: 'text-orange-400' };
    case 'stable': return { label: 'Estable', icon: '➡️', color: 'text-slate-400' };
    case 'falling': return { label: 'En tendencia bajista', icon: '↘️', color: 'text-emerald-400' };
    case 'rapidly_falling': return { label: 'Bajando rápidamente', icon: '📉', color: 'text-green-400' };
    default: return { label: movement, icon: '➡️', color: 'text-slate-400' };
  }
}

// ================================================================
// Componente principal
// ================================================================

export function PrecioLuzWidget() {
  const [data, setData] = useState<LuzData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [viewMode, setViewMode] = useState<'chart' | 'ranking'>('chart');

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
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const signalColor = useMemo(() => {
    if (!data) return '#94a3b8';
    switch (data.cheapest.current_hour_signal) {
      case 'very_low': case 'low': return '#22c55e';
      case 'medium': return '#eab308';
      case 'high': return '#f97316';
      case 'very_high': case 'critical': return '#ef4444';
      default: return '#94a3b8';
    }
  }, [data]);

  const signalLabel = useMemo(() => {
    if (!data) return '';
    switch (data.cheapest.current_hour_signal) {
      case 'very_low': case 'low': return '🟢 Muy barato';
      case 'medium': return '🟡 Precio medio';
      case 'high': return '🟠 Caro';
      case 'very_high': case 'critical': return '🔴 Muy caro';
      default: return '⚪ Desconocido';
    }
  }, [data]);

  const movement = data ? getMovementLabel(data.trend.priceMovement) : null;
  const avgPrice = data?.stats.average || 0;

  // Bar chart max
  const maxBarPrice = useMemo(() => {
    if (!data?.allHours?.length) return 30;
    return Math.max(...data.allHours.map(h => h.price)) * 1.3;
  }, [data]);

  // Sorted prices
  const sortedByPrice = useMemo(() => {
    if (!data?.allHours) return [];
    return [...data.allHours].sort((a, b) => a.price - b.price);
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="text-lg font-bold">Precio de la luz hoy</h3>
            <span className="text-[10px] text-slate-500">España · PVPC 2.0TD</span>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 hover:text-white transition disabled:opacity-50"
        >
          {loading ? '↻ ...' : '↻ Actualizar'}
        </button>
      </div>

      {/* Loading */}
      {loading && !data && (
        <div className="animate-pulse space-y-3">
          <div className="h-28 bg-slate-800/50 rounded-xl" />
          <div className="h-16 bg-slate-800/30 rounded-xl" />
          <div className="h-48 bg-slate-800/30 rounded-xl" />
        </div>
      )}

      {/* Error */}
      {error && !data && (
        <div className="p-5 rounded-xl bg-red-500/20 border border-red-500/30 text-center">
          <p className="text-red-300 text-sm mb-3">❌ {error}</p>
          <button
            onClick={fetchData}
            className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && (
        <>
          {/* ============================================================ */}
          {/* CURRENT PRICE — Big display */}
          {/* ============================================================ */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-slate-700/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${signalColor}, transparent)` }} />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Precio actual</div>
                <div className={`text-5xl sm:text-6xl font-black tabular-nums ${getPriceColor(data.current.price, avgPrice)}`}>
                  {data.current.price.toFixed(2)}
                  <span className={`text-lg font-semibold ml-1 ${getPriceColor(data.current.price, avgPrice)}`}>
                    {data.current.unit}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: signalColor + '20', color: signalColor, border: `1px solid ${signalColor}40` }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: signalColor }} />
                  {signalLabel}
                </div>
                {movement && (
                  <div className={`text-xs mt-1 ${movement.color}`}>
                    {movement.icon} {movement.label}
                  </div>
                )}
              </div>
            </div>

            {/* Trend mini-indicator */}
            <div className="relative mt-4 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span>
                Ant. hora: <strong className={`${data.trend.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {data.trend.change > 0 ? '+' : ''}{data.trend.change.toFixed(2)} c€
                </strong>
              </span>
              {data.trend.nextHour && (
                <span>
                  Próx. hora: <strong className="text-slate-300">{data.trend.nextHour.price.toFixed(2)} c€</strong>
                  <span className={`ml-1 ${data.trend.nextHour.direction === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                    {data.trend.nextHour.direction === 'up' ? '↑' : data.trend.nextHour.direction === 'down' ? '↓' : '→'}
                  </span>
                </span>
              )}
              <span className="ml-auto">Rank: #{data.cheapest.current_hour_rank + 1} / {data.allHours.length}</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RECOMMENDATION */}
          {/* ============================================================ */}
          <div className="p-4 rounded-xl text-sm" style={{
            backgroundColor: data.recommendation.color + '15',
            borderColor: data.recommendation.color + '30',
            borderWidth: 1,
          }}>
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">{data.recommendation.icon}</span>
              <div>
                <div className="font-semibold text-white mb-0.5">{data.recommendation.short}</div>
                <div className="text-slate-300 text-xs leading-relaxed">{data.recommendation.detail}</div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STATISTICS PANEL */}
          {/* ============================================================ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Precio medio', value: `${data.stats.average.toFixed(2)} c€`, icon: '📊', color: 'text-brand-300' },
              { label: 'Más barata', value: data.stats.min ? `${data.stats.min.price.toFixed(1)} c€` : '-', icon: '🟢', color: 'text-green-400', sub: data.stats.min ? getShortHour(data.stats.min.hour) : '' },
              { label: 'Más cara', value: data.stats.max ? `${data.stats.max.price.toFixed(1)} c€` : '-', icon: '🔴', color: 'text-red-400', sub: data.stats.max ? getShortHour(data.stats.max.hour) : '' },
              { label: 'Rango', value: `${data.stats.range.toFixed(1)} c€`, icon: '📏', color: 'text-amber-400' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
                <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <div className={`text-base sm:text-lg font-bold tabular-nums ${item.color}`}>{item.value}</div>
                {item.sub && <div className="text-[10px] text-slate-500 mt-0.5">{item.sub}</div>}
              </div>
            ))}
          </div>

          {/* Extra stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Mediana', value: `${data.stats.median.toFixed(2)} c€`, icon: '📐' },
              { label: 'Volatilidad', value: `${data.stats.volatility.toFixed(2)} c€`, icon: '📉' },
              { label: 'Hora actual es', value: `${data.stats.currentPercentile}% más cara que ${data.stats.cheaperHours}h`, icon: '📋' },
              { label: '3h baratas consec.', value: data.stats.cheapest3hAvg ? `${data.stats.cheapest3hAvg.toFixed(2)} c€` : '-', icon: '🏆' },
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900/30 border border-slate-800/40 text-center">
                <div className="text-[10px] text-slate-500 mb-0.5 flex items-center justify-center gap-1">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <div className="text-xs font-semibold text-slate-300 tabular-nums">{item.value}</div>
              </div>
            ))}
          </div>

          {/* ============================================================ */}
          {/* BEST & WORST HOURS */}
          {/* ============================================================ */}
          {data.stats.bestHourSlot && data.stats.worstHourSlot && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="text-[10px] text-green-300 mb-0.5">🏆 Hora más barata del día</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-green-400">{data.stats.bestHourSlot.price.toFixed(2)}</span>
                  <span className="text-xs text-green-300 mb-1">c€/kWh</span>
                </div>
                <div className="text-xs text-green-300/70">{getHourLabel(data.stats.bestHourSlot.hour)}</div>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-[10px] text-red-300 mb-0.5">⚠️ Hora más cara del día</div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-red-400">{data.stats.worstHourSlot.price.toFixed(2)}</span>
                  <span className="text-xs text-red-300 mb-1">c€/kWh</span>
                </div>
                <div className="text-xs text-red-300/70">{getHourLabel(data.stats.worstHourSlot.hour)}</div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW TOGGLE — Chart / Ranking */}
          {/* ============================================================ */}
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'chart' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Por horas
            </button>
            <button
              onClick={() => setViewMode('ranking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'ranking' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 Ranking precios
            </button>
          </div>

          {/* ============================================================ */}
          {/* FULL 24H CHART */}
          {/* ============================================================ */}
          {viewMode === 'chart' && data.allHours.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <h4 className="font-semibold text-sm">Precios por hora</h4>
                </div>
                <span className="text-[10px] text-slate-500">
                  Media: <strong className="text-slate-300">{avgPrice.toFixed(1)}</strong> c€
                </span>
              </div>

              {/* Bar chart */}
              <div className="space-y-1">
                {data.allHours.map((h, i) => {
                  const pct = (h.price / maxBarPrice) * 100;
                  const barColor = getBarColor(h.price, avgPrice);
                  const textColor = getPriceColor(h.price, avgPrice);
                  const isCurrent = i === data.currentHourIndex;
                  return (
                    <div key={i} className={`flex items-center gap-2 group ${isCurrent ? 'opacity-100' : ''}`}>
                      <span className={`text-[11px] font-mono w-10 shrink-0 text-right ${isCurrent ? 'text-brand-300 font-bold' : 'text-slate-500'}`}>
                        {getShortHour(h.hour)}
                      </span>
                      <div className={`flex-1 h-6 rounded-md bg-slate-800/50 relative overflow-hidden cursor-pointer transition-all group-hover:scale-y-110 origin-bottom ${isCurrent ? 'ring-2 ring-brand-500/50 ring-offset-1 ring-offset-slate-900' : ''}`}
                        title={`${getHourLabel(h.hour)}: ${h.price.toFixed(2)} c€/kWh`}>
                        <div
                          className={`h-full rounded-md transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.max(pct, 3)}%` }}
                        />
                        <div className={`absolute top-0 left-0 h-full w-full flex items-center px-2 ${pct < 30 ? 'justify-start' : 'justify-start'}`}>
                          <span className={`text-[11px] font-semibold tabular-nums ${textColor} ${pct < 15 ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                            {h.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] font-bold text-brand-400 shrink-0">AHORA</span>
                      )}
                      {/* Mini gap indicator */}
                      {i < data.allHours.length - 1 && !isCurrent && (
                        <div className={`w-1 h-5 rounded-full shrink-0 transition-opacity ${
                          data.allHours[i + 1].price > h.price ? 'bg-red-500/30' : 'bg-green-500/30'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-green-600 to-green-400" /> Barato (&lt;70% media)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-amber-600 to-amber-400" /> Normal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-orange-600 to-orange-400" /> Caro (&gt;130% media)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-red-600 to-red-400" /> Muy caro
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* RANKING VIEW */}
          {/* ============================================================ */}
          {viewMode === 'ranking' && sortedByPrice.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h4 className="font-semibold text-sm">Ranking de precios</h4>
                </div>
                <span className="text-[10px] text-slate-500">Más barato → Más caro</span>
              </div>

              <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {sortedByPrice.map((h, i) => {
                  const textColor = getPriceColor(h.price, avgPrice);
                  const rank = i + 1;
                  return (
                    <div
                      key={h.hour}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition"
                    >
                      <span className="text-xs font-mono text-slate-500 w-8 shrink-0 text-right">#{rank}</span>
                      <span className="text-xs text-slate-400 w-16">{getHourLabel(h.hour)}</span>
                      <div className="flex-1 h-5 rounded bg-slate-800/50 overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-300"
                          style={{
                            width: `${((h.price - sortedByPrice[0].price) / (sortedByPrice[sortedByPrice.length - 1].price - sortedByPrice[0].price + 0.01)) * 100 + 3}%`,
                            background: `linear-gradient(90deg, ${
                              rank <= sortedByPrice.length * 0.25 ? '#22c55e' :
                              rank <= sortedByPrice.length * 0.5 ? '#eab308' :
                              rank <= sortedByPrice.length * 0.75 ? '#f97316' : '#ef4444'
                            }40, ${
                              rank <= sortedByPrice.length * 0.25 ? '#22c55e' :
                              rank <= sortedByPrice.length * 0.5 ? '#eab308' :
                              rank <= sortedByPrice.length * 0.75 ? '#f97316' : '#ef4444'
                            }80)`,
                          }}
                        />
                      </div>
                      <span className={`text-xs font-semibold font-mono w-16 text-right ${textColor}`}>
                        {h.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* BEST 3H WINDOW */}
          {/* ============================================================ */}
          {data.cheapest.best_3h_window && (
            <div className="p-4 rounded-xl bg-brand-600/10 border border-brand-500/20">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-brand-300 font-semibold">🏆 Mejor ventana de 3 horas consecutivas</div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-300 tabular-nums">{data.cheapest.best_3h_window.avg_price.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500">c€/kWh media</div>
                </div>
              </div>
              <div className="text-sm text-slate-300">
                De <span className="font-bold text-white">{getHourLabel(data.cheapest.best_3h_window.start)}</span> a{' '}
                <span className="font-bold text-white">{getHourLabel(data.cheapest.best_3h_window.end)}</span>
                <span className="text-xs text-slate-500 ml-2">
                  — Ideal para lavadora, lavavajillas, horno...
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* NEXT CHEAP HOUR */}
          {/* ============================================================ */}
          {data.cheapest.hours_until_next_cheap > 0 && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-green-300 mb-0.5">⏳ Próxima hora barata</div>
                  <div className="text-lg font-bold text-green-400">
                    en ~{data.cheapest.hours_until_next_cheap}h
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

          {/* ============================================================ */}
          {/* PRICE RANGE VISUALIZATION */}
          {/* ============================================================ */}
          {data.stats.min && data.stats.max && (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-xs text-slate-500 mb-2">📐 Rango de precios del día</div>
              <div className="relative h-6 rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 overflow-hidden">
                {/* Current price marker */}
                <div
                  className="absolute top-0 w-1 h-full bg-white rounded-full shadow-lg shadow-white/50 z-10 transition-all duration-500"
                  style={{
                    left: `${((data.current.price - data.stats.min.price) / (data.stats.max.price - data.stats.min.price + 0.01)) * 100}%`,
                  }}
                />
                {/* Average marker */}
                <div
                  className="absolute top-0 w-0.5 h-full bg-black/40 z-10"
                  style={{ left: `${((avgPrice - data.stats.min.price) / (data.stats.max.price - data.stats.min.price + 0.01)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{data.stats.min.price.toFixed(1)} c€</span>
                <span className="text-slate-400">● Media {avgPrice.toFixed(1)} c€</span>
                <span>{data.stats.max.price.toFixed(1)} c€</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TOTAL ELECTRICITY INFO */}
          {/* ============================================================ */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap justify-center">
              <span>Precio spot (ENTSO-E): <strong className="text-slate-300">{data.current.price.toFixed(2)} {data.current.unit}</strong></span>
              <span>Estado red: <strong className="text-slate-300">{data.cheapest.energy_state}</strong></span>
              <span>Confianza: <strong className="text-slate-300">{data.cheapest.available ? 'Alta' : 'Baja'}</strong></span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-slate-600 text-center">
            Datos: ENTSO-E vía Elecz.com · Actualizado: {lastUpdate || '...'}
          </div>
        </>
      )}
    </div>
  );
}
