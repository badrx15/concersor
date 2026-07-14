'use client';

import { useState, useEffect } from 'react';
import { FileDrop, DownloadButton, ErrorBox, loadImage, canvasToBlob, replaceExt, formatBytes } from './shared';

export function ImageToWebpWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(85);
  const [result, setResult] = useState<{ url: string; name: string; size: number; original: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const convert = async () => {
    if (!file) { setError('Selecciona una imagen'); return; }
    setBusy(true); setError(''); setResult(null);
    try {
      const img = await loadImage(file);
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const q = Math.max(0.1, Math.min(1, quality / 100));
      const blob = await canvasToBlob(c, 'image/webp', q);
      const url = URL.createObjectURL(blob);
      setResult({ url, name: replaceExt(file.name, 'webp'), size: blob.size, original: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al convertir');
    } finally {
      setBusy(false);
    }
  };

  const saved = result ? Math.round((1 - result.size / result.original) * 100) : 0;

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" onFiles={(f) => { setFile(f[0]); setResult(null); }} label="Selecciona cualquier imagen" />
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Calidad (1-100)</label>
        <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-brand-500" />
        <span className="text-sm text-slate-400">{quality}</span>
      </div>
      <button onClick={convert} disabled={busy || !file} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition">
        {busy ? <span className="loading-dots"><span></span><span></span><span></span></span> : '✨ Convertir a WebP'}
      </button>
      {error && <ErrorBox message={error} />}
      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">Resultado</h3></div>
          <img src={result.url} alt="Resultado" className="max-h-48 rounded-lg border border-slate-700 mb-3" />
          <div className="text-sm text-slate-400 mb-1">📐 {result.name} ({formatBytes(result.size)})</div>
          <div className="text-sm text-green-400 mb-3">📉 Ahorraste {saved}% ({formatBytes(result.original)} → {formatBytes(result.size)})</div>
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}
