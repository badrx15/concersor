'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import JsBarcode from 'jsbarcode';

export function BarcodeGeneratorWidget() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [text, setText] = useState('');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(60);
  const [showText, setShowText] = useState(true);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [loaded, setLoaded] = useState(true);

  // JsBarcode está importado desde npm, disponible directamente

  const generateBarcode = useCallback(() => {
    if (!svgRef.current || !loaded || !text.trim()) return;
    try {
      JsBarcode(svgRef.current, text.trim(), {
        format,
        width,
        height,
        displayValue: showText,
        text: text.trim(),
        font: 'monospace',
        fontSize: 16,
        margin: 10,
        textMargin: 5,
        lineColor: color,
        background: bgColor,
      });
    } catch (e) {
      console.error('Barcode error:', e);
    }
  }, [text, format, width, height, showText, color, bgColor, loaded]);

  useEffect(() => {
    generateBarcode();
  }, [generateBarcode]);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codigo-${text || 'barras'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      canvas.width = svg.clientWidth * 2;
      canvas.height = svg.clientHeight * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `codigo-${text || 'barras'}.png`;
          a.click();
          URL.revokeObjectURL(pngUrl);
        }
      }, 'image/png');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const suggestions = [
    '123456789',
    'CONVERSORPRO',
    'HOLA-MUNDO',
    'ABC-123-XYZ',
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Texto o número</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe el texto para el código de barras..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Formato</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="CODE128">CODE128</option>
            <option value="CODE39">CODE39</option>
            <option value="EAN-13">EAN-13</option>
            <option value="UPC-A">UPC-A</option>
            <option value="ITF">ITF-14</option>
            <option value="pharmacode">Pharmacode</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Ancho (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={1}
            max={10}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Alto (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={20}
            max={200}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Color de barras</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Color de fondo</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">Mostrar texto</span>
          </label>
        </div>
      </div>

      {/* Sugerencias */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-slate-400 mr-1 self-center">Ejemplos:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setText(s)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Barcode Preview */}
      <div className={`rounded-xl p-6 flex justify-center ${text.trim() && loaded ? 'bg-white' : 'bg-slate-900/60'} border border-slate-800 min-h-[120px] items-center`}>
        {text.trim() && loaded ? (
          <svg ref={svgRef} className="max-w-full" />
        ) : !loaded ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Cargando generador de códigos...
          </div>
        ) : (
          <span className="text-slate-500 text-sm">Escribe algo arriba para generar el código</span>
        )}
      </div>

      {/* Download buttons */}
      {text.trim() && loaded && (
        <div className="flex gap-2">
          <button onClick={downloadSvg} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold transition">
            ⬇ Descargar SVG
          </button>
          <button onClick={downloadPng} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/30 hover:scale-105 transition">
            ⬇ Descargar PNG
          </button>
        </div>
      )}
    </div>
  );
}
