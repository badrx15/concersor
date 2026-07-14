'use client';

import type { Converter } from '@/lib/converters';
import { UnitConverterWidget } from './widgets/unit-converter';
import { CurrencyConverterWidget } from './widgets/currency-converter';
import { PngToJpgWidget } from './widgets/png-to-jpg';
import { ImageToWebpWidget } from './widgets/image-to-webp';
import { CompressImageWidget } from './widgets/compress-image';
import { ImageToPdfWidget } from './widgets/image-to-pdf';
import { PdfToImagesWidget } from './widgets/pdf-to-images';
import { CompressPdfWidget } from './widgets/compress-pdf';
import { CaseConverterWidget } from './widgets/case-converter';
import { WordCounterWidget } from './widgets/word-counter';
import { JsonCsvWidget } from './widgets/json-csv';

interface Props {
  converter: Converter;
}

export function ConverterWidget({ converter }: Props) {
  switch (converter.widget) {
    case 'unit-converter':
      return <UnitConverterWidget config={converter.widgetConfig} />;
    case 'currency-converter':
      return <CurrencyConverterWidget config={converter.widgetConfig} />;
    case 'png-to-jpg':
      return <PngToJpgWidget />;
    case 'image-to-webp':
      return <ImageToWebpWidget />;
    case 'compress-image':
      return <CompressImageWidget />;
    case 'image-to-pdf':
      return <ImageToPdfWidget />;
    case 'pdf-to-images':
      return <PdfToImagesWidget />;
    case 'compress-pdf':
      return <CompressPdfWidget />;
    case 'case-converter':
      return <CaseConverterWidget />;
    case 'word-counter':
      return <WordCounterWidget />;
    case 'json-csv':
      return <JsonCsvWidget />;
    default:
      return <p className="text-slate-400">Widget no disponible todavía.</p>;
  }
}
