'use client';

import { useState, useMemo } from 'react';

export function DateDifferenceWidget() {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(fmt(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [endDate, setEndDate] = useState(fmt(today));
  const [mode, setMode] = useState<'diff' | 'add'>('diff');

  // Para modo "sumar/restar"
  const [baseDate, setBaseDate] = useState(fmt(today));
  const [addDays, setAddDays] = useState('');
  const [addMonths, setAddMonths] = useState('');
  const [addYears, setAddYears] = useState('');

  const result = useMemo(() => {
    if (mode === 'diff') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

      const diffMs = end.getTime() - start.getTime();
      const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.round(diffMs / (1000 * 60 * 60));
      const totalMinutes = Math.round(diffMs / (1000 * 60));

      // Calcular años, meses, días exactos
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      let days = end.getDate() - start.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      return { years, months, days, totalDays, totalHours, totalMinutes, negative: totalDays < 0 };
    } else {
      const base = new Date(baseDate);
      if (isNaN(base.getTime())) return null;
      const d = parseInt(addDays) || 0;
      const m = parseInt(addMonths) || 0;
      const y = parseInt(addYears) || 0;
      if (d === 0 && m === 0 && y === 0) return null;

      const result = new Date(base);
      result.setFullYear(result.getFullYear() + y);
      result.setMonth(result.getMonth() + m);
      result.setDate(result.getDate() + d);

      return {
        original: base,
        result,
        diff: { years: y, months: m, days: d },
      };
    }
  }, [mode, startDate, endDate, baseDate, addDays, addMonths, addYears]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700">
        <button onClick={() => setMode('diff')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'diff' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          📅 Diferencia
        </button>
        <button onClick={() => setMode('add')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'add' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          ➕ Sumar/Restar
        </button>
      </div>

      {mode === 'diff' ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-300">Fecha inicio</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white [color-scheme:dark]" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Fecha fin</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white [color-scheme:dark]" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-300">Fecha base</label>
            <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white [color-scheme:dark]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-300">Años</label>
              <input type="number" value={addYears} onChange={e => setAddYears(e.target.value)} placeholder="0"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Meses</label>
              <input type="number" value={addMonths} onChange={e => setAddMonths(e.target.value)} placeholder="0"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Días</label>
              <input type="number" value={addDays} onChange={e => setAddDays(e.target.value)} placeholder="0"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Usa valores negativos para restar (ej: -5 días)</p>
        </div>
      )}

      {result && mode === 'diff' && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2"><span className="text-2xl">📅</span><h3 className="text-lg font-bold">Diferencia</h3></div>
          {result.negative ? (
            <p className="text-red-400">La fecha de inicio es posterior a la fecha fin.</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-brand-300">{result.years}</div>
                  <div className="text-xs text-slate-400">años</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-brand-300">{result.months}</div>
                  <div className="text-xs text-slate-400">meses</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="text-2xl font-bold text-brand-300">{result.days}</div>
                  <div className="text-xs text-slate-400">días</div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1 px-3 rounded bg-slate-800/30">
                  <span className="text-slate-400">Total días</span>
                  <span className="font-semibold">{result.totalDays!.toLocaleString('es-ES')}</span>
                </div>
                <div className="flex justify-between py-1 px-3 rounded bg-slate-800/30">
                  <span className="text-slate-400">Total horas</span>
                  <span className="font-semibold">{result.totalHours!.toLocaleString('es-ES')}</span>
                </div>
                <div className="flex justify-between py-1 px-3 rounded bg-slate-800/30">
                  <span className="text-slate-400">Total minutos</span>
                  <span className="font-semibold">{result.totalMinutes!.toLocaleString('es-ES')}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {result && mode === 'add' && 'original' in result && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2"><span className="text-2xl">📅</span><h3 className="text-lg font-bold">Resultado</h3></div>
          <div className="flex justify-between py-2 px-3 rounded-lg bg-slate-800/40">
            <span className="text-slate-400">Fecha original</span>
            <span className="font-semibold">{result.original!.toLocaleDateString('es-ES')}</span>
          </div>
          <div className="flex justify-between py-3 px-3 rounded-lg bg-brand-600/20 border border-brand-600/30">
            <span className="font-semibold">Nueva fecha</span>
            <span className="font-bold text-lg text-brand-300">{result.result!.toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
