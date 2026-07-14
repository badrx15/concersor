/**
 * REGISTRO DE CONVERSORES — arquitectura config-driven.
 * ========================================================
 * Para añadir un nuevo conversor, copia un objeto del array y modifica
 * los campos. La web genera automáticamente la página, el sitemap, los
 * enlaces relacionados, los datos estructurados (Schema.org) y el contenido
 * SEO (explicación, tabla de equivalencias, FAQ).
 *
 * El campo `widget` indica qué componente cliente renderiza la herramienta.
 * Los widgets disponibles están en /components/widgets/.
 */

export type ConverterCategory =
  | 'unidades'
  | 'divisas'
  | 'archivos'
  | 'texto';

export type WidgetType =
  | 'unit-converter'
  | 'currency-converter'
  | 'image-to-pdf'
  | 'pdf-to-images'
  | 'compress-pdf'
  | 'compress-image'
  | 'png-to-jpg'
  | 'image-to-webp'
  | 'case-converter'
  | 'word-counter'
  | 'json-csv';

export interface FaqItem {
  q: string;
  a: string;
}

export interface EquivalenceRow {
  from: string;
  to: string;
}

export interface Converter {
  slug: string;
  name: string;
  category: ConverterCategory;
  icon: string;
  color: string;
  widget: WidgetType;
  /** Configuración específica del widget */
  widgetConfig?: Record<string, string>;
  metaTitle: string;
  metaDescription: string;
  /** Texto de explicación (HTML seguro, se renderiza como párrafos) */
  explanation: string[];
  /** Tabla de equivalencias comunes */
  equivalences: EquivalenceRow[];
  /** Preguntas frecuentes con Schema FAQPage */
  faq: FaqItem[];
  /** Slugs de conversores relacionados */
  related: string[];
  /** Palabras clave para SEO (no se muestran, solo metadatos) */
  keywords: string[];
}

export const CATEGORIES: {
  id: ConverterCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
}[] = [
  {
    id: 'unidades',
    name: 'Unidades',
    icon: '📏',
    color: '#3b82f6',
    description: 'Longitud, peso, temperatura, volumen y velocidad.',
  },
  {
    id: 'divisas',
    name: 'Divisas',
    icon: '💱',
    color: '#22c55e',
    description: 'Conversión de monedas con tasas en tiempo real.',
  },
  {
    id: 'archivos',
    name: 'Archivos',
    icon: '📁',
    color: '#f97316',
    description: 'PDF, imágenes, compresión — todo en tu navegador.',
  },
  {
    id: 'texto',
    name: 'Texto y datos',
    icon: '🔤',
    color: '#06b6d4',
    description: 'Mayúsculas, contador de palabras, JSON ↔ CSV.',
  },
];

