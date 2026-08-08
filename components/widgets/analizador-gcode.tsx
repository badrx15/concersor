'use client';

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { FileDrop, InputGroup, formatBytes } from './shared';
import {
  analyzeGcode,
  analyzeStl,
  analyze3mf,
  type GcodeAnalysis,
  type StlAnalysis,
  type ThreeMfAnalysis,
  FILAMENT_AREA_MM2,
  formatTime,
} from '@/lib/gcode-estimator';
import { FILAMENTS } from './calculadora-impresion-3d';

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition';

// Ancho de línea usado en la estimación de tiempo de STL (mm)
const NOZZLE_W = 0.4;

const eur = (n: number) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

type Analysis = GcodeAnalysis | StlAnalysis | ThreeMfAnalysis;

function statCard(icon: string, label: string, value: ReactNode, sub?: string) {
  return (
    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <span>{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 text-base sm:text-lg font-bold text-white tabular-nums">{value}</div>
      {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
    </div>
  );
}

export function AnalizadorGcodeWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Coste
  const [materialId, setMaterialId] = useState('pla');
  const [priceInput, setPriceInput] = useState('');
  const [failRate, setFailRate] = useState(5);
  const [powerW, setPowerW] = useState('200');
  const [kwhInput, setKwhInput] = useState('0.15');
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState(false);
  const [infill, setInfill] = useState(20);

  const material = FILAMENTS.find((f) => f.id === materialId) ?? FILAMENTS[0];

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setAnalysis(null);
    setError(null);
    setAnalyzing(true);
    try {
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (ext === 'stl') {
        setAnalysis(analyzeStl(await f.arrayBuffer()));
      } else if (ext === '3mf' || ext === '3dmodel') {
        setAnalysis(await analyze3mf(await f.arrayBuffer()));
      } else if (ext === 'gcode' || ext === 'gco' || ext === 'g') {
        setAnalysis(analyzeGcode(await f.text()));
      } else {
        // Autodetección por contenido
        const head = await f.slice(0, 4).text();
        if (head.startsWith('PK')) {
          // ZIP → probablemente 3MF
          setAnalysis(await analyze3mf(await f.arrayBuffer()));
        } else {
          const text = await f.slice(0, 500).text();
          if (/solid|facet\s+normal/i.test(text)) {
            setAnalysis(analyzeStl(await f.arrayBuffer()));
          } else {
            setAnalysis(analyzeGcode(await f.text()));
          }
        }
      }
    } catch {
      setError('No se pudo analizar el archivo. Asegúrate de que sea un .gcode, .stl o .3mf válido.');
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const useLivePrice = useCallback(async () => {
    setLiveLoading(true);
    setLiveError(false);
    try {
      const res = await fetch('/api/luz');
      if (res.ok) {
        const json = await res.json();
        const priceEur = json.current?.price != null ? json.current.price / 100 : null;
        if (priceEur && priceEur > 0) setKwhInput(priceEur.toFixed(3));
        else setLiveError(true);
      } else {
        setLiveError(true);
      }
    } catch {
      setLiveError(true);
    } finally {
      setLiveLoading(false);
    }
  }, []);

  const results = useMemo(() => {
    if (!analysis) return null;

    const density = material.density; // g/cm³
    const pricePerKg = parseFloat(priceInput) || material.pricePerUnit;

    let grams: number | null = null;
    let timeSeconds: number | null = null;
    let timeIsEstimate = false;

    if (analysis.kind === 'gcode') {
      if (analysis.filamentGramsMeta != null) grams = analysis.filamentGramsMeta;
      else if (analysis.filamentMm != null)
        grams = (analysis.filamentMm * FILAMENT_AREA_MM2 * density) / 1000;
      timeSeconds = analysis.timeSeconds;
      timeIsEstimate = analysis.timeMethod === 'estimated';
    } else {
      // STL: relleno = capas exteriores (~20%) + interior al % de infill
      const fillFactor = 0.2 + 0.8 * (infill / 100);
      const solidGrams = (analysis.volumeMm3 * density) / 1000;
      grams = solidGrams * fillFactor;
      const flow = 60 * 0.2 * NOZZLE_W; // velocidad × altura capa × ancho línea
      timeSeconds = (analysis.volumeMm3 * fillFactor) / flow;
      timeIsEstimate = true;
    }

    if (grams == null || timeSeconds == null) {
      return { grams, timeSeconds, timeIsEstimate, materialCost: null, elecCost: null, total: null, kwh: null };
    }

    const materialCost = ((grams / 1000) * pricePerKg * (1 + failRate / 100));
    const kwh = ((parseFloat(powerW) || 0) / 1000) * (timeSeconds / 3600);
    const elecCost = kwh * (parseFloat(kwhInput) || 0);
    const total = materialCost + elecCost;

    return { grams, timeSeconds, timeIsEstimate, materialCost, elecCost, total, kwh };
  }, [analysis, material, priceInput, failRate, powerW, kwhInput, infill]);

  const goToFullCalculator = () => {
    if (!results || results.grams == null) return;
    try {
      sessionStorage.setItem(
        'impresion3d-prefill',
        JSON.stringify({
          qty: Math.round(results.grams * 10) / 10,
          hours: (results.timeSeconds ?? 0) / 3600,
          copies: 1,
        })
      );
    } catch {}
    window.location.href = '/conversor/calculadora-impresion-3d';
  };

  return (
    <div className="space-y-4">
      {/* Subida de archivo */}
      <FileDrop
        accept=".gcode,.gco,.g,.stl,.3mf"
        label="Sube tu archivo .gcode, .stl o .3mf"
        onFiles={handleFiles}
      />
      {file && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700 text-sm">
          <span className="text-slate-300 truncate">📎 {file.name}</span>
          <span className="text-xs text-slate-500 shrink-0 ml-3">{formatBytes(file.size)}</span>
        </div>
      )}
      {analyzing && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
          <span className="inline-block w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Analizando el archivo…
        </div>
      )}
      {error && <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-100 text-sm">❌ {error}</div>}

      {/* Resultados del archivo */}
      {results && !analyzing && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {analysis?.kind === 'gcode' ? (
              <>
                {statCard(
                  '⏱️',
                  'Tiempo estimado',
                  results.timeSeconds != null ? formatTime(results.timeSeconds) : '—',
                  results.timeIsEstimate ? 'estimación por movimientos' : 'dato del laminador'
                )}
                {statCard(
                  '🧵',
                  'Filamento',
                  results.grams != null ? `${results.grams.toLocaleString('es-ES', { maximumFractionDigits: 1 })} g` : '—',
                  (analysis as GcodeAnalysis).filamentMm != null
                    ? `${((analysis as GcodeAnalysis).filamentMm! / 1000).toFixed(2)} m`
                    : undefined
                )}
                {statCard(
                  '📏',
                  'Capas',
                  (analysis as GcodeAnalysis).layers != null ? `${(analysis as GcodeAnalysis).layers}` : '—',
                  (analysis as GcodeAnalysis).layerHeightMm != null
                    ? `${(analysis as GcodeAnalysis).layerHeightMm} mm`
                    : undefined
                )}
                {statCard('📂', 'Método', (analysis as GcodeAnalysis).filamentMethod === 'metadata' ? 'Metadatos' : (analysis as GcodeAnalysis).filamentMethod === 'calculated' ? 'Estimado' : 'N/D')}
              </>
            ) : (
              <>
                {statCard(
                  '📐',
                  'Volumen',
                  ((analysis as StlAnalysis).volumeMm3 / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' cm³',
                  'sólido (100% relleno)'
                )}
                {statCard(
                  '📏',
                  'Medidas',
                  `${(analysis as StlAnalysis).sizeMm.x.toFixed(1)} × ${(analysis as StlAnalysis).sizeMm.y.toFixed(1)} × ${(analysis as StlAnalysis).sizeMm.z.toFixed(1)} mm`
                )}
                {statCard('🧵', 'Peso impreso', `${results.grams?.toFixed(1) ?? '—'} g`, `relleno ${infill}%`)}
                {statCard(
                  '⏱️',
                  'Tiempo estimado',
                  results.timeSeconds != null ? formatTime(results.timeSeconds) : '—',
                  'estimación estándar'
                )}
              </>
            )}
          </div>

          {(analysis as GcodeAnalysis).warnings?.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 space-y-1">
              {(analysis as GcodeAnalysis).warnings.map((w, i) => (
                <p key={i}>⚠️ {w}</p>
              ))}
            </div>
          )}

          {/* Configuración de coste */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">💶 Coste de la pieza</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InputGroup label="Material" tooltip="El material determina la densidad (para calcular el peso) y el precio medio por kilo.">
                <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className={inputCls}>
                  {FILAMENTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup label="Precio (€/kg)" tooltip="Precio del kilo de filamento. Vacío = precio medio del material seleccionado.">
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder={String(material.pricePerUnit)}
                  className={inputCls}
                />
              </InputGroup>
              <InputGroup
                label="Potencia impresora (W)"
                tooltip="Consumo medio de tu impresora mientras imprime (típico 120-250 W en FDM)."
              >
                <input type="number" min={0} step={10} value={powerW} onChange={(e) => setPowerW(e.target.value)} className={inputCls} />
              </InputGroup>
              <InputGroup
                label="Precio luz (€/kWh)"
                tooltip="Puedes cargar el precio real de hoy en España con el botón ⚡."
              >
                <div className="flex gap-2">
                  <input type="number" min={0} step={0.01} value={kwhInput} onChange={(e) => setKwhInput(e.target.value)} className={inputCls} />
                  <button
                    onClick={useLivePrice}
                    disabled={liveLoading}
                    title="Usar el precio de la luz real de hoy en España"
                    className="shrink-0 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm transition"
                  >
                    {liveLoading ? '…' : '⚡ Hoy'}
                  </button>
                </div>
              </InputGroup>
              <InputGroup
                label={`Tasa de fallos: ${failRate}%`}
                tooltip="Porcentaje de impresiones que fallan: añade ese coste extra de material."
              >
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={failRate}
                    onChange={(e) => setFailRate(parseInt(e.target.value))}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="text-sm font-semibold text-slate-300 w-9 text-right tabular-nums">{failRate}%</span>
                </div>
              </InputGroup>
              {analysis?.kind !== 'gcode' && (
                <InputGroup
                  label={`Relleno: ${infill}%`}
                  tooltip="El porcentaje de relleno interior (infill). A más relleno, más peso y más tiempo."
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={infill}
                      onChange={(e) => setInfill(parseInt(e.target.value))}
                      className="flex-1 accent-brand-500"
                    />
                    <span className="text-sm font-semibold text-slate-300 w-9 text-right tabular-nums">{infill}%</span>
                  </div>
                </InputGroup>
              )}
            </div>
            {liveError && (
              <p className="mt-2 text-xs text-red-400">No se pudo obtener el precio de la luz ahora mismo.</p>
            )}
          </div>

          {/* Total */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-600/25 via-slate-900 to-pink-600/20 border border-brand-500/40">
            <div className="text-[11px] uppercase tracking-widest text-brand-300 font-bold">Coste estimado por pieza</div>
            <div className="text-4xl font-black text-white mt-1 tabular-nums">
              {results.total != null ? eur(results.total) : '—'}
            </div>
            {results.materialCost != null && results.elecCost != null && (
              <p className="mt-1.5 text-[11px] text-slate-400">
                Material {eur(results.materialCost)} · Luz {eur(results.elecCost)}
              </p>
            )}
            {results.total != null && (
              <button
                onClick={goToFullCalculator}
                className="mt-4 w-full px-4 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-pink-500 text-white text-sm hover:from-brand-500 hover:to-pink-400 transition shadow-lg shadow-brand-500/30"
              >
                ⚙️ Abrir en la calculadora completa
              </button>
            )}
            <p className="mt-2 text-[10px] text-slate-500 text-center">
              La calculadora completa añade amortización de la impresora, extras y precio de venta.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-200">Consejo:</strong> los laminadores (Cura, PrusaSlicer, OrcaSlicer) guardan en el
            .gcode el tiempo y el filamento exactos como comentarios. Si tu archivo los incluye, los resultados son muy precisos.
            En caso contrario se hace una <strong className="text-slate-200">estimación</strong> analizando los movimientos del
            cabezal. También acepta modelos .stl y .3mf (el formato de Windows 3D Builder y PrusaSlicer) para calcular su volumen y peso.
          </div>
        </>
      )}
    </div>
  );
}
