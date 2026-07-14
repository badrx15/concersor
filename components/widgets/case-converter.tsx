'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from './shared';

const CASE_OPTIONS = [
  { v: 'upper', t: 'MAYÚSCULAS' },
  { v: 'lower', t: 'minúsculas' },
  { v: 'title', t: 'Title Case' },
  { v: 'sentence', t: 'Sentence case' },
  { v: 'camel', t: 'camelCase' },
  { v: 'pascal', t: 'PascalCase' },
  { v: 'snake', t: 'snake_case' },
  { v: 'kebab', t: 'kebab-case' },
  { v: 'constant', t: 'CONSTANT_CASE' },
] as const;

function toCase(text: string, to: string): string {
  const words = text.split(/[\s_-]+|(?=[A-Z])/).filter(Boolean);
  switch (to) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camel': return (words[0]?.toLowerCase() || '') + words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'pascal': return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    case 'snake': return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab': return words.map((w) => w.toLowerCase()).join('-');
    case 'constant': return words.map((w) => w.toUpperCase()).join('_');
    default: return text;
  }
}

export function CaseConverterWidget() {
  const [text, setText] = useState('');
  const [targetCase, setTargetCase] = useState<string>('upper');

  const result = useMemo(() => toCase(text, targetCase), [text, targetCase]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Texto a convertir</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Escribe o pega tu texto aquí..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Convertir a</label>
        <div className="flex flex-wrap gap-2">
          {CASE_OPTIONS.map((o) => (
            <button
              key={o.v}
              onClick={() => setTargetCase(o.v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                targetCase === o.v
                  ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                  : 'bg-slate-800/60 border-slate-700 hover:border-brand-500'
              }`}
            >
              {o.t}
            </button>
          ))}
        </div>
      </div>

      {text && (
        <div className="relative">
          <pre className="p-4 bg-slate-950 rounded-lg border border-slate-700 text-sm font-mono whitespace-pre-wrap min-h-[80px]">
            {result || <span className="text-slate-500">El resultado aparecerá aquí...</span>}
          </pre>
          <CopyButton text={result} className="absolute top-3 right-3" />
        </div>
      )}
    </div>
  );
}
