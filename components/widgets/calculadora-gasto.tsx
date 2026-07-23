'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { InputGroup } from './shared';

interface Appliance {
  id: string;
  name: string;
  powerW: number;
  hoursDay: number;
}

interface LuzData {
  current: { price: number; unit: string; currency: string };
}

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: 'fridge', name: '🧊 Nevera', powerW: 200, hoursDay: 24 },
  { id: 'freezer', name: '❄️ Congelador', powerW: 150, hoursDay: 24 },
  { id: 'washing', name: '🧺 Lavadora', powerW: 2000, hoursDay: 1 },
  { id: 'dishwasher', name: '🍽️ Lavavajillas', powerW: 1500, hoursDay: 1 },
  { id: 'oven', name: '🔥 Horno', powerW: 2500, hoursDay: 0.5 },
  { id: 'microwave', name: '📡 Microondas', powerW: 900, hoursDay: 0.3 },
  { id: 'tv', name: '📺 Televisor', powerW: 150, hoursDay: 4 },
  { id: 'computer', name: '💻 Ordenador', powerW: 200, hoursDay: 6 },
  { id: 'ac', name: '❄️ Aire acondicionado', powerW: 1500, hoursDay: 4 },
  { id: 'heater', name: '🔥 Calefacción eléctrica', powerW: 2000, hoursDay: 6 },
  { id: 'dryer', name: '👕 Secadora', powerW: 2500, hoursDay: 1 },
  { id: 'iron', name: '👔 Plancha', powerW: 1500, hoursDay: 0.3 },
  { id: 'water-heater', name: '🚿 Termo eléctrico', powerW: 1500, hoursDay: 3 },
  { id: 'coffee', name: '☕ Cafetera', powerW: 800, hoursDay: 0.2 },
  { id: 'router', name: '📶 Router WiFi', powerW: 15, hoursDay: 24 },
  { id: 'led-bulb', name: '💡 Bombilla LED', powerW: 10, hoursDay: 5 },
];

function formatEuro(n: number): string {
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' €';
}

