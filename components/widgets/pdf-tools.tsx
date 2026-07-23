'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileDrop, DownloadButton, ErrorBox, formatBytes } from './shared';

type PdfTool = 'merge' | 'split' | 'remove-pages' | 'rotate' | 'protect' | 'unlock' | 'organize' | 'page-numbers' | 'watermark';

interface Props {
  tool: PdfTool;
}

export function PdfToolsWidget({ tool }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; size: number; original?: number } | null>(null);
  const [results, setResults] = useState<{ url: string; name: string; size: number }[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  // Tool-specific state
  const [password, setPassword] = useState('');
  const [removePages, setRemovePages] = useState('');
  const [rotateDeg, setRotateDeg] = useState(90);
  const [watermarkText, setWatermarkText] = useState('');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right' | 'top-center'>('bottom-center');
  const [order, setOrder] = useState<number[]>([]);
  const [pageCount, setPageCount] = useState(0);

  const isMultiFile = tool === 'merge';
  const needsPassword = tool === 'protect' || tool === 'unlock';
  const needsInput = tool === 'remove-pages' || tool === 'rotate' || tool === 'watermark' || tool === 'page-numbers';

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
      results.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, [result, results]);

  const convert = useCallback(async () => {
    setError(''); setResult(null); setResults([]);
    if (isMultiFile && files.length < 2) { setError('Selecciona al menos 2 archivos PDF'); return; }
    if (!isMultiFile && !file) { setError('Selecciona un archivo PDF'); return; }
    if (tool === 'protect' && !password) { setError('Introduce una contraseña'); return; }
    if (tool === 'watermark' && !watermarkText) { setError('Introduce el texto de la marca de agua'); return; }
    if (tool === 'remove-pages' && !removePages) { setError('Indica qué páginas eliminar'); return; }

    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');

      if (tool === 'merge') {
        const merged = await PDFDocument.create();
        for (const f of files) {
          setProgress(`Procesando ${f.name}...`);
          const pdf = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
          const idx = await merged.copyPages(pdf, pdf.getPageIndices());
          idx.forEach((p: any) => merged.addPage(p));
        }
        const bytes = await merged.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), name: 'pdf-unido.pdf', size: blob.size });
      }

      else if (tool === 'split') {
        const pdf = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
        const pages: { url: string; name: string; size: number }[] = [];
        for (let i = 0; i < pdf.getPageCount(); i++) {
          setProgress(`Página ${i + 1} de ${pdf.getPageCount()}...`);
          const newPdf = await PDFDocument.create();
          const [copied] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(copied);
          const bytes = await newPdf.save();
          const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
          pages.push({ url: URL.createObjectURL(blob), name: `pagina-${String(i + 1).padStart(3, '0')}.pdf`, size: blob.size });
        }
        setResults(pages);
      }

      else if (tool === 'remove-pages') {
        const pdf = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
        const totalPages = pdf.getPageCount();
        const toRemove: number[] = [];
        removePages.split(/[,\s]+/).forEach((s) => {
          const trimmed = s.trim();
          if (trimmed.includes('-')) {
            const [a, b] = trimmed.split('-').map(Number);
            if (!isNaN(a) && !isNaN(b)) {
              for (let n = a; n <= b; n++) {
                if (n > 0 && n <= totalPages) toRemove.push(n);
              }
            }
          } else {
            const n = parseInt(trimmed, 10);
            if (!isNaN(n) && n > 0 && n <= totalPages) toRemove.push(n);
          }
        });
        if (toRemove.length === 0) { setError('No se encontraron páginas válidas para eliminar'); setBusy(false); return; }
        const keep = Array.from({ length: totalPages }, (_, i) => i + 1).filter((n) => !toRemove.includes(n));
        if (keep.length === 0) { setError('No puedes eliminar todas las páginas'); setBusy(false); return; }
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(pdf, keep.map((n) => n - 1));
        copied.forEach((p: any) => newPdf.addPage(p));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), name: file!.name.replace(/\.pdf$/i, '') + '-modificado.pdf', size: blob.size, original: file!.size });
      }

      else if (tool === 'rotate') {
        const pdf = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
        const pages = pdf.getPages();
        const deg = rotateDeg as 90 | 180 | 270;
        pages.forEach((p: any) => p.setRotation(p.getRotation().angle + deg));
        const bytes = await pdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), name: file!.name.replace(/\.pdf$/i, '') + '-rotado.pdf', size: blob.size, original: file!.size });
      }

      else if (tool === 'protect') {
        setError('⚠️ La protección con contraseña requiere una librería de cifrado que no está disponible en esta versión. Mientras tanto, puedes usar otras herramientas como unir o comprimir PDF.');
        setBusy(false);
        return;
      }

      else if (tool === 'unlock') {
        setError('🔓 Para desbloquear un PDF protegido, necesitas la contraseña correcta. La librería actual no soporta desbloqueo. Prueba con otras herramientas como dividir o rotar PDF.');
        setBusy(false);
        return;
      }

      else if (tool === 'organize') {
        const pdf = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
        const count = pdf.getPageCount();
        if (order.length === 0) {
          // First run: show page interface
          setPageCount(count);
          setOrder(Array.from({ length: count }, (_, i) => i + 1));
          setBusy(false);
          return;
        }
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(pdf, order.map((n) => n - 1));
        copied.forEach((p: any) => newPdf.addPage(p));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), name: file!.name.replace(/\.pdf$/i, '') + '-reordenado.pdf', size: blob.size, original: file!.size });
      }

      else if (tool === 'page-numbers') {
        const pdf = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
        const pages = pdf.getPages();
        for (let i = 0; i < pages.length; i++) {
          const { width, height } = pages[i].getSize();
          let x = width / 2;
          let y = 30;
          if (pageNumberPos === 'bottom-right') { x = width - 50; }
          else if (pageNumberPos === 'top-right') { x = width - 50; y = height - 30; }
          else if (pageNumberPos === 'top-center') { y = height - 30; }
          pages[i].drawText(String(i + 1), { x, y, size: 12, color: { type: 'RGB', red: 0.3, green: 0.3, blue: 0.3 } as any });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), name: file!.name.replace(/\.pdf$/i, '') + '-numerado.pdf', size: blob.size, original: file!.size });
      }

      else if (tool === 'watermark') {
        const pdf = await PDFDocument.load(await file!.arrayBuffer(), { ignoreEncryption: true });
        const pages = pdf.getPages();
        for (const p of pages) {
          const { width, height } = p.getSize();
          p.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: 48,
            opacity: 0.2,
            rotate: { angle: 45, type: 'degrees' as any },
            color: { type: 'RGB', red: 0.5, green: 0.5, blue: 0.5 } as any,
          });
        }
        const bytes = await pdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), name: file!.name.replace(/\.pdf$/i, '') + '-con-marca.pdf', size: blob.size, original: file!.size });
      }

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al procesar PDF');
    } finally {
      setBusy(false);
      setProgress('');
    }
  }, [tool, files, file, password, removePages, rotateDeg, watermarkText, pageNumberPos, order, pageCount]);

  const handleOrganizeMove = (idx: number, dir: -1 | 1) => {
    const newOrder = [...order];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setOrder(newOrder);
  };

  const handleFile = (f: File[]) => {
    if (isMultiFile) { setFiles(f); } else { setFile(f[0]); }
    setResult(null); setResults([]); setOrder([]);
  };

  const saved = result?.original && result?.size ? Math.round((1 - result.size / result.original) * 100) : 0;

  return (
    <div className="space-y-4">
      {isMultiFile ? (
        <FileDrop accept="application/pdf" multiple onFiles={handleFile} label="Selecciona varios PDFs para unir" />
      ) : (
        <FileDrop accept="application/pdf" onFiles={handleFile} label="Selecciona un archivo PDF" />
      )}

      {needsInput && (
        <div className="space-y-3">
          {tool === 'remove-pages' && (
            <div>
              <label className="text-sm font-medium text-slate-300">Páginas a eliminar (ej: 1,3,5-7)</label>
              <input value={removePages} onChange={(e) => setRemovePages(e.target.value)} placeholder="1,3,5-7" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
            </div>
          )}
          {tool === 'rotate' && (
            <div>
              <label className="text-sm font-medium text-slate-300">Ángulo de rotación</label>
              <select value={rotateDeg} onChange={(e) => setRotateDeg(Number(e.target.value))} className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white">
                <option value={90}>90° horario</option>
                <option value={180}>180°</option>
                <option value={270}>90° antihorario</option>
              </select>
            </div>
          )}
          {tool === 'watermark' && (
            <div>
              <label className="text-sm font-medium text-slate-300">Texto de la marca de agua</label>
              <input value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="Ej: BORRADOR" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
            </div>
          )}
          {tool === 'page-numbers' && (
            <div>
              <label className="text-sm font-medium text-slate-300">Posición de los números</label>
              <select value={pageNumberPos} onChange={(e) => setPageNumberPos(e.target.value as any)} className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white">
                <option value="bottom-center">Abajo centro</option>
                <option value="bottom-right">Abajo derecha</option>
                <option value="top-center">Arriba centro</option>
                <option value="top-right">Arriba derecha</option>
              </select>
            </div>
          )}
        </div>
      )}

      {needsPassword && (
        <div>
          <label className="text-sm font-medium text-slate-300">{tool === 'protect' ? 'Contraseña para proteger' : 'Contraseña del PDF'}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
        </div>
      )}

      {tool === 'organize' && order.length > 0 && pageCount > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Reordenar páginas (arrastra con los botones)</label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {order.map((page, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                <span className="text-xs text-slate-400 w-6">{i + 1}.</span>
                <span className="text-sm flex-1">Página {page}</span>
                <button onClick={() => handleOrganizeMove(i, -1)} disabled={i === 0} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition">↑</button>
                <button onClick={() => handleOrganizeMove(i, 1)} disabled={i === order.length - 1} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition">↓</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={convert} disabled={busy || (isMultiFile ? files.length < 2 : !file)} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition">
        {busy ? <span className="text-sm">{progress || 'Procesando...'}</span> : getButtonLabel(tool)}
      </button>

      {error && <ErrorBox message={error} />}

      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">Resultado</h3></div>
          <div className="text-sm text-slate-400 mb-1">📐 {result.name} ({formatBytes(result.size)})</div>
          {saved > 0 && <div className="text-sm text-green-400 mb-3">📉 {saved}% más pequeño</div>}
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">{results.length} archivo(s) generado(s)</h3></div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 transition gap-3">
                <div className="text-sm truncate flex-1">{r.name}</div>
                <DownloadButton href={r.url} name={r.name} label="⬇" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getButtonLabel(tool: PdfTool): string {
  const labels: Record<PdfTool, string> = {
    'merge': '📄 Unir PDFs',
    'split': '✂️ Dividir PDF',
    'remove-pages': '🗑️ Eliminar páginas',
    'rotate': '🔄 Rotar PDF',
    'protect': '🔒 Proteger PDF',
    'unlock': '🔓 Desbloquear PDF',
    'organize': '📋 Reordenar páginas',
    'page-numbers': '🔢 Añadir números',
    'watermark': '💧 Añadir marca de agua',
  };
  return labels[tool];
}
