'use client';

import { useState } from 'react';

type DiscountMode = 'final-price' | 'saved' | 'what-pct';

export function DiscountCalculatorWidget() {
  const [mode, setMode] = useState<DiscountMode>('final-price');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPct, setDiscountPct] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [result, setResult] = useState<{
    original: number;
    discountPct: number;
    saved: number;
    final: number;
  } | null>(null);

  const calculate = () => {
    setResult(null);
    const orig = parseFloat(originalPrice);
    const discPct = parseFloat(discountPct);
    const sale = parseFloat(salePrice);

    if (mode === 'final-price' || mode === 'saved') {
      if (isNaN(orig) || isNaN(discPct)) return;
      const saved = (orig * discPct) / 100;
      const final = orig - saved;
      setResult({ original: orig, discountPct: discPct, saved, final });
    } else {
      if (isNaN(orig) || isNaN(sale) || orig === 0) return;
      const saved = orig - sale;
      const discPct = (saved / orig) * 100;
      setResult({ original: orig, discountPct: discPct, saved, final: sale });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700">
        <button onClick={() => { setMode('final-price'); setResult(null); }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${mode === 'final-price' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          💰 Precio final
        </button>
        <button onClick={() => { setMode('saved'); setResult(null); }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${mode === 'saved' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          💵 ¿Cuánto ahorro?
        </button>
        <button onClick={() => { setMode('what-pct'); setResult(null); }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${mode === 'what-pct' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          🔢 ¿Qué % es?
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-300">Precio original (€)</label>
          <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="Ej: 100"
            className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
        </div>

        {(mode === 'final-price' || mode === 'saved') ? (
          <div>
            <label className="text-sm font-medium text-slate-300">Descuento (%)</label>
            <input type="number" value={discountPct} onChange={e => setDiscountPct(e.target.value)} placeholder="Ej: 20"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {[5, 10, 15, 20, 25, 30, 40, 50].map(p => (
                <button key={p} onClick={() => setDiscountPct(String(p))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    discountPct === String(p)
                      ? 'bg-green-600/50 text-green-200 border border-green-500/50'
                      : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
                  }`}>
                  -{p}%
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-slate-300">Precio final (€)</label>
            <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="Ej: 80"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
        )}
      </div>

      <button onClick={calculate}
        disabled={!getEnabled()}
        className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 text-white disabled:opacity-50 transition hover:shadow-lg active:scale-[0.98]">
        Calcular
      </button>

      {result && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3 mb-2"><span className="text-2xl">🏷️</span><h3 className="text-lg font-bold">Resultado</h3></div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-slate-800/40">
              <div className="text-xs text-slate-400 mb-1">Precio original</div>
              <div className="text-xl font-bold text-white">
                {result.original.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/40">
              <div className="text-xs text-slate-400 mb-1">Dto. aplicado</div>
              <div className="text-xl font-bold text-amber-400">
                -{result.discountPct.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-600/15 border border-green-500/30">
            <div className="text-xs text-green-300 mb-1">💰 Ahorras</div>
            <div className="text-2xl font-bold text-green-400">
              {result.saved.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
          </div>

          <div className="p-4 rounded-lg bg-brand-600/20 border border-brand-600/40">
            <div className="text-xs text-brand-300 mb-1">Precio final</div>
            <div className="text-2xl font-bold text-brand-300">
              {result.final.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getEnabled() {
    if (mode === 'final-price' || mode === 'saved') return originalPrice && discountPct;
    return originalPrice && salePrice;
  }
}
