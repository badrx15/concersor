'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileDrop, DownloadButton, ErrorBox, loadScript, formatBytes } from './shared';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// Configure pdf.js worker (solo cliente)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type DocTool =
  | 'word-to-pdf'
  | 'excel-to-pdf'
  | 'html-to-pdf'
  | 'pdf-to-word'
  | 'pdf-to-excel'
  | 'pdf-to-powerpoint'
  | 'powerpoint-to-pdf';

interface Props {
  tool: DocTool;
}

// ====================================================================
// Helpers
// ====================================================================

/** Renderiza todas las páginas de un PDF como data-URL PNG */
async function renderPdfPages(file: File, scale = 2): Promise<string[]> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo crear el contexto de renderizado');
    await page.render({ canvas, viewport }).promise;
    pages.push(canvas.toDataURL('image/png'));
  }
  return pages;
}

/** Convierte una data-URL a ArrayBuffer */
function dataUrlToBuffer(dataUrl: string): ArrayBuffer {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// ====================================================================
// Conversiones NEW — 100% local en el navegador
// ====================================================================

/** PDF → PowerPoint (cada página como imagen en una diapositiva) */
async function convertPdfToPowerpoint(file: File): Promise<Blob> {
  const images = await renderPdfPages(file, 1.5);
  const pptxgen = (await import('pptxgenjs')).default;
  const pres = new pptxgen();
  pres.defineLayout({ name: 'CUSTOM', width: 13.333, height: 7.5 });
  pres.layout = 'CUSTOM';

  for (const dataUrl of images) {
    const slide = pres.addSlide();
    slide.addImage({ data: dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 });
  }

  return (await pres.write({ outputType: 'blob' })) as Blob;
}

/** PDF → Word (cada página como imagen en una página del documento) */
async function convertPdfToWord(file: File): Promise<Blob> {
  const images = await renderPdfPages(file, 1.5);
  const { Document, Packer, Paragraph, ImageRun } = await import('docx');

  const children: InstanceType<typeof Paragraph>[] = [];
  for (let i = 0; i < images.length; i++) {
    const imgBuf = dataUrlToBuffer(images[i]);
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: imgBuf,
            transformation: { width: 600, height: 849 }, // ~A4 aspect ratio
            type: 1 as any, // PNG
          }),
        ],
        alignment: 'center' as any,
        ...(i > 0 ? { pageBreakBefore: true } : {}),
      }),
    );
  }

  const doc = new Document({
    title: 'Convertido de PDF',
    description: 'Documento Word convertido desde PDF',
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}

/** PDF → Excel (texto extraído en celdas, una fila por página) */
async function convertPdfToExcel(file: File): Promise<Blob> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const XLSX = await import('xlsx');

  const rows: string[][] = [['Página', 'Contenido extraído']];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    rows.push([`Página ${i}`, text]);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'PDF');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/** PowerPoint → PDF (extrae texto de cada diapositiva y lo pone en páginas PDF) */
