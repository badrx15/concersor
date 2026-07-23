'use client';

import { useState, useMemo } from 'react';
import { InputGroup } from './shared';

export function VatCalculatorWidget() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(21);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const result = useMemo(() => {
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) return null;
    const r = rate / 100;

    if (mode === 'add') {
      const vat = a * r;
      const total = a + vat;
      return { base: a, vat, total };
    } else {
      const base = a / (1 + r);
      const vat = a - base;
      return { base, vat, total: a };
    }
  }, [amount, rate, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700">
        <button onClick={() => setMode('add')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'add' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          Añadir IVA
        </button>
        <button onClick={() => setMode('remove')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'remove' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          Quitar IVA
        </button>
      </div>

      <InputGroup
        label={mode === 'add' ? 'Precio sin IVA' : 'Precio con IVA incluido'}
        tooltip={mode === 'add'
          ? 'Introduce el precio base sin impuestos. Se le añadirá el IVA correspondiente.'
          : 'Introduce el precio total que ya incluye el IVA. Se calculará la base imponible y el IVA desglosado.'}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
        </div>
      </InputGroup>

      <InputGroup label={'Tipo de IVA: ' + rate + '%'} tooltip="Elige el tipo de IVA a aplicar. En España: 4% (superreducido), 10% (reducido), 21% (general). Usa el deslizador para otros valores.">
        <div className="flex gap-2 mt-2">
          {[4, 10, 21].map(r => (
            <button key={r} onClick={() => setRate(r)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${rate === r ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'}`}>
              {r}%
            </button>
          ))}
        </div>
        <input type="range" min={0} max={27} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-brand-500 mt-2" />
      </InputGroup>

      {result && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 mb-1"><span className="text-2xl">💰</span><h3 className="text-lg font-bold">Desglose</h3></div>
          <div className="space-y-2">
            <div className="flex justify-between py-2 px-3 rounded-lg bg-slate-800/40">
              <span className="text-slate-400">Base imponible</span>
              <span className="font-semibold">{result.base.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-lg bg-slate-800/40">
              <span className="text-slate-400">IVA ({rate}%)</span>
              <span className="font-semibold text-amber-400">{result.vat.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between py-3 px-3 rounded-lg bg-brand-600/20 border border-brand-600/30">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-brand-300">{result.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
