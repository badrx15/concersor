'use client';

import dynamic from 'next/dynamic';
import type { Converter } from '@/lib/converters';
import { UnitConverterWidget } from './widgets/unit-converter';
import { CurrencyConverterWidget } from './widgets/currency-converter';
import { PngToJpgWidget } from './widgets/png-to-jpg';
import { ImageToWebpWidget } from './widgets/image-to-webp';
import { CompressImageWidget } from './widgets/compress-image';
import { CaseConverterWidget } from './widgets/case-converter';
import { WordCounterWidget } from './widgets/word-counter';
import { JsonCsvWidget } from './widgets/json-csv';
import { AgeCalculatorWidget } from './widgets/age-calculator';
import { QrGeneratorWidget } from './widgets/qr-generator';
import { TimezoneConverterWidget } from './widgets/timezone-converter';
import { NumbersToWordsWidget } from './widgets/numbers-to-words';
import { DevToolsWidget } from './widgets/dev-tools';
import { BarcodeGeneratorWidget } from './widgets/barcode-generator';
import { UtilityToolsWidget } from './widgets/utility-tools';
import { HeicToJpgWidget } from './widgets/heic-to-jpg';
import { GifVideoWidget } from './widgets/gif-video';
import { PercentageCalculatorWidget } from './widgets/percentage-calculator';
import { BmiCalculatorWidget } from './widgets/bmi-calculator';
import { PasswordGeneratorWidget } from './widgets/password-generator';
import { VatCalculatorWidget } from './widgets/vat-calculator';
import { DateDifferenceWidget } from './widgets/date-difference';
import { DiscountCalculatorWidget } from './widgets/discount-calculator';

// Skeleton para widgets lazy
function WidgetSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 bg-slate-800/50 rounded-xl" />
      <div className="h-10 bg-slate-800/30 rounded-xl w-2/3" />
      <div className="h-10 bg-slate-800/30 rounded-xl w-1/2" />
      <div className="h-12 bg-gradient-to-r from-brand-600/30 to-pink-500/30 rounded-xl" />
    </div>
  );
}

// Widgets con librerías solo-navegador (ssr: false)
const PdfToolsWidget = dynamic(() => import('./widgets/pdf-tools').then((m) => m.PdfToolsWidget), { ssr: false, loading: WidgetSkeleton });
const CompressPdfWidget = dynamic(() => import('./widgets/compress-pdf').then((m) => m.CompressPdfWidget), { ssr: false, loading: WidgetSkeleton });
const ImageToPdfWidget = dynamic(() => import('./widgets/image-to-pdf').then((m) => m.ImageToPdfWidget), { ssr: false, loading: WidgetSkeleton });
const PdfToImagesWidget = dynamic(() => import('./widgets/pdf-to-images').then((m) => m.PdfToImagesWidget), { ssr: false, loading: WidgetSkeleton });
const DocumentConverterWidget = dynamic(() => import('./widgets/document-converter').then((m) => m.DocumentConverterWidget), { ssr: false, loading: WidgetSkeleton });

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
    case 'dev-tools':
      return <DevToolsWidget tool={(converter.widgetConfig?.tool as any) || 'hash'} />;
    case 'barcode-generator':
      return <BarcodeGeneratorWidget />;
    case 'heic-to-jpg':
      return <HeicToJpgWidget />;
    case 'gif-video':
      return <GifVideoWidget />;
    case 'percentage-calculator':
      return <PercentageCalculatorWidget />;
    case 'bmi-calculator':
      return <BmiCalculatorWidget />;
    case 'password-generator':
      return <PasswordGeneratorWidget />;
    case 'vat-calculator':
      return <VatCalculatorWidget />;
    case 'date-difference':
      return <DateDifferenceWidget />;
    case 'discount-calculator':
      return <DiscountCalculatorWidget />;
    case 'utility-tools':
      return <UtilityToolsWidget tool={(converter.widgetConfig?.tool as any) || 'markdown'} />;
    default:
      return <p className="text-slate-400">Widget no disponible todavía.</p>;
  }
}
