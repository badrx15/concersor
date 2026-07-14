'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from './shared';

type Direction = 'json-to-csv' | 'csv-to-json';

function jsonToCsv(jsonStr: string): string {
  let arr: unknown[];
  try {
    arr = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('JSON inválido: ' + (e instanceof Error ? e.message : ''));
  }
  if (!Array.isArray(arr) || arr.length === 0) throw new Error('El JSON debe ser un array de objetos con al menos un elemento');
  const first = arr[0];
  if (typeof first !== 'object' || first === null) throw new Error('El array debe contener objetos');
  const headers = Object.keys(first as object);
  const escapeCell = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const rows = [headers.join(',')];
  for (const item of arr) {
    if (typeof item !== 'object' || item === null) continue;
    const obj = item as Record<string, unknown>;
    rows.push(headers.map((h) => escapeCell(obj[h])).join(','));
  }
  return rows.join('\n');
}

function csvToJson(csvStr: string): string {
  const rows = parseCsvRows(csvStr);
  if (rows.length < 2) throw new Error('CSV vacío o sin datos');
  const headers = rows[0];
  const result = rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

function parseCsvRows(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') { cell += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (cell !== '' || row.length) { row.push(cell); out.push(row); row = []; cell = ''; }
      } else cell += c;
    }
  }
  if (cell !== '' || row.length) { row.push(cell); out.push(row); }
  return out;
}

export function JsonCsvWidget() {
  const [direction, setDirection] = useState<Direction>('json-to-csv');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (!input.trim()) return '';
    setError('');
    try {
      return direction === 'json-to-csv' ? jsonToCsv(input) : csvToJson(input);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      return '';
    }
  }, [input, direction]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Dirección</label>
        <div className="flex gap-2">
          <button
            onClick={() => setDirection('json-to-csv')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${direction === 'json-to-csv' ? 'bg-brand-500/20 border-brand-500 text-brand-300' : 'bg-slate-800/60 border-slate-700 hover:border-brand-500'}`}
          >
            JSON → CSV
          </button>
          <button
            onClick={() => setDirection('csv-to-json')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${direction === 'csv-to-json' ? 'bg-brand-500/20 border-brand-500 text-brand-300' : 'bg-slate-800/60 border-slate-700 hover:border-brand-500'}`}
          >
            CSV → JSON
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">
          {direction === 'json-to-csv' ? 'Pega tu JSON aquí' : 'Pega tu CSV aquí'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={direction === 'json-to-csv' ? '[\n  {"nombre": "Ana", "edad": 30},\n  {"nombre": "Juan", "edad": 25}\n]' : 'nombre,edad\nAna,30\nJuan,25'}
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm font-mono resize-y"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">❌ {error}</div>
      )}

      {result && (
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Resultado</label>
          <div className="relative">
            <pre className="p-4 bg-slate-950 rounded-lg border border-slate-700 text-sm font-mono whitespace-pre-wrap max-h-72 overflow-auto">{result}</pre>
            <CopyButton text={result} className="absolute top-3 right-3" />
          </div>
        </div>
      )}
    </div>
  );
}
