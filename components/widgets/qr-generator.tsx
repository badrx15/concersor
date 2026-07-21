'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { CopyButton } from './shared';

export function QrGeneratorWidget() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) {
      setError('Introduce un texto o URL para generar el QR.');
      return;
    }
    setError('');
    try {
      const url = await QRCode.toDataURL(text.trim(), {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrDataUrl(url);
    } catch {
      setError('Error al generar el código QR. Intenta con otro texto.');
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qr-${text.slice(0, 20).replace(/[^a-z0-9]/gi, '-') || 'codigo'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="space-y-5">
      {/* Input text */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          🔗 Texto o URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://ejemplo.com o cualquier texto..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition resize-none"
        />
      </div>

      {/* Options row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Color frente</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Color fondo</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Tamaño</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full h-10 rounded-xl bg-slate-800 border border-slate-700 text-white px-3 outline-none focus:border-brand-500 transition"
          >
            <option value={128}>128 px</option>
            <option value={256}>256 px</option>
            <option value={384}>384 px</option>
            <option value={512}>512 px</option>
            <option value={1024}>1024 px</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm">❌ {error}</p>
      )}

      {/* Generate button */}
      <button
        onClick={generateQR}
        className="w-full px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white hover:from-brand-500 hover:to-pink-400 shadow-lg shadow-brand-500/30 transition active:scale-[0.98]"
      >
        ✨ Generar código QR
      </button>

      {/* QR Display */}
      {qrDataUrl && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <div className="p-4 rounded-2xl border border-slate-700 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Código QR generado"
              className="max-w-full h-auto"
              style={{ width: Math.min(size, 300) }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadQR}
              className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white hover:from-brand-500 hover:to-pink-400 shadow-lg shadow-brand-500/30 transition"
            >
              ⬇ Descargar PNG
            </button>
            <CopyButton text={text} />
          </div>
        </div>
      )}

      {/* Quick actions */}
      {!qrDataUrl && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500 self-center">Sugerencias:</span>
          {['https://google.com', 'https://github.com', 'https://whatsapp.com', 'Hola mundo'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setText(suggestion);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs font-medium text-slate-300 hover:border-brand-500 transition"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
