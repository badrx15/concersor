'use client';

import { useState, useCallback } from 'react';
import { InputGroup } from './shared';

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
      <InputGroup label={'Longitud: ' + length} tooltip="La longitud de la contraseña. A mayor longitud, más segura. Se recomienda al menos 12 caracteres, idealmente 16 o más.">
        <input type="range" min={4} max={64} value={length} onChange={e => { setLength(+e.target.value); setPassword(''); }} className="w-full accent-brand-500" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>4</span><span>64</span></div>
      </InputGroup>

      <div className="space-y-2">
        {[
          { id: 'upper', label: 'Mayúsculas (A-Z)', val: useUpper, set: setUseUpper, tip: 'Incluye letras A-Z mayúsculas. Aumenta la complejidad y seguridad.' },
          { id: 'lower', label: 'Minúsculas (a-z)', val: useLower, set: setUseLower, tip: 'Incluye letras a-z minúsculas. Es la base de cualquier contraseña.' },
          { id: 'digits', label: 'Números (0-9)', val: useDigits, set: setUseDigits, tip: 'Incluye dígitos del 0 al 9. Añade variedad y dificulta ataques de diccionario.' },
          { id: 'symbols', label: 'Símbolos (!@#$%)', val: useSymbols, set: setUseSymbols, tip: 'Incluye caracteres especiales. Son los que más aumentan la fortaleza de la contraseña.' },
        ].map(({ id, label, val, set, tip }) => (
          <div key={id} className="group relative">
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition">
              <input type="checkbox" checked={val} onChange={() => { set(!val); setPassword(''); }} className="w-4 h-4 accent-brand-500" />
              <span className="text-sm text-slate-300">{label}</span>
              <span className="ml-auto inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-slate-700/60 text-[10px] text-slate-400 cursor-help hover:bg-slate-600 hover:text-slate-200 transition-all select-none">?</span>
            </label>
            <div className="absolute bottom-full right-0 mb-2 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 shadow-2xl text-xs text-slate-200 leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none w-64 whitespace-normal">
              {tip}
              <div className="absolute top-full right-6 -mt-px border-[6px] border-transparent border-t-slate-600" />
            </div>
          </div>
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
