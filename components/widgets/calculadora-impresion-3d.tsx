'use client';

import { useState, useMemo, useEffect } from 'react';
import { InputGroup } from './shared';

// ============================================================
// DATOS — Filamentos, impresoras y ejemplos
// ============================================================

interface Filament {
  id: string;
  name: string;
  pricePerUnit: number; // €/kg o €/L
  density: number; // g/cm³ (equivalente a kg/L)
  perLiter?: boolean; // la resina se vende por litro
}

export const FILAMENTS: Filament[] = [
  { id: 'pla', name: 'PLA', pricePerUnit: 20, density: 1.24 },
  { id: 'petg', name: 'PETG', pricePerUnit: 25, density: 1.27 },
  { id: 'abs', name: 'ABS', pricePerUnit: 25, density: 1.04 },
  { id: 'tpu', name: 'TPU', pricePerUnit: 35, density: 1.21 },
  { id: 'asa', name: 'ASA', pricePerUnit: 35, density: 1.07 },
  { id: 'nylon', name: 'Nylon', pricePerUnit: 45, density: 1.14 },
  { id: 'resina', name: 'Resina (SLA)', pricePerUnit: 30, density: 1.1, perLiter: true },
];

interface Printer {
  id: string;
  name: string;
  powerW: number;
}

const PRINTERS: Printer[] = [
  { id: 'ender3', name: 'Ender 3 / Ender 3 V2 (FDM)', powerW: 200 },
  { id: 'prusa', name: 'Prusa i3 MK3S+ (FDM)', powerW: 120 },
  { id: 'artillery', name: 'Artillery Sidewinder X1 (FDM)', powerW: 400 },
  { id: 'resin', name: 'Impresora de resina (SLA)', powerW: 80 },
  { id: 'custom', name: '⚙️ Personalizada', powerW: 0 },
];

const EXAMPLES = [
  { name: '🪙 Llavero', grams: 6, hours: 0.5, copies: 10, filament: 'pla' },
  { name: '🥤 Vaso', grams: 45, hours: 4, copies: 1, filament: 'pla' },
  { name: '🗿 Figura decorativa', grams: 120, hours: 12, copies: 1, filament: 'pla' },
  { name: '🧰 Soporte de móvil', grams: 35, hours: 3.5, copies: 2, filament: 'petg' },
  { name: '🧸 Miniatura', grams: 9, hours: 1.2, copies: 20, filament: 'resina' },
];

// ============================================================
// HELPERS
// ============================================================

const fmt = (n: number, digits = 2) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: digits, maximumFractionDigits: digits });

const eur = (n: number) => fmt(n, 2) + ' €';

function sectionHeader(icon: string, title: string, subtitle: string) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-9 h-9 shrink-0 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-lg">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-bold text-white leading-tight">{title}</h3>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition';

// ============================================================
// WIDGET
// ============================================================

