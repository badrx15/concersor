'use client';

import { useState } from 'react';

type PctMode = 'pct-of' | 'what-pct' | 'pct-change';

export function PercentageCalculatorWidget() {
  const [mode, setMode] = useState<PctMode>('pct-of');
  const [value, setValue] = useState('');
  const [percent, setPercent] = useState('');
  const [total, setTotal] = useState('');
  const [oldVal, setOldVal] = useState('');
  const [newVal, setNewVal] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    setResult(null);
    const v = parseFloat(value);
    const p = parseFloat(percent);
    const t = parseFloat(total);
    const o = parseFloat(oldVal);
    const n = parseFloat(newVal);

    if (mode === 'pct-of') {
      if (isNaN(v) || isNaN(p)) return;
      const r = (v * p) / 100;
      setResult(`${p}% de ${v.toLocaleString('es-ES')} = ${r.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`);
    } else if (mode === 'what-pct') {
      if (isNaN(v) || isNaN(t) || t === 0) return;
      const r = (v / t) * 100;
      setResult(`${v.toLocaleString('es-ES')} es el ${r.toLocaleString('es-ES', { maximumFractionDigits: 2 })}% de ${t.toLocaleString('es-ES')}`);
    } else {
      if (isNaN(o) || isNaN(n) || o === 0) return;
      const diff = n - o;
      const r = (diff / o) * 100;
      const sign = diff >= 0 ? '+' : '';
      setResult(`Cambio: ${sign}${r.toLocaleString('es-ES', { maximumFractionDigits: 2 })}% (${sign}${diff.toLocaleString('es-ES', { maximumFractionDigits: 2 })})`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700">
        <button onClick={() => { setMode('pct-of'); setResult(null); }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${mode === 'pct-of' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          % de cantidad
        </button>
        <button onClick={() => { setMode('what-pct'); setResult(null); }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${mode === 'what-pct' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          ¿Qué % es?
        </button>
        <button onClick={() => { setMode('pct-change'); setResult(null); }}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${mode === 'pct-change' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          Cambio %
        </button>
      </div>

      {mode === 'pct-of' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-300">Cantidad</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Ej: 200" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Porcentaje (%)</label>
            <input type="number" value={percent} onChange={e => setPercent(e.target.value)} placeholder="Ej: 15" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
        </div>
      )}

      {mode === 'what-pct' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-300">Valor</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Ej: 30" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Total</label>
            <input type="number" value={total} onChange={e => setTotal(e.target.value)} placeholder="Ej: 200" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
        </div>
      )}

      {mode === 'pct-change' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-300">Valor anterior</label>
            <input type="number" value={oldVal} onChange={e => setOldVal(e.target.value)} placeholder="Ej: 50" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Valor nuevo</label>
            <input type="number" value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="Ej: 75" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </div>
        </div>
      )}

      <button onClick={calculate} disabled={!getEnabled()} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition hover:shadow-lg active:scale-[0.98]">
        Calcular
      </button>

      {result && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-2"><span className="text-2xl">📊</span><h3 className="text-lg font-bold">Resultado</h3></div>
          <p className="text-xl font-semibold text-brand-300">{result}</p>
        </div>
      )}
    </div>
  );

  function getEnabled() {
    if (mode === 'pct-of') return value && percent;
    if (mode === 'what-pct') return value && total;
    return oldVal && newVal;
  }
}
