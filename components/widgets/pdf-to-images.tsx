'use client';

import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileDrop, ErrorBox, DownloadButton, canvasToBlob, formatBytes } from './shared';

export function PdfToImagesWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{ url: string; name: string; size: number }[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  useEffect(() => () => { results.forEach((r) => URL.revokeObjectURL(r.url)); }, [results]);

  const convert = async () => {
    if (!file) { setError('Selecciona un PDF'); return; }
    setBusy(true); setError(''); setResults([]);
    try {
      // Worker desde el paquete npm para coincidir con la versión instalada
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const pages: { url: string; name: string; size: number }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Procesando página ${i} de ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
        const blob = await canvasToBlob(canvas, 'image/png');
        const url = URL.createObjectURL(blob);
        pages.push({ url, name: `pagina-${String(i).padStart(3, '0')}.png`, size: blob.size });
      }
      setResults(pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al procesar PDF');
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" onFiles={(f) => { setFile(f[0]); setResults([]); }} label="Selecciona un archivo PDF" />
      <button onClick={convert} disabled={busy || !file} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition">
        {busy ? <span className="text-sm">{progress || 'Procesando...'}</span> : '🖼️ Extraer imágenes'}
      </button>
      {error && <ErrorBox message={error} />}
      {results.length > 0 && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">{results.length} imagen(es) extraída(s)</h3></div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 transition gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={r.url} alt={r.name} className="w-12 h-12 object-cover rounded border border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm truncate">{r.name}</div>
                    <div className="text-xs text-slate-500">{formatBytes(r.size)}</div>
                  </div>
                </div>
                <DownloadButton href={r.url} name={r.name} label="⬇" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
