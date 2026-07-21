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
import { PdfToolsWidget } from './widgets/pdf-tools';
import { DocumentConverterWidget } from './widgets/document-converter';
import { AgeCalculatorWidget } from './widgets/age-calculator';
import { QrGeneratorWidget } from './widgets/qr-generator';
import { TimezoneConverterWidget } from './widgets/timezone-converter';
import { NumbersToWordsWidget } from './widgets/numbers-to-words';

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
    case 'pdf-tools':
      return <PdfToolsWidget tool={(converter.widgetConfig?.tool as any) || 'merge'} />;
    case 'document-converter':
      return <DocumentConverterWidget tool={(converter.widgetConfig?.tool as any) || 'word-to-pdf'} />;
    case 'age-calculator':
      return <AgeCalculatorWidget />;
    case 'qr-generator':
      return <QrGeneratorWidget />;
    case 'timezone-converter':
      return <TimezoneConverterWidget />;
    case 'numbers-to-words':
      return <NumbersToWordsWidget />;
    default:
      return <p className="text-slate-400">Widget no disponible todavía.</p>;
  }
}
