/**
 * Configuración global del sitio.
 * Editar estos valores para personalizar el despliegue.
 */
export const siteConfig = {
  name: 'Conversor Pro',
  shortName: 'ConversorPro',
  tagline: 'Conversores online gratis — unidades, divisas, archivos y texto',
  description:
    'Conversores online gratis: unidades, divisas, archivos y texto. Rápido, preciso y sin registro. Procesamiento 100% en tu navegador. Más de 50 herramientas gratuitas.',
  longDescription:
    'La mejor colección de conversores online gratis. Convierte unidades de longitud, peso, temperatura, volumen y velocidad. Cambia divisas con tasas en tiempo real. Procesa archivos PDF e imágenes sin subirlos a servidores. Convierte texto entre formatos. Todo gratis, sin registro y 100% privado.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://conversoresweb.vercel.app',
  locale: 'es-ES',
  // Google AdSense — sustituir con tu publisher ID real tras la aprobación
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-8885324906798080',
  // Google Analytics 4 — dejar vacío para desactivar
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || '',
  contactEmail: 'soporte@conversorpro.com',
  // Para futuras versiones: activar i18n con inglés
  defaultLang: 'es',
  social: {
    twitter: '@conversorpro',
  },
  keywords: [
    // GENERAL
    'conversor online', 'convertir online gratis', 'herramientas online gratis', 'conversor gratis',
    'convertir archivos', 'conversor de archivos', 'calculadora online', 'herramientas web',
    'utilidades online', 'convertir unidades', 'conversor de unidades', 'conversion de unidades',
    'pasar de unidad a otra', 'tabla de conversion', 'convertir medidas', 'calculadora de conversion',
    'herramienta conversion', 'conversor universal', 'conversor todo en uno', 'app conversion online',
    'mejor conversor online', 'conversor sin registro', 'conversor privado', 'sin instalar nada',
    'funciona en navegador', 'herramientas sin descargar', 'online tool spanish', 'convertidor web',
    'conversor pro', 'conversores pro', 'conversor profesional', 'herramientas utilidad',
    'pagina de conversiones', 'web de conversiones', 'convertir valores', 'cambio de unidades',

    // LONGITUD
    'convertir kilometros a millas', 'km a millas', 'pasar km a mi', 'cuantas millas son un kilometro',
    'convertir millas a kilometros', 'millas a km', 'pasar millas a km', 'cuantos km son una milla',
    'convertir metros a pies', 'metros a pies', 'm a ft', 'pasar metros a pies', 'altura metros a pies',
    'convertir pies a metros', 'pies a metros', 'ft a m', 'pasar pies a metros',
    'convertir centimetros a pulgadas', 'cm a pulgadas', 'centimetros a pulgadas', 'pasar cm a in',
    'convertir pulgadas a centimetros', 'pulgadas a cm', 'pasar pulgadas a cm', 'pantalla pulgadas cm',
    'convertir yardas a metros', 'yardas a metros', 'pasar yardas a m',
    'convertir milimetros a centimetros', 'mm a cm', 'pasar mm a cm',
    'conversor de longitud', 'medidas de longitud', 'unidades de longitud', 'convertir medidas longitud',
    'tabla longitud', 'calcular distancia', 'conversor distancia', 'convertir distancia',

    // PESO
    'convertir kilos a libras', 'kilogramos a libras', 'kg a lb', 'pasar kg a libras',
    'convertir libras a kilos', 'libras a kg', 'lb a kg', 'pasar libras a kg',
    'convertir gramos a onzas', 'gramos a onzas', 'g a oz', 'pasar gramos a onzas',
    'convertir onzas a gramos', 'onzas a gramos', 'oz a g', 'pasar onzas a gramos',
    'convertir toneladas a kilos', 'toneladas a kg', 'pasar toneladas a kg',
    'convertir miligramos a gramos', 'mg a g', 'pasar mg a gramos',
    'conversor de peso', 'unidades de peso', 'medidas de peso', 'convertir peso',
    'calcular peso', 'conversion peso', 'tabla de pesos', 'báscula online',

    // TEMPERATURA
    'convertir celsius a fahrenheit', 'celsius a fahrenheit', 'centigrados a fahrenheit', '°C a °F',
    'convertir fahrenheit a celsius', 'fahrenheit a celsius', '°F a °C', 'pasar fahrenheit a celsius',
    'convertir celsius a kelvin', 'celsius a kelvin', '°C a K', 'pasar celsius a kelvin',
    'convertir kelvin a celsius', 'kelvin a celsius', 'K a °C',
    'conversor de temperatura', 'convertir temperatura', 'grados temperatura', 'termometro online',
    'tabla temperatura', 'cambio de temperatura', 'temperatura corporal', 'escalas termometricas',

    // VOLUMEN
    'convertir litros a galones', 'litros a galones', 'L a gal', 'pasar litros a galones',
    'convertir galones a litros', 'galones a litros', 'gal a L', 'pasar galones a litros',
    'convertir mililitros a onzas', 'ml a oz', 'pasar ml a onzas',
    'convertir metros cubicos a litros', 'm3 a litros', 'pasar m3 a L',
    'conversor de volumen', 'unidades de volumen', 'convertir volumen', 'medidas de volumen',

    // VELOCIDAD
    'convertir kmh a mph', 'km/h a mph', 'pasar kmh a mph', 'velocidad kmh mph',
    'convertir mph a kmh', 'mph a kmh', 'pasar mph a kmh',
    'convertir nudos a kmh', 'nudos a km/h', 'pasar nudos a kmh',
    'conversor de velocidad', 'convertir velocidad', 'unidades de velocidad', 'calcular velocidad',

    // DIVISAS
    'conversor de divisas', 'cambio de moneda', 'convertir divisas online', 'tipo de cambio hoy',
    'convertir euros a dolares', 'euros a dolares', 'EUR a USD', 'cambio euro dolar',
    'convertir dolares a euros', 'dolares a euros', 'USD a EUR', 'cambio dolar euro',
    'convertir libras a euros', 'libras a euros', 'GBP a EUR', 'cambio libra euro',
    'convertir euros a libras', 'euros a libras', 'EUR a GBP', 'cambio euro libra',
    'convertir pesos a dolares', 'pesos a dolares', 'MXN a USD',
    'convertir dolares a pesos', 'dolares a pesos', 'USD a MXN',
    'convertir yenes a euros', 'yenes a euros', 'JPY a EUR', 'cambio yen euro',
    'convertir euros a yenes', 'euros a yenes', 'EUR a JPY', 'cambio euro yen',
    'convertir francos a euros', 'francos suizos a euros', 'CHF a EUR',
    'convertir euros a francos', 'euros a francos suizos', 'EUR a CHF',
    'convertir dolares canadienses a euros', 'CAD a EUR', 'dolar canadiense a euro',
    'convertir dolares australianos a euros', 'AUD a EUR', 'dolar australiano a euro',
    'tasa de cambio en vivo', 'cotizacion divisas', 'mercado de divisas', 'cambio de moneda extranjera',
    'mejor cambio de divisas', 'conversor moneda internacional', 'paridad euro dolar',
    'precio del dolar hoy', 'euro a dolar blue', 'dolar a peso argentino', 'cambio euro peso mexicano',

    // ARCHIVOS PDF
    'conversor pdf', 'convertir pdf online', 'herramientas pdf gratis', 'editar pdf online',
    'convertir imagenes a pdf', 'imagenes a pdf', 'jpg a pdf', 'png a pdf', 'fotos a pdf',
    'convertir pdf a imagenes', 'pdf a imagenes', 'pdf a png', 'pdf a jpg', 'extraer paginas pdf',
    'comprimir pdf', 'reducir tamaño pdf', 'comprimir pdf sin perder calidad', 'optimizar pdf',
    'unir pdf', 'fusionar pdf', 'combinar pdf', 'juntar pdfs online', 'merge pdf',
    'dividir pdf', 'separar pdf', 'partir pdf', 'split pdf', 'extraer paginas pdf',
    'proteger pdf', 'poner contraseña pdf', 'encriptar pdf', 'bloquear pdf', 'seguridad pdf',
    'desbloquear pdf', 'quitar contraseña pdf', 'unlock pdf', 'desencriptar pdf',
    'reordenar pdf', 'organizar pdf', 'ordenar paginas pdf', 'reorganizar pdf',
    'numerar paginas pdf', 'añadir numeros a pdf', 'contar paginas pdf',
    'marca de agua pdf', 'watermark pdf', 'añadir texto a pdf', 'marcar pdf',
    'word a pdf', 'docx a pdf', 'convertir word a pdf', 'documento word a pdf',
    'excel a pdf', 'xlsx a pdf', 'convertir excel a pdf', 'hoja de calculo a pdf',
    'powerpoint a pdf', 'ppt a pdf', 'convertir powerpoint a pdf', 'presentacion a pdf',
    'html a pdf', 'convertir html a pdf', 'pagina web a pdf', 'url a pdf',
    'pdf a word', 'pdf a docx', 'convertir pdf a word', 'pdf a documento editable',
    'pdf a excel', 'pdf a xlsx', 'convertir pdf a excel', 'pdf a hoja de calculo',
    'pdf a powerpoint', 'pdf a ppt', 'convertir pdf a powerpoint', 'pdf a presentacion',

    // IMAGENES
    'convertir imagen', 'conversor de imagenes', 'cambiar formato imagen', 'convertir fotos online',
    'png a jpg', 'convertir png a jpg', 'imagen png a jpg', 'cambiar png a jpg',
    'jpg a png', 'convertir jpg a png', 'imagen jpg a png',
    'imagen a webp', 'convertir a webp', 'png a webp', 'jpg a webp', 'optimizar imagenes web',
    'webp a jpg', 'convertir webp a jpg', 'webp a png',
    'comprimir imagen', 'reducir tamaño imagen', 'optimizar imagen online', 'comprimir jpg', 'comprimir png',
    'redimensionar imagen', 'cambiar tamaño imagen', 'escalar imagen', 'redimensionar fotos',
    'convertir heic a jpg', 'heic a jpg', 'fotos iphone a jpg',
    'convertir svg a png', 'svg a png', 'vector a imagen',
    'convertir bmp a jpg', 'bmp a jpg', 'bitmap a jpg',

    // TEXTO
    'convertir texto', 'herramientas de texto', 'conversor de texto online',
    'mayusculas a minusculas', 'minusculas a mayusculas', 'convertir texto a mayusculas',
    'title case', 'camelCase', 'pascal case', 'snake case', 'kebab case', 'conversor de casos',
    'contador de palabras', 'contar palabras', 'contador caracteres', 'palabras y caracteres',
    'tiempo de lectura', 'contar parrafos', 'contar oraciones', 'analizar texto',
    'json a csv', 'csv a json', 'convertir json a csv', 'json to csv', 'csv to json',
    'formatear json', 'validar json', 'pretty print json', 'minificar json',
    'convertir csv a excel', 'csv a excel',

    // NUEVOS CONVERSORES
    'calcular edad', 'calculadora de edad', 'cuantos años tengo', 'calcular años vividos',
    'calculadora edad exacta', 'edad en años meses dias', 'calcular edad online',
    'generador qr', 'crear codigo qr', 'qr online', 'generar qr gratis', 'codigo qr personalizado',
    'qr con colores', 'descargar codigo qr', 'qr generator',
    'conversor zona horaria', 'zona horaria', 'cambio de huso horario', 'hora mundial',
    'diferencia horaria', 'que hora es en', 'husos horarios', 'convertir hora',
    'numeros a letras', 'numeros a texto', 'convertir numeros a palabras', 'escribir numeros en letras',
    'numeros a letras euros', 'como se escribe', 'letras de numeros', 'numero en español',

    // ESTATICAS
    'sobre nosotros', 'quienes somos', 'contacto', 'contactar', 'escribirnos', 'soporte',
    'politica de privacidad', 'privacidad online', 'proteccion de datos', 'cookies',
    'procesamiento local', 'seguridad online', 'sin tracking', 'datos seguros', 'navegacion privada',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