export const CONVERTERS: Converter[] = [
  // ====================================================================
  // UNIDADES — LONGITUD
  // ====================================================================
  {
    slug: 'kilometros-a-millas',
    name: 'Kilómetros a Millas',
    category: 'unidades',
    icon: '📏',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'length', defaultFrom: 'kilometro', defaultTo: 'milla' },
    metaTitle: 'Kilómetros a Millas — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte kilómetros a millas (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis, sin registro, 100% preciso.',
    explanation: [
      'Un kilómetro equivale a 0,621371 millas. Para convertir kilómetros a millas, multiplica el valor en kilómetros por 0,621371. Por ejemplo, 10 km × 0,621371 = 6,21371 millas.',
      'La milla terrestre o milla estatutaria (statute mile) se usa en países anglosajones como Estados Unidos y Reino Unido, mientras que el kilómetro es la unidad estándar en la mayoría del mundo. Esta conversión es útil al viajar, interpretar velocidades en carretera o comparar distancias en mapas.',
    ],
    equivalences: [
      { from: '1 km', to: '0,621371 mi' },
      { from: '5 km', to: '3,10686 mi' },
      { from: '10 km', to: '6,21371 mi' },
      { from: '21,0975 km', to: '13,1094 mi (media maratón)' },
      { from: '42,195 km', to: '26,2188 mi (maratón)' },
      { from: '100 km', to: '62,1371 mi' },
    ],
    faq: [
      {
        q: '¿Cuántas millas son un kilómetro?',
        a: 'Un kilómetro equivale a 0,621371 millas. Para una conversión rápida, puedes dividir los kilómetros entre 1,609.',
      },
      {
        q: '¿Cuál es la fórmula para convertir km a millas?',
        a: 'millas = kilómetros × 0,621371. También puedes usar: millas = kilómetros ÷ 1,609344.',
      },
      {
        q: '¿Es lo mismo milla náutica que milla terrestre?',
        a: 'No. La milla náutica equivale a 1,852 kilómetros (1852 metros), mientras que la milla terrestre equivale a 1,609344 kilómetros (1609,344 metros).',
      },
    ],
    related: ['millas-a-kilometros', 'metros-a-pies', 'cm-a-pulgadas'],
    keywords: ['kilometros a millas', 'km a mi', 'convertir km a millas', 'conversion kilometros millas'],
  },
  {
    slug: 'millas-a-kilometros',
    name: 'Millas a Kilómetros',
    category: 'unidades',
    icon: '📏',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'length', defaultFrom: 'milla', defaultTo: 'kilometro' },
    metaTitle: 'Millas a Kilómetros — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte millas a kilómetros (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis, sin registro, 100% preciso.',
    explanation: [
      'Una milla equivale a 1,609344 kilómetros. Para convertir millas a kilómetros, multiplica el valor en millas por 1,609344. Por ejemplo, 50 mi × 1,609344 = 80,4672 kilómetros.',
      'Esta conversión es muy común al alquilar coches en países que usan millas o al interpretar indicaciones de velocidad en carreteras de Estados Unidos y Reino Unido.',
    ],
    equivalences: [
      { from: '1 mi', to: '1,60934 km' },
      { from: '10 mi', to: '16,0934 km' },
      { from: '26,2188 mi', to: '42,195 km (maratón)' },
      { from: '50 mi', to: '80,4672 km' },
      { from: '100 mi', to: '160,934 km' },
    ],
    faq: [
      {
        q: '¿Cuántos kilómetros son una milla?',
        a: 'Una milla terrestre equivale exactamente a 1,609344 kilómetros, es decir, 1609,344 metros.',
      },
      {
        q: '¿Cuál es la fórmula para convertir millas a km?',
        a: 'kilómetros = millas × 1,609344.',
      },
    ],
    related: ['kilometros-a-millas', 'metros-a-pies', 'cm-a-pulgadas'],
    keywords: ['millas a kilometros', 'mi a km', 'convertir millas a km'],
  },
  {
    slug: 'metros-a-pies',
    name: 'Metros a Pies',
    category: 'unidades',
    icon: '📏',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'length', defaultFrom: 'metro', defaultTo: 'pie' },
    metaTitle: 'Metros a Pies — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte metros a pies (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Un metro equivale a 3,28084 pies. Para convertir metros a pies, multiplica el valor en metros por 3,28084. Por ejemplo, 2 m × 3,28084 = 6,56168 pies.',
      'El pie es una unidad de longitud usada tradicionalmente en países anglosajones, sobre todo para medir la altura de personas y edificios en Estados Unidos.',
    ],
    equivalences: [
      { from: '1 m', to: '3,28084 ft' },
      { from: '1,70 m', to: '5,577 ft' },
      { from: '3 m', to: '9,84252 ft' },
      { from: '10 m', to: '32,8084 ft' },
      { from: '100 m', to: '328,084 ft' },
    ],
    faq: [
      {
        q: '¿Cuántos pies son un metro?',
        a: 'Un metro equivale a 3,28084 pies (aproximadamente 3 pies y 3,37 pulgadas).',
      },
      {
        q: '¿Cuánto mide 1,80 metros en pies?',
        a: '1,80 metros equivalen a 5,90551 pies, es decir, aproximadamente 5 pies y 11 pulgadas.',
      },
    ],
    related: ['kilometros-a-millas', 'cm-a-pulgadas', 'millas-a-kilometros'],
    keywords: ['metros a pies', 'm a ft', 'convertir metros a pies', 'altura metros a pies'],
  },
  {
    slug: 'cm-a-pulgadas',
    name: 'Centímetros a Pulgadas',
    category: 'unidades',
    icon: '📏',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'length', defaultFrom: 'centimetro', defaultTo: 'pulgada' },
    metaTitle: 'Centímetros a Pulgadas — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte centímetros a pulgadas (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Un centímetro equivale a 0,393701 pulgadas. Para convertir centímetros a pulgadas, multiplica el valor en centímetros por 0,393701. Por ejemplo, 30 cm × 0,393701 = 11,811 pulgadas.',
      'La pulgada es una unidad de longitud muy usada en pantallas de televisión, monitores, pantallas de móvil y herramientas en países anglosajones.',
    ],
    equivalences: [
      { from: '1 cm', to: '0,393701 in' },
      { from: '10 cm', to: '3,93701 in' },
      { from: '15 cm', to: '5,90551 in' },
      { from: '30 cm', to: '11,811 in' },
      { from: '100 cm', to: '39,3701 in' },
    ],
    faq: [
      {
        q: '¿Cuántas pulgadas son un centímetro?',
        a: 'Un centímetro equivale a 0,393701 pulgadas. Para una conversión mental rápida, divide los centímetros entre 2,54.',
      },
      {
        q: '¿Cuántos centímetros son una pulgada?',
        a: 'Una pulgada equivale exactamente a 2,54 centímetros.',
      },
      {
        q: '¿Cómo mido una pantalla de 55 pulgadas en centímetros?',
        a: '55 pulgadas × 2,54 = 139,7 centímetros. Esta medida corresponde a la diagonal de la pantalla.',
      },
    ],
    related: ['metros-a-pies', 'kilometros-a-millas', 'millas-a-kilometros'],
    keywords: ['cm a pulgadas', 'centimetros a pulgadas', 'convertir cm a in', 'pantalla pulgadas cm'],
  },

  // ====================================================================
  // UNIDADES — PESO
  // ====================================================================
  {
    slug: 'kilos-a-libras',
    name: 'Kilogramos a Libras',
    category: 'unidades',
    icon: '⚖️',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'weight', defaultFrom: 'kilogramo', defaultTo: 'libra' },
    metaTitle: 'Kilogramos a Libras — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte kilogramos a libras (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Un kilogramo equivale a 2,20462 libras. Para convertir kilogramos a libras, multiplica el valor en kilogramos por 2,20462. Por ejemplo, 70 kg × 2,20462 = 154,324 libras.',
      'La libra es la unidad de masa más usada en Estados Unidos y se utiliza en el gimnasio, en cocina y para pesar el equipaje en aeropuertos de países anglosajones.',
    ],
    equivalences: [
      { from: '1 kg', to: '2,20462 lb' },
      { from: '5 kg', to: '11,0231 lb' },
      { from: '10 kg', to: '22,0462 lb' },
      { from: '50 kg', to: '110,231 lb' },
      { from: '100 kg', to: '220,462 lb' },
    ],
    faq: [
      {
        q: '¿Cuántas libras son un kilo?',
        a: 'Un kilogramo equivale a 2,20462 libras. Para una conversión rápida, multiplica los kilos por 2,2.',
      },
      {
        q: '¿Cuál es la fórmula para convertir kg a libras?',
        a: 'libras = kilogramos × 2,20462.',
      },
      {
        q: '¿Cuánto es 80 kg en libras?',
        a: '80 kg × 2,20462 = 176,37 libras.',
      },
    ],
    related: ['gramos-a-onzas', 'kilometros-a-millas', 'metros-a-pies'],
    keywords: ['kilos a libras', 'kg a lb', 'convertir kilogramos a libras', 'peso kg a libras'],
  },
  {
    slug: 'gramos-a-onzas',
    name: 'Gramos a Onzas',
    category: 'unidades',
    icon: '⚖️',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'weight', defaultFrom: 'gramo', defaultTo: 'onza' },
    metaTitle: 'Gramos a Onzas — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte gramos a onzas (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Un gramo equivale a 0,035274 onzas. Para convertir gramos a onzas, multiplica el valor en gramos por 0,035274. Por ejemplo, 100 g × 0,035274 = 3,5274 onzas.',
      'La onza es muy usada en recetas de cocina de países anglosajones y en la venta de metales preciosos como el oro.',
    ],
    equivalences: [
      { from: '1 g', to: '0,035274 oz' },
      { from: '28,3495 g', to: '1 oz' },
      { from: '100 g', to: '3,5274 oz' },
      { from: '250 g', to: '8,81849 oz' },
      { from: '500 g', to: '17,637 oz' },
      { from: '1000 g', to: '35,274 oz' },
    ],
    faq: [
      {
        q: '¿Cuántas onzas son un gramo?',
        a: 'Un gramo equivale a 0,035274 onzas. Para una conversión rápida, divide los gramos entre 28,35.',
      },
      {
        q: '¿Cuántos gramos son una onza?',
        a: 'Una onza equivale a 28,3495 gramos.',
      },
    ],
    related: ['kilos-a-libras', 'kilometros-a-millas', 'metros-a-pies'],
    keywords: ['gramos a onzas', 'g a oz', 'convertir gramos a onzas', 'cocina gramos onzas'],
  },

  // ====================================================================
  // UNIDADES — TEMPERATURA
  // ====================================================================
  {
    slug: 'celsius-a-fahrenheit',
    name: 'Celsius a Fahrenheit',
    category: 'unidades',
    icon: '🌡️',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'temperature', defaultFrom: 'celsius', defaultTo: 'fahrenheit' },
    metaTitle: 'Celsius a Fahrenheit — Conversor de temperatura gratis | ConversorPro',
    metaDescription:
      'Convierte grados Celsius a Fahrenheit (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Para convertir grados Celsius a Fahrenheit, usa la fórmula: °F = (°C × 9/5) + 32. Por ejemplo, 25 °C × 9/5 + 32 = 77 °F.',
      'La escala Celsius (también llamada centígrada) se usa en la mayoría del mundo, mientras que Fahrenheit se usa en Estados Unidos para el clima, la cocina y la temperatura corporal.',
    ],
    equivalences: [
      { from: '0 °C', to: '32 °F (congelación del agua)' },
      { from: '10 °C', to: '50 °F' },
      { from: '20 °C', to: '68 °F' },
      { from: '25 °C', to: '77 °F' },
      { from: '37 °C', to: '98,6 °F (temperatura corporal)' },
      { from: '100 °C', to: '212 °F (ebullición del agua)' },
    ],
    faq: [
      {
        q: '¿Cuál es la fórmula para convertir Celsius a Fahrenheit?',
        a: '°F = (°C × 9/5) + 32. También puedes usar: °F = °C × 1,8 + 32.',
      },
      {
        q: '¿A cuántos Fahrenheit equivale 0 grados Celsius?',
        a: '0 °C equivale a 32 °F, que es el punto de congelación del agua.',
      },
      {
        q: '¿Qué temperatura corporal normal en Fahrenheit?',
        a: 'La temperatura corporal normal de 37 °C equivale a 98,6 °F.',
      },
    ],
    related: ['fahrenheit-a-celsius', 'celsius-a-kelvin', 'kilometros-a-millas'],
    keywords: ['celsius a fahrenheit', 'centigrados a fahrenheit', 'convertir °C a °F', 'temperatura celsius fahrenheit'],
  },
  {
    slug: 'fahrenheit-a-celsius',
    name: 'Fahrenheit a Celsius',
    category: 'unidades',
    icon: '🌡️',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'temperature', defaultFrom: 'fahrenheit', defaultTo: 'celsius' },
    metaTitle: 'Fahrenheit a Celsius — Conversor de temperatura gratis | ConversorPro',
    metaDescription:
      'Convierte grados Fahrenheit a Celsius (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Para convertir grados Fahrenheit a Celsius, usa la fórmula: °C = (°F − 32) × 5/9. Por ejemplo, (98,6 °F − 32) × 5/9 = 37 °C.',
      'Esta conversión es útil al interpretar recetas americanas, pronósticos del tiempo en Estados Unidos o lecturas de termómetros que usan la escala Fahrenheit.',
    ],
    equivalences: [
      { from: '32 °F', to: '0 °C (congelación del agua)' },
      { from: '50 °F', to: '10 °C' },
      { from: '68 °F', to: '20 °C' },
      { from: '98,6 °F', to: '37 °C (temperatura corporal)' },
      { from: '212 °F', to: '100 °C (ebullición del agua)' },
    ],
    faq: [
      {
        q: '¿Cuál es la fórmula para convertir Fahrenheit a Celsius?',
        a: '°C = (°F − 32) × 5/9. También puedes usar: °C = (°F − 32) / 1,8.',
      },
      {
        q: '¿A cuántos Celsius equivale 100 grados Fahrenheit?',
        a: '100 °F equivale a 37,78 °C, una temperatura muy cálida.',
      },
    ],
    related: ['celsius-a-fahrenheit', 'celsius-a-kelvin', 'kilometros-a-millas'],
    keywords: ['fahrenheit a celsius', '°F a °C', 'convertir fahrenheit a celsius', 'temperatura fahrenheit celsius'],
  },
  {
    slug: 'celsius-a-kelvin',
    name: 'Celsius a Kelvin',
    category: 'unidades',
    icon: '🌡️',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'temperature', defaultFrom: 'celsius', defaultTo: 'kelvin' },
    metaTitle: 'Celsius a Kelvin — Conversor de temperatura gratis | ConversorPro',
    metaDescription:
      'Convierte grados Celsius a Kelvin (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Para convertir grados Celsius a Kelvin, usa la fórmula: K = °C + 273,15. Por ejemplo, 25 °C + 273,15 = 298,15 K.',
      'El kelvin es la unidad de temperatura del Sistema Internacional y se usa en ciencia, física e ingeniería. A diferencia de Celsius y Fahrenheit, el kelvin no lleva el símbolo °.',
    ],
    equivalences: [
      { from: '−273,15 °C', to: '0 K (cero absoluto)' },
      { from: '0 °C', to: '273,15 K' },
      { from: '25 °C', to: '298,15 K' },
      { from: '100 °C', to: '373,15 K' },
    ],
    faq: [
      {
        q: '¿Cuál es la fórmula para convertir Celsius a Kelvin?',
        a: 'K = °C + 273,15. Es una simple suma porque ambas escalas tienen el mismo tamaño de grado.',
      },
      {
        q: '¿Qué es el cero absoluto en Celsius?',
        a: 'El cero absoluto (0 K) equivale a −273,15 °C. Es la temperatura más baja posible teóricamente.',
      },
    ],
    related: ['celsius-a-fahrenheit', 'fahrenheit-a-celsius', 'kilometros-a-millas'],
    keywords: ['celsius a kelvin', '°C a K', 'convertir celsius a kelvin', 'temperatura kelvin'],
  },

  // ====================================================================
  // UNIDADES — VOLUMEN
  // ====================================================================
  {
    slug: 'litros-a-galones',
    name: 'Litros a Galones',
    category: 'unidades',
    icon: '🧊',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'volume', defaultFrom: 'litro', defaultTo: 'galon-us' },
    metaTitle: 'Litros a Galones — Conversor de volumen gratis | ConversorPro',
    metaDescription:
      'Convierte litros a galones (EE.UU. y Reino Unido) y viceversa. Tabla de equivalencias, fórmula y FAQ. Gratis y preciso.',
    explanation: [
      'Un litro equivale a 0,264172 galones estadounidenses. Para convertir litros a galones, multiplica el valor en litros por 0,264172. Por ejemplo, 50 L × 0,264172 = 13,2086 galones.',
      'Existen dos tipos de galón: el galón estadounidense (3,78541 L) y el galón imperial británico (4,54609 L). Este conversor permite usar ambos.',
    ],
    equivalences: [
      { from: '1 L', to: '0,264172 gal (EE.UU.)' },
      { from: '10 L', to: '2,64172 gal (EE.UU.)' },
      { from: '3,78541 L', to: '1 gal (EE.UU.)' },
      { from: '4,54609 L', to: '1 gal (Reino Unido)' },
      { from: '50 L', to: '13,2086 gal (EE.UU.)' },
      { from: '100 L', to: '26,4172 gal (EE.UU.)' },
    ],
    faq: [
      {
        q: '¿Cuántos litros son un galón?',
        a: 'Un galón estadounidense equivale a 3,78541 litros. Un galón imperial (Reino Unido) equivale a 4,54609 litros.',
      },
      {
        q: '¿Cuál es la diferencia entre galón US y galón UK?',
        a: 'El galón estadounidense equivale a 3,78541 litros, mientras que el galón imperial británico equivale a 4,54609 litros. Siempre especifica cuál usas.',
      },
    ],
    related: ['kilometros-a-millas', 'kilos-a-libras', 'metros-a-pies'],
    keywords: ['litros a galones', 'L a gal', 'convertir litros a galones', 'volumen litros galones'],
  },

  // ====================================================================
  // UNIDADES — VELOCIDAD
  // ====================================================================
  {
    slug: 'kmh-a-mph',
    name: 'km/h a mph',
    category: 'unidades',
    icon: '🚗',
    color: '#3b82f6',
    widget: 'unit-converter',
    widgetConfig: { unitCategory: 'speed', defaultFrom: 'kmh', defaultTo: 'mph' },
    metaTitle: 'km/h a mph — Conversor de velocidad gratis | ConversorPro',
    metaDescription:
      'Convierte kilómetros por hora a millas por hora (y viceversa) al instante. Tabla de equivalencias, fórmula y FAQ.',
    explanation: [
      'Un kilómetro por hora equivale a 0,621371 millas por hora. Para convertir km/h a mph, multiplica el valor por 0,621371. Por ejemplo, 120 km/h × 0,621371 = 74,5645 mph.',
      'Esta conversión es muy común al conducir en países con diferentes límites de velocidad o al interpretar la velocidad de un coche importado.',
    ],
    equivalences: [
      { from: '1 km/h', to: '0,621371 mph' },
      { from: '50 km/h', to: '31,0686 mph' },
      { from: '90 km/h', to: '55,9234 mph' },
      { from: '100 km/h', to: '62,1371 mph' },
      { from: '120 km/h', to: '74,5645 mph' },
    ],
    faq: [
      {
        q: '¿Cuántos mph son 100 km/h?',
        a: '100 km/h equivalen a 62,1371 mph. Para una conversión rápida, divide los km/h entre 1,609.',
      },
      {
        q: '¿Cuál es la fórmula para convertir km/h a mph?',
        a: 'mph = km/h × 0,621371. También: mph = km/h ÷ 1,609344.',
      },
    ],
    related: ['kilometros-a-millas', 'millas-a-kilometros', 'celsius-a-fahrenheit'],
    keywords: ['kmh a mph', 'km/h a mph', 'convertir km/h a mph', 'velocidad km/h mph'],
  },

  // ====================================================================
  // DIVISAS
  // ====================================================================
  {
    slug: 'euros-a-dolares',
    name: 'Euros a Dólares',
    category: 'divisas',
    icon: '💱',
    color: '#22c55e',
    widget: 'currency-converter',
    widgetConfig: { defaultFrom: 'EUR', defaultTo: 'USD' },
    metaTitle: 'Euros a Dólares (EUR → USD) — Conversor de divisa en vivo | ConversorPro',
    metaDescription:
      'Convierte euros a dólares estadounidenses con tasas de cambio en tiempo real. Gratis, rápido y actualizado. Tabla y FAQ.',
    explanation: [
      'El euro (EUR) es la moneda oficial de 20 países de la Eurozona. El dólar estadounidense (USD) es la moneda más usada en el comercio internacional. El tipo de cambio entre ambas fluctúa constantemente según el mercado de divisas.',
      'Este conversor usa tasas de cambio en tiempo real obtenidas de APIs públicas y se actualizan periódicamente. Para transacciones reales, consulta siempre con tu banco, ya que aplican un margen o comisión.',
    ],
    equivalences: [
      { from: '1 EUR', to: '≈ 1,08 USD (aproximado)' },
      { from: '10 EUR', to: '≈ 10,80 USD' },
      { from: '50 EUR', to: '≈ 54 USD' },
      { from: '100 EUR', to: '≈ 108 USD' },
      { from: '500 EUR', to: '≈ 540 USD' },
      { from: '1000 EUR', to: '≈ 1080 USD' },
    ],
    faq: [
      {
        q: '¿La tasa de cambio es exacta?',
        a: 'Las tasas se obtienen de APIs públicas de tipo de cambio (exchangerate.host, frankfurter.app) y se actualizan periódicamente. Son orientativas; tu banco puede aplicar un margen.',
      },
      {
        q: '¿Cada cuánto se actualiza la tasa?',
        a: 'El servidor cachea las tasas durante varias horas para no saturar la API. El resultado muestra la fecha y hora de la última actualización.',
      },
      {
        q: '¿Puedo convertir otras monedas?',
        a: 'Sí. Visita nuestro conversor de divisas general para ver todas las monedas disponibles.',
      },
    ],
    related: ['dolares-a-euros', 'conversor-divisas', 'libras-a-euros'],
    keywords: ['euros a dolares', 'EUR a USD', 'convertir euros a dolares', 'cambio euro dolar'],
  },
  {
    slug: 'dolares-a-euros',
    name: 'Dólares a Euros',
    category: 'divisas',
    icon: '💱',
    color: '#22c55e',
    widget: 'currency-converter',
    widgetConfig: { defaultFrom: 'USD', defaultTo: 'EUR' },
    metaTitle: 'Dólares a Euros (USD → EUR) — Conversor de divisa en vivo | ConversorPro',
    metaDescription:
      'Convierte dólares estadounidenses a euros con tasas de cambio en tiempo real. Gratis, rápido y actualizado. Tabla y FAQ.',
    explanation: [
      'El dólar estadounidense (USD) es la moneda más utilizada en transacciones internacionales. El euro (EUR) es la moneda de la Eurozona. El tipo de cambio fluctúa según el mercado FOREX.',
      'Usa este conversor para saber cuántos euros recibes por tus dólares al tipo de cambio actual del mercado. Recuerda que los bancos y casas de cambio aplican comisiones.',
    ],
    equivalences: [
      { from: '1 USD', to: '≈ 0,93 EUR (aproximado)' },
      { from: '10 USD', to: '≈ 9,30 EUR' },
      { from: '50 USD', to: '≈ 46,50 EUR' },
      { from: '100 USD', to: '≈ 93 EUR' },
      { from: '1000 USD', to: '≈ 930 EUR' },
    ],
    faq: [
      {
        q: '¿Cuántos euros son 100 dólares?',
        a: 'Depende del tipo de cambio actual. El conversor muestra el valor exacto con la tasa más reciente disponible.',
      },
      {
        q: '¿Por qué el resultado difiere de lo que me da el banco?',
        a: 'Los bancos y casas de cambio aplican un margen o comisión sobre el tipo de cambio interbancario. Nuestro conversor muestra el tipo de cambio de mercado puro.',
      },
    ],
    related: ['euros-a-dolares', 'conversor-divisas', 'libras-a-euros'],
    keywords: ['dolares a euros', 'USD a EUR', 'convertir dolares a euros', 'cambio dolar euro'],
  },
  {
    slug: 'conversor-divisas',
    name: 'Conversor de Divisas',
    category: 'divisas',
    icon: '💱',
    color: '#22c55e',
    widget: 'currency-converter',
    widgetConfig: { defaultFrom: 'EUR', defaultTo: 'USD' },
    metaTitle: 'Conversor de Divisas en Tiempo Real — Gratis | ConversorPro',
    metaDescription:
      'Convierte entre euros, dólares, libras, yenes y más con tasas de cambio en tiempo real. Gratis, rápido y sin registro.',
    explanation: [
      'Este conversor de divisas te permite cambiar entre las principales monedas del mundo usando tasas de cambio en tiempo real obtenidas de APIs financieras públicas.',
      'Soporta EUR (euro), USD (dólar estadounidense), GBP (libra esterlina), JPY (yen japonés), CHF (franco suizo), CAD (dólar canadiense), AUD (dólar australiano), MXN (peso mexicano) y más.',
    ],
    equivalences: [
      { from: 'EUR → USD', to: '≈ 1,08' },
      { from: 'EUR → GBP', to: '≈ 0,85' },
      { from: 'USD → JPY', to: '≈ 150' },
      { from: 'GBP → EUR', to: '≈ 1,18' },
      { from: 'EUR → MXN', to: '≈ 19' },
    ],
    faq: [
      {
        q: '¿Las tasas son en tiempo real?',
        a: 'Sí. Se obtienen de APIs públicas (exchangerate.host, frankfurter.app) con un sistema de caché de varias horas para optimizar el rendimiento.',
      },
      {
        q: '¿Qué monedas puedo convertir?',
        a: 'Soportamos las principales monedas: EUR, USD, GBP, JPY, CHF, CAD, AUD, MXN, ARS, BRL, CNY, INR y más.',
      },
    ],
    related: ['euros-a-dolares', 'dolares-a-euros', 'libras-a-euros'],
    keywords: ['conversor de divisas', 'conversor moneda', 'cambio de moneda', 'tipo de cambio'],
  },
  {
    slug: 'libras-a-euros',
    name: 'Libras a Euros',
    category: 'divisas',
    icon: '💱',
    color: '#22c55e',
    widget: 'currency-converter',
    widgetConfig: { defaultFrom: 'GBP', defaultTo: 'EUR' },
    metaTitle: 'Libras a Euros (GBP → EUR) — Conversor de divisa en vivo | ConversorPro',
    metaDescription:
      'Convierte libras esterlinas a euros con tasas de cambio en tiempo real. Gratis, rápido y actualizado.',
    explanation: [
      'La libra esterlina (GBP) es la moneda del Reino Unido. El euro (EUR) es la moneda de la Eurozona. Tras el Brexit, el tipo de cambio entre ambas ha sido especialmente volátil.',
      'Usa este conversor para saber cuántos euros recibes por tus libras al tipo de cambio actual del mercado.',
    ],
    equivalences: [
      { from: '1 GBP', to: '≈ 1,18 EUR (aproximado)' },
      { from: '10 GBP', to: '≈ 11,80 EUR' },
      { from: '50 GBP', to: '≈ 59 EUR' },
      { from: '100 GBP', to: '≈ 118 EUR' },
    ],
    faq: [
      {
        q: '¿Cuántos euros son 100 libras?',
        a: 'Depende del tipo de cambio actual. Usa el conversor para obtener el valor exacto con la tasa más reciente.',
      },
    ],
    related: ['euros-a-dolares', 'dolares-a-euros', 'conversor-divisas'],
    keywords: ['libras a euros', 'GBP a EUR', 'convertir libras a euros', 'cambio libra euro'],
  },

  // ====================================================================
  // ARCHIVOS — IMAGEN
  // ====================================================================
  {
    slug: 'png-a-jpg',
    name: 'PNG a JPG',
    category: 'archivos',
    icon: '🖼️',
    color: '#f97316',
    widget: 'png-to-jpg',
    metaTitle: 'PNG a JPG — Conversor de imagen online gratis | ConversorPro',
    metaDescription:
      'Convierte imágenes PNG a JPG en tu navegador. Sin subir archivos, 100% privado. Control de calidad. Gratis y sin registro.',
    explanation: [
      'Convierte imágenes PNG a formato JPG directamente en tu navegador, sin necesidad de instalar software ni subir tus archivos a ningún servidor. El procesamiento es 100% local para garantizar tu privacidad.',
      'El formato PNG soporta transparencias, pero sus archivos son más pesados. Al convertir a JPG, las transparencias se aplanan sobre fondo blanco y el archivo resultante es mucho más ligero. JPG es ideal para fotografías en webs y redes sociales.',
    ],
    equivalences: [
      { from: 'PNG (con transparencia)', to: 'JPG (fondo blanco)' },
      { from: 'PNG ~2 MB', to: 'JPG ~300 KB (calidad 90)' },
      { from: 'PNG ~5 MB', to: 'JPG ~700 KB (calidad 90)' },
    ],
    faq: [
      {
        q: '¿Se suben mis imágenes a un servidor?',
        a: 'No. La conversión se realiza enteramente en tu navegador usando Canvas API. Tus imágenes nunca salen de tu dispositivo.',
      },
      {
        q: '¿Qué pasa con la transparencia del PNG?',
        a: 'El formato JPG no soporta transparencia. Las áreas transparentes se rellenan con fondo blanco automáticamente.',
      },
      {
        q: '¿Puedo ajustar la calidad del JPG?',
        a: 'Sí. El conversor permite ajustar la calidad de 1 a 100. Un valor de 85-90 ofrece un buen equilibrio entre calidad y tamaño.',
      },
    ],
    related: ['imagen-a-webp', 'comprimir-imagen', 'imagenes-a-pdf'],
    keywords: ['png a jpg', 'convertir png a jpg', 'imagen png a jpg online', 'cambiar formato png a jpg'],
  },
  {
    slug: 'imagen-a-webp',
    name: 'Imagen a WebP',
    category: 'archivos',
    icon: '🎨',
    color: '#f97316',
    widget: 'image-to-webp',
    metaTitle: 'Imagen a WebP — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte cualquier imagen (PNG, JPG) a WebP, el formato moderno que pesa 25-35% menos. 100% en tu navegador, privado.',
    explanation: [
      'WebP es un formato de imagen moderno desarrollado por Google que ofrece una compresión superior a PNG y JPG, manteniendo la misma calidad visual. Las imágenes WebP pesan entre un 25% y un 35% menos.',
      'Usa este conversor para optimizar las imágenes de tu web y mejorar los Core Web Vitals (LCP). Todos los navegadores modernos soportan WebP.',
    ],
    equivalences: [
      { from: 'PNG ~2 MB', to: 'WebP ~400 KB (calidad 85)' },
      { from: 'JPG ~1 MB', to: 'WebP ~700 KB (calidad 85)' },
      { from: 'JPG ~500 KB', to: 'WebP ~350 KB (calidad 85)' },
    ],
    faq: [
      {
        q: '¿Qué navegadores soportan WebP?',
        a: 'Todos los navegadores modernos (Chrome, Firefox, Safari, Edge) soportan WebP. Internet Explorer no lo soporta.',
      },
      {
        q: '¿WebP soporta transparencia?',
        a: 'Sí, WebP soporta tanto transparencia (canal alpha) como animación, a diferencia de JPG.',
      },
    ],
    related: ['png-a-jpg', 'comprimir-imagen', 'imagenes-a-pdf'],
    keywords: ['imagen a webp', 'convertir a webp', 'png a webp', 'jpg a webp', 'optimizar imagenes web'],
  },
  {
    slug: 'comprimir-imagen',
    name: 'Comprimir Imagen',
    category: 'archivos',
    icon: '🗜️',
    color: '#f97316',
    widget: 'compress-image',
    metaTitle: 'Comprimir Imagen Online — Reducir tamaño JPG/PNG gratis | ConversorPro',
    metaDescription:
      'Reduce el tamaño de tus imágenes JPG y PNG sin perder calidad visible. 100% en tu navegador, privado y gratis.',
    explanation: [
      'Comprime imágenes JPG y PNG reduciendo su tamaño de archivo sin perder resolución. Ajusta el nivel de compresión para encontrar el equilibrio perfecto entre calidad y peso.',
      'Las imágenes más ligeras cargan más rápido, mejorando el SEO y la experiencia de usuario. Usa esta herramienta antes de subir imágenes a tu web o enviarlas por email.',
    ],
    equivalences: [
      { from: 'JPG 2 MB (calidad 100)', to: 'JPG 400 KB (calidad 60) — 80% menos' },
      { from: 'PNG 5 MB', to: 'JPG 500 KB (calidad 70) — 90% menos' },
    ],
    faq: [
      {
        q: '¿La compresión reduce la resolución?',
        a: 'No. La compresión ajusta la calidad de codificación (quantization) pero mantiene las dimensiones originales (píxeles) de la imagen.',
      },
      {
        q: '¿Qué nivel de calidad recomiendo?',
        a: 'Para fotos web, calidad 60-70 suele ser suficiente. Para imágenes con texto o líneas finas, usa 80+ para evitar artefactos.',
      },
    ],
    related: ['png-a-jpg', 'imagen-a-webp', 'comprimir-pdf'],
    keywords: ['comprimir imagen', 'reducir tamaño imagen', 'optimizar imagen online', 'comprimir jpg'],
  },

  // ====================================================================
  // ARCHIVOS — PDF
  // ====================================================================
  {
    slug: 'imagenes-a-pdf',
    name: 'Imágenes a PDF',
    category: 'archivos',
    icon: '📄',
    color: '#f97316',
    widget: 'image-to-pdf',
    metaTitle: 'Imágenes a PDF — Convertir JPG/PNG a PDF online gratis | ConversorPro',
    metaDescription:
      'Combina una o varias imágenes (JPG, PNG) en un único PDF. 100% en tu navegador, privado y gratis. Sin registro.',
    explanation: [
      'Convierte una o varias imágenes en un documento PDF. Cada imagen se coloca en una página A4 centrada y optimizada. El procesamiento es 100% local en tu navegador.',
      'Es ideal para escanear documentos con el móvil y convertirlos en un PDF único, o para crear un portfolio a partir de varias fotos.',
    ],
    equivalences: [
      { from: '1 imagen JPG', to: '1 página PDF' },
      { from: '5 imágenes', to: 'PDF de 5 páginas' },
      { from: '10 imágenes', to: 'PDF de 10 páginas' },
    ],
    faq: [
      {
        q: '¿Se suben mis imágenes a un servidor?',
        a: 'No. Todo el procesamiento ocurre en tu navegador usando la librería jsPDF. Tus imágenes no salen de tu dispositivo.',
      },
      {
        q: '¿Qué tamaño de página usa el PDF?',
        a: 'Las páginas son A4 (210 × 297 mm) y las imágenes se centran manteniendo su proporción.',
      },
    ],
    related: ['pdf-a-imagenes', 'comprimir-pdf', 'png-a-jpg'],
    keywords: ['imagenes a pdf', 'jpg a pdf', 'png a pdf', 'convertir imagenes a pdf', 'fotos a pdf'],
  },
  {
    slug: 'pdf-a-imagenes',
    name: 'PDF a Imágenes',
    category: 'archivos',
    icon: '🖼️',
    color: '#f97316',
    widget: 'pdf-to-images',
    metaTitle: 'PDF a Imágenes — Convertir PDF a PNG/JPG online gratis | ConversorPro',
    metaDescription:
      'Extrae cada página de un PDF como imagen PNG de alta resolución. 100% en tu navegador, privado y gratis.',
    explanation: [
      'Convierte cada página de un documento PDF en una imagen PNG de alta resolución. El procesamiento es 100% local usando PDF.js.',
      'Es útil para extraer gráficos, compartir páginas individuales de un PDF o para incrustar contenido de un PDF en una presentación.',
    ],
    equivalences: [
      { from: 'PDF de 10 páginas', to: '10 imágenes PNG' },
      { from: 'PDF de 1 página', to: '1 imagen PNG (alta resolución)' },
    ],
    faq: [
      {
        q: '¿Qué resolución tienen las imágenes?',
        a: 'Las páginas se renderizan a 2x de resolución (scale 2.0) para asegurar nitidez en pantalla e impresión.',
      },
      {
        q: '¿Puedo descargar todas las páginas a la vez?',
        a: 'Sí. El conversor genera un enlace de descarga por cada página del PDF.',
      },
    ],
    related: ['imagenes-a-pdf', 'comprimir-pdf', 'comprimir-imagen'],
    keywords: ['pdf a imagenes', 'pdf a png', 'pdf a jpg', 'extraer paginas pdf', 'convertir pdf a imagen'],
  },
  {
    slug: 'comprimir-pdf',
    name: 'Comprimir PDF',
    category: 'archivos',
    icon: '🗜️',
    color: '#f97316',
    widget: 'compress-pdf',
    metaTitle: 'Comprimir PDF Online — Reducir tamaño PDF gratis | ConversorPro',
    metaDescription:
      'Reduce el tamaño de tus PDFs eliminando metadatos innecesarios y optimizando la estructura. 100% en tu navegador, privado.',
    explanation: [
      'Comprime documentos PDF eliminando metadatos innecesarios (autor, título, asunto) y activando ObjectStreams para optimizar la estructura del archivo. El procesamiento es 100% local.',
      'Para una compresión más agresiva de PDFs con muchas imágenes, considera comprimir primero las imágenes individualmente con nuestra herramienta de compresión de imágenes.',
    ],
    equivalences: [
      { from: 'PDF con metadatos', to: 'PDF optimizado (sin metadatos)' },
      { from: 'PDF 10 MB', to: 'PDF ~9,5 MB (optimización estructural)' },
    ],
    faq: [
      {
        q: '¿Cuánto se reduce el tamaño del PDF?',
        a: 'Depende del contenido. La eliminación de metadatos y ObjectStreams suele dar un 5-15% de reducción. PDFs con muchas imágenes pueden requerir compresión de las imágenes primero.',
      },
      {
        q: '¿Se mantiene la calidad del PDF?',
        a: 'Sí. La compresión no altera el contenido visible (texto, imágenes, gráficos). Solo elimina metadatos y optimiza la estructura interna.',
      },
    ],
    related: ['comprimir-imagen', 'pdf-a-imagenes', 'imagenes-a-pdf'],
    keywords: ['comprimir pdf', 'reducir tamaño pdf', 'optimizar pdf online', 'pdf mas ligero'],
  },

  // ====================================================================
  // TEXTO Y DATOS
  // ====================================================================
  {
    slug: 'mayusculas-a-minusculas',
    name: 'Mayúsculas a Minúsculas',
    category: 'texto',
    icon: '🔤',
    color: '#06b6d4',
    widget: 'case-converter',
    metaTitle: 'Mayúsculas a Minúsculas — Conversor de texto online gratis | ConversorPro',
    metaDescription:
      'Convierte texto entre mayúsculas, minúsculas, Title Case, camelCase y más. 100% en tu navegador, gratis y sin registro.',
    explanation: [
      'Convierte texto entre diferentes formatos de mayúsculas y minúsculas: MINÚSCULAS, MAYÚSCULAS, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case y CONSTANT_CASE.',
      'El procesamiento es instantáneo y 100% local en tu navegador. El texto no se envía a ningún servidor.',
    ],
    equivalences: [
      { from: 'hola mundo', to: 'HOLA MUNDO (mayúsculas)' },
      { from: 'hola mundo', to: 'Hola Mundo (Title Case)' },
      { from: 'Hola Mundo', to: 'hola mundo (minúsculas)' },
      { from: 'hola mundo', to: 'holaMundo (camelCase)' },
    ],
    faq: [
      {
        q: '¿Se guarda mi texto en algún servidor?',
        a: 'No. La conversión se hace enteramente en tu navegador. Tu texto no se envía ni se almacena en ningún servidor.',
      },
      {
        q: '¿Qué formatos de caso soporta?',
        a: 'Soporta: mayúsculas, minúsculas, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case y CONSTANT_CASE.',
      },
    ],
    related: ['contador-palabras', 'json-a-csv', 'celsius-a-fahrenheit'],
    keywords: ['mayusculas a minusculas', 'convertir texto a mayusculas', 'title case', 'camelCase', 'conversor de texto'],
  },
  {
    slug: 'contador-palabras',
    name: 'Contador de Palabras',
    category: 'texto',
    icon: '🔢',
    color: '#06b6d4',
    widget: 'word-counter',
    metaTitle: 'Contador de Palabras y Caracteres Online — Gratis | ConversorPro',
    metaDescription:
      'Cuenta palabras, caracteres, oraciones, párrafos y tiempo de lectura estimado. 100% en tu navegador, gratis y sin registro.',
    explanation: [
      'Cuenta el número de palabras, caracteres (con y sin espacios), oraciones, párrafos y estima el tiempo de lectura a una velocidad de 250 palabras por minuto.',
      'Es una herramienta esencial para escritores, estudiantes, redactores SEO y autores que necesitan cumplir con límites de extensión.',
    ],
    equivalences: [
      { from: '1 página A4', to: '≈ 250-500 palabras' },
      { from: '1 minuto lectura', to: '≈ 250 palabras' },
      { from: 'Post de blog', to: '≈ 1000-2000 palabras' },
    ],
    faq: [
      {
        q: '¿Cómo se cuentan las palabras?',
        a: 'Se dividen los espacios en blanco y se cuentan los fragmentos resultantes. Los signos de puntuación no se cuentan como palabras independientes.',
      },
      {
        q: '¿El tiempo de lectura es preciso?',
        a: 'Se estima a 250 palabras por minuto, que es la velocidad media de lectura en silencio. La lectura en voz alta es más lenta (130-150 ppm).',
      },
    ],
    related: ['mayusculas-a-minusculas', 'json-a-csv', 'celsius-a-fahrenheit'],
    keywords: ['contador de palabras', 'contar palabras', 'contador caracteres', 'palabras y caracteres', 'tiempo de lectura'],
  },
  {
    slug: 'json-a-csv',
    name: 'JSON a CSV',
    category: 'texto',
    icon: '🔤',
    color: '#06b6d4',
    widget: 'json-csv',
    metaTitle: 'JSON a CSV (y CSV a JSON) — Conversor online gratis | ConversorPro',
    metaDescription:
      'Convierte datos JSON a formato CSV y viceversa. 100% en tu navegador, gratis. Ideal para desarrolladores y análisis de datos.',
    explanation: [
      'Convierte un array JSON de objetos a formato CSV (Comma-Separated Values) y viceversa. Las comas y comillas en los valores se escapan correctamente según el estándar RFC 4180.',
      'El formato CSV es ideal para importar datos en Excel, Google Sheets u otras hojas de cálculo, mientras que JSON es más usado en programación y APIs.',
    ],
    equivalences: [
      { from: 'JSON: [{"a":1,"b":2}]', to: 'CSV: a,b\\n1,2' },
      { from: 'JSON: array de 100 objetos', to: 'CSV: 101 filas (cabecera + datos)' },
    ],
    faq: [
      {
        q: '¿Qué estructura de JSON se necesita para CSV?',
        a: 'El JSON debe ser un array de objetos con la misma estructura: [{"clave1": "valor1", "clave2": "valor2"}, ...]. Las claves se convierten en cabeceras del CSV.',
      },
      {
        q: '¿Se manejan comas y comillas en los datos?',
        a: 'Sí. Los valores que contienen comas, comillas o saltos de línea se encierran entre comillas dobles y las comillas internas se duplican, según el estándar RFC 4180.',
      },
    ],
    related: ['mayusculas-a-minusculas', 'contador-palabras', 'celsius-a-fahrenheit'],
    keywords: ['json a csv', 'csv a json', 'convertir json a csv', 'json to csv', 'formato datos'],
  },
];

// ====================================================================
// HELPERS
// ====================================================================

export const CONVERTERS_BY_SLUG: Record<string, Converter> = Object.fromEntries(
  CONVERTERS.map((c) => [c.slug, c])
);

export function getConverter(slug: string): Converter | undefined {
  return CONVERTERS_BY_SLUG[slug];
}

export function getRelatedConverters(slug: string, limit = 6): Converter[] {
  const converter = getConverter(slug);
  if (!converter) return [];
  const related = converter.related
    .map((s) => getConverter(s))
    .filter((c): c is Converter => c !== undefined);
  // Si no hay suficientes relacionados, añadir de la misma categoría
  if (related.length < limit) {
    const sameCategory = CONVERTERS.filter(
      (c) => c.category === converter.category && c.slug !== slug && !related.includes(c)
    );
    return [...related, ...sameCategory].slice(0, limit);
  }
  return related.slice(0, limit);
}

export function getConvertersByCategory(category: ConverterCategory): Converter[] {
  return CONVERTERS.filter((c) => c.category === category);
}

export function getAllSlugs(): string[] {
  return CONVERTERS.map((c) => c.slug);
}
