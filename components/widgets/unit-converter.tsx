'use client';

import { useState, useMemo } from 'react';
import { UNIT_TABLES, convertUnit, convertTemperature, formatNumber } from '@/lib/units';

interface Props {
  config?: Record<string, string>;
}

const TEMP_UNITS = [
  { key: 'celsius', label: 'Celsius (°C)' },
  { key: 'fahrenheit', label: 'Fahrenheit (°F)' },
  { key: 'kelvin', label: 'Kelvin (K)' },
];

export function UnitConverterWidget({ config }: Props) {
  const category = config?.unitCategory || 'length';
  const isTemp = category === 'temperature';
  const table = isTemp ? null : UNIT_TABLES[category];

  const units = useMemo(() => {
    if (isTemp) return TEMP_UNITS;
    if (!table) return [];
    return Object.entries(table).map(([key, def]) => ({
      key,
      label: `${def.label} (${def.symbol})`,
    }));
  }, [isTemp, table]);

  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(config?.defaultFrom || units[0]?.key || '');
  const [to, setTo] = useState(config?.defaultTo || units[1]?.key || '');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    setError('');
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return null;
    try {
      const converted = isTemp
        ? convertTemperature(num, from, to)
        : convertUnit(num, category, from, to);
      return converted;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
      return null;
    }
  }, [value, from, to, category, isTemp]);

  const handleCopy = async () => {
    if (result === null) return;
    const text = `${value} ${from} = ${formatNumber(result)} ${to}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-4">
      {/* Input value */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Valor</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-lg font-mono"
          placeholder="Escribe un número"
          step="any"
        />
      </div>

      {/* From / To selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">De</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm"
          >
            {units.map((u) => (
              <option key={u.key} value={u.key}>{u.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-brand-500 hover:text-brand-300 transition mb-0.5"
          aria-label="Intercambiar unidades"
          title="Intercambiar"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 4v16M7 4L3 8M7 4l4 4M17 20V4M17 20l4-4M17 20l-4-4" />
          </svg>
        </button>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">A</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm"
          >
            {units.map((u) => (
              <option key={u.key} value={u.key}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      {error ? (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">
          ❌ {error}
        </div>
      ) : result !== null ? (
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-brand-600/20 to-pink-500/10 border border-brand-500/30">
          <div className="text-sm text-slate-400 mb-1">Resultado</div>
          <div className="text-3xl font-bold font-mono text-white">
            {formatNumber(result)} <span className="text-brand-300 text-xl">{to}</span>
          </div>
          <div className="text-sm text-slate-400 mt-2">
            {value} {from} = {formatNumber(result)} {to}
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition"
          >
            📋 Copiar
          </button>
        </div>
      ) : null}
    </div>
  );
}
