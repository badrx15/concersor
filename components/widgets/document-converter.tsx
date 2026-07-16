'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileDrop, DownloadButton, ErrorBox, loadScript, formatBytes } from './shared';

type DocTool = 'word-to-pdf' | 'excel-to-pdf' | 'html-to-pdf' | 'pdf-to-word' | 'pdf-to-excel' | 'pdf-to-powerpoint' | 'powerpoint-to-pdf';

interface Props {
  tool: DocTool;
}

export function DocumentConverterWidget({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isToPdf = tool === 'word-to-pdf' || tool === 'excel-to-pdf' || tool === 'html-to-pdf' || tool === 'powerpoint-to-pdf';

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const getAccept = () => {
    switch (tool) {
      case 'word-to-pdf': return '.docx,.doc';
      case 'excel-to-pdf': return '.xlsx,.xls,.csv';
      case 'html-to-pdf': return '.html,.htm';
      case 'powerpoint-to-pdf': return '.pptx,.ppt';
      default: return 'application/pdf';
    }
  };

  const convert = useCallback(async () => {
    if (!file) { setError('Selecciona un archivo'); return; }
    setBusy(true); setError(''); setResult(null);

    try {
      if (!isToPdf) {
        // PDF to other format - for now show informative message
        setError(`⚠️ La conversión de PDF a ${tool === 'pdf-to-word' ? 'Word' : tool === 'pdf-to-excel' ? 'Excel' : 'PowerPoint'} requiere procesamiento en servidor. Próximamente disponible.`);
        setBusy(false);
        return;
      }

      if (tool === 'html-to-pdf') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        const jsPDF = (window as any).jspdf.jsPDF;
        const text = await file.text();
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = pdf.internal.pageSize.getWidth() - 40;
        let y = 40;
        // Strip tags and render text
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        const lines = pdf.splitTextToSize(cleanText, pageW);
        for (let i = 0; i < lines.length; i++) {
          if (y > pdf.internal.pageSize.getHeight() - 40) { pdf.addPage(); y = 40; }
          pdf.text(lines[i], 20, y);
          y += 14;
        }
        const blob = pdf.output('blob') as Blob;
        setResult({ url: URL.createObjectURL(blob), name: file.name.replace(/\.[^.]+$/, '') + '.pdf', size: blob.size });
      }

      else if (tool === 'word-to-pdf') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        const mammoth = (window as any).mammoth;
        const jsPDF = (window as any).jspdf.jsPDF;
        const result = await mammoth.convertToHtml({ arrayBuffer: file.arrayBuffer() });
        const html = result.value;
        // Create a temp div to extract text
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || '';
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = pdf.internal.pageSize.getWidth() - 40;
        let y = 40;
        const lines = pdf.splitTextToSize(text, pageW);
        for (let i = 0; i < lines.length; i++) {
          if (y > pdf.internal.pageSize.getHeight() - 40) { pdf.addPage(); y = 40; }
          pdf.text(lines[i], 20, y);
          y += 14;
        }
        const blob = pdf.output('blob') as Blob;
        setResult({ url: URL.createObjectURL(blob), name: file.name.replace(/\.[^.]+$/, '') + '.pdf', size: blob.size });
      }

      else if (tool === 'excel-to-pdf') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        const XLSX = (window as any).XLSX;
        const jsPDF = (window as any).jspdf.jsPDF;
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
        let firstPage = true;
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          const lines = csv.split('\n').filter((l: string) => l.trim());
          if (!firstPage) pdf.addPage();
          firstPage = false;
          // Title
          pdf.setFontSize(14);
          pdf.text(sheetName, 20, 30);
          pdf.setFontSize(10);
          let y = 50;
          const pageW = pdf.internal.pageSize.getWidth() - 40;
          for (const line of lines) {
            const wrapped = pdf.splitTextToSize(line, pageW);
            for (const w of wrapped) {
              if (y > pdf.internal.pageSize.getHeight() - 30) { pdf.addPage(); y = 30; }
              pdf.text(w, 20, y);
              y += 12;
            }
          }
        }
        const blob = pdf.output('blob') as Blob;
        setResult({ url: URL.createObjectURL(blob), name: file.name.replace(/\.[^.]+$/, '') + '.pdf', size: blob.size });
      }

      else if (tool === 'powerpoint-to-pdf') {
        setError('⚠️ La conversión de PowerPoint a PDF requiere procesamiento en servidor. Próximamente disponible.');
        setBusy(false); return;
      }

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al convertir');
    } finally {
      setBusy(false);
    }
  }, [tool, file, isToPdf]);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
        {isToPdf
          ? `ℹ️ Convierte archivos ${getLabel(tool)}. El procesamiento es 100% local en tu navegador.`
          : `ℹ️ La conversión de PDF a ${getReverseLabel(tool)} está en desarrollo. Mientras tanto, puedes usar nuestras otras herramientas PDF.`}
      </div>

      <FileDrop accept={getAccept()} onFiles={(f) => { setFile(f[0]); setResult(null); }} label={`Selecciona un archivo ${getAccept().split(',').join(' o ')}`} />

      {file && (
        <div className="text-sm text-slate-400">
          📎 {file.name} ({formatBytes(file.size)})
        </div>
      )}

      <button onClick={convert} disabled={busy || !file} className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition">
        {busy ? <span className="text-sm">Convirtiendo...</span> : `🔄 Convertir a ${tool.includes('pdf-') ? 'otro formato' : 'PDF'}`}
      </button>

      {error && <ErrorBox message={error} />}

      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">✅</span><h3 className="text-xl font-bold">Resultado</h3></div>
          <div className="text-sm text-slate-400 mb-1">📐 {result.name} ({formatBytes(result.size)})</div>
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}

function getLabel(tool: DocTool): string {
  const m: Record<DocTool, string> = {
    'word-to-pdf': 'Word a PDF',
    'excel-to-pdf': 'Excel a PDF',
    'html-to-pdf': 'HTML a PDF',
    'pdf-to-word': 'PDF a Word',
    'pdf-to-excel': 'PDF a Excel',
    'pdf-to-powerpoint': 'PDF a PowerPoint',
    'powerpoint-to-pdf': 'PowerPoint a PDF',
  };
  return m[tool];
}

function getReverseLabel(tool: DocTool): string {
  const m: Record<string, string> = {
    'pdf-to-word': 'Word',
    'pdf-to-excel': 'Excel',
    'pdf-to-powerpoint': 'PowerPoint',
  };
  return m[tool] || 'otro formato';
}
