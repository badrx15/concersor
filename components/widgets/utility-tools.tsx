'use client';

import { useState, useRef, useCallback } from 'react';
import { CopyButton, FileDrop, ResultBox } from './shared';

type UtilityTool = 'markdown' | 'metadata' | 'speech';

export function UtilityToolsWidget({ tool }: { tool: UtilityTool }) {
  switch (tool) {
    case 'markdown':
      return <MarkdownConverter />;
    case 'metadata':
      return <ImageMetadata />;
    case 'speech':
      return <SpeechToText />;
    default:
      return <p className="text-slate-400">Herramienta no disponible</p>;
  }
}

// ============================================================
// CONVERSOR MARKDOWN A HTML
// ============================================================
function MarkdownConverter() {
  const [input, setInput] = useState('');
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(true);

  const convert = useCallback(async (text: string) => {
    setInput(text);
    if (!text.trim()) {
      setHtml('');
      setError('');
      return;
    }
    try {
      const marked = (await import('marked')).marked;
      const result = await marked.parse(text);
      setHtml(result);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Error al convertir Markdown');
    }
  }, []);

  const examples = [
    '# Título\nEsto es un **texto** en negrita',
    '## Lista\n- Item 1\n- Item 2\n- Item 3',
    '[Enlace](https://ejemplo.com)\n\n`código`',
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setPreview(true)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            preview ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          👁️ Vista previa
        </button>
        <button
          onClick={() => setPreview(false)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            !preview ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔧 HTML
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Markdown</label>
          <textarea
            value={input}
            onChange={(e) => convert(e.target.value)}
            placeholder="Escribe o pega Markdown aquí..."
            className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {preview ? 'Vista previa' : 'HTML generado'}
          </label>
          {preview ? (
            <div className="w-full h-64 bg-white rounded-xl p-4 text-sm text-slate-900 overflow-y-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html || '<p class="text-slate-400">Escribe Markdown para ver la vista previa</p>' }}
            />
          ) : (
            <div className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl overflow-y-auto">
              <pre className="p-4 text-sm font-mono text-slate-200 whitespace-pre-wrap break-all">{html || 'Escribe Markdown para ver el HTML'}</pre>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">{error}</div>
      )}

      {html && (
        <div className="flex gap-2">
          <CopyButton text={html} className="text-sm" />
        </div>
      )}

      {/* Examples */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-slate-400">Ejemplos:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => convert(ex)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition"
          >
            Ejemplo {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LECTOR DE METADATOS DE IMAGEN (EXIF)
// ============================================================
function ImageMetadata() {
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const readMetadata = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }
    setLoading(true);
    setError('');
    setMetadata(null);

    try {
      // Show preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Read EXIF using exif-js (loaded from CDN to avoid ESM issues)
      const data = await readExifFromFile(file);
      
      // Also collect basic info
      const basicInfo: Record<string, any> = {
        'Nombre': file.name,
        'Tamaño': formatFileSize(file.size),
        'Tipo': file.type,
        'Última modificación': new Date(file.lastModified).toLocaleString('es-ES'),
      };

      if (data && data.exif) {
        const exif = data.exif;
        if (exif.Make) basicInfo['Fabricante'] = exif.Make;
        if (exif.Model) basicInfo['Modelo'] = exif.Model;
        if (exif.DateTimeOriginal) basicInfo['Fecha original'] = exif.DateTimeOriginal;
        if (exif.ExposureTime) basicInfo['Tiempo exposición'] = `${exif.ExposureTime}s`;
        if (exif.FNumber) basicInfo['Apertura'] = `f/${exif.FNumber}`;
        if (exif.ISOSpeedRatings) basicInfo['ISO'] = exif.ISOSpeedRatings;
        if (exif.FocalLength) basicInfo['Distancia focal'] = `${exif.FocalLength}mm`;
        if (exif.Flash) basicInfo['Flash'] = exif.Flash === 1 ? 'Sí' : 'No';
        if (exif.GPSLatitude && exif.GPSLatitudeRef && exif.GPSLongitude && exif.GPSLongitudeRef) {
          basicInfo['GPS'] = `${exif.GPSLatitudeRef} ${exif.GPSLatitude.join(',')} / ${exif.GPSLongitudeRef} ${exif.GPSLongitude.join(',')}`;
        }
      }

      // Image dimensions
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          basicInfo['Dimensiones'] = `${img.width} × ${img.height} px`;
          basicInfo['Relación aspecto'] = `${(img.width / img.height).toFixed(2)}:1`;
          resolve();
        };
        img.onerror = () => reject();
        img.src = url;
      });

      setMetadata(basicInfo);
    } catch (e: any) {
      setError(e.message || 'Error al leer metadatos');
    }
    setLoading(false);
  }, []);

  return (
    <div className="space-y-4">
      <FileDrop
        accept="image/*"
        label="Arrastra o selecciona una imagen (JPG, PNG, WebP)"
        onFiles={readMetadata}
      />

      {loading && (
        <div className="flex items-center gap-3 text-slate-400 text-sm py-4">
          <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Leyendo metadatos...
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">{error}</div>
      )}

      {metadata && previewUrl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <img src={previewUrl} alt="Preview" className="w-full rounded-xl border border-slate-700 max-h-60 object-contain bg-slate-900/30" />
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 overflow-y-auto max-h-60">
            <h3 className="text-sm font-bold text-brand-400 mb-3">📋 Metadatos</h3>
            <table className="w-full text-xs">
              <tbody>
                {Object.entries(metadata).map(([key, val]) => (
                  <tr key={key} className="border-b border-slate-800/50">
                    <td className="py-1.5 pr-3 text-slate-400 whitespace-nowrap">{key}</td>
                    <td className="py-1.5 text-slate-200 font-mono break-all">{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

async function readExifFromFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as ArrayBuffer;
        // Try to use exif-js if available
        if (typeof (window as any).EXIF !== 'undefined') {
          (window as any).EXIF.getData(file, function (this: any) {
            const exifData = (window as any).EXIF.getAllTags(this);
            resolve({ exif: exifData });
          });
        } else {
          // Load exif-js from CDN
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js';
          script.onload = () => {
            (window as any).EXIF.getData(file, function (this: any) {
              const exifData = (window as any).EXIF.getAllTags(this);
              resolve({ exif: exifData });
            });
          };
          script.onerror = () => resolve({ exif: null });
          document.head.appendChild(script);
        }
      } catch {
        resolve({ exif: null });
      }
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// ============================================================
// CONVERSOR DE VOZ A TEXTO (Speech to Text)
// ============================================================
function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let final = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev + final);
      setInterim(interimText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      // Auto-restart if still listening
      if (listening) {
        try { recognition.start(); } catch {}
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  const clearText = () => {
    setTranscript('');
    setInterim('');
  };

  if (!supported) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">🎤</div>
        <p className="text-slate-300 font-semibold">Tu navegador no soporta reconocimiento de voz</p>
        <p className="text-slate-400 text-sm mt-2">Prueba con Chrome, Edge o Safari</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-5xl mb-4">{listening ? '🔴' : '🎤'}</div>
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition ${
            listening
              ? 'bg-red-500/20 border border-red-500 text-red-300 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 hover:scale-105'
          }`}
        >
          {listening ? '⏹ Detener' : '🎤 Iniciar grabación'}
        </button>
        <p className="text-xs text-slate-400 mt-2">
          {listening ? 'Hablando... Di algo en español' : 'Haz clic y habla para convertir voz a texto'}
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 min-h-[120px]">
        <p className="text-slate-200 text-base leading-relaxed">
          {transcript}
          {interim && <span className="text-slate-400">{interim}</span>}
        </p>
        {!transcript && !interim && (
          <p className="text-slate-500 text-sm">El texto aparecerá aquí mientras hablas...</p>
        )}
      </div>

      {(transcript || interim) && (
        <div className="flex gap-2">
          <CopyButton text={transcript + interim} className="text-sm" />
          <button onClick={clearText} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition">
            🗑 Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
