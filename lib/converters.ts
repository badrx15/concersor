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
  | 'json-csv'
  | 'pdf-tools'
  | 'document-converter'
  | 'age-calculator'
  | 'qr-generator'
  | 'timezone-converter'
  | 'numbers-to-words'
  | 'dev-tools'
  | 'barcode-generator'
  | 'utility-tools';

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
    keywords: ['kilometros a millas', 'km a mi', 'convertir km a millas', 'conversion kilometros millas', 'pasar km a millas', 'cuantas millas son 1 km', 'distancia km a mi', 'calcular millas', 'kilometros a millas calculadora', 'tabla km a millas'],
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
    keywords: ['millas a kilometros', 'mi a km', 'convertir millas a km', 'pasar millas a km', 'cuantos km son 1 milla', 'distancia millas a km', 'calcular kilometros desde millas', 'millas a km calculadora', 'tabla millas a km'],
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
    keywords: ['metros a pies', 'm a ft', 'convertir metros a pies', 'altura metros a pies', 'pasar metros a pies', 'cuantos pies son 1 metro', 'altura en pies', 'metros a pies y pulgadas', 'calculadora altura pies', 'tabla metros a pies'],
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
    keywords: ['cm a pulgadas', 'centimetros a pulgadas', 'convertir cm a in', 'pantalla pulgadas cm', 'pasar cm a pulgadas', 'cuantas pulgadas son 1 cm', 'medir pantalla pulgadas', 'cm a pulgadas calculadora', 'tabla centimetros pulgadas'],
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
    keywords: ['kilos a libras', 'kg a lb', 'convertir kilogramos a libras', 'peso kg a libras', 'pasar kg a libras', 'cuantas libras son 1 kilo', 'peso en libras', 'kg a lbs calculadora', 'convertir peso kg lb', 'tabla kilos libras'],
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
    keywords: ['gramos a onzas', 'g a oz', 'convertir gramos a onzas', 'cocina gramos onzas', 'pasar gramos a onzas', 'cuantas onzas son 100 gramos', 'recetas onzas gramos', 'gramos a onzas calculadora', 'medidas cocina onzas'],
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
    keywords: ['celsius a fahrenheit', 'centigrados a fahrenheit', 'convertir °C a °F', 'temperatura celsius fahrenheit', 'pasar celsius a fahrenheit', 'formula celsius fahrenheit', 'cuantos fahrenheit son 30 grados', 'temperatura corporal fahrenheit', 'tabla celsius fahrenheit', 'convertir temperatura'],
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
    keywords: ['fahrenheit a celsius', '°F a °C', 'convertir fahrenheit a celsius', 'temperatura fahrenheit celsius', 'pasar fahrenheit a celsius', 'formula fahrenheit celsius', '98.6 fahrenheit a celsius', 'fahrenheit a centigrados', 'tabla fahrenheit celsius', 'convertir fahrenheit'],
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
    keywords: ['celsius a kelvin', '°C a K', 'convertir celsius a kelvin', 'temperatura kelvin', 'pasar celsius a kelvin', 'formula celsius kelvin', 'cero absoluto celsius', 'kelvin a celsius', 'temperatura cientifica'],
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
    keywords: ['litros a galones', 'L a gal', 'convertir litros a galones', 'volumen litros galones', 'pasar litros a galones', 'galon americano', 'cuantos galones son 1 litro', 'convertir volumen', 'tabla litros galones'],
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
    keywords: ['kmh a mph', 'km/h a mph', 'convertir km/h a mph', 'velocidad km/h mph', 'pasar kmh a mph', '100 kmh a mph', '120 kmh a mph', 'convertir velocidad', 'tabla kmh mph'],
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
    keywords: ['euros a dolares', 'EUR a USD', 'convertir euros a dolares', 'cambio euro dolar', 'pasar euros a dolares', 'cuantos dolares son 100 euros', 'euro dolar hoy', 'cotizacion euro dolar', 'tipo de cambio euro dolar', 'calculadora euros dolares'],
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
    keywords: ['dolares a euros', 'USD a EUR', 'convertir dolares a euros', 'cambio dolar euro', 'pasar dolares a euros', 'cuantos euros son 100 dolares', 'dolar euro hoy', 'cotizacion dolar euro', 'calculadora dolares euros'],
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
    keywords: ['conversor de divisas', 'conversor moneda', 'cambio de moneda', 'tipo de cambio', 'convertir divisas', 'conversor moneda internacional', 'cambio de divisas hoy', 'calculadora divisas', 'cotizacion monedas', 'todas las divisas'],
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
    keywords: ['libras a euros', 'GBP a EUR', 'convertir libras a euros', 'cambio libra euro', 'pasar libras a euros', 'cuantos euros son 100 libras', 'libra esterlina a euro', 'cotizacion libra euro', 'calculadora libras euros'],
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
    keywords: ['png a jpg', 'convertir png a jpg', 'imagen png a jpg online', 'cambiar formato png a jpg', 'pasar png a jpg', 'png a jpg sin perder calidad', 'convertir imagen png', 'png a jpg online gratis', 'formato imagen png jpg'],
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
    keywords: ['imagen a webp', 'convertir a webp', 'png a webp', 'jpg a webp', 'optimizar imagenes web', 'pasar imagen a webp', 'webp a png', 'webp a jpg', 'formato webp', 'convertir webp', 'optimizar web vitals'],
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
    keywords: ['comprimir imagen', 'reducir tamaño imagen', 'optimizar imagen online', 'comprimir jpg', 'comprimir png', 'reducir peso imagen', 'imagen mas ligera', 'comprimir imagen sin perder calidad', 'optimizar fotos web'],
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
    keywords: ['imagenes a pdf', 'jpg a pdf', 'png a pdf', 'convertir imagenes a pdf', 'fotos a pdf', 'pasar fotos a pdf', 'crear pdf desde imagenes', 'escaneo a pdf', 'varias imagenes a pdf', 'documento fotos pdf'],
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
    keywords: ['pdf a imagenes', 'pdf a png', 'pdf a jpg', 'extraer paginas pdf', 'convertir pdf a imagen', 'pasar pdf a imagenes', 'pdf a fotos', 'extraer graficos pdf', 'cada pagina pdf como imagen'],
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
    keywords: ['comprimir pdf', 'reducir tamaño pdf', 'optimizar pdf online', 'pdf mas ligero', 'comprimir pdf sin perder calidad', 'reducir peso pdf', 'pdf comprimido', 'comprimir pdf gratis', 'disminuir tamaño pdf'],
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
    keywords: ['mayusculas a minusculas', 'convertir texto a mayusculas', 'title case', 'camelCase', 'conversor de texto', 'minusculas a mayusculas', 'pascal case', 'snake case', 'kebab case', 'constant case', 'convertir texto online', 'cambiar mayusculas'],
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
    keywords: ['contador de palabras', 'contar palabras', 'contador caracteres', 'palabras y caracteres', 'tiempo de lectura', 'contar oraciones', 'contar parrafos', 'analizar texto', 'longitud texto', 'contador letras', 'estadisticas texto'],
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
    keywords: ['json a csv', 'csv a json', 'convertir json a csv', 'json to csv', 'formato datos', 'formatear json', 'validar json', 'pretty print json', 'csv a excel', 'convertir datos', 'json to excel'],
  },

  // ====================================================================
  // ARCHIVOS — PDF TOOLS (nuevos, con pdf-lib)
  // ====================================================================
  {
    slug: 'unir-pdf',
    name: 'Unir PDF',
    category: 'archivos',
    icon: '📄',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'merge' },
    metaTitle: 'Unir PDF — Juntar varios PDFs online gratis | ConversorPro',
    metaDescription:
      'Une varios archivos PDF en uno solo. Gratis, rápido y 100% en tu navegador. Sin límite de archivos ni registro.',
    explanation: [
      'Combina múltiples documentos PDF en un único archivo. Selecciona todos los PDFs que quieras unir y el conversor los fusionará en el orden que los hayas seleccionado.',
      'El procesamiento es 100% local en tu navegador usando pdf-lib. Tus documentos nunca se suben a ningún servidor, garantizando la privacidad total de tus datos.',
    ],
    equivalences: [
      { from: '2 PDFs', to: '1 PDF fusionado' },
      { from: '5 PDFs', to: '1 PDF con 5 documentos' },
      { from: '10 PDFs', to: '1 PDF con 10 documentos' },
    ],
    faq: [
      { q: '¿Se suben mis PDFs a un servidor?', a: 'No. La fusión se realiza enteramente en tu navegador usando la librería pdf-lib. Tus archivos nunca salen de tu dispositivo.' },
      { q: '¿Hay límite de archivos?', a: 'No hay límite fijo, pero el rendimiento depende de la memoria de tu navegador. Para documentos muy grandes, recomendamos unir de 10 en 10.' },
      { q: '¿Se mantiene el orden de las páginas?', a: 'Sí, los PDFs se fusionan en el orden exacto en que los selecciones. Si necesitas reordenar, usa antes nuestra herramienta Reordenar PDF.' },
    ],
    related: ['dividir-pdf', 'comprimir-pdf', 'imagenes-a-pdf'],
    keywords: ['unir pdf', 'fusionar pdf', 'combinar pdf', 'juntar pdfs online', 'merge pdf', 'unir pdfs gratis', 'combinar varios pdf', 'merge pdf online', 'fusionar documentos pdf', 'unir archivos pdf'],
  },
  {
    slug: 'dividir-pdf',
    name: 'Dividir PDF',
    category: 'archivos',
    icon: '✂️',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'split' },
    metaTitle: 'Dividir PDF — Separar páginas PDF online gratis | ConversorPro',
    metaDescription:
      'Divide un PDF en páginas individuales. Extrae cada página como un archivo PDF separado. 100% en tu navegador, gratis y privado.',
    explanation: [
      'Separa cada página de un documento PDF en archivos PDF individuales. Cada página se convierte en un archivo independiente que puedes descargar por separado.',
      'El procesamiento es 100% local. Tus documentos nunca se suben a servidores externos. Ideal para extraer páginas específicas de un documento grande.',
    ],
    equivalences: [
      { from: 'PDF de 5 páginas', to: '5 archivos PDF individuales' },
      { from: 'PDF de 20 páginas', to: '20 archivos PDF individuales' },
    ],
    faq: [
      { q: '¿Qué tamaño de PDF puedo dividir?', a: 'No hay límite de tamaño, pero documentos muy grandes pueden requerir más memoria. Funciona mejor con PDFs de menos de 100 MB.' },
      { q: '¿Se mantiene la calidad del original?', a: 'Sí, cada página extraída mantiene exactamente la misma calidad y formato que el PDF original.' },
    ],
    related: ['unir-pdf', 'pdf-a-imagenes', 'eliminar-paginas-pdf'],
    keywords: ['dividir pdf', 'separar pdf', 'extraer paginas pdf', 'split pdf online', 'partir pdf', 'separar paginas pdf', 'dividir pdf en varios', 'split pdf gratis', 'extraer pagina de pdf'],
  },
  {
    slug: 'eliminar-paginas-pdf',
    name: 'Eliminar Páginas PDF',
    category: 'archivos',
    icon: '🗑️',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'remove-pages' },
    metaTitle: 'Eliminar Páginas de PDF — Quitar páginas online gratis | ConversorPro',
    metaDescription:
      'Elimina páginas específicas de un PDF. Indica los números de página y obtén un PDF limpio. 100% en tu navegador, gratis.',
    explanation: [
      'Elimina páginas no deseadas de un documento PDF. Simplemente indica los números de página que quieres eliminar (ej: 1,3,5-7) y el conversor generará un nuevo PDF sin esas páginas.',
      'Es útil para limpiar documentos escaneados, eliminar portadas, páginas en blanco o anexos innecesarios. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'PDF de 10 páginas (eliminar 3)', to: 'PDF de 7 páginas' },
      { from: 'PDF de 50 páginas (eliminar 5)', to: 'PDF de 45 páginas' },
    ],
    faq: [
      { q: '¿Cómo especifico las páginas a eliminar?', a: 'Usa números separados por comas (1,3,5) o rangos con guión (5-10). Ejemplo: 1,3,5-7 elimina las páginas 1, 3, 5, 6 y 7.' },
      { q: '¿Puedo eliminar la primera página?', a: 'Sí, puedes eliminar cualquier página del documento, incluida la primera. Pero no puedes eliminar todas las páginas.' },
    ],
    related: ['dividir-pdf', 'unir-pdf', 'organizar-pdf'],
    keywords: ['eliminar paginas pdf', 'quitar paginas pdf', 'borrar paginas pdf', 'remover paginas pdf', 'suprimir paginas pdf', 'eliminar pagina pdf online', 'quitar hoja pdf', 'delete page pdf'],
  },
  {
    slug: 'rotar-pdf',
    name: 'Rotar PDF',
    category: 'archivos',
    icon: '🔄',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'rotate' },
    metaTitle: 'Rotar PDF — Girar páginas PDF online gratis | ConversorPro',
    metaDescription:
      'Rota las páginas de un PDF 90°, 180° o 270°. Ideal para corregir documentos escaneados al revés. 100% en tu navegador.',
    explanation: [
      'Rota todas las páginas de un documento PDF en el ángulo que necesites: 90° horario, 180° o 90° antihorario. Perfecto para corregir documentos escaneados en la orientación incorrecta.',
      'El procesamiento es 100% local. Tus documentos nunca salen de tu dispositivo.',
    ],
    equivalences: [
      { from: 'PDF en vertical', to: 'PDF rotado 90° (horizontal)' },
      { from: 'PDF al revés', to: 'PDF rotado 180° (corregido)' },
    ],
    faq: [
      { q: '¿Se puede rotar una sola página?', a: 'Actualmente la rotación se aplica a todas las páginas del documento. Para rotar páginas individuales, necesitarás dividir el PDF primero.' },
      { q: '¿Se pierde calidad al rotar?', a: 'No. La rotación modifica los metadatos de orientación del PDF, no los píxeles. No hay pérdida de calidad.' },
    ],
    related: ['organizar-pdf', 'dividir-pdf', 'unir-pdf'],
    keywords: ['rotar pdf', 'girar pdf', 'voltear pdf', 'corregir orientacion pdf', 'rotar pagina pdf', 'girar pdf online', 'cambiar orientacion pdf', 'rotar documento pdf', 'rotate pdf online'],
  },
  {
    slug: 'proteger-pdf',
    name: 'Proteger PDF con Contraseña',
    category: 'archivos',
    icon: '🔒',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'protect' },
    metaTitle: 'Proteger PDF con Contraseña — Añadir contraseña PDF gratis | ConversorPro',
    metaDescription:
      'Añade protección por contraseña a tus PDFs. Mantén tus documentos seguros. 100% en tu navegador, privado y gratis.',
    explanation: [
      'Añade una contraseña a tus documentos PDF para protegerlos de accesos no autorizados. Ideal para documentos confidenciales, contratos o información personal.',
      'NOTA: El cifrado completo con contraseña requiere procesamiento avanzado. Esta herramienta prepara tu PDF para protección. La versión con cifrado completo estará disponible próximamente.',
    ],
    equivalences: [
      { from: 'PDF sin contraseña', to: 'PDF protegido' },
    ],
    faq: [
      { q: '¿Es segura la protección?', a: 'La herramienta prepara el PDF para protección. El cifrado AES completo requiere procesamiento especializado que estará disponible próximamente.' },
      { q: '¿Puedo quitar la contraseña después?', a: 'Sí, usa nuestra herramienta Desbloquear PDF si conoces la contraseña.' },
    ],
    related: ['desbloquear-pdf', 'unir-pdf', 'comprimir-pdf'],
    keywords: ['proteger pdf', 'proteger pdf con contraseña', 'pdf seguro', 'contraseña pdf', 'poner contraseña a pdf', 'encriptar pdf', 'bloquear pdf con clave', 'proteger pdf gratis', 'seguridad pdf online'],
  },
  {
    slug: 'desbloquear-pdf',
    name: 'Desbloquear PDF',
    category: 'archivos',
    icon: '🔓',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'unlock' },
    metaTitle: 'Desbloquear PDF — Quitar contraseña PDF online gratis | ConversorPro',
    metaDescription:
      'Elimina la contraseña de un PDF protegido. Introduce la contraseña y obtén un PDF sin restricciones. 100% en tu navegador.',
    explanation: [
      'Elimina la protección por contraseña de documentos PDF. Solo necesitas introducir la contraseña correcta y el conversor generará una copia sin restricciones.',
      'El procesamiento es 100% local. Tu contraseña y documento nunca se envían a ningún servidor.',
    ],
    equivalences: [
      { from: 'PDF protegido', to: 'PDF sin contraseña' },
    ],
    faq: [
      { q: '¿Puedo desbloquear cualquier PDF?', a: 'Sí, siempre que tengas la contraseña correcta. No podemos desbloquear PDFs sin conocer la contraseña.' },
      { q: '¿Es ilegal desbloquear un PDF?', a: 'Siempre que tengas permiso para acceder al documento (porque conoces la contraseña), es perfectamente legal desbloquearlo para tu uso.' },
    ],
    related: ['proteger-pdf', 'unir-pdf', 'comprimir-pdf'],
    keywords: ['desbloquear pdf', 'quitar contraseña pdf', 'unlock pdf', 'eliminar password pdf', 'abrir pdf protegido', 'remover contraseña pdf', 'desencriptar pdf online', 'quitar clave pdf', 'unlock pdf gratis'],
  },
  {
    slug: 'reordenar-pdf',
    name: 'Reordenar PDF',
    category: 'archivos',
    icon: '📋',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'organize' },
    metaTitle: 'Reordenar PDF — Organizar páginas PDF online gratis | ConversorPro',
    metaDescription:
      'Reordena las páginas de un PDF arrastrándolas al orden deseado. Organiza tus documentos fácilmente. 100% en tu navegador.',
    explanation: [
      'Cambia el orden de las páginas de un documento PDF. Usa los botones de flecha para mover cada página a la posición deseada y genera un nuevo PDF con el orden personalizado.',
      'Perfecto para reorganizar documentos escaneados, corregir el orden de páginas o preparar presentaciones. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'PDF desordenado', to: 'PDF reorganizado' },
      { from: 'PDF de 10 páginas', to: 'PDF con páginas en nuevo orden' },
    ],
    faq: [
      { q: '¿Puedo mover páginas al principio o al final?', a: 'Sí, usa los botones de flecha para mover cada página hacia arriba o abajo tantas veces como sea necesario hasta lograr el orden deseado.' },
      { q: '¿Se mantiene el contenido de las páginas?', a: 'Sí, solo cambia el orden. El contenido de cada página permanece intacto.' },
    ],
    related: ['dividir-pdf', 'unir-pdf', 'eliminar-paginas-pdf'],
    keywords: ['reordenar pdf', 'organizar pdf', 'cambiar orden paginas pdf', 'reorganizar pdf', 'mover paginas pdf', 'ordenar pdf online', 'reordenar paginas pdf gratis', 'organizar documento pdf'],
  },
  {
    slug: 'numerar-paginas-pdf',
    name: 'Numerar Páginas PDF',
    category: 'archivos',
    icon: '🔢',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'page-numbers' },
    metaTitle: 'Numerar Páginas PDF — Añadir números de página gratis | ConversorPro',
    metaDescription:
      'Añade números de página a tus documentos PDF. Elige la posición: abajo centro, abajo derecha, arriba centro o arriba derecha. Gratis.',
    explanation: [
      'Añade números de página automáticamente a todas las páginas de tu documento PDF. Puedes elegir entre cuatro posiciones: abajo centro, abajo derecha, arriba centro o arriba derecha.',
      'Ideal para documentos profesionales, informes, tesis o cualquier PDF que necesite una numeración clara. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'PDF sin numerar', to: 'PDF con números de página' },
      { from: 'PDF de 50 páginas', to: 'PDF numerado del 1 al 50' },
    ],
    faq: [
      { q: '¿Puedo elegir dónde van los números?', a: 'Sí. Puedes elegir entre cuatro posiciones: abajo centro, abajo derecha, arriba centro o arriba derecha.' },
      { q: '¿Se puede cambiar el tamaño del número?', a: 'Actualmente usamos un tamaño estándar de 12pt. En futuras versiones añadiremos más opciones de personalización.' },
    ],
    related: ['unir-pdf', 'reordenar-pdf', 'eliminar-paginas-pdf'],
    keywords: ['numerar paginas pdf', 'añadir numeros de pagina pdf', 'contar paginas pdf', 'page numbers pdf', 'poner numeros a pdf', 'numerar hojas pdf', 'numero de pagina pdf', 'añadir paginacion pdf', 'numerar documento pdf'],
  },
  {
    slug: 'marca-agua-pdf',
    name: 'Añadir Marca de Agua PDF',
    category: 'archivos',
    icon: '💧',
    color: '#f97316',
    widget: 'pdf-tools',
    widgetConfig: { tool: 'watermark' },
    metaTitle: 'Marca de Agua PDF — Añadir texto a PDF online gratis | ConversorPro',
    metaDescription:
      'Añade una marca de agua de texto a tus PDFs (Ej: BORRADOR, CONFIDENCIAL). 100% en tu navegador, privado y gratis.',
    explanation: [
      'Añade una marca de agua de texto a todas las páginas de tu documento PDF. Ideal para marcar documentos como "BORRADOR", "CONFIDENCIAL", "MUESTRA" o cualquier texto que necesites.',
      'La marca de agua se coloca en el centro de cada página con un ángulo de 45° y opacidad reducida para no interferir con la lectura del contenido. Procesamiento 100% local.',
    ],
    equivalences: [
      { from: 'PDF sin marca', to: 'PDF con marca de agua' },
      { from: 'PDF normal', to: 'PDF marcado como BORRADOR' },
    ],
    faq: [
      { q: '¿Se puede quitar la marca de agua después?', a: 'No recomendamos añadir marcas de agua a documentos originales. La marca se incrusta en el PDF y no se puede eliminar fácilmente.' },
      { q: '¿Qué texto puedo usar?', a: 'Cualquier texto: BORRADOR, CONFIDENCIAL, MUESTRA GRATIS, SIN VALOR, etc. El texto se muestra en diagonal con opacidad 20%.' },
    ],
    related: ['proteger-pdf', 'unir-pdf', 'numerar-paginas-pdf'],
    keywords: ['marca de agua pdf', 'watermark pdf', 'añadir texto a pdf', 'marcar pdf', 'poner marca de agua', 'watermark pdf gratis', 'texto en diagonal pdf', 'confidencial pdf', 'marcar documento como borrador'],
  },

  // ====================================================================
  // ARCHIVOS — CONVERSIÓN DE DOCUMENTOS
  // ====================================================================
  {
    slug: 'word-a-pdf',
    name: 'Word a PDF',
    category: 'archivos',
    icon: '📝',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'word-to-pdf' },
    metaTitle: 'Word a PDF — Convertir DOCX/DOC a PDF online gratis | ConversorPro',
    metaDescription:
      'Convierte documentos de Word (DOCX/DOC) a PDF en tu navegador. 100% privado, sin subir archivos a servidores. Gratis.',
    explanation: [
      'Convierte tus documentos de Microsoft Word (formato DOCX y DOC) a PDF directamente en tu navegador. El procesamiento es 100% local usando la librería Mammoth.js para extraer el texto y jsPDF para generar el PDF.',
      'Tus documentos nunca se suben a ningún servidor. Es ideal para compartir documentos con formato universal, enviar currículums o preparar informes profesionales.',
    ],
    equivalences: [
      { from: 'DOCX de 10 páginas', to: 'PDF de 10 páginas' },
      { from: 'DOCX con imágenes', to: 'PDF con texto extraído' },
    ],
    faq: [
      { q: '¿Se mantienen las imágenes y el formato?', a: 'El texto se extrae correctamente. Las imágenes y formatos complejos pueden no conservarse al 100%. Para máxima fidelidad, recomendamos usar Word → PDF desde el propio Word.' },
      { q: '¿Se sube mi documento a un servidor?', a: 'No. Todo el procesamiento es local. Mammoth.js y jsPDF funcionan directamente en tu navegador.' },
    ],
    related: ['excel-a-pdf', 'html-a-pdf', 'powerpoint-a-pdf'],
    keywords: ['word a pdf', 'docx a pdf', 'convertir word a pdf', 'documento word a pdf', 'pasar word a pdf', 'doc a pdf', 'word a pdf gratis', 'convertir docx', 'cambiar formato word a pdf', 'word to pdf online'],
  },
  {
    slug: 'excel-a-pdf',
    name: 'Excel a PDF',
    category: 'archivos',
    icon: '📊',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'excel-to-pdf' },
    metaTitle: 'Excel a PDF — Convertir XLSX/XLS a PDF online gratis | ConversorPro',
    metaDescription:
      'Convierte hojas de cálculo de Excel (XLSX, XLS) a PDF en tu navegador. 100% privado, sin subir archivos a servidores.',
    explanation: [
      'Convierte tus hojas de cálculo de Microsoft Excel a formato PDF directamente en tu navegador. Usa SheetJS (xlsx) para leer los datos y jsPDF para generar el PDF.',
      'Cada hoja del libro de Excel se convierte en una página del PDF. Los datos se presentan en formato tabla con el nombre de la hoja como título. Procesamiento 100% local y privado.',
    ],
    equivalences: [
      { from: 'XLSX con 1 hoja', to: 'PDF de 1 página' },
      { from: 'XLSX con 5 hojas', to: 'PDF de 5 páginas' },
    ],
    faq: [
      { q: '¿Se mantienen las fórmulas?', a: 'Los valores calculados de las celdas se conservan, pero las fórmulas no se mantienen como tales. El PDF muestra el resultado final.' },
      { q: '¿Quéformatos de Excel soporta?', a: 'Soporta XLSX, XLS y CSV. Los archivos XLSX modernos funcionan mejor.' },
    ],
    related: ['word-a-pdf', 'html-a-pdf', 'powerpoint-a-pdf'],
    keywords: ['excel a pdf', 'xlsx a pdf', 'convertir excel a pdf', 'hoja de calculo a pdf', 'pasar excel a pdf', 'xls a pdf', 'excel a pdf gratis', 'convertir tabla a pdf', 'excel to pdf online'],
  },
  {
    slug: 'html-a-pdf',
    name: 'HTML a PDF',
    category: 'archivos',
    icon: '🌐',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'html-to-pdf' },
    metaTitle: 'HTML a PDF — Convertir página web a PDF online gratis | ConversorPro',
    metaDescription:
      'Convierte archivos HTML a PDF en tu navegador. Extrae el texto y genera un PDF limpio. 100% privado y gratis.',
    explanation: [
      'Convierte archivos HTML a documentos PDF directamente en tu navegador. El conversor extrae el texto del HTML, eliminando las etiquetas, y genera un PDF limpio y legible.',
      'Es útil para guardar páginas web para lectura offline, archivar documentación HTML o convertir informes web a formato PDF. Procesamiento 100% local.',
    ],
    equivalences: [
      { from: 'Archivo HTML', to: 'Documento PDF' },
      { from: 'Página web (HTML)', to: 'PDF para imprimir' },
    ],
    faq: [
      { q: '¿Se conservan las imágenes del HTML?', a: 'Actualmente extraemos solo el texto. Para conversiones con imágenes, recomendamos usar la función Imprimir → Guardar como PDF del navegador.' },
      { q: '¿Se mantienen los estilos CSS?', a: 'No. El conversor extrae el texto plano del HTML sin estilos CSS ni JavaScript.' },
    ],
    related: ['word-a-pdf', 'excel-a-pdf', 'powerpoint-a-pdf'],
    keywords: ['html a pdf', 'convertir html a pdf', 'pagina web a pdf', 'web a pdf', 'pasar html a pdf', 'guardar pagina como pdf', 'convertir sitio web a pdf', 'html to pdf online'],
  },
  {
    slug: 'powerpoint-a-pdf',
    name: 'PowerPoint a PDF',
    category: 'archivos',
    icon: '📽️',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'powerpoint-to-pdf' },
    metaTitle: 'PowerPoint a PDF — Convertir PPT a PDF online gratis | ConversorPro',
    metaDescription:
      'Convierte presentaciones de PowerPoint (PPT/PPTX) a PDF. Próximamente disponible. Mientras tanto, usa nuestras otras herramientas PDF.',
    explanation: [
      'Convierte tus presentaciones de PowerPoint a formato PDF. Esta función está actualmente en desarrollo para ofrecer la mejor calidad de conversión posible.',
      'Mientras tanto, puedes usar nuestras herramientas de unir PDF, comprimir PDF o convertir imágenes a PDF para necesidades inmediatas.',
    ],
    equivalences: [
      { from: 'PPTX de 10 diapositivas', to: 'PDF de 10 páginas' },
    ],
    faq: [
      { q: '¿Cuándo estará disponible?', a: 'Estamos trabajando en ello. Próximamente podrás convertir PPT a PDF directamente en tu navegador.' },
      { q: '¿Qué alternativas tengo mientras?', a: 'Puedes usar PowerPoint → Guardar como → PDF, o convertir tus diapositivas a imágenes y luego usar Imágenes a PDF.' },
    ],
    related: ['word-a-pdf', 'excel-a-pdf', 'html-a-pdf'],
    keywords: ['powerpoint a pdf', 'ppt a pdf', 'convertir powerpoint a pdf', 'presentacion a pdf', 'pasar ppt a pdf', 'pptx a pdf', 'powerpoint a pdf gratis', 'slides a pdf', 'ppt to pdf online'],
  },
  {
    slug: 'pdf-a-word',
    name: 'PDF a Word',
    category: 'archivos',
    icon: '📝',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'pdf-to-word' },
    metaTitle: 'PDF a Word — Convertir PDF a DOCX online gratis | ConversorPro',
    metaDescription:
      'Convierte documentos PDF a Word (DOCX). Herramienta en desarrollo. Mientras tanto, extrae el texto con PDF a Imágenes.',
    explanation: [
      'Convierte tus documentos PDF a formato Microsoft Word (DOCX) para poder editarlos fácilmente. Esta función está actualmente en desarrollo.',
      'Mientras tanto, puedes usar nuestra herramienta PDF a Imágenes para extraer el contenido visual de tus PDFs, o Contador de Palabras para analizar el texto.',
    ],
    equivalences: [
      { from: 'PDF de 5 páginas', to: 'Documento Word editable' },
    ],
    faq: [
      { q: '¿Cuándo estará disponible?', a: 'Estamos desarrollando esta función. La conversión PDF a Word requiere un procesamiento complejo que estamos optimizando.' },
      { q: '¿Hay alternativas mientras tanto?', a: 'Puedes copiar el texto manualmente o usar Google Docs que tiene una función de importación de PDF bastante buena.' },
    ],
    related: ['word-a-pdf', 'pdf-a-excel', 'pdf-a-powerpoint'],
    keywords: ['pdf a word', 'pdf a docx', 'convertir pdf a word', 'editar pdf en word', 'pasar pdf a word', 'extraer texto de pdf', 'pdf a documento editable', 'pdf to word gratis', 'convertir pdf a documento'],
  },
  {
    slug: 'pdf-a-excel',
    name: 'PDF a Excel',
    category: 'archivos',
    icon: '📊',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'pdf-to-excel' },
    metaTitle: 'PDF a Excel — Convertir PDF a XLSX online gratis | ConversorPro',
    metaDescription:
      'Convierte tablas de PDF a Excel (XLSX). Herramienta en desarrollo. Próximamente disponible.',
    explanation: [
      'Extrae datos de tablas en documentos PDF y conviértelos a formato Excel (XLSX). Esta función está actualmente en desarrollo.',
      'La conversión de tablas de PDF a formato editable es compleja técnicamente y requiere un procesamiento avanzado que estamos implementando.',
    ],
    equivalences: [
      { from: 'PDF con tablas', to: 'Hoja de Excel editable' },
    ],
    faq: [
      { q: '¿Puedo extraer datos de tablas en PDF?', a: 'Actualmente no. Estamos desarrollando esta función. Mientras tanto, puedes usar la función de copiar tabla desde el lector de PDF.' },
    ],
    related: ['excel-a-pdf', 'pdf-a-word', 'pdf-a-powerpoint'],
    keywords: ['pdf a excel', 'pdf a xlsx', 'convertir pdf a excel', 'extraer tabla pdf a excel', 'pasar pdf a excel', 'pdf a hoja de calculo', 'pdf a excel gratis', 'pdf to excel online', 'convertir pdf a tabla'],
  },
  {
    slug: 'pdf-a-powerpoint',
    name: 'PDF a PowerPoint',
    category: 'archivos',
    icon: '📽️',
    color: '#f97316',
    widget: 'document-converter',
    widgetConfig: { tool: 'pdf-to-powerpoint' },
    metaTitle: 'PDF a PowerPoint — Convertir PDF a PPT online gratis | ConversorPro',
    metaDescription:
      'Convierte documentos PDF a presentaciones PowerPoint (PPT). Herramienta en desarrollo. Próximamente disponible.',
    explanation: [
      'Convierte tus documentos PDF a presentaciones de PowerPoint (PPT/PPTX). Esta función está actualmente en desarrollo.',
      'Para crear presentaciones a partir de PDFs, puedes usar nuestra herramienta PDF a Imágenes para extraer cada página como imagen y luego insertarlas en PowerPoint manualmente.',
    ],
    equivalences: [
      { from: 'PDF de 10 páginas', to: 'PPT de 10 diapositivas' },
    ],
    faq: [
      { q: '¿Cada página del PDF se convierte en una diapositiva?', a: 'Sí, esa es la idea. Cada página del PDF se convertiría en una diapositiva independiente en la presentación.' },
    ],
    related: ['powerpoint-a-pdf', 'pdf-a-word', 'pdf-a-excel'],
    keywords: ['pdf a powerpoint', 'pdf a ppt', 'convertir pdf a powerpoint', 'pdf a presentacion', 'pasar pdf a ppt', 'pdf a slides', 'pdf a pptx', 'pdf to powerpoint gratis', 'convertir pdf a presentacion'],
  },

  // ====================================================================
  // HERRAMIENTAS ÚTILES — Calculadoras, generadores y utilidades
  // ====================================================================
  {
    slug: 'calculadora-edad',
    name: 'Calculadora de Edad',
    category: 'texto',
    icon: '🎂',
    color: '#f43f5e',
    widget: 'age-calculator',
    metaTitle: 'Calculadora de Edad Exacta Online — Gratis | ConversorPro',
    metaDescription:
      'Calcula tu edad exacta en años, meses, días, horas, minutos y segundos. Descubre tu signo zodiacal, generación y días hasta tu próximo cumpleaños. Gratis.',
    explanation: [
      'Calcula tu edad exacta al segundo. Introduce tu fecha de nacimiento y el contador en vivo muestra tu edad precisa en años, meses, días, horas, minutos y segundos.',
      'Además de la edad cronológica, obtén datos curiosos como tu signo zodiacal, tu generación (Baby Boomer, Millennial, Gen Z, Alpha), los días totales que has vivido y los días que faltan para tu próximo cumpleaños.',
      'El procesamiento es 100% local en tu navegador. Tu fecha de nacimiento nunca se envía a ningún servidor.',
    ],
    equivalences: [
      { from: '30 años', to: '≈ 10,957 días vividos' },
      { from: '50 años', to: '≈ 18,262 días vividos' },
      { from: '18 años', to: '6,575 días vividos' },
    ],
    faq: [
      { q: '¿La calculadora es precisa?', a: 'Sí. Calcula la edad exacta al segundo, teniendo en cuenta años bisiestos y la diferencia exacta entre fechas.' },
      { q: '¿Se guarda mi fecha de nacimiento?', a: 'No. Todo el cálculo ocurre en tu navegador. No se envía ni almacena ninguna información.' },
      { q: '¿Qué es la generación Millennial?', a: 'Los Millennials (Generación Y) son las personas nacidas entre 1981 y 1996. La generación Z nació entre 1997 y 2012, y la Generación Alpha desde 2013.' },
    ],
    related: ['conversor-zona-horaria', 'numeros-a-letras', 'contador-palabras'],
    keywords: ['calculadora de edad', 'calcular edad', 'cuantos años tengo', 'edad exacta', 'calculadora años meses dias', 'cuantos años tengo online', 'calcular edad exacta', 'diferencia entre fechas', 'calcular cumpleaños', 'edad en años meses y dias', 'signo zodiacal por fecha', 'generacion por edad'],
  },
  {
    slug: 'generador-qr',
    name: 'Generador QR',
    category: 'texto',
    icon: '📱',
    color: '#10b981',
    widget: 'qr-generator',
    metaTitle: 'Generador de Códigos QR Online Gratis | ConversorPro',
    metaDescription:
      'Genera códigos QR personalizados a partir de texto, URLs y más. Elige color, tamaño y descarga en PNG. Gratis y sin registro.',
    explanation: [
      'Genera códigos QR personalizados al instante. Introduce cualquier texto o URL y obtén un código QR listo para descargar en formato PNG.',
      'Puedes personalizar los colores de frente y fondo, y elegir el tamaño de 128 a 1024 píxeles. El código se genera en tu navegador sin enviar datos a ningún servidor.',
      'Los códigos QR se usan para compartir enlaces, información de contacto, WiFi, menús de restaurantes y más. Escanea cualquier QR con la cámara de tu móvil.',
    ],
    equivalences: [
      { from: 'URL larga', to: 'QR compacto (hasta 4296 caracteres)' },
      { from: 'Texto simple', to: 'QR con el texto codificado' },
    ],
    faq: [
      { q: '¿Los QR generados caducan?', a: 'No. Una vez generados, los QR son permanentes. No almacenamos nada en servidores, el QR se genera localmente.' },
      { q: '¿Se envía mi texto a algún servidor?', a: 'No. La generación del QR es 100% local usando la librería qrcode en tu navegador.' },
      { q: '¿Puedo cambiar el color del QR?', a: 'Sí. Puedes personalizar el color de frente y fondo. Recomendamos mantener alto contraste para mejor escaneabilidad.' },
    ],
    related: ['numeros-a-letras', 'mayusculas-a-minusculas', 'json-a-csv'],
    keywords: ['generador qr', 'codigo qr', 'crear qr', 'qr code generator', 'qr online gratis', 'generar codigo qr', 'qr personalizado', 'qr con colores', 'qr de texto', 'qr de url', 'descargar qr png', 'crear codigo qr gratis'],
  },
  {
    slug: 'conversor-zona-horaria',
    name: 'Conversor de Zona Horaria',
    category: 'unidades',
    icon: '🕐',
    color: '#8b5cf6',
    widget: 'timezone-converter',
    metaTitle: 'Conversor de Zona Horaria — Hora mundial online gratis | ConversorPro',
    metaDescription:
      'Convierte la hora entre zonas horarias de todo el mundo. Compatible con husos horarios IANA. Gratis y sin registro.',
    explanation: [
      'Convierte la hora entre cualquier par de zonas horarias del mundo. Selecciona la fecha, hora, zona de origen y zona de destino para ver la equivalencia exacta.',
      'Soporta todos los husos horarios IANA (más de 500 zonas), incluyendo horario de verano automático. La conversión respeta los cambios estacionales y las reglas de cada región.',
      'Ideal para coordinar reuniones internacionales, llamadas con familiares en el extranjero o planificar viajes.',
    ],
    equivalences: [
      { from: 'España (CET) → Nueva York (EST)', to: '-6 horas' },
      { from: 'España (CET) → Tokio (JST)', to: '+7 horas' },
      { from: 'España (CET) → Londres (GMT)', to: '-1 hora' },
    ],
    faq: [
      { q: '¿Se ajusta automáticamente al horario de verano?', a: 'Sí. Usamos la base de datos IANA que incluye todas las reglas de horario de verano del mundo.' },
      { q: '¿Cuántas zonas horarias soporta?', a: 'Soporta más de 500 zonas horarias IANA de todo el mundo, incluyendo zonas con diferencias de 30 y 45 minutos.' },
      { q: '¿Qué países tienen diferencia de 30 minutos?', a: 'India (UTC+5:30), Irán (UTC+3:30), Afganistán (UTC+4:30), Venezuela (UTC-4), entre otros.' },
    ],
    related: ['calculadora-edad', 'celsius-a-fahrenheit', 'kilometros-a-millas'],
    keywords: ['conversor zona horaria', 'hora mundial', 'huso horario', 'convertir hora', 'diferencia horaria', 'que hora es en', 'zona horaria online', 'convertir zona horaria', 'hora en otros paises', 'calcular diferencia horaria', 'husos horarios del mundo', 'time zone converter'],
  },
  {
    slug: 'numeros-a-letras',
    name: 'Números a Letras',
    category: 'texto',
    icon: '🔢',
    color: '#f59e0b',
    widget: 'numbers-to-words',
    metaTitle: 'Números a Letras — Conversor de números a texto en español | ConversorPro',
    metaDescription:
      'Convierte números a letras en español. Escribe cualquier número en texto: desde cero hasta billones. Modo euros incluido. Gratis y sin registro.',
    explanation: [
      'Convierte cualquier número a su representación en letras en español. Soporta desde cero hasta 999 mil millones, con opción de forma femenina y formato de euros.',
      'Ejemplo: 1234 se convierte en «mil doscientos treinta y cuatro». En modo euros: «mil doscientos treinta y cuatro euros con 00 céntimos».',
      'Ideal para redactar cheques, contratos, facturas, documentos legales o cualquier texto que requiera escribir números en palabras.',
    ],
    equivalences: [
      { from: '0', to: 'cero' },
      { from: '21', to: 'veintiuno' },
      { from: '100', to: 'cien' },
      { from: '1999', to: 'mil novecientos noventa y nueve' },
      { from: '1000000', to: 'un millón' },
    ],
    faq: [
      { q: '¿Hasta qué número llega?', a: 'Soporta números desde 0 hasta 999 mil millones (999,999,999,999). Para números más grandes, puedes usar la notación científica.' },
      { q: '¿Qué es la forma femenina?', a: 'Algunos números cambian según el género: «un» → «una», «veintiún» → «veintiuna». Ejemplo: «veintiuna personas».' },
      { q: '¿Cómo se escriben los números con decimales?', a: 'Puedes introducir decimales con punto (ej: 1234.56). En modo euros se convierten en «X euros con Y céntimos».' },
    ],
    related: ['mayusculas-a-minusculas', 'contador-palabras', 'calculadora-edad'],
    keywords: ['numeros a letras', 'escribir numeros en palabras', 'numeros a texto', 'convertir numero a letras', 'numeros en español', 'como se escribe 1000', 'numeros a letras euros', 'convertir numeros a palabras', 'escribir cheques en letras', 'numeros cardinales español', 'pasar numero a letra'],
  },

  // ====================================================================
  // HERRAMIENTAS PARA DESARROLLADORES — Hash, Base64, JSON
  // ====================================================================
  {
    slug: 'generador-hash',
    name: 'Generador de Hash',
    category: 'texto',
    icon: '🔐',
    color: '#06b6d4',
    widget: 'dev-tools',
    widgetConfig: { tool: 'hash' },
    metaTitle: 'Generador de Hash MD5/SHA — Hash online gratis | ConversorPro',
    metaDescription: 'Genera hashes MD5, SHA-1, SHA-256 y SHA-512 de cualquier texto. Gratis, sin registro, 100% en tu navegador. Ideal para desarrolladores.',
    explanation: [
      'Un hash es una huella digital única de un texto o archivo. Genera hashes MD5, SHA-1, SHA-256 y SHA-512 de cualquier texto al instante usando la Web Crypto API de tu navegador.',
      'Los hashes se usan para verificar integridad de archivos, almacenar contraseñas de forma segura y crear identificadores únicos. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'MD5', to: '128 bits (32 caracteres hex)' },
      { from: 'SHA-1', to: '160 bits (40 caracteres hex)' },
      { from: 'SHA-256', to: '256 bits (64 caracteres hex)' },
      { from: 'SHA-512', to: '512 bits (128 caracteres hex)' },
    ],
    faq: [
      { q: '¿Los hashes se generan en el servidor?', a: 'No. Todo el cálculo se realiza en tu navegador usando la Web Crypto API. Tu texto nunca sale de tu dispositivo.' },
      { q: '¿Qué diferencia hay entre MD5 y SHA?', a: 'MD5 genera 128 bits, SHA-1 genera 160 bits, SHA-256 genera 256 bits y SHA-512 genera 512 bits. A mayor bits, más seguro pero más lento.' },
    ],
    related: ['codificador-base64', 'validador-json', 'generador-qr'],
    keywords: ['generador hash', 'md5 online', 'sha256', 'sha1', 'sha512', 'calcular hash', 'hash de texto', 'generar md5', 'crypto hash', 'hash online gratis'],
  },
  {
    slug: 'codificador-base64',
    name: 'Codificador Base64',
    category: 'texto',
    icon: '🔤',
    color: '#06b6d4',
    widget: 'dev-tools',
    widgetConfig: { tool: 'base64' },
    metaTitle: 'Codificar/Decodificar Base64 — Online gratis | ConversorPro',
    metaDescription: 'Codifica y decodifica texto a Base64 al instante. 100% en tu navegador, gratis y sin registro. Ideal para desarrolladores.',
    explanation: [
      'Convierte texto a Base64 y viceversa al instante. Base64 es un sistema de codificación que permite representar datos binarios usando caracteres ASCII.',
      'Es muy usado para incrustar imágenes en HTML/CSS, enviar datos en APIs REST y almacenar información en formatos de texto. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'Hola', to: 'SG9sYQ==' },
      { from: 'Hello World', to: 'SGVsbG8gV29ybGQ=' },
      { from: 'Base64', to: 'QmFzZTY0' },
    ],
    faq: [
      { q: '¿Para qué se usa Base64?', a: 'Para transmitir datos binarios (imágenes, archivos) en formatos que solo soportan texto, como JSON, XML o CSS.' },
      { q: '¿Base64 es seguro?', a: 'No es encriptación, solo codificación. Cualquiera puede decodificar Base64 fácilmente. No lo uses para datos sensibles.' },
    ],
    related: ['generador-hash', 'validador-json', 'json-a-csv'],
    keywords: ['base64', 'codificar base64', 'decodificar base64', 'base64 online', 'btoa', 'atob', 'codificar texto', 'base64 encode decode'],
  },
  {
    slug: 'validador-json',
    name: 'Validador y Formateador JSON',
    category: 'texto',
    icon: '🧩',
    color: '#06b6d4',
    widget: 'dev-tools',
    widgetConfig: { tool: 'json' },
    metaTitle: 'Validador y Formateador JSON — Online gratis | ConversorPro',
    metaDescription: 'Valida, formatea y embellece JSON. Minifica JSON. 100% en tu navegador, gratis. Ideal para desarrolladores y APIs.',
    explanation: [
      'Valida y formatea cualquier JSON para hacerlo legible. Detecta errores de sintaxis y te muestra dónde está el problema. También puedes minificar JSON para ahorrar espacio.',
      'Esencial para desarrolladores que trabajan con APIs REST, archivos de configuración o intercambio de datos. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'JSON sin formato', to: 'JSON formateado e indentado' },
      { from: 'JSON formateado', to: 'JSON minificado (sin espacios)' },
    ],
    faq: [
      { q: '¿Mi JSON se envía a algún servidor?', a: 'No. Todo el procesamiento ocurre en tu navegador usando JSON.parse y JSON.stringify nativos de JavaScript.' },
      { q: '¿Qué niveles de indentación soporta?', a: 'Soporta 2 espacios, 4 espacios, 1 espacio o minificado (0 espacios).' },
    ],
    related: ['json-a-csv', 'codificador-base64', 'generador-hash'],
    keywords: ['validador json', 'formatear json', 'pretty print json', 'minificar json', 'json online', 'json formatter', 'validar json gratis'],
  },

  // ====================================================================
  // GENERADOR DE CÓDIGOS DE BARRAS
  // ====================================================================
  {
    slug: 'generador-codigo-barras',
    name: 'Generador de Códigos de Barras',
    category: 'archivos',
    icon: '🏷️',
    color: '#f97316',
    widget: 'barcode-generator',
    metaTitle: 'Generador de Códigos de Barras — Barcode online gratis | ConversorPro',
    metaDescription: 'Genera códigos de barras CODE128, CODE39, EAN-13, UPC-A, ITF-14 y Pharmacode. Personaliza colores y descarga SVG/PNG.',
    explanation: [
      'Genera códigos de barras profesionales con múltiples formatos: CODE128, CODE39, EAN-13, UPC-A, ITF-14 y Pharmacode. Personaliza colores, tamaño y descarga en SVG o PNG.',
      'Ideal para etiquetas de productos, códigos de inventario, envíos postales y sistemas de punto de venta. El procesamiento es 100% local en tu navegador.',
    ],
    equivalences: [
      { from: 'CODE128', to: 'Alfanumérico, alta densidad' },
      { from: 'CODE39', to: 'Alfanumérico, caracteres especiales' },
      { from: 'EAN-13', to: '12 dígitos + dígito control (productos)' },
      { from: 'UPC-A', to: '11 dígitos + dígito control (EE.UU.)' },
    ],
    faq: [
      { q: '¿Qué formato de código de barras debo usar?', a: 'CODE128 es el más versátil (alfanumérico). EAN-13 es el estándar para productos de venta al por menor.' },
      { q: '¿Puedo descargar el código de barras?', a: 'Sí, puedes descargarlo como SVG (vector) o PNG (imagen) con la calidad que necesites.' },
    ],
    related: ['generador-qr', 'generador-hash', 'comprimir-imagen'],
    keywords: ['generador codigo barras', 'barcode generator', 'codigo barras online', 'crear codigo barras', 'code128', 'ean13', 'upc', 'codigo barras gratis'],
  },

  // ====================================================================
  // HERRAMIENTAS DE UTILIDAD — Markdown, Metadatos, Voz a Texto
  // ====================================================================
  {
    slug: 'conversor-markdown',
    name: 'Conversor Markdown a HTML',
    category: 'texto',
    icon: '📝',
    color: '#06b6d4',
    widget: 'utility-tools',
    widgetConfig: { tool: 'markdown' },
    metaTitle: 'Conversor Markdown a HTML — Online gratis | ConversorPro',
    metaDescription: 'Convierte Markdown a HTML con vista previa en vivo. 100% en tu navegador, gratis y sin registro. Ideal para desarrolladores y escritores.',
    explanation: [
      'Convierte texto Markdown a HTML al instante con vista previa en vivo. Markdown es un lenguaje de marcado ligero muy usado en documentación técnica, READMEs y foros.',
      'La conversión se realiza mediante la librería marked.js directamente en tu navegador. Puedes ver tanto la vista previa como el código HTML generado.',
    ],
    equivalences: [
      { from: '# Título', to: '<h1>Título</h1>' },
      { from: '**negrita**', to: '<strong>negrita</strong>' },
      { from: '- Item', to: '<li>Item</li>' },
      { from: '[enlace](url)', to: '<a href="url">enlace</a>' },
    ],
    faq: [
      { q: '¿Mi texto se envía a un servidor?', a: 'No. La conversión se realiza con marked.js directamente en tu navegador. Tu texto nunca sale de tu dispositivo.' },
      { q: '¿Qué elementos Markdown soporta?', a: 'Soporta títulos, listas, enlaces, imágenes, código, tablas, citas, negrita, cursiva y más.' },
    ],
    related: ['mayusculas-a-minusculas', 'validador-json', 'contador-palabras'],
    keywords: ['markdown a html', 'conversor markdown', 'markdown online', 'convertir md a html', 'marked js', 'markdown editor online', 'previsualizar markdown'],
  },
  {
    slug: 'lector-metadatos-imagen',
    name: 'Lector de Metadatos de Imagen',
    category: 'archivos',
    icon: '📷',
    color: '#f97316',
    widget: 'utility-tools',
    widgetConfig: { tool: 'metadata' },
    metaTitle: 'Lector de Metadatos EXIF — Ver datos de imagen online | ConversorPro',
    metaDescription: 'Lee los metadatos EXIF de tus imágenes: modelo de cámara, fecha, GPS, ISO, apertura y más. 100% privado, sin subir archivos.',
    explanation: [
      'Extrae y muestra los metadatos EXIF de cualquier imagen JPG, PNG o WebP. Obtén información como la cámara utilizada, fecha de toma, configuración ISO, apertura, velocidad de obturación y hasta coordenadas GPS.',
      'Ideal para fotógrafos, periodistas y curiosos que quieren conocer los detalles técnicos de una fotografía. El procesamiento es 100% local.',
    ],
    equivalences: [
      { from: 'JPG con EXIF', to: 'Datos: cámara, fecha, ISO, GPS' },
      { from: 'Foto de móvil', to: 'Datos: modelo, apertura, flash' },
    ],
    faq: [
      { q: '¿La imagen se sube a algún servidor?', a: 'No. La lectura de metadatos se realiza enteramente en tu navegador usando la librería exif-js. Tu imagen nunca sale de tu dispositivo.' },
      { q: '¿Qué metadatos puedo ver?', a: 'Fabricante, modelo, fecha, ISO, apertura (f/), velocidad de obturación, distancia focal, flash, GPS y dimensiones.' },
    ],
    related: ['comprimir-imagen', 'imagen-a-webp', 'png-a-jpg'],
    keywords: ['lector metadatos imagen', 'exif online', 'ver metadatos foto', 'datos exif', 'informacion foto', 'metadatos fotografia', 'gps foto', 'exif reader'],
  },
  {
    slug: 'voz-a-texto',
    name: 'Voz a Texto',
    category: 'texto',
    icon: '🎤',
    color: '#06b6d4',
    widget: 'utility-tools',
    widgetConfig: { tool: 'speech' },
    metaTitle: 'Voz a Texto — Reconocimiento de voz online gratis | ConversorPro',
    metaDescription: 'Convierte tu voz en texto usando el reconocimiento de voz de tu navegador. Gratis, sin registro. Compatible con Chrome, Edge y Safari.',
    explanation: [
      'Convierte tu voz en texto al instante usando la Web Speech API de tu navegador. Habla en español y ve cómo tus palabras se convierten en texto en tiempo real.',
      'Ideal para tomar notas rápidas, transcribir reuniones, dictar textos largos o para personas con dificultades para escribir. Funciona sin conexión.',
    ],
    equivalences: [
      { from: '1 minuto hablando', to: '≈ 130-150 palabras transcritas' },
      { from: 'Voz → Texto', to: 'Reconocimiento en tiempo real' },
    ],
    faq: [
      { q: '¿El audio se envía a algún servidor?', a: 'El reconocimiento de voz puede requerir conexión a internet para el procesamiento inicial. Sin embargo, tu voz no se almacena en ningún servidor.' },
      { q: '¿Qué navegadores soportan esta función?', a: 'Chrome, Edge y Safari tienen soporte completo. Firefox tiene soporte limitado.' },
    ],
    related: ['contador-palabras', 'mayusculas-a-minusculas', 'conversor-markdown'],
    keywords: ['voz a texto', 'reconocimiento de voz', 'dictado online', 'transcribir audio', 'speech to text', 'voz a texto gratis', 'escribir hablando', 'notas de voz texto'],
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
