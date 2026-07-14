'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  config?: Record<string, string>;
}

const CURRENCIES = [
  'EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'MXN', 'ARS', 'BRL', 'CNY', 'INR',
];

const CURRENCY_NAMES: Record<string, string> = {
  EUR: 'Euro', USD: 'Dólar EE.UU.', GBP: 'Libra esterlina', JPY: 'Yen japonés',
  CHF: 'Franco suizo', CAD: 'Dólar canadiense', AUD: 'Dólar australiano',
  MXN: 'Peso mexicano', ARS: 'Peso argentino', BRL: 'Real brasileño',
  CNY: 'Yuan chino', INR: 'Rupia india',
};

interface RatesResponse {
  base: string;
  date?: string;
  rates: Record<string, number>;
  cached?: boolean;
  source?: string;
  cacheAgeMin?: number;
}

export function CurrencyConverterWidget({ config }: Props) {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState(config?.defaultFrom || 'EUR');
  const [to, setTo] = useState(config?.defaultTo || 'USD');
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async (base: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/rates?base=${base}`);
      if (!res.ok) throw new Error('No se pudieron obtener las tasas');
      const data: RatesResponse = await res.json();
      setRates(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al obtener tasas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(from);
  }, [from, fetchRates]);

  const result = (() => {
    const amt = parseFloat(amount);
    if (!Number.isFinite(amt) || !rates?.rates?.[to]) return null;
    return amt * rates.rates[to];
  })();

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleCopy = async () => {
    if (result === null) return;
    const text = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="space-y-4">
      {/* Amount */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Importe</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-lg font-mono"
          min="0"
          step="any"
        />
      </div>

      {/* From / To */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">De</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-brand-500 hover:text-brand-300 transition mb-0.5"
          aria-label="Intercambiar monedas"
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
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      {error ? (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">
          ❌ {error}
        </div>
      ) : (
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-green-600/20 to-cyan-500/10 border border-green-500/30">
          <div className="text-sm text-slate-400 mb-1">Resultado</div>
          {loading ? (
            <div className="text-2xl text-slate-400">
              <span className="loading-dots"><span></span><span></span><span></span></span>
            </div>
          ) : result !== null ? (
            <>
              <div className="text-3xl font-bold font-mono text-white">
                {result.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                <span className="text-green-300 text-xl">{to}</span>
              </div>
              <div className="text-sm text-slate-400 mt-2">
                {amount} {from} = {result.toFixed(2)} {to}
              </div>
              {rates && (
                <div className="text-xs text-slate-500 mt-2">
                  Tasa: 1 {from} = {rates.rates[to]?.toFixed(6)} {to}
                  {rates.date && ` · Actualizado: ${rates.date}`}
                  {rates.cached && ` (caché ${rates.cacheAgeMin}min)`}
                </div>
              )}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition"
              >
                📋 Copiar
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
