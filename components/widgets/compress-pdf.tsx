'use client';

import { useState, useEffect } from 'react';
import { FileDrop, DownloadButton, ErrorBox, formatBytes } from './shared';

export function CompressPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; size: number; original: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const convert = async () => {
    if (!file) { setError('Selecciona un PDF'); return; }
    setBusy(true); setError(''); setResult(null);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      // Remove metadata to reduce size
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      const bytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResult({ url, name: file.name.replace(/\.pdf$/i, '') + '-comprimido.pdf', size: blob.size, original: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al comprimir PDF');
    } finally {
      setBusy(false);
    }
  };

  const saved = result ? Math.round((1 - result.size / result.original) * 100) : 0;

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" onFiles={(f) => { setFile(f[0]); setResult(null); }} label="Selecciona un archivo PDF" />
      <div className="text-xs text-slate-500">📊 Se eliminan metadatos y se optimiza la estructura del PDF.</div>
      <button onClick={convert} disabled={busy || !file} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition">
        {busy ? <span className="loading-dots"><span></span><span></span><span></span></span> : '🗜️ Comprimir PDF'}
      </button>
      {error && <ErrorBox message={error} />}
      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">Resultado</h3></div>
          <div className="text-sm text-slate-400 mb-1">📐 {result.name} ({formatBytes(result.size)})</div>
          {saved > 0 && <div className="text-sm text-green-400 mb-3">📉 Ahorraste {saved}% ({formatBytes(result.original)} → {formatBytes(result.size)})</div>}
          {saved <= 0 && <div className="text-sm text-slate-400 mb-3">ℹ️ El PDF ya estaba optimizado. Se eliminaron los metadatos.</div>}
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}
