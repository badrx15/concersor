'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface QuickOption {
  label: string;
  category: string;
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  fromSymbol: string;
  toSymbol: string;
  factor: number; // multiply "from" value to get "to" value
  slug: string;
}

const QUICK_OPTIONS: QuickOption[] = [
  { label: 'km → mi', category: 'length', from: 'kilometro', to: 'milla', fromLabel: 'Kilómetros', toLabel: 'Millas', fromSymbol: 'km', toSymbol: 'mi', factor: 0.621371, slug: 'kilometros-a-millas' },
  { label: 'mi → km', category: 'length', from: 'milla', to: 'kilometro', fromLabel: 'Millas', toLabel: 'Kilómetros', fromSymbol: 'mi', toSymbol: 'km', factor: 1.60934, slug: 'millas-a-kilometros' },
  { label: 'kg → lb', category: 'weight', from: 'kilogramo', to: 'libra', fromLabel: 'Kilogramos', toLabel: 'Libras', fromSymbol: 'kg', toSymbol: 'lb', factor: 2.20462, slug: 'kilos-a-libras' },
  { label: '°C → °F', category: 'temperature', from: 'celsius', to: 'fahrenheit', fromLabel: 'Celsius', toLabel: 'Fahrenheit', fromSymbol: '°C', toSymbol: '°F', factor: 0, slug: 'celsius-a-fahrenheit' },
  { label: '€ → $', category: 'currency', from: 'EUR', to: 'USD', fromLabel: 'Euros', toLabel: 'Dólares', fromSymbol: '€', toSymbol: '$', factor: 1.08, slug: 'euros-a-dolares' },
  { label: '$ → €', category: 'currency', from: 'USD', to: 'EUR', fromLabel: 'Dólares', toLabel: 'Euros', fromSymbol: '$', toSymbol: '€', factor: 0.93, slug: 'dolares-a-euros' },
  { label: 'L → gal', category: 'volume', from: 'litro', to: 'galon-us', fromLabel: 'Litros', toLabel: 'Galones (US)', fromSymbol: 'L', toSymbol: 'gal', factor: 0.264172, slug: 'litros-a-galones' },
  { label: 'km/h → mph', category: 'speed', from: 'kmh', to: 'mph', fromLabel: 'km/h', toLabel: 'mph', fromSymbol: 'km/h', toSymbol: 'mph', factor: 0.621371, slug: 'kmh-a-mph' },
];

export function HeroQuickConverter() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [value, setValue] = useState('1');
  const [copied, setCopied] = useState(false);
  const [eurUsdRate, setEurUsdRate] = useState(1.08);

  // Fetch live EUR/USD rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('/api/rates?base=EUR&target=USD');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data?.rates?.USD) {
          setEurUsdRate(data.rates.USD);
        }
      } catch {
        // Fallback to default rate
      }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 300000); // every 5 min
    return () => clearInterval(interval);
  }, []);

  // Dynamic options with live rate
  const dynamicOptions = useMemo(() =>
    QUICK_OPTIONS.map((opt) => {
      if (opt.category === 'currency') {
        if (opt.from === 'EUR') return { ...opt, factor: eurUsdRate };
        if (opt.from === 'USD') return { ...opt, factor: 1 / eurUsdRate };
      }
      return opt;
    }),
    [eurUsdRate]
  );

  const option = dynamicOptions[selectedIndex];

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return '—';

    if (option.category === 'temperature') {
      // Special handling for temperature
      if (option.from === 'celsius' && option.to === 'fahrenheit') {
        return ((num * 9) / 5 + 32).toLocaleString('es-ES', { maximumFractionDigits: 2 });
      }
      if (option.from === 'fahrenheit' && option.to === 'celsius') {
        return ((num - 32) * 5 / 9).toLocaleString('es-ES', { maximumFractionDigits: 2 });
      }
    }

    const converted = num * option.factor;
    return converted.toLocaleString('es-ES', { maximumFractionDigits: 4 });
  }, [value, option]);

  const handleCopy = useCallback(() => {
    if (result !== '—') {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="mx-auto max-w-lg">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-brand-500/10">
        {/* Conversion type selector */}
        <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
          {QUICK_OPTIONS.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => { setSelectedIndex(i); setValue('1'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                i === selectedIndex
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-1 text-left">{option.fromLabel}</div>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="0"
                step="any"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg font-semibold focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">
                {option.fromSymbol}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center pt-5">
            <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center text-brand-400 shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-1 text-left">{option.toLabel}</div>
            <div className="relative cursor-pointer group" onClick={handleCopy}>
              <div className="w-full px-4 py-3 rounded-xl bg-brand-600/10 border border-brand-600/30 text-white text-lg font-semibold text-left flex items-center min-h-[48px] transition-all group-hover:border-brand-500/60">
                <span className="truncate">{result}</span>
              </div>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand-400 font-medium pointer-events-none">
                {option.toSymbol}
              </span>
              {/* Copy indicator */}
              <div className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-xs bg-slate-700 text-white px-2 py-0.5 rounded-md whitespace-nowrap">
                  {copied ? '✓ Copiado' : '📋 Copiar'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Link to full tool */}
        <div className="mt-3 flex justify-between items-center">
          <Link
            href={`/conversor/${option.slug}`}
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium flex items-center gap-1"
          >
            Herramienta completa
            <span className="text-xs">→</span>
          </Link>
          <span className="text-[10px] text-slate-600">Conversión instantánea · Sin registro</span>
        </div>
      </div>
    </div>
  );
}
