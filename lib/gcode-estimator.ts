/**
 * Analizador de archivos GCODE y STL para impresión 3D.
 * Funciones puras, sin dependencias del DOM ni de React.
 *
 * - analyzeGcode: extrae tiempo de impresión y filamento usado (metadatos del
 *   laminador o cálculo desde los movimientos E/X/Y/Z/F del archivo).
 * - analyzeStl: calcula volumen del sólido (descomposición en tetraedros con
 *   volumen firmado) y caja delimitadora desde mallas binarias o ASCII.
 */

export const FILAMENT_DIAMETER = 1.75; // mm
export const NOZZLE_DIAMETER = 0.4; // mm
/** Área de la sección del filamento en mm² */
export const FILAMENT_AREA_MM2 = Math.PI * (FILAMENT_DIAMETER / 2) ** 2;
/** Relación de áreas boquilla/filamento (para estimar tiempo desde el E) */
const AREA_RATIO = (NOZZLE_DIAMETER * NOZZLE_DIAMETER) / (FILAMENT_DIAMETER * FILAMENT_DIAMETER);

export interface GcodeAnalysis {
  kind: 'gcode';
  /** Segundos de impresión (null si no se pudo estimar) */
  timeSeconds: number | null;
  timeMethod: 'metadata' | 'estimated' | 'none';
  /** Longitud de filamento usada en mm (metadatos o suma de E) */
  filamentMm: number | null;
  /** Gramos según metadatos del laminador (si los escribe) */
  filamentGramsMeta: number | null;
  filamentMethod: 'metadata' | 'calculated' | 'none';
  /** Número de capas detectado */
  layers: number | null;
  /** Altura de capa en mm */
  layerHeightMm: number | null;
  /** Extrusiones totales (mm de filamento) calculadas desde los movimientos */
  calculatedEmm: number;
  warnings: string[];
}

export interface StlAnalysis {
  kind: 'stl';
  method: 'binary' | 'ascii';
  triangles: number;
  /** Volumen del sólido en mm³ (valor absoluto) */
  volumeMm3: number;
  sizeMm: { x: number; y: number; z: number };
}

// ============================================================
// HELPERS
// ============================================================

/** Convierte cadenas tipo "1h 23m 45s", "1h23m45s", "2h 15min" o "45m" a segundos */
function parseDuration(str: string): number | null {
  let t = str.toLowerCase();
  let total = 0;
  t = t.replace(/([\d.]+)\s*(?:h|hours?|hr)\s*/i, (_, n: string) => {
    total += parseFloat(n) * 3600;
    return ' ';
  });
  t = t.replace(/([\d.]+)\s*(?:min)\s*/i, (_, n: string) => {
    total += parseFloat(n) * 60;
    return ' ';
  });
  // Cuidado: 'm' de minutos después de haber procesado horas/min explícitos
  t = t.replace(/([\d.]+)\s*m(?!s)\s*/i, (_, n: string) => {
    total += parseFloat(n) * 60;
    return ' ';
  });
  t = t.replace(/([\d.]+)\s*(?:sec|s)\s*/i, (_, n: string) => {
    total += parseFloat(n);
    return ' ';
  });
  return total > 0 ? total : null;
}

// ============================================================
// GCODE
// ============================================================

