'use client';

import { useState, useRef, useCallback } from 'react';

interface FileDropProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}

export function FileDrop({ accept, multiple, onFiles, label }: FileDropProps) {
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    setSelected(arr);
    onFiles(arr);
  }, [onFiles]);

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
        dragging ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 hover:border-brand-500 bg-slate-800/30'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="text-3xl mb-2">📤</div>
      <div className="font-medium text-slate-200">
        {selected.length > 0
          ? `${selected.length} archivo(s) seleccionado(s)`
          : label || 'Click o arrastra tu archivo'}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 text-xs text-slate-400 space-y-0.5">
          {selected.slice(0, 4).map((f, i) => (
            <div key={i}>📎 {f.name} ({formatBytes(f.size)})</div>
          ))}
          {selected.length > 4 && <div>...y {selected.length - 4} más</div>}
        </div>
      )}
    </div>
  );
}

export function formatBytes(n: number): string {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return (n / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export function DownloadButton({ href, name, label }: { href: string; name: string; label?: string }) {
  return (
    <a
      href={href}
      download={name}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white hover:from-brand-500 hover:to-pink-400 shadow-lg shadow-brand-500/30 transition"
    >
      ⬇ {label || `Descargar ${name}`}
    </a>
  );
}

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className={`px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition ${className || ''}`}
    >
      {copied ? '✓ Copiado' : '📋 Copiar'}
    </button>
  );
}

export function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">✅</span>
        <h3 className="text-xl font-bold">Resultado</h3>
      </div>
      {children}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">
      ❌ {message}
    </div>
  );
}

/** Carga un script desde CDN de forma lazy (para jsPDF, pdf-lib, pdf.js, etc.) */
const scriptCache: Record<string, Promise<void>> = {};
export function loadScript(src: string): Promise<void> {
  if (src in scriptCache) return scriptCache[src];
  scriptCache[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { delete scriptCache[src]; reject(new Error('Failed: ' + src)); };
    document.head.appendChild(s);
  });
  return scriptCache[src];
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo cargar la imagen')); };
    img.src = url;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas.toBlob falló'))),
      mime,
      quality
    );
  });
}

export function replaceExt(filename: string, ext: string): string {
  return filename.replace(/\.[^/.]+$/, '') + '.' + ext.replace(/^\./, '');
}
