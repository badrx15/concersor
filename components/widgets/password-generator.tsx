'use client';

import { useState, useCallback } from 'react';

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useDigits: boolean, useSymbols: boolean): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_-+=<>?/{}[]|';
  
  let charset = '';
  if (useUpper) charset += upper;
  if (useLower) charset += lower;
  if (useDigits) charset += digits;
  if (useSymbols) charset += symbols;
  
  if (!charset) return '';
  
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

function getStrength(length: number, types: number): { label: string; color: string; pct: number } {
  const score = Math.min(100, (length * types * 12) + (length > 8 ? 20 : 0));
  if (score < 30) return { label: 'Débil', color: '#ef4444', pct: score };
  if (score < 60) return { label: 'Media', color: '#eab308', pct: score };
  if (score < 80) return { label: 'Fuerte', color: '#22c55e', pct: score };
  return { label: 'Muy fuerte', color: '#06b6d4', pct: score };
}

export function PasswordGeneratorWidget() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const activeTypes = [useUpper, useLower, useDigits, useSymbols].filter(Boolean).length;
  const strength = password ? getStrength(password.length, activeTypes) : null;

  const generate = useCallback(() => {
    setPassword(generatePassword(length, useUpper, useLower, useDigits, useSymbols));
    setCopied(false);
  }, [length, useUpper, useLower, useDigits, useSymbols]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-300">Longitud: <span className="text-brand-300 font-bold">{length}</span></label>
        <input type="range" min={4} max={64} value={length} onChange={e => { setLength(+e.target.value); setPassword(''); }} className="w-full accent-brand-500 mt-2" />
        <div className="flex justify-between text-xs text-slate-500"><span>4</span><span>64</span></div>
      </div>

      <div className="space-y-2">
        {[
          { id: 'upper', label: 'Mayúsculas (A-Z)', val: useUpper, set: setUseUpper },
          { id: 'lower', label: 'Minúsculas (a-z)', val: useLower, set: setUseLower },
          { id: 'digits', label: 'Números (0-9)', val: useDigits, set: setUseDigits },
          { id: 'symbols', label: 'Símbolos (!@#$%)', val: useSymbols, set: setUseSymbols },
        ].map(({ id, label, val, set }) => (
          <label key={id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition">
            <input type="checkbox" checked={val} onChange={() => { set(!val); setPassword(''); }} className="w-4 h-4 accent-brand-500" />
            <span className="text-sm text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      <button onClick={generate} disabled={!activeTypes} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition hover:shadow-lg active:scale-[0.98]">
        🔑 Generar contraseña
      </button>

      {password && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            <h3 className="text-lg font-bold">Contraseña generada</h3>
          </div>
          <div className="flex gap-2">
            <code className="flex-1 p-3 rounded-lg bg-slate-800 text-brand-300 text-sm font-mono break-all select-all">{password}</code>
            <button onClick={copyToClipboard} className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition">
              {copied ? '✅' : '📋'}
            </button>
          </div>
          {strength && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Seguridad:</span>
                <span style={{ color: strength.color }} className="font-semibold">{strength.label}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${strength.pct}%`, backgroundColor: strength.color }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