export function analyzeGcode(text: string): GcodeAnalysis {
  const warnings: string[] = [];
  let timeSeconds: number | null = null;
  let timeMethod: 'metadata' | 'estimated' | 'none' = 'none';
  let filamentMmMeta: number | null = null;
  let filamentGramsMeta: number | null = null;
  let layers: number | null = 0;
  let layerHeightMm: number | null = null;

  // Estado de la máquina para la estimación por movimientos
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;
  let lastE = 0;
  let eAbsolute = true; // por defecto M82 (E absoluto)
  let f = 1800; // mm/min por defecto
  let calculatedE = 0; // suma de extrusiones positivas (mm de filamento)
  let retractions = 0;
  let estimatedTime = 0;

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ---- Comentarios / metadatos ----
    if (line.startsWith(';')) {
      const lower = line.toLowerCase();
      if (timeSeconds == null) {
        const t1 = line.match(/;\s*TIME\s*:\s*([\d.]+)/i);
        const t2 = line.match(/;\s*TIME_ELAPSED\s*:\s*([\d.]+)/i);
        if (t1) {
          timeSeconds = parseFloat(t1[1]);
          timeMethod = 'metadata';
        } else if (t2) {
          timeSeconds = parseFloat(t2[1]);
          timeMethod = 'metadata';
        } else if (lower.includes('estimated printing time')) {
          const d = parseDuration(line.replace(/^.*=\s*/, ''));
          if (d != null) {
            timeSeconds = d;
            timeMethod = 'metadata';
          }
        }
      }
      if (filamentMmMeta == null && filamentGramsMeta == null) {
        // Cura: ";Filament used: 6.2453m"  (metros)
        let m = line.match(/Filament used\s*:\s*([\d.]+)\s*m/i);
        if (m) {
          filamentMmMeta = parseFloat(m[1]) * 1000;
        } else {
          // Prusa/Slic3r: "; filament used [mm] = 4529.9"
          m = line.match(/filament used \[mm\]\s*=\s*([\d.]+)/i);
          if (m) filamentMmMeta = parseFloat(m[1]);
        }
        // Prusa/Slic3r: "; filament used [g] = 11.9" o "; total filament used [g] = 11.9"
        m = line.match(/(?:total\s+)?filament used \[g\]\s*=\s*([\d.]+)/i);
        if (m) filamentGramsMeta = parseFloat(m[1]);
      }
      // Conteo de capas: ;LAYER_COUNT:n (Cura) o el índice ;LAYER:n más alto +1
      const lc = line.match(/;\s*LAYER_COUNT\s*:\s*(\d+)/i);
      if (lc) {
        layers = Math.max(layers ?? 0, parseInt(lc[1], 10));
      } else {
        const lm = line.match(/;\s*LAYER\s*:\s*(\d+)/i);
        if (lm) layers = Math.max(layers ?? 0, parseInt(lm[1], 10) + 1);
      }
      if (layerHeightMm == null) {
        const lh =
          line.match(/Layer height\s*:\s*([\d.]+)/i) ||
          line.match(/layer_height\s*=\s*([\d.]+)/i);
        if (lh) layerHeightMm = parseFloat(lh[1]);
      }
      continue;
    }

    // ---- Comandos ----
    const cmd = line.match(/^([GM])\s*(\d+)/i);
    if (!cmd) continue;
    const code = cmd[1].toUpperCase() + cmd[2];

    if (code === 'M82') {
      eAbsolute = true;
      continue;
    }
    if (code === 'M83') {
      eAbsolute = false;
      continue;
    }
    if (code === 'G92') {
      const eM = line.match(/\bE\s*([-\d.]+)/);
      if (eM) lastE = parseFloat(eM[1]);
      continue;
    }
    if (code !== 'G1' && code !== 'G0') continue;

    // Tokens de la línea (con o sin espacios: "G1X10Y20E0.5F1800")
    const fM = line.match(/\bF\s*([\d.]+)/);
    if (fM && parseFloat(fM[1]) > 0) f = parseFloat(fM[1]);
    const xM = line.match(/\bX\s*([-\d.]+)/);
    const yM = line.match(/\bY\s*([-\d.]+)/);
    const zM = line.match(/\bZ\s*([-\d.]+)/);
    const eM = line.match(/\bE\s*([-\d.]+)/);

    const nx = xM ? parseFloat(xM[1]) : lastX;
    const ny = yM ? parseFloat(yM[1]) : lastY;
    const nz = zM ? parseFloat(zM[1]) : lastZ;
    const dx = nx - lastX;
    const dy = ny - lastY;
    const dz = nz - lastZ;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    let dE = 0;
    if (eM) {
      const e = parseFloat(eM[1]);
      dE = eAbsolute ? e - lastE : e;
      lastE = eAbsolute ? e : lastE + dE;
      if (dE > 0.001) calculatedE += dE;
      else if (dE < -0.001) retractions++;
    }

    const speed = f / 60; // mm/s
    if (dE > 0.001) {
      // Movimiento de extrusión: el tiempo lo marca el avance del cabezal o el
      // empuje del filamento (lo que tarde más), nunca el más corto.
      const feedTime = dE / (speed * AREA_RATIO);
      const moveTime = dist > 0.001 ? dist / speed : 0;
      estimatedTime += Math.max(feedTime, moveTime);
    } else if (dist > 0.001) {
      // Viaje sin extruir
      estimatedTime += dist / speed;
    }

    lastX = nx;
    lastY = ny;
    lastZ = nz;
  }

  if (timeSeconds == null && estimatedTime > 0) {
    timeSeconds = estimatedTime;
    timeMethod = 'estimated';
  }
  if (layers === 0) layers = null;

  if (timeSeconds == null) warnings.push('No se pudo estimar el tiempo de impresión de este archivo.');
  if (filamentMmMeta == null && filamentGramsMeta == null && calculatedE === 0)
    warnings.push('No se encontró información de filamento ni movimientos de extrusión (E).');

  return {
    kind: 'gcode',
    timeSeconds,
    timeMethod,
    filamentMm: filamentMmMeta ?? (calculatedE > 0 ? calculatedE : null),
    filamentGramsMeta,
    filamentMethod: filamentMmMeta != null || filamentGramsMeta != null ? 'metadata' : calculatedE > 0 ? 'calculated' : 'none',
    layers,
    layerHeightMm,
    calculatedEmm: calculatedE,
    warnings,
  };
}

