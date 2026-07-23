'use client';

import { useState, useEffect } from 'react';
import { FileDrop, DownloadButton, ErrorBox, formatBytes } from './shared';

export function HeicToJpgWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const convert = async () => {
    if (!file) { setError('Selecciona una foto HEIC'); return; }
    setBusy(true); setError(''); setResult(null);
    try {
      const heic2any = (await import('heic2any')).default;
      const blob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: quality / 100,
      });
      const resultBlob = Array.isArray(blob) ? blob[0] : blob;
      setResult({
        url: URL.createObjectURL(resultBlob),
        name: file.name.replace(/\.heic$/i, '.jpg'),
        size: resultBlob.size,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al convertir HEIC. Asegúrate de que el archivo sea una foto HEIC válida.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
        ℹ️ Convierte fotos HEIC de iPhone a JPG. 100% local en tu navegador, tus fotos no se suben a ningún servidor.
      </div>

      <FileDrop
        accept=".heic,.heif,image/heic,image/heif"
        onFiles={(f) => { setFile(f[0]); setResult(null); }}
        label="Selecciona una foto HEIC (.heic) de tu iPhone"
      />

      {file && (
        <div className="text-sm text-slate-400">
          📎 {file.name} ({formatBytes(file.size)})
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">
          Calidad JPG ({quality}%)
        </label>
        <input
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(+e.target.value)}
          className="w-full accent-brand-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Menor tamaño</span>
          <span>Mejor calidad</span>
        </div>
      </div>

      <button
        onClick={convert}
        disabled={busy || !file}
        className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition hover:shadow-lg hover:shadow-brand-600/25 active:scale-[0.98]"
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Convirtiendo...
          </span>
        ) : (
          '🔄 Convertir HEIC a JPG'
        )}
      </button>

      {error && <ErrorBox message={error} />}

      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold">Resultado</h3>
          </div>
          <img
            src={result.url}
            alt="Vista previa JPG"
            className="max-h-48 rounded-lg border border-slate-700 mb-3 mx-auto"
          />
          <div className="text-sm text-slate-400 mb-1">
            📐 {result.name} ({formatBytes(result.size)})
          </div>
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}