async function convertPowerpointToPdf(file: File): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const data = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(data);

  // Recopilar diapositivas ordenadas
  const slidePaths: string[] = [];
  zip.forEach((relPath) => {
    const match = relPath.match(/^ppt\/slides\/slide(\d+)\.xml$/);
    if (match) slidePaths.push(relPath);
  });
  slidePaths.sort((a, b) => {
    const na = parseInt(a.match(/slide(\d+)/)![1]);
    const nb = parseInt(b.match(/slide(\d+)/)![1]);
    return na - nb;
  });

  if (slidePaths.length === 0) throw new Error('No se encontraron diapositivas en el archivo PPTX.');

  // Extraer texto de cada diapositiva
  const slideTexts: string[] = [];
  for (const path of slidePaths) {
    const content = await zip.file(path)!.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    const ns = 'http://schemas.openxmlformats.org/drawingml/2006/main';
    const textEls = xmlDoc.getElementsByTagNameNS(ns, 't');
    const texts = Array.from(textEls)
      .map((el) => el.textContent || '')
      .filter(Boolean);
    slideTexts.push(texts.join(' ').trim() || `(Diapositiva ${slidePaths.indexOf(path) + 1})`);
  }

  // Generar PDF
  const pdfDoc = await PDFDocument.create();
  for (const text of slideTexts) {
    const page = pdfDoc.addPage([612, 792]); // US Letter
      const maxChars = 4000;
      const displayText = text.length > maxChars
        ? text.slice(0, maxChars) + '...'
        : text;
      // Dividir en líneas manualmente para evitar overflow
      const words = displayText.split(' ');
      let line = '';
      let lineY = 700;
      for (const word of words) {
        if ((line + ' ' + word).length > 85 || lineY < 40) {
          page.drawText(line, { x: 50, y: lineY, size: 11, maxWidth: 512 });
          line = word;
          lineY -= 16;
          if (lineY < 40) break; // no more room
        } else {
          line = line ? line + ' ' + word : word;
        }
      }
      if (line && lineY >= 40) {
        page.drawText(line, { x: 50, y: lineY, size: 11, maxWidth: 512 });
      }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

// ====================================================================
// Componente principal
// ====================================================================

export function DocumentConverterWidget({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    url: string;
    name: string;
    size: number;
  } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isToPdf =
    tool === 'word-to-pdf' ||
    tool === 'excel-to-pdf' ||
    tool === 'html-to-pdf' ||
    tool === 'powerpoint-to-pdf';

  const isFromPdf =
    tool === 'pdf-to-word' ||
    tool === 'pdf-to-excel' ||
    tool === 'pdf-to-powerpoint';

  useEffect(() => () => {
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);

  const getAccept = () => {
    switch (tool) {
      case 'word-to-pdf':
        return '.docx,.doc';
      case 'excel-to-pdf':
        return '.xlsx,.xls,.csv';
      case 'html-to-pdf':
        return '.html,.htm';
      case 'powerpoint-to-pdf':
        return '.pptx,.ppt';
      default:
        return 'application/pdf';
    }
  };

  const convert = useCallback(async () => {
    if (!file) {
      setError('Selecciona un archivo');
      return;
    }
    setBusy(true);
    setError('');
    setResult(null);

    try {
      let blob: Blob;
      let outputName: string;

      switch (tool) {
        case 'pdf-to-powerpoint': {
          blob = await convertPdfToPowerpoint(file);
          outputName = file.name.replace(/\.pdf$/i, '') + '.pptx';
          break;
        }
        case 'pdf-to-word': {
          blob = await convertPdfToWord(file);
          outputName = file.name.replace(/\.pdf$/i, '') + '.docx';
          break;
        }
        case 'pdf-to-excel': {
          blob = await convertPdfToExcel(file);
          outputName = file.name.replace(/\.pdf$/i, '') + '.xlsx';
          break;
        }
        case 'powerpoint-to-pdf': {
          blob = await convertPowerpointToPdf(file);
          outputName = file.name.replace(/\.pptx?$/i, '') + '.pdf';
          break;
        }

        // === Herramientas existentes (mantenidas tal cual) ===

        case 'html-to-pdf': {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          const jsPDF = (window as any).jspdf.jsPDF;
          const text = await file.text();
          const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
          const pageW = pdf.internal.pageSize.getWidth() - 40;
          let y = 40;
          const cleanText = text
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          const lines = pdf.splitTextToSize(cleanText, pageW);
          for (let i = 0; i < lines.length; i++) {
            if (y > pdf.internal.pageSize.getHeight() - 40) {
              pdf.addPage();
              y = 40;
            }
            pdf.text(lines[i], 20, y);
            y += 14;
          }
          blob = pdf.output('blob') as Blob;
          outputName = file.name.replace(/\.[^.]+$/, '') + '.pdf';
          break;
        }

        case 'word-to-pdf': {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          const mammoth = (window as any).mammoth;
          const jsPDF = (window as any).jspdf.jsPDF;
          const result = await mammoth.convertToHtml({ arrayBuffer: file.arrayBuffer() });
          const html = result.value;
          const div = document.createElement('div');
          div.innerHTML = html;
          const text = div.textContent || '';
          const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
          const pageW = pdf.internal.pageSize.getWidth() - 40;
          let y = 40;
          const lines = pdf.splitTextToSize(text, pageW);
          for (let i = 0; i < lines.length; i++) {
            if (y > pdf.internal.pageSize.getHeight() - 40) {
              pdf.addPage();
              y = 40;
            }
            pdf.text(lines[i], 20, y);
            y += 14;
          }
          blob = pdf.output('blob') as Blob;
          outputName = file.name.replace(/\.[^.]+$/, '') + '.pdf';
          break;
        }

        case 'excel-to-pdf': {
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
            pdf.setFontSize(14);
            pdf.text(sheetName, 20, 30);
            pdf.setFontSize(10);
            let y = 50;
            const pageW = pdf.internal.pageSize.getWidth() - 40;
            for (const line of lines) {
              const wrapped = pdf.splitTextToSize(line, pageW);
              for (const w of wrapped) {
                if (y > pdf.internal.pageSize.getHeight() - 30) {
                  pdf.addPage();
                  y = 30;
                }
                pdf.text(w, 20, y);
                y += 12;
              }
            }
          }
          blob = pdf.output('blob') as Blob;
          outputName = file.name.replace(/\.[^.]+$/, '') + '.pdf';
          break;
        }

        default:
          throw new Error('Herramienta no reconocida');
      }

      setResult({
        url: URL.createObjectURL(blob),
        name: outputName,
        size: blob.size,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al convertir');
    } finally {
      setBusy(false);
    }
  }, [tool, file]);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
        {isToPdf || isFromPdf ? (
          <>
            ✅ Conversión <strong>100% local</strong> en tu navegador. Tus archivos
            nunca se suben a ningún servidor.
          </>
        ) : (
          <>ℹ️ Convierte archivos {getLabel(tool)}. Procesamiento 100% local.</>
        )}
      </div>

      <FileDrop
        accept={getAccept()}
        onFiles={(f) => {
          setFile(f[0]);
          setResult(null);
        }}
        label={`Selecciona un archivo ${getAccept().split(',').join(' o ')}`}
      />

      {file && (
        <div className="text-sm text-slate-400">
          📎 {file.name} ({formatBytes(file.size)})
        </div>
      )}

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
          `🔄 ${getButtonLabel(tool)}`
        )}
      </button>

      {error && <ErrorBox message={error} />}

      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold">Resultado</h3>
          </div>
          <div className="text-sm text-slate-400 mb-1">
            📐 {result.name} ({formatBytes(result.size)})
          </div>
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}

// ====================================================================
// Labels
// ====================================================================

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

function getButtonLabel(tool: DocTool): string {
  const m: Record<DocTool, string> = {
    'word-to-pdf': 'Convertir a PDF',
    'excel-to-pdf': 'Convertir a PDF',
    'html-to-pdf': 'Convertir a PDF',
    'pdf-to-word': 'Convertir a Word',
    'pdf-to-excel': 'Convertir a Excel',
    'pdf-to-powerpoint': 'Convertir a PowerPoint',
    'powerpoint-to-pdf': 'Convertir a PDF',
  };
  return m[tool];
}
