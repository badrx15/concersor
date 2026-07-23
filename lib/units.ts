/**
 * Tablas de factores de conversión y funciones para unidades.
 * Cada tabla usa una unidad base (factor 1) y el resto se expresa
 * como múltiplo de esa base. La conversión es: resultado = valor * factorFrom / factorTo.
 */

export interface UnitDef {
  factor: number;
  label: string;
  symbol: string;
}

export const UNIT_TABLES: Record<string, Record<string, UnitDef>> = {
  length: {
    kilometro: { factor: 1000, label: 'kilómetro', symbol: 'km' },
    metro: { factor: 1, label: 'metro', symbol: 'm' },
    centimetro: { factor: 0.01, label: 'centímetro', symbol: 'cm' },
    milimetro: { factor: 0.001, label: 'milímetro', symbol: 'mm' },
    milla: { factor: 1609.344, label: 'milla', symbol: 'mi' },
    pie: { factor: 0.3048, label: 'pie', symbol: 'ft' },
    pulgada: { factor: 0.0254, label: 'pulgada', symbol: 'in' },
    yarda: { factor: 0.9144, label: 'yarda', symbol: 'yd' },
    'milla-nautica': { factor: 1852, label: 'milla náutica', symbol: 'M' },
  },
  weight: {
    kilogramo: { factor: 1, label: 'kilogramo', symbol: 'kg' },
    gramo: { factor: 0.001, label: 'gramo', symbol: 'g' },
    tonelada: { factor: 1000, label: 'tonelada', symbol: 't' },
    libra: { factor: 0.45359237, label: 'libra', symbol: 'lb' },
    onza: { factor: 0.02834952, label: 'onza', symbol: 'oz' },
    stone: { factor: 6.35029, label: 'stone', symbol: 'st' },
  },
  volume: {
    litro: { factor: 1, label: 'litro', symbol: 'L' },
    mililitro: { factor: 0.001, label: 'mililitro', symbol: 'ml' },
    'galon-us': { factor: 3.78541, label: 'galón (EE.UU.)', symbol: 'gal' },
    'galon-uk': { factor: 4.54609, label: 'galón (Reino Unido)', symbol: 'gal UK' },
    'metro-cubico': { factor: 1000, label: 'metro cúbico', symbol: 'm³' },
    pinta: { factor: 0.473176, label: 'pinta', symbol: 'pt' },
    taza: { factor: 0.236588, label: 'taza', symbol: 'taza' },
    'onza-liquida': { factor: 0.0295735, label: 'onza líquida', symbol: 'oz fl' },
  },
  speed: {
    kmh: { factor: 1, label: 'kilómetro por hora', symbol: 'km/h' },
    mph: { factor: 1.609344, label: 'milla por hora', symbol: 'mph' },
    ms: { factor: 3.6, label: 'metro por segundo', symbol: 'm/s' },
    nudos: { factor: 1.852, label: 'nudo', symbol: 'kn' },
    'pies-segundo': { factor: 1.09728, label: 'pie por segundo', symbol: 'ft/s' },
  },
};

/**
 * Conversión de temperatura — manejo especial porque no es multiplicación lineal.
 */
export function convertTemperature(
  value: number,
  from: string,
  to: string
): number {
  // Primero pasar a Celsius
  let celsius: number;
  if (from === 'celsius') celsius = value;
  else if (from === 'fahrenheit') celsius = ((value - 32) * 5) / 9;
  else if (from === 'kelvin') celsius = value - 273.15;
  else throw new Error(`Unidad origen no válida: ${from}`);

  // Luego de Celsius a destino
  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return (celsius * 9) / 5 + 32;
  if (to === 'kelvin') return celsius + 273.15;
  throw new Error(`Unidad destino no válida: ${to}`);
}

/**
 * Conversión genérica de unidades usando las tablas de factores.
 */
export function convertUnit(
  value: number,
  category: string,
  fromUnit: string,
  toUnit: string
): number {
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }
  const table = UNIT_TABLES[category];
  if (!table) throw new Error(`Categoría no válida: ${category}`);
  const from = table[fromUnit];
  const to = table[toUnit];
  if (!from || !to) throw new Error(`Unidad no válida`);
  return (value * from.factor) / to.factor;
}

/**
 * Formatear un número de forma legible (sin colas de ceros innecesarios).
 */
export function formatNumber(n: number, maxDecimals = 8): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = parseFloat(n.toFixed(maxDecimals));
  // Si es entero, mostrar sin decimales
  if (Number.isInteger(rounded)) return rounded.toLocaleString('es-ES');
  return rounded.toLocaleString('es-ES', {
    maximumFractionDigits: maxDecimals,
  });
}