export function Impresion3DWidget() {
  const [filamentId, setFilamentId] = useState('pla');
  const [priceInput, setPriceInput] = useState(''); // vacío → precio por defecto del material
  const [qtyInput, setQtyInput] = useState(''); // gramos (o ml en resina)
  const [failRate, setFailRate] = useState(5);
  const [copies, setCopies] = useState(1);
  const [hours, setHours] = useState(4);
  const [minutes, setMinutes] = useState(0);
  const [printerId, setPrinterId] = useState('ender3');
  const [powerInput, setPowerInput] = useState('200');
  const [kwhInput, setKwhInput] = useState('0.15');
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState(false);
  const [printerPrice, setPrinterPrice] = useState('250');
  const [lifespan, setLifespan] = useState('5000');
  const [extraCost, setExtraCost] = useState('0');
  const [margin, setMargin] = useState(50);

  const filament = FILAMENTS.find((f) => f.id === filamentId) ?? FILAMENTS[0];
  const isResin = !!filament.perLiter;

  useEffect(() => {
    const p = PRINTERS.find((pr) => pr.id === printerId);
    if (p && p.powerW > 0) setPowerInput(String(p.powerW));
  }, [printerId]);

  // Prefill desde el analizador GCODE/STL (sessionStorage)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('impresion3d-prefill');
      if (raw) {
        const p = JSON.parse(raw);
        if (p.qty) setQtyInput(String(p.qty));
        if (typeof p.hours === 'number' && p.hours > 0) {
          const whole = Math.floor(p.hours);
          setHours(whole);
          setMinutes(Math.round((p.hours - whole) * 60));
        }
        if (p.copies) setCopies(p.copies);
        sessionStorage.removeItem('impresion3d-prefill');
      }
    } catch {}
  }, []);

  const useLivePrice = async () => {
    setLiveLoading(true);
    setLiveError(false);
    try {
      const res = await fetch('/api/luz');
      if (res.ok) {
        const json = await res.json();
        const priceEur = json.current?.price != null ? json.current.price / 100 : null;
        if (priceEur && priceEur > 0) {
          setKwhInput(priceEur.toFixed(3));
        } else {
          setLiveError(true);
        }
      } else {
        setLiveError(true);
      }
    } catch {
      setLiveError(true);
    } finally {
      setLiveLoading(false);
    }
  };

  const applyExample = (ex: (typeof EXAMPLES)[number]) => {
    setFilamentId(ex.filament);
    setQtyInput(String(ex.grams));
    const wholeHours = Math.floor(ex.hours);
    setHours(wholeHours);
    setMinutes(Math.round((ex.hours - wholeHours) * 60));
    setCopies(ex.copies);
  };

  const result = useMemo(() => {
    const qty = parseFloat(qtyInput) || 0;
    const pricePerUnit = parseFloat(priceInput) || filament.pricePerUnit;

    // Material: gramos → kg (o ml → L para resina)
    const weightKg = isResin ? (qty / 1000) * filament.density : qty / 1000;
    const materialCost = isResin ? (qty / 1000) * pricePerUnit : weightKg * pricePerUnit;
    const materialCostWithWaste = materialCost * (1 + failRate / 100);

    // Energía
    const totalHours = hours + minutes / 60;
    const power = parseFloat(powerInput) || 0;
    const kwhPrice = parseFloat(kwhInput) || 0;
    const kwhPerPiece = (power / 1000) * totalHours;
    const electricityCost = kwhPerPiece * kwhPrice;

    // Amortización de la impresora
    const printerPriceNum = parseFloat(printerPrice) || 0;
    const lifespanNum = parseFloat(lifespan) || 1;
    const depCost = (printerPriceNum / lifespanNum) * totalHours;

    const extra = parseFloat(extraCost) || 0;

    const perPiece = materialCostWithWaste + electricityCost + depCost + extra;
    const total = perPiece * copies;

    const marginNum = margin || 0;
    const sellPerPiece = perPiece * (1 + marginNum / 100);
    const sellSuggestion = Math.ceil(sellPerPiece * 2) / 2;

    const breakdown = [
      { label: 'Material (filamento)', value: materialCostWithWaste, color: 'bg-brand-500', icon: '🧵' },
      { label: 'Electricidad', value: electricityCost, color: 'bg-amber-400', icon: '⚡' },
      { label: 'Amortización impresora', value: depCost, color: 'bg-cyan-400', icon: '🖨️' },
      { label: 'Extras / acabado', value: extra, color: 'bg-pink-500', icon: '🛠️' },
    ];
    const maxBreakdown = Math.max(...breakdown.map((b) => b.value), 0.0001);

    return {
      qty,
      pricePerUnit,
      weightKg,
      materialCostWithWaste,
      totalHours,
      kwhPerPiece,
      extra,
      electricityCost,
      depCost,
      perPiece,
      total,
      sellPerPiece,
      sellSuggestion,
      breakdown,
      maxBreakdown,
      materialTotalKg: weightKg * copies,
      kwhTotal: kwhPerPiece * copies,
    };
  }, [filamentId, priceInput, qtyInput, failRate, copies, hours, minutes, powerInput, kwhInput, printerPrice, lifespan, extraCost, margin, isResin, filament]);

  return (
    <div className="space-y-4">
      {/* Ejemplos rápidos */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">⚡ Prueba con un ejemplo:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.name}
            onClick={() => applyExample(ex)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/70 border border-slate-700 text-slate-300 hover:border-brand-500/60 hover:bg-brand-500/10 hover:text-white transition"
          >
            {ex.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 items-start">
        {/* ============ FORMULARIO ============ */}
        <div className="lg:col-span-3 space-y-4">
          {/* La pieza */}
          <section className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            {sectionHeader('🧩', 'La pieza', 'Copias y tiempo de impresión por pieza')}
            <div className="grid grid-cols-3 gap-3">
              <InputGroup
                label="Copias"
                tooltip="¿Cuántas piezas iguales vas a imprimir? El coste total se multiplica por este número."
              >
                <input
                  type="number"
                  min={1}
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className={inputCls}
                />
              </InputGroup>
              <InputGroup
                label="Horas"
                tooltip="Tiempo de impresión por pieza en horas. Tu laminador (Cura, PrusaSlicer…) lo indica al cortar el modelo."
              >
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={inputCls}
                />
              </InputGroup>
              <InputGroup
                label="Minutos"
                tooltip="Minutos extra del tiempo de impresión (para ajustar el cálculo con precisión)."
              >
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  className={inputCls}
                />
              </InputGroup>
            </div>
            <div className="mt-3">
              <InputGroup
                label={`Tasa de fallos: ${failRate}%`}
                tooltip="Porcentaje de impresiones que acaban fallando (adherencia, cortes de luz, atascos…). Aumenta el coste del material. Un 5% es un valor razonable."
              >
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={failRate}
                    onChange={(e) => setFailRate(parseInt(e.target.value))}
                    className="flex-1 accent-brand-500"
                  />
                  <span className="text-sm font-semibold text-slate-300 w-10 text-right tabular-nums">{failRate}%</span>
                </div>
              </InputGroup>
            </div>
          </section>

          {/* Material */}
          <section className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            {sectionHeader('🧵', 'Material', 'Filamento o resina que consumes por pieza')}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputGroup
                label="Material"
                tooltip="Tipo de material. Al elegirlo se cargan la densidad y el precio medio orientativo, que puedes ajustar."
              >
                <select
                  value={filamentId}
                  onChange={(e) => setFilamentId(e.target.value)}
                  className={inputCls}
                >
                  {FILAMENTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup
                label={isResin ? 'Precio (€/litro)' : 'Precio (€/kg)'}
                tooltip={isResin
                  ? 'Precio del litro de resina. Vacío = precio medio orientativo del material seleccionado.'
                  : 'Precio del kilo de filamento. Vacío = precio medio orientativo del material seleccionado.'}
              >
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder={String(filament.pricePerUnit)}
                  className={inputCls}
                />
              </InputGroup>
              <InputGroup
                label={isResin ? 'Volumen por pieza (ml)' : 'Peso por pieza (g)'}
                tooltip={isResin
                  ? 'Mililitros de resina que consume cada pieza (incluye soportes). Tu laminador lo estima al cortar.'
                  : 'Gramos de filamento que consume cada pieza (incluye soportes). Tu laminador lo estima al cortar.'}
              >
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  placeholder={isResin ? 'Ej: 30' : 'Ej: 45'}
                  className={inputCls}
                />
              </InputGroup>
            </div>
            {result.weightKg > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                ≈ <span className="text-slate-300 font-medium">{fmt(result.weightKg * 1000, 1)} g</span> de material por pieza ·{' '}
                {fmt(result.materialTotalKg * 1000, 1)} g en total ({fmt(result.materialTotalKg, 2)} kg)
              </p>
            )}
          </section>

          {/* Energía */}
          <section className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            {sectionHeader('⚡', 'Energía', 'Consumo eléctrico de la impresora')}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputGroup
                label="Impresora"
                tooltip="Preselecciona el consumo típico de impresoras populares. Elige «Personalizada» para escribir tu propia potencia."
              >
                <select
                  value={printerId}
                  onChange={(e) => setPrinterId(e.target.value)}
                  className={inputCls}
                >
                  {PRINTERS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup
                label="Potencia (W)"
                tooltip="Vatios que consume la impresora de media mientras imprime (la cama caliente es lo que más gasta)."
              >
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={powerInput}
                  onChange={(e) => setPowerInput(e.target.value)}
                  className={inputCls}
                />
              </InputGroup>
              <InputGroup
                label="Precio luz (€/kWh)"
                tooltip="Precio medio de la electricidad. Puedes cargar el precio real de hoy en España con el botón de abajo."
              >
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={kwhInput}
                    onChange={(e) => setKwhInput(e.target.value)}
                    className={inputCls}
                  />
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
            </div>
            {liveError && (
              <p className="mt-2 text-xs text-red-400">No se pudo obtener el precio de la luz ahora mismo. Sigue usando el valor manual.</p>
            )}
            {result.kwhPerPiece > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Esta pieza consume ≈ <span className="text-slate-300 font-medium">{fmt(result.kwhPerPiece, 2)} kWh</span>
                {copies > 1 && <> · <span className="text-slate-300 font-medium">{fmt(result.kwhTotal, 2)} kWh</span> en total</>}
              </p>
            )}
          </section>

          {/* Económico */}
          <section className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            {sectionHeader('💶', 'Económico', 'Amortización, acabados y margen de venta')}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InputGroup
                label="Precio impresora (€)"
                tooltip="Cuánto te costó la impresora. Se reparte entre las horas de vida útil estimadas."
              >
                <input type="number" min={0} value={printerPrice} onChange={(e) => setPrinterPrice(e.target.value)} className={inputCls} />
              </InputGroup>
              <InputGroup
                label="Vida útil (h)"
                tooltip="Horas de impresión estimadas hasta que la impresora se amortiza (típicamente 3.000–8.000 h)."
              >
                <input type="number" min={1} value={lifespan} onChange={(e) => setLifespan(e.target.value)} className={inputCls} />
              </InputGroup>
              <InputGroup
                label="Extras/pieza (€)"
                tooltip="Costes adicionales por pieza: lijado, pintura, post-procesado, embalaje, etiquetas, etc."
              >
                <input type="number" min={0} step={0.05} value={extraCost} onChange={(e) => setExtraCost(e.target.value)} className={inputCls} />
              </InputGroup>
              <InputGroup
                label={`Margen venta: ${margin}%`}
                tooltip="Beneficio que quieres ganar por encima del coste al vender la pieza (típico 50–150%)."
              >
                <input type="number" min={0} step={5} value={margin} onChange={(e) => setMargin(Math.max(0, parseInt(e.target.value) || 0))} className={inputCls} />
              </InputGroup>
            </div>
          </section>
        </div>

        {/* ============ RESULTADOS ============ */}
        <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-4">
          {/* Tarjeta principal */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-600/25 via-slate-900 to-pink-600/20 border border-brand-500/40 shadow-xl shadow-brand-500/10">
            <div className="text-[11px] uppercase tracking-widest text-brand-300 font-bold">Coste por pieza</div>
            <div className="text-4xl font-black text-white mt-1 tabular-nums">{eur(result.perPiece)}</div>
            <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
              Material {eur(result.materialCostWithWaste)} · Luz {eur(result.electricityCost)} · Amortización {eur(result.depCost)}
              {result.extra > 0 && <> · Extras {eur(result.extra)}</>}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                <div className="text-[11px] text-slate-400">
                  Total × {copies} {copies === 1 ? 'pieza' : 'piezas'}
                </div>
                <div className="text-lg font-bold text-white tabular-nums">{eur(result.total)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                <div className="text-[11px] text-slate-400">Venta recomendada</div>
                <div className="text-lg font-bold text-green-400 tabular-nums">{eur(result.sellPerPiece)}</div>
                <div className="text-[11px] text-slate-500">Redondea a: <strong className="text-slate-300">{fmt(result.sellSuggestion, 2)} €</strong></div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              {result.totalHours > 0 && <>Tiempo: {fmt(result.totalHours, 1)} h/pieza · {copies > 1 ? fmt(result.totalHours * copies, 1) + ' h en total' : ''}</>}
            </p>
          </div>

          {/* Desglose */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">📊 Desglose del coste</h3>
            <div className="space-y-3">
              {result.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-slate-400">
                      {b.icon} {b.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 tabular-nums">
                      {eur(b.value)}
                      <span className="text-slate-500 font-normal"> · {fmt(result.perPiece > 0 ? (b.value / result.perPiece) * 100 : 0, 0)}%</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${b.color} transition-all duration-500`}
                      style={{ width: `${(b.value / result.maxBreakdown) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consejos */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-sm font-bold text-slate-200 mb-2">💡 Consejos</h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                {result.totalHours > 0 && (
                  <>La impresora te cuesta ≈ <strong className="text-slate-200">{eur((parseFloat(printerPrice) || 0) / (parseFloat(lifespan) || 1))}/hora</strong> solo en amortización.</>
                )}
              </li>
              <li>Imprime en <strong className="text-slate-200">lotes</strong>: varias piezas a la vez reparten la amortización y el calentamiento inicial.</li>
              <li>
                {result.materialCostWithWaste > 0 && result.perPiece > 0 && (
                  <>El material es el <strong className="text-brand-300">{fmt((result.materialCostWithWaste / result.perPiece) * 100, 0)}%</strong> de tu coste actual.</>
                )}
              </li>
              <li>Las impresiones de <strong className="text-slate-200">bajo relleno (10-15%)</strong> usan mucho menos filamento sin perder rigidez.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
