'use client';

import { useState, useMemo } from 'react';

export function WordCounterWidget() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const readingTime = Math.max(1, Math.round(words.length / 250));
    return {
      words: words.length,
      chars,
      charsNoSpace,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime,
    };
  }, [text]);

  const statCards = [
    { label: 'Palabras', value: stats.words, icon: '📝' },
    { label: 'Caracteres', value: stats.chars, icon: '🔢' },
    { label: 'Sin espacios', value: stats.charsNoSpace, icon: '✂️' },
    { label: 'Oraciones', value: stats.sentences, icon: '📌' },
    { label: 'Párrafos', value: stats.paragraphs, icon: '📄' },
    { label: 'Lectura (min)', value: stats.readingTime, icon: '⏱️' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Texto a analizar</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Escribe o pega tu texto aquí..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm resize-y"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-brand-300">{s.value.toLocaleString('es-ES')}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
