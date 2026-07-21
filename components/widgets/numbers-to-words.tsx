'use client';

import { useState } from 'react';
import { CopyButton } from './shared';

// Spanish number to words
const UNITS = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const TENS = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const SPECIAL_TEENS: Record<number, string> = {
  11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
  16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve',
};
const SPECIAL_TWENTIES: Record<number, string> = {
  21: 'veintiún', 22: 'veintidós', 23: 'veintitrés', 24: 'veinticuatro',
  25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete', 28: 'veintiocho', 29: 'veintinueve',
};
const HUNDREDS: Record<number, string> = {
  100: 'cien', 200: 'doscientos', 300: 'trescientos', 400: 'cuatrocientos',
  500: 'quinientos', 600: 'seiscientos', 700: 'setecientos', 800: 'ochocientos', 900: 'novecientos',
};

function convertGroup(n: number, feminine = false): string {
  if (n === 0) return '';
  if (n < 10) {
    if (n === 1 && feminine) return 'una';
    if (n === 1) return 'un';
    return UNITS[n];
  }
  if (n >= 11 && n <= 19) {
    const v = SPECIAL_TEENS[n];
    if (n === 11 && feminine) return 'once';
    return v;
  }
  if (n >= 21 && n <= 29) {
    const v = SPECIAL_TWENTIES[n];
    if (n === 21 && feminine) return 'veintiuna';
    return v;
  }
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    if (unit === 0) return TENS[ten];
    return `${TENS[ten]} y ${unit === 1 && feminine ? 'una' : unit === 1 ? 'un' : UNITS[unit]}`;
  }
  // 100-999
  const hundred = Math.floor(n / 100) * 100;
  const rest = n % 100;
  if (hundred === 100 && n === 100) return 'cien';
  const hundredWord = HUNDREDS[hundred];
  if (!hundredWord) return UNITS[Math.floor(n / 100)] + 'cientos' + (rest > 0 ? ' ' + convertGroup(rest, feminine) : '');
  if (hundredWord === 'quinientos' && n >= 500 && n < 600) {
    return 'quinientos' + (rest > 0 ? ' ' + convertGroup(rest, feminine) : '');
  }
  return hundredWord + (rest > 0 ? ' ' + convertGroup(rest, feminine) : '');
}

function numberToWords(n: number, feminine = false): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return 'cero';

  const isNegative = n < 0;
  const absN = Math.abs(n);

  const billions = Math.floor(absN / 1000000000);
  const millions = Math.floor((absN % 1000000000) / 1000000);
  const thousands = Math.floor((absN % 1000000) / 1000);
  const remainder = absN % 1000;

  const parts: string[] = [];

  if (billions > 0) {
    if (billions === 1) parts.push('mil millones');
    else parts.push(convertGroup(billions) + ' mil millones');
  }
  if (millions > 0) {
    if (millions === 1) parts.push('un millón');
    else parts.push(convertGroup(millions) + ' millones');
  }
  if (thousands > 0) {
    if (thousands === 1) parts.push('mil');
    else parts.push(convertGroup(thousands) + ' mil');
  }
  if (remainder > 0) {
    parts.push(convertGroup(remainder, feminine));
  }

  const result = parts.join(' ');
  return (isNegative ? 'menos ' : '') + result;
}

function numberToCurrency(n: number): string {
  const integer = Math.floor(n);
  const cents = Math.round((n - integer) * 100);
  const words = numberToWords(integer, true);
  const centsStr = cents.toString().padStart(2, '0');
  return `${words} euros con ${centsStr} céntimos`;
}

export function NumbersToWordsWidget() {
  const [value, setValue] = useState('1234');
  const [mode, setMode] = useState<'plain' | 'currency'>('plain');

  const num = parseFloat(value);
  const isValid = !isNaN(num) && Number.isFinite(num) && value.trim() !== '';

  const plainResult = isValid ? numberToWords(num) : '';
  const currencyResult = isValid && num >= 0 ? numberToCurrency(num) : '';
  const feminineResult = isValid ? numberToWords(num, true) : '';

  const maxIntegerDigits = 15; // billions max
  const exceedsLimit = value.replace(/[-\d.]/g, '').length === 0 && value.replace(/[^0-9]/g, '').length > maxIntegerDigits;

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          🔢 Número
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            // Allow digits, decimal point, minus sign
            if (/^-?\d*\.?\d*$/.test(raw) || raw === '') {
              setValue(raw);
            }
          }}
          placeholder="Ej: 1234.56"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition text-lg font-mono"
        />
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        {[
          { id: 'plain' as const, label: '📝 Texto simple' },
          { id: 'currency' as const, label: '💰 Euros' },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setMode(opt.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              mode === opt.id
                ? 'bg-brand-600/30 border-brand-500 text-brand-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Validation */}
      {value && !isValid && (
        <p className="text-amber-400 text-sm">⚠️ Introduce un número válido.</p>
      )}
      {exceedsLimit && (
        <p className="text-amber-400 text-sm">⚠️ El número es demasiado grande (máx. 999 mil millones).</p>
      )}

      {/* Result */}
      {isValid && !exceedsLimit && (
        <div>
          {/* Plain result */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">
                  {mode === 'currency' ? '💰 Cantidad en euros' : '📝 Número en letras'}
                </div>
                <p className="text-lg sm:text-xl font-bold text-brand-300 leading-relaxed">
                  {mode === 'currency' ? currencyResult : plainResult}
                </p>
                {/* Show feminine form for plain mode when different */}
                {mode === 'plain' && feminineResult && feminineResult !== plainResult && (
                  <>
                    <div className="text-xs text-slate-400 mt-3 mb-1">👩 Forma femenina</div>
                    <p className="text-base text-cyan-300">{feminineResult}</p>
                  </>
                )}
              </div>
              <CopyButton text={mode === 'currency' ? currencyResult : plainResult} className="shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* Quick examples */}
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">Ejemplos rápidos</p>
        <div className="flex flex-wrap gap-2">
          {['1', '7', '15', '21', '100', '1234', '1000000', '1.99', '1000000000'].map((example) => (
            <button
              key={example}
              onClick={() => setValue(example)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs font-mono text-slate-300 hover:border-brand-500 transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-slate-500 leading-relaxed">
        Soporta números desde cero hasta 999 mil millones, con hasta 2 decimales.
        Usa el punto (.) como separador decimal.
      </div>
    </div>
  );
}
