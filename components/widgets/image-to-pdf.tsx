'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FileDrop, DownloadButton, ErrorBox, loadImage, formatBytes } from './shared';

export function ImageToPdfWidget() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const convert = async () => {
    if (files.length === 0) { setError('Selecciona al menos una imagen'); return; }
    setBusy(true); setError(''); setResult(null);
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < files.length; i++) {
        const img = await loadImage(files[i]);
        const ratio = Math.min(pageW / img.naturalWidth, pageH / img.naturalHeight);
        const w = img.naturalWidth * ratio;
        const h = img.naturalHeight * ratio;
        if (i > 0) pdf.addPage();
        // Use canvas to get data URL for reliability
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d')!.drawImage(img, 0, 0);
        const dataUrl = c.toDataURL('image/jpeg', 0.92);
        pdf.addImage(dataUrl, 'JPEG', (pageW - w) / 2, (pageH - h) / 2, w, h, undefined, 'FAST');
      }

      const blob = pdf.output('blob') as Blob;
      const url = URL.createObjectURL(blob);
      setResult({ url, name: 'imagenes.pdf', size: blob.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear PDF');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" multiple onFiles={(f) => { setFiles(f); setResult(null); }} label="Selecciona una o varias imágenes" />
      <div className="text-xs text-slate-500">📋 {files.length} imagen(es) → {files.length} página(s) PDF</div>
      <button onClick={convert} disabled={busy || files.length === 0} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition">
        {busy ? <span className="loading-dots"><span></span><span></span><span></span></span> : '📄 Crear PDF'}
      </button>
      {error && <ErrorBox message={error} />}
      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">Resultado</h3></div>
          <div className="text-sm text-slate-400 mb-3">📐 {result.name} ({formatBytes(result.size)})</div>
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}