// ============================================================
// STL
// ============================================================

export function analyzeStl(buffer: ArrayBuffer): StlAnalysis {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  let method: 'binary' | 'ascii' = 'ascii';
  let triangles = 0;
  let volume = 0;
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  // Detección binaria: 80 bytes de cabecera + uint32 de triángulos + triángulos de 50 bytes
  let isBinary = false;
  if (bytes.length >= 84) {
    const count = view.getUint32(80, true);
    const expected = 84 + count * 50;
    if (count > 0 && count < 50_000_000 && bytes.length - expected >= 0 && bytes.length - expected < 64) {
      isBinary = true;
      method = 'binary';
      triangles = count;
      for (let i = 0; i < count; i++) {
        const off = 84 + i * 50 + 12; // saltar normal (12 bytes)
        const v0x = view.getFloat32(off, true);
        const v0y = view.getFloat32(off + 4, true);
        const v0z = view.getFloat32(off + 8, true);
        const v1x = view.getFloat32(off + 12, true);
        const v1y = view.getFloat32(off + 16, true);
        const v1z = view.getFloat32(off + 20, true);
        const v2x = view.getFloat32(off + 24, true);
        const v2y = view.getFloat32(off + 28, true);
        const v2z = view.getFloat32(off + 32, true);
        volume +=
          (v0x * (v1y * v2z - v1z * v2y) +
            v0y * (v1z * v2x - v1x * v2z) +
            v0z * (v1x * v2y - v1y * v2x)) /
          6;
        for (const [vx, vy, vz] of [
          [v0x, v0y, v0z],
          [v1x, v1y, v1z],
          [v2x, v2y, v2z],
        ]) {
          if (vx < minX) minX = vx;
          if (vy < minY) minY = vy;
          if (vz < minZ) minZ = vz;
          if (vx > maxX) maxX = vx;
          if (vy > maxY) maxY = vy;
          if (vz > maxZ) maxZ = vz;
        }
      }
    }
  }

  if (!isBinary) {
    method = 'ascii';
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const verts: number[] = [];
    const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text))) {
      verts.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
    }
    triangles = Math.floor(verts.length / 9);
    for (let i = 0; i + 8 < verts.length; i += 9) {
      const v0x = verts[i];
      const v0y = verts[i + 1];
      const v0z = verts[i + 2];
      const v1x = verts[i + 3];
      const v1y = verts[i + 4];
      const v1z = verts[i + 5];
      const v2x = verts[i + 6];
      const v2y = verts[i + 7];
      const v2z = verts[i + 8];
      volume +=
        (v0x * (v1y * v2z - v1z * v2y) +
          v0y * (v1z * v2x - v1x * v2z) +
          v0z * (v1x * v2y - v1y * v2x)) /
        6;
      for (const [vx, vy, vz] of [
        [v0x, v0y, v0z],
        [v1x, v1y, v1z],
        [v2x, v2y, v2z],
      ]) {
        if (vx < minX) minX = vx;
        if (vy < minY) minY = vy;
        if (vz < minZ) minZ = vz;
        if (vx > maxX) maxX = vx;
        if (vy > maxY) maxY = vy;
        if (vz > maxZ) maxZ = vz;
      }
    }
  }

  return {
    kind: 'stl',
    method,
    triangles,
    volumeMm3: Math.abs(volume),
    sizeMm: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
  };
}

// ============================================================
// Formateo compartido
// ============================================================

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h <= 0) return `${m} min`;
  return `${h} h ${m} min`;
}