function formatCompactEuro(n: number): string {
  if (n < 0.01) return '< 0,01 €';
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

export function CalculadoraGastoWidget() {
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [priceData, setPriceData] = useState<LuzData | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [customName, setCustomName] = useState('');
  const [customPower, setCustomPower] = useState('');
  const [customHours, setCustomHours] = useState('');

  const fetchPrice = useCallback(async () => {
    try {
      setPriceLoading(true);
      const res = await fetch('/api/luz');
      if (res.ok) {
        const json = await res.json();
        setPriceData(json);
      }
    } catch {} finally {
      setPriceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  const pricePerKwh = priceData ? priceData.current.price / 100 : 0; // c€/kWh → €/kWh

  const results = useMemo(() => {
    if (!pricePerKwh || pricePerKwh <= 0) return null;
    return appliances.map(a => {
      const kw = a.powerW / 1000;
      const kwhPerDay = kw * a.hoursDay;
      const costPerDay = kwhPerDay * pricePerKwh;
      const costPerWeek = costPerDay * 7;
      const costPerMonth = costPerDay * 30;
      const costPerYear = costPerDay * 365;
      return { ...a, kw, kwhPerDay, costPerDay, costPerWeek, costPerMonth, costPerYear };
    });
  }, [appliances, pricePerKwh]);

  const totals = useMemo(() => {
    if (!results) return null;
    return {
      totalKwhDay: results.reduce((s, r) => s + r.kwhPerDay, 0),
      totalCostDay: results.reduce((s, r) => s + r.costPerDay, 0),
      totalCostWeek: results.reduce((s, r) => s + r.costPerWeek, 0),
      totalCostMonth: results.reduce((s, r) => s + r.costPerMonth, 0),
      totalCostYear: results.reduce((s, r) => s + r.costPerYear, 0),
    };
  }, [results]);

  const addCustomAppliance = () => {
    const power = parseFloat(customPower);
    const hours = parseFloat(customHours);
    if (!customName.trim() || isNaN(power) || power <= 0 || isNaN(hours) || hours <= 0) return;
    const newAppliance: Appliance = {
      id: 'custom-' + Date.now(),
      name: customName.trim(),
      powerW: power,
      hoursDay: hours,
    };
    setAppliances(prev => [...prev, newAppliance]);
    setCustomName('');
    setCustomPower('');
    setCustomHours('');
  };

  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.filter(a => a.id !== id));
  };

  const resetToDefaults = () => {
    setAppliances(DEFAULT_APPLIANCES);
  };

  const sortedResults = useMemo(() => {
    if (!results) return [];
    return [...results].sort((a, b) => b.costPerDay - a.costPerDay);
  }, [results]);

  return (
    <div className="space-y-4">
      {/* Price banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400">Precio luz actual</div>
          <div className="text-xl font-bold tabular-nums">
            {priceLoading ? (
              <span className="text-slate-500">Cargando...</span>
            ) : pricePerKwh > 0 ? (
              <span className={pricePerKwh < 0.12 ? 'text-green-400' : pricePerKwh < 0.20 ? 'text-amber-400' : 'text-red-400'}>
                {(pricePerKwh * 100).toFixed(2)} <span className="text-sm font-normal">c€/kWh</span>
              </span>
            ) : (
              <span className="text-slate-500">No disponible</span>
            )}
          </div>
        </div>
        <button onClick={fetchPrice} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition">
          ↻ Actualizar
        </button>
      </div>

      {/* Results summary */}
      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Gasto día', value: totals.totalCostDay, color: 'text-brand-300' },
            { label: 'Gasto semana', value: totals.totalCostWeek, color: 'text-amber-400' },
            { label: 'Gasto mes', value: totals.totalCostMonth, color: 'text-pink-400' },
            { label: 'Gasto año', value: totals.totalCostYear, color: 'text-green-400' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xs text-slate-400">{item.label}</div>
              <div className={`text-base sm:text-lg font-bold tabular-nums ${item.color}`}>{formatCompactEuro(item.value)}</div>
            </div>
          ))}
        </div>
      )}

      {totals && (
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex justify-between text-sm">
          <span className="text-slate-400">Consumo total</span>
          <span className="font-semibold text-white">{totals.totalKwhDay.toFixed(1)} kWh/día · {(totals.totalKwhDay * 365).toFixed(0)} kWh/año</span>
        </div>
      )}

      {/* Appliance list */}
      {sortedResults.length > 0 && (
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-800/80 px-4 py-2.5 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-200">Electrodomésticos</span>
            <button onClick={resetToDefaults} className="text-xs text-slate-500 hover:text-slate-300 transition">
              ↺ Restaurar
            </button>
          </div>
          <div className="divide-y divide-slate-700/60 max-h-80 overflow-y-auto">
            {sortedResults.map(r => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 transition group">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.powerW}W · {r.hoursDay}h/día · {r.kwhPerDay.toFixed(2)} kWh</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold tabular-nums">{formatCompactEuro(r.costPerDay)}</div>
                  <div className="text-xs text-slate-500">{formatCompactEuro(r.costPerMonth)}/mes</div>
                </div>
                <button onClick={() => removeAppliance(r.id)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/70 hover:text-red-300 transition">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add custom appliance */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">➕ Añadir electrodoméstico personalizado</h4>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <InputGroup label="Nombre" tooltip="Ej: Ventilador, Cargador portátil, etc.">
            <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Nombre"
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm placeholder-slate-500" />
          </InputGroup>
          <InputGroup label="Potencia (W)" tooltip="Vatios que consume el aparato. Lo encuentras en la etiqueta trasera del electrodoméstico.">
            <input type="number" value={customPower} onChange={e => setCustomPower(e.target.value)} placeholder="Ej: 2000"
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm placeholder-slate-500" />
          </InputGroup>
          <InputGroup label="Horas/día" tooltip="Horas al día que está encendido de media.">              <input type="number" value={customHours} onChange={e => setCustomHours(e.target.value)} placeholder="Ej: 2" min={0} max={24} step={0.5}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm placeholder-slate-500" />
          </InputGroup>
        </div>
        <button onClick={addCustomAppliance}
          disabled={!customName.trim() || !customPower || !customHours}
          className="w-full px-4 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm disabled:opacity-50 transition hover:shadow-lg">
          Añadir
        </button>
      </div>

      {/* Tips */}
      {totals && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <span className="text-lg shrink-0">💡</span>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Según el precio actual ({(pricePerKwh * 100).toFixed(2)} c€/kWh), tu <strong className="text-slate-200">gasto estimado</strong> es de <strong className="text-brand-300">{formatCompactEuro(totals.totalCostMonth)}/mes</strong>.</p>
              <p>Los <strong className="text-amber-400">3 electrodomésticos que más gastan</strong> representan el {sortedResults.length >= 3
                ? ((sortedResults[0].costPerDay + sortedResults[1].costPerDay + sortedResults[2].costPerDay) / totals.totalCostDay * 100).toFixed(0)
                : '100'}% del consumo total.</p>
              {pricePerKwh > 0.15 && (
                <p>⚠️ El precio actual es elevado. Intenta usar los electrodomésticos de alto consumo en <strong className="text-green-400">horas valle</strong> (mira la herramienta "Precio de la Luz").</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
