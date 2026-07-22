'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { CopyButton, FileDrop, loadImage } from './shared';

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
// LECTOR DE METADATOS DE IMAGEN (MEJORADO — 40+ CAMPOS)
// ============================================================
function ImageMetadata() {
  const [groups, setGroups] = useState<MetadataGroup[] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['📁 Archivo', '📷 Cámara', '⚙️ Captura']));

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const previewUrlRef = useRef<string | null>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const cleanup = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const readMetadata = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG, WebP, etc.)');
      return;
    }
    setLoading(true);
    setError('');
    setGroups(null);
    cleanup();

    try {
      // Show preview
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);

      // Read image dimensions
      const img = await loadImage(file);

      // Read EXIF/IPTC/XMP via exif-js
      const allData = await readAllMetadata(file);

      // Build grouped metadata
      const result = buildMetadataGroups(file, img, allData);
      setGroups(result);
    } catch (e: any) {
      setError(e.message || 'Error al leer metadatos');
    }
    setLoading(false);
  }, [cleanup]);

  const allJson = groups
    ? JSON.stringify(
        groups.flatMap((g) => g.fields.map((f) => [f.label, f.value])),
        null,
        2
      )
    : '';

  return (
    <div className="space-y-4">
      <FileDrop
        accept="image/*"
        label="Arrastra o selecciona una imagen (JPG, PNG, WebP, TIFF)"
        onFiles={readMetadata}
      />

      {loading && (
        <div className="flex items-center gap-3 text-slate-400 text-sm py-6">
          <span className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Leyendo todos los metadatos...
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm">{error}</div>
      )}

      {groups && previewUrl && (
        <div className="space-y-4">
          {/* Preview + actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-64 flex-shrink-0">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full rounded-xl border border-slate-700 max-h-48 object-contain bg-slate-900/30"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-sm font-bold text-brand-400">📋 Metadatos completos</h3>
                {groups.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {groups.reduce((s, g) => s + g.fields.length, 0)} campos en {groups.length} categorías
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setExpandedGroups(new Set(groups.map((g) => g.id)))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  🔽 Expandir todo
                </button>
                <button
                  onClick={() => setExpandedGroups(new Set())}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  🔼 Colapsar todo
                </button>
                <CopyButton text={allJson} className="text-xs" />
              </div>
            </div>
          </div>

          {/* Metadata accordion groups */}
          <div className="space-y-2">
            {groups.map((group) => (
              <AccordionGroup
                key={group.id}
                id={group.id}
                title={group.title}
                icon={group.icon}
                isOpen={expandedGroups.has(group.id)}
                onToggle={toggleGroup}
                fields={group.fields}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE ACORDEÓN
// ============================================================
function AccordionGroup({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  fields,
}: {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  fields: MetadataField[];
}) {
  if (fields.length === 0) return null;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition text-left"
      >
        <span className="text-sm font-semibold text-slate-200">
          {icon} {title} <span className="text-slate-500 font-normal">({fields.length})</span>
        </span>
        <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-3">
          <table className="w-full text-xs">
            <tbody>
              {fields.map((field, i) => (
                <tr
                  key={i}
                  className={`${i < fields.length - 1 ? 'border-b border-slate-800/40' : ''}`}
                >
                  <td className="py-1.5 pr-4 text-slate-400 whitespace-nowrap w-1/2 align-top">
                    {field.label}
                  </td>
                  <td className="py-1.5 text-slate-100 font-mono break-all">
                    {field.highlight ? (
                      <span className="text-brand-300 font-semibold">{field.value}</span>
                    ) : (
                      field.value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TIPOS
// ============================================================
interface MetadataField {
  label: string;
  value: string;
  highlight?: boolean;
}

interface MetadataGroup {
  id: string;
  title: string;
  icon: string;
  fields: MetadataField[];
}

// ============================================================
// FORMATEADORES DE VALORES EXIF
// ============================================================
function fmtOrientation(v: any): string {
  const map: Record<number, string> = {
    1: 'Horizontal (normal)',
    2: 'Espejado horizontal',
    3: 'Rotado 180°',
    4: 'Espejado vertical',
    5: 'Rotado 90° + espejado horizontal',
    6: 'Rotado 90° horario',
    7: 'Rotado 90° + espejado vertical',
    8: 'Rotado 90° antihorario',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtFlash(v: any): string {
  if (v == null) return '—';
  const n = Number(v);
  const fired = n & 0x01 ? '✅ Disparado' : '❌ No disparado';
  const parts = [fired];
  // Bits 1-2: return light detection
  if (n & 0x06) {
    const ret = (n >> 1) & 0x03;
    if (ret === 1) parts.push('↩️ Sin retorno de luz');
    else if (ret === 2) parts.push('✅ Retorno de luz detectado');
  }
  if (n & 0x08) parts.push('🚫 Sin función de flash');
  if (n & 0x10) parts.push('🔴 Reducción de ojos rojos');
  return parts.join(' · ');
}

function fmtExposureProgram(v: any): string {
  const map: Record<number, string> = {
    0: 'No definido',
    1: 'Manual',
    2: 'Programa normal',
    3: 'Prioridad apertura',
    4: 'Prioridad obturador',
    5: 'Creativo (profundidad)',
    6: 'Acción (velocidad)',
    7: 'Retrato',
    8: 'Paisaje',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtMeteringMode(v: any): string {
  const map: Record<number, string> = {
    0: 'Desconocido',
    1: 'Promedio',
    2: 'Promedio central',
    3: 'Puntual',
    4: 'Multipuntual',
    5: 'Patrón',
    6: 'Parcial',
    255: 'Otro',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtWhiteBalance(v: any): string {
  return v === 0 ? 'Automático ⚡' : v === 1 ? 'Manual ✋' : `Desconocido (${v})`;
}

function fmtLightSource(v: any): string {
  const map: Record<number, string> = {
    0: 'Desconocido',
    1: 'Luz diurna',
    2: 'Fluorescente',
    3: 'Incandescente',
    4: 'Flash',
    9: 'Buen tiempo',
    10: 'Nublado',
    11: 'Sombra',
    12: 'Fluorescente D',
    13: 'Fluorescente N',
    14: 'Fluorescente W',
    15: 'Luz blanca',
    17: 'Luz estándar A',
    18: 'Luz estándar B',
    19: 'Luz estándar C',
    20: 'D55',
    21: 'D65',
    22: 'D75',
    23: 'D50',
    24: 'ISO tungsteno',
    255: 'Otro',
  };
  return map[v] ?? `Fuente ${v}`;
}

function fmtSceneCapture(v: any): string {
  const map: Record<number, string> = {
    0: 'Estándar',
    1: 'Retrato',
    2: 'Paisaje',
    3: 'Nocturno',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtSubjectDistanceRange(v: any): string {
  const map: Record<number, string> = {
    0: 'Desconocido',
    1: 'Macro',
    2: 'Cerca',
    3: 'Lejos',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtGainControl(v: any): string {
  const map: Record<number, string> = {
    0: 'Ninguno',
    1: 'Ganancia baja',
    2: 'Ganancia alta',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtContrast(v: any): string {
  return v === 0 ? 'Normal' : v === 1 ? 'Bajo (suave)' : v === 2 ? 'Alto (fuerte)' : `Desconocido (${v})`;
}

function fmtSaturation(v: any): string {
  return v === 0 ? 'Normal' : v === 1 ? 'Baja' : v === 2 ? 'Alta' : `Desconocido (${v})`;
}

function fmtSharpness(v: any): string {
  return v === 0 ? 'Normal' : v === 1 ? 'Bajo (suave)' : v === 2 ? 'Alto (nítido)' : `Desconocido (${v})`;
}

function fmtSensingMethod(v: any): string {
  const map: Record<number, string> = {
    1: 'No definido',
    2: 'Sensor de un chip',
    3: 'Sensor de dos chips',
    4: 'Sensor de tres chips',
    5: 'Sensor secuencial color',
    7: 'Sensor tri-lineal',
    8: 'Sensor secuencial blanco/negro',
  };
  return map[v] ?? `Desconocido (${v})`;
}

function fmtFileSource(v: any): string {
  return v === 3 ? 'Cámara digital' : `Desconocido (${v})`;
}

function fmtResolutionUnit(v: any): string {
  return v === 2 ? 'pulgadas' : v === 3 ? 'cm' : `Unidad ${v}`;
}

function fmtGPSRef(ref: string): string {
  return ref === 'N' ? 'Norte 🌍' : ref === 'S' ? 'Sur 🌍' : ref === 'E' ? 'Este 🌍' : ref === 'O' ? 'Oeste 🌍' : ref || '—';
}

function fmtGPSDMS(coord: [number, number, number] | number[], ref?: string): string {
  if (!coord || !Array.isArray(coord) || coord.length < 3) return '—';
  const [d, m, s] = coord.map(Number);
  const dir = ref === 'N' ? 'N' : ref === 'S' ? 'S' : ref === 'E' ? 'E' : ref === 'O' ? 'O' : '';
  const decimal = d + m / 60 + s / 3600;
  return `${d}°${m}'${s.toFixed(2)}"${dir} (${decimal.toFixed(6)}°)`;
}

function fmtAltitude(v: any, ref?: any): string {
  if (v == null) return '—';
  const alt = Number(v);
  const sign = Number(ref) === 1 ? '-' : '';
  return `${sign}${alt.toFixed(1)} m`;
}

function fmtRational(v: any): string {
  if (v == null) return '—';
  if (typeof v === 'number') return v.toString();
  if (Array.isArray(v)) return v.join('/');
  return String(v);
}

function fmtExposureBias(v: any): string {
  if (v == null) return '—';
  const n = Number(v);
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)} EV`;
}

function fmtGPSStatus(v: any): string {
  return v === 'A' ? 'Activo (medición en curso)' : v === 'V' ? 'Void (inactivo)' : String(v);
}

function fmtGPSMeasureMode(v: any): string {
  return v === '2' ? '2D' : v === '3' ? '3D' : String(v);
}

// ============================================================
// CONSTRUCCIÓN DE GRUPOS DE METADATOS
// ============================================================
function buildMetadataGroups(
  file: File,
  img: HTMLImageElement,
  data: AllMetadata
): MetadataGroup[] {
  const { exif, iptc } = data;
  const groups: MetadataGroup[] = [];

  // ---------- FILE INFO ----------
  const fileFields: MetadataField[] = [
    { label: 'Nombre', value: file.name },
    { label: 'Tamaño', value: formatFileSize(file.size), highlight: true },
    { label: 'Tipo MIME', value: file.type || 'Desconocido' },
    { label: 'Última modificación', value: new Date(file.lastModified).toLocaleString('es-ES') },
    { label: 'Dimensiones', value: `${img.width} × ${img.height} px`, highlight: true },
    { label: 'Megapíxeles', value: ((img.width * img.height) / 1_000_000).toFixed(2) + ' MP', highlight: true },
    { label: 'Relación de aspecto', value: `${(img.width / img.height).toFixed(2)}:1` },
  ];

  if (exif?.Orientation != null) {
    fileFields.push({ label: 'Orientación', value: fmtOrientation(exif.Orientation) });
  }
  if (exif?.XResolution != null) {
    const unit = fmtResolutionUnit(exif.ResolutionUnit);
    fileFields.push({
      label: 'Resolución X',
      value: `${fmtRational(exif.XResolution)} ${unit === 'pulgadas' ? 'ppp' : unit === 'cm' ? 'ppc' : ''}`,
    });
  }
  if (exif?.YResolution != null) {
    const unit = fmtResolutionUnit(exif.ResolutionUnit);
    fileFields.push({
      label: 'Resolución Y',
      value: `${fmtRational(exif.YResolution)} ${unit === 'pulgadas' ? 'ppp' : unit === 'cm' ? 'ppc' : ''}`,
    });
  }
  if (exif?.Compression != null) {
    fileFields.push({ label: 'Compresión', value: String(exif.Compression) });
  }
  if (exif?.BitsPerSample != null) {
    fileFields.push({ label: 'Bits por muestra', value: String(exif.BitsPerSample) });
  }

  groups.push({ id: '📁 Archivo', title: 'Archivo', icon: '📁', fields: fileFields });

  // ---------- CAMERA INFO ----------
  const cameraFields: MetadataField[] = [];
  if (exif?.Make) cameraFields.push({ label: 'Fabricante', value: String(exif.Make), highlight: true });
  if (exif?.Model) cameraFields.push({ label: 'Modelo', value: String(exif.Model), highlight: true });
  if (exif?.Software) cameraFields.push({ label: 'Software', value: String(exif.Software) });
  if (exif?.Artist) cameraFields.push({ label: 'Artista / Autor', value: String(exif.Artist) });
  if (exif?.Copyright) cameraFields.push({ label: 'Copyright', value: String(exif.Copyright) });
  if (exif?.ImageDescription) cameraFields.push({ label: 'Descripción', value: String(exif.ImageDescription) });
  if (exif?.ExifVersion) cameraFields.push({ label: 'Versión EXIF', value: String(exif.ExifVersion) });
  if (exif?.FlashpixVersion) cameraFields.push({ label: 'Versión Flashpix', value: String(exif.FlashpixVersion) });

  groups.push({ id: '📷 Cámara', title: 'Cámara', icon: '📷', fields: cameraFields });

  // ---------- CAPTURE SETTINGS ----------
  const captureFields: MetadataField[] = [];
  if (exif?.DateTimeOriginal) captureFields.push({ label: 'Fecha de captura', value: String(exif.DateTimeOriginal), highlight: true });
  if (exif?.DateTimeDigitized) captureFields.push({ label: 'Fecha digitalización', value: String(exif.DateTimeDigitized) });
  if (exif?.DateTime) captureFields.push({ label: 'Fecha modificación', value: String(exif.DateTime) });
  if (exif?.SubsecTimeOriginal) captureFields.push({ label: 'Subsegundos (original)', value: String(exif.SubsecTimeOriginal) });
  if (exif?.ISOSpeedRatings != null) captureFields.push({ label: 'ISO', value: String(exif.ISOSpeedRatings), highlight: true });
  if (exif?.ExposureTime != null) captureFields.push({ label: 'Tiempo exposición', value: `${fmtRational(exif.ExposureTime)} s`, highlight: true });
  if (exif?.ShutterSpeedValue != null) captureFields.push({ label: 'Velocidad obturación', value: fmtRational(exif.ShutterSpeedValue) });
  if (exif?.FNumber != null) captureFields.push({ label: 'Apertura (F-number)', value: `f/${exif.FNumber}`, highlight: true });
  if (exif?.ApertureValue != null) captureFields.push({ label: 'Valor apertura (AV)', value: fmtRational(exif.ApertureValue) });
  if (exif?.MaxApertureValue != null) captureFields.push({ label: 'Apertura máxima', value: `f/${exif.MaxApertureValue}` });
  if (exif?.FocalLength != null) captureFields.push({ label: 'Distancia focal', value: `${exif.FocalLength} mm`, highlight: true });
  if (exif?.FocalLengthIn35mmFilm != null) captureFields.push({ label: 'Dist. focal (35mm)', value: `${exif.FocalLengthIn35mmFilm} mm` });
  if (exif?.DigitalZoomRation != null && Number(exif.DigitalZoomRation) > 0) {
    captureFields.push({ label: 'Zoom digital', value: `${fmtRational(exif.DigitalZoomRation)}×` });
  }
  if (exif?.ExposureProgram != null) captureFields.push({ label: 'Programa exposición', value: fmtExposureProgram(exif.ExposureProgram) });
  if (exif?.ExposureMode != null) captureFields.push({ label: 'Modo exposición', value: exif.ExposureMode === 0 ? 'Automático' : exif.ExposureMode === 1 ? 'Manual' : exif.ExposureMode === 2 ? 'Horquillado (Bracket)' : `Desconocido (${exif.ExposureMode})` });
  if (exif?.ExposureBias != null) captureFields.push({ label: 'Compensación EV', value: fmtExposureBias(exif.ExposureBias) });
  if (exif?.MeteringMode != null) captureFields.push({ label: 'Modo medición', value: fmtMeteringMode(exif.MeteringMode) });
  if (exif?.WhiteBalance != null) captureFields.push({ label: 'Balance blancos', value: fmtWhiteBalance(exif.WhiteBalance) });
  if (exif?.LightSource != null) captureFields.push({ label: 'Fuente de luz', value: fmtLightSource(exif.LightSource) });
  if (exif?.Flash != null) captureFields.push({ label: 'Flash', value: fmtFlash(exif.Flash) });
  if (exif?.SubjectDistance != null) captureFields.push({ label: 'Distancia al sujeto', value: `${exif.SubjectDistance} m` });
  if (exif?.SceneCaptureType != null) captureFields.push({ label: 'Tipo escena', value: fmtSceneCapture(exif.SceneCaptureType) });
  if (exif?.SubjectDistanceRange != null) captureFields.push({ label: 'Rango distancia', value: fmtSubjectDistanceRange(exif.SubjectDistanceRange) });
  if (exif?.CustomRendered != null) captureFields.push({ label: 'Procesado personalizado', value: exif.CustomRendered === 0 ? 'Normal' : 'Personalizado' });

  groups.push({ id: '⚙️ Captura', title: 'Captura', icon: '⚙️', fields: captureFields });

  // ---------- COLOR & QUALITY ----------
  const qualityFields: MetadataField[] = [];
  if (exif?.ColorSpace != null) {
    qualityFields.push({
      label: 'Espacio de color',
      value: exif.ColorSpace === 1 ? 'sRGB' : exif.ColorSpace === 2 ? 'Adobe RGB' : exif.ColorSpace === 65535 ? 'Sin calibrar (ICC)' : `Espacio ${exif.ColorSpace}`,
    });
  }
  if (exif?.Contrast != null) qualityFields.push({ label: 'Contraste', value: fmtContrast(exif.Contrast) });
  if (exif?.Saturation != null) qualityFields.push({ label: 'Saturación', value: fmtSaturation(exif.Saturation) });
  if (exif?.Sharpness != null) qualityFields.push({ label: 'Nitidez', value: fmtSharpness(exif.Sharpness) });
  if (exif?.GainControl != null) qualityFields.push({ label: 'Control de ganancia', value: fmtGainControl(exif.GainControl) });
  if (exif?.BrightnessValue != null) qualityFields.push({ label: 'Valor brillo (BV)', value: fmtRational(exif.BrightnessValue) });
  if (exif?.SensingMethod != null) qualityFields.push({ label: 'Método sensor', value: fmtSensingMethod(exif.SensingMethod) });
  if (exif?.FileSource != null) qualityFields.push({ label: 'Fuente archivo', value: fmtFileSource(exif.FileSource) });
  if (exif?.SceneType != null) qualityFields.push({ label: 'Tipo escena (código)', value: exif.SceneType === 1 ? 'Imagen directamente fotografiada' : String(exif.SceneType) });
  if (exif?.ComponentsConfiguration != null) qualityFields.push({ label: 'Config. componentes', value: String(exif.ComponentsConfiguration) });
  if (exif?.CompressedBitsPerPixel != null) qualityFields.push({ label: 'Bits comprimidos/px', value: fmtRational(exif.CompressedBitsPerPixel) });
  if (exif?.PixelXDimension != null) qualityFields.push({ label: 'Ancho efectivo (px)', value: String(exif.PixelXDimension) });
  if (exif?.PixelYDimension != null) qualityFields.push({ label: 'Alto efectivo (px)', value: String(exif.PixelYDimension) });
  if (exif?.PhotometricInterpretation != null) {
    const pmap: Record<number, string> = { 2: 'RGB', 6: 'YCbCr', 0: 'Blanco/Negro' };
    qualityFields.push({ label: 'Interpretación fotométrica', value: pmap[exif.PhotometricInterpretation] ?? String(exif.PhotometricInterpretation) });
  }
  if (exif?.YCbCrSubSampling != null) qualityFields.push({ label: 'Submuestreo YCbCr', value: Array.isArray(exif.YCbCrSubSampling) ? exif.YCbCrSubSampling.join(':') : String(exif.YCbCrSubSampling) });
  if (exif?.YCbCrPositioning != null) qualityFields.push({ label: 'Posicionamiento YCbCr', value: exif.YCbCrPositioning === 1 ? 'Centrado' : exif.YCbCrPositioning === 2 ? 'Co-sited' : String(exif.YCbCrPositioning) });
  if (exif?.ImageUniqueID != null) qualityFields.push({ label: 'ID único de imagen', value: String(exif.ImageUniqueID) });

  groups.push({ id: '🎨 Calidad', title: 'Color y Calidad', icon: '🎨', fields: qualityFields });

  // ---------- GPS ----------
  const gpsFields: MetadataField[] = [];
  const hasGPS = exif?.GPSLatitude || exif?.GPSLongitude || exif?.GPSAltitude;
  if (hasGPS) {
    if (exif.GPSLatitude && exif.GPSLatitudeRef) {
      gpsFields.push({ label: 'Latitud', value: fmtGPSDMS(exif.GPSLatitude, exif.GPSLatitudeRef), highlight: true });
      gpsFields.push({ label: 'Referencia latitud', value: fmtGPSRef(exif.GPSLatitudeRef) });
    }
    if (exif.GPSLongitude && exif.GPSLongitudeRef) {
      gpsFields.push({ label: 'Longitud', value: fmtGPSDMS(exif.GPSLongitude, exif.GPSLongitudeRef), highlight: true });
      gpsFields.push({ label: 'Referencia longitud', value: fmtGPSRef(exif.GPSLongitudeRef) });
    }
    if (exif.GPSAltitude != null || exif.GPSAltitudeRef != null) {
      gpsFields.push({ label: 'Altitud', value: fmtAltitude(exif.GPSAltitude, exif.GPSAltitudeRef) });
    }
    if (exif.GPSTimeStamp) {
      const ts = Array.isArray(exif.GPSTimeStamp) ? exif.GPSTimeStamp.map(Number) : [];
      if (ts.length >= 3) {
        gpsFields.push({ label: 'Hora GPS (UTC)', value: `${String(ts[0]).padStart(2, '0')}:${String(ts[1]).padStart(2, '0')}:${String(ts[2].toFixed(0)).padStart(2, '0')}` });
      }
    }
    if (exif.GPSDateStamp) gpsFields.push({ label: 'Fecha GPS', value: String(exif.GPSDateStamp) });
    if (exif.GPSSatellites) gpsFields.push({ label: 'Satélites', value: String(exif.GPSSatellites) });
    if (exif.GPSStatus != null) gpsFields.push({ label: 'Estado GPS', value: fmtGPSStatus(exif.GPSStatus) });
    if (exif.GPSMeasureMode != null) gpsFields.push({ label: 'Modo medición', value: fmtGPSMeasureMode(exif.GPSMeasureMode) });
    if (exif.GPSDOP != null) gpsFields.push({ label: 'Precisión (DOP)', value: `${Number(exif.GPSDOP).toFixed(2)} m` });
    if (exif.GPSSpeed != null) {
      const speedUnit = exif.GPSSpeedRef === 'K' ? 'km/h' : exif.GPSSpeedRef === 'M' ? 'mph' : exif.GPSSpeedRef === 'N' ? 'nudos' : '';
      gpsFields.push({ label: 'Velocidad', value: `${Number(exif.GPSSpeed).toFixed(1)} ${speedUnit}` });
    }
    if (exif.GPSTrack != null) gpsFields.push({ label: 'Dirección (Track)', value: `${Number(exif.GPSTrack).toFixed(1)}°` });
    if (exif.GPSImgDirection != null) gpsFields.push({ label: 'Dirección imagen', value: `${Number(exif.GPSImgDirection).toFixed(1)}°` });
    if (exif.GPSMapDatum) gpsFields.push({ label: 'Datum mapa', value: String(exif.GPSMapDatum) });
    if (exif.GPSVersionID) gpsFields.push({ label: 'Versión GPS', value: Array.isArray(exif.GPSVersionID) ? exif.GPSVersionID.join('.') : String(exif.GPSVersionID) });
    if (exif.GPSDestLatitude) gpsFields.push({ label: 'Latitud destino', value: fmtGPSDMS(exif.GPSDestLatitude, exif.GPSDestLatitudeRef) });
    if (exif.GPSDestLongitude) gpsFields.push({ label: 'Longitud destino', value: fmtGPSDMS(exif.GPSDestLongitude, exif.GPSDestLongitudeRef) });
    if (exif.GPSDestBearing != null) gpsFields.push({ label: 'Rumbo destino', value: `${Number(exif.GPSDestBearing).toFixed(1)}°` });
    if (exif.GPSDestDistance != null) gpsFields.push({ label: 'Distancia destino', value: `${Number(exif.GPSDestDistance).toFixed(1)} ${exif.GPSDestDistanceRef || ''}` });
    if (exif.GPSProcessingMethod) gpsFields.push({ label: 'Método procesamiento', value: String(exif.GPSProcessingMethod) });
    if (exif.GPSAreaInformation) gpsFields.push({ label: 'Información área', value: String(exif.GPSAreaInformation) });
  } else {
    gpsFields.push({ label: 'GPS', value: '📡 No hay datos GPS en esta imagen' });
  }

  groups.push({ id: '🌍 GPS', title: 'GPS', icon: '🌍', fields: gpsFields });

  // ---------- IPTC ----------
  if (iptc && Object.keys(iptc).length > 0) {
    const iptcFields: MetadataField[] = [];
    if (iptc['caption']) iptcFields.push({ label: 'Descripción (Caption)', value: String(iptc['caption']) });
    if (iptc['headline']) iptcFields.push({ label: 'Titular (Headline)', value: String(iptc['headline']) });
    if (iptc['credit']) iptcFields.push({ label: 'Crédito', value: String(iptc['credit']) });
    if (iptc['source']) iptcFields.push({ label: 'Fuente', value: String(iptc['source']) });
    if (iptc['byline']) iptcFields.push({ label: 'Autor (Byline)', value: Array.isArray(iptc['byline']) ? iptc['byline'].join(', ') : String(iptc['byline']) });
    if (iptc['bylineTitle']) iptcFields.push({ label: 'Cargo del autor', value: String(iptc['bylineTitle']) });
    if (iptc['captionWriter']) iptcFields.push({ label: 'Escritor del caption', value: String(iptc['captionWriter']) });
    if (iptc['keywords']) iptcFields.push({ label: 'Palabras clave', value: Array.isArray(iptc['keywords']) ? iptc['keywords'].join(', ') : String(iptc['keywords']) });
    if (iptc['copyrightNotice']) iptcFields.push({ label: 'Aviso copyright', value: String(iptc['copyrightNotice']) });
    if (iptc['category']) iptcFields.push({ label: 'Categoría', value: String(iptc['category']) });
    if (iptc['dateCreated']) iptcFields.push({ label: 'Fecha creación', value: String(iptc['dateCreated']) });
    if (iptc['city']) iptcFields.push({ label: 'Ciudad', value: String(iptc['city']) });
    if (iptc['country']) iptcFields.push({ label: 'País', value: String(iptc['country']) });
    if (iptc['objectName']) iptcFields.push({ label: 'Nombre objeto', value: String(iptc['objectName']) });

    groups.push({ id: '📝 IPTC', title: 'IPTC (Datos editoriales)', icon: '📝', fields: iptcFields });
  }

  // ---------- OTHER (remaining tags) ----------
  const knownTags = new Set([
    'Make', 'Model', 'Software', 'Artist', 'Copyright', 'ImageDescription',
    'Orientation', 'XResolution', 'YResolution', 'ResolutionUnit', 'Compression', 'BitsPerSample', 'SamplesPerPixel',
    'DateTime', 'DateTimeOriginal', 'DateTimeDigitized', 'SubsecTime', 'SubsecTimeOriginal', 'SubsecTimeDigitized',
    'ExifVersion', 'FlashpixVersion',
    'ISOSpeedRatings', 'ExposureTime', 'ShutterSpeedValue', 'FNumber', 'ApertureValue', 'MaxApertureValue',
    'FocalLength', 'FocalLengthIn35mmFilm', 'DigitalZoomRation',
    'ExposureProgram', 'ExposureMode', 'ExposureBias', 'MeteringMode', 'WhiteBalance', 'LightSource', 'Flash',
    'SubjectDistance', 'SceneCaptureType', 'SubjectDistanceRange', 'CustomRendered',
    'ColorSpace', 'Contrast', 'Saturation', 'Sharpness', 'GainControl', 'BrightnessValue',
    'SensingMethod', 'FileSource', 'SceneType', 'ComponentsConfiguration', 'CompressedBitsPerPixel',
    'PixelXDimension', 'PixelYDimension', 'PhotometricInterpretation',
    'YCbCrSubSampling', 'YCbCrPositioning', 'ImageUniqueID', 'MakerNote', 'UserComment',
    'FocalPlaneXResolution', 'FocalPlaneYResolution', 'FocalPlaneResolutionUnit',
    'InteroperabilityIFDPointer', 'ExposureIndex',
    // GPS
    'GPSVersionID', 'GPSLatitudeRef', 'GPSLatitude', 'GPSLongitudeRef', 'GPSLongitude',
    'GPSAltitudeRef', 'GPSAltitude', 'GPSTimeStamp', 'GPSSatellites', 'GPSStatus', 'GPSMeasureMode',
    'GPSDOP', 'GPSSpeedRef', 'GPSSpeed', 'GPSTrackRef', 'GPSTrack', 'GPSImgDirectionRef', 'GPSImgDirection',
    'GPSMapDatum', 'GPSDestLatitudeRef', 'GPSDestLatitude', 'GPSDestLongitudeRef', 'GPSDestLongitude',
    'GPSDestBearingRef', 'GPSDestBearing', 'GPSDestDistanceRef', 'GPSDestDistance',
    'GPSProcessingMethod', 'GPSAreaInformation', 'GPSDateStamp', 'GPSDifferential',
    // TIFF
    'StripOffsets', 'RowsPerStrip', 'StripByteCounts', 'PlanarConfiguration', 'TransferFunction',
    'WhitePoint', 'PrimaryChromaticities', 'JPEGInterchangeFormat', 'JPEGInterchangeFormatLength',
    'YCbCrCoefficients', 'ReferenceBlackWhite',
  ]);

  const otherFields: MetadataField[] = [];
  if (exif) {
    for (const [key, val] of Object.entries(exif)) {
      if (!knownTags.has(key) && val != null && val !== '') {
        otherFields.push({ label: key, value: typeof val === 'object' ? JSON.stringify(val) : String(val) });
      }
    }
  }
  if (exif?.UserComment && exif.UserComment !== '') {
    otherFields.push({ label: 'Comentario usuario', value: String(exif.UserComment) });
  }
  if (exif?.MakerNote) {
    otherFields.push({ label: 'MakerNote', value: `${String(exif.MakerNote).substring(0, 100)}... (datos propietarios)` });
  }

  if (otherFields.length > 0) {
    groups.push({ id: '🔬 Otros', title: 'Otros datos técnicos', icon: '🔬', fields: otherFields });
  }

  return groups;
}

// ============================================================
// LECTURA COMPLETA DE METADATOS (EXIF + IPTC + XMP)
// ============================================================
interface AllMetadata {
  exif: Record<string, any> | null;
  iptc: Record<string, any> | null;
}

async function readAllMetadata(file: File): Promise<AllMetadata> {
  return new Promise((resolve, reject) => {
    // exif-js lee la cabecera del archivo directamente, sin necesidad de FileReader
    const doRead = () => {
      try {
        processExif(file, resolve, reject);
      } catch {
        resolve({ exif: null, iptc: null });
      }
    };

    if (typeof (window as any).EXIF === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js';
      script.onload = doRead;
      script.onerror = () => {
        // Fallback: cargar desde node_modules
        const s2 = document.createElement('script');
        s2.src = '/node_modules/exif-js/exif.js';
        s2.onload = doRead;
        s2.onerror = () => resolve({ exif: null, iptc: null });
        document.head.appendChild(s2);
      };
      document.head.appendChild(script);
    } else {
      doRead();
    }
  });
}

function processExif(
  file: File,
  resolve: (data: AllMetadata) => void,
  _reject: (err: Error) => void
) {
  try {
    // Enable XMP reading
    try {
      (window as any).EXIF.enableXmp();
    } catch {}

    (window as any).EXIF.getData(file, function (this: any) {
      try {
        // Get ALL EXIF tags (includes TIFF + GPS)
        const exifData = (window as any).EXIF.getAllTags(this) || {};

        // Get IPTC data
        let iptcData: Record<string, any> | null = null;
        try {
          if (typeof (window as any).EXIF.getAllIptcs === 'function') {
            iptcData = (window as any).EXIF.getAllIptcs(this) || null;
          }
        } catch {}

        resolve({ exif: exifData, iptc: iptcData });
      } catch {
        resolve({ exif: null, iptc: null });
      }
    });
  } catch {
    resolve({ exif: null, iptc: null });
  }
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
