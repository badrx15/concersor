import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contacto — ConversorPro',
  description: 'Ponte en contacto con el equipo de ConversorPro. Reporta bugs, sugiere herramientas o envía feedback.',
  alternates: { canonical: '/contacto' },
};

export default function ContactPage() {
  return (
    <div className="view-fade max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4">Contacto</h1>
      <p className="text-slate-300 mb-8 text-lg">
        ¿Encontraste un bug? ¿Quieres sugerir un conversor nuevo? ¿Tienes feedback? Escríbenos.
      </p>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div>
          <div className="font-semibold text-slate-100 mb-1">📧 Email</div>
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-400 hover:underline font-bold text-lg">
            {siteConfig.contactEmail}
          </a>
        </div>

        <div>
          <div className="font-semibold text-slate-100 mb-1">💡 Sugerencias</div>
          <p className="text-slate-300">
            Sugerencias de conversores nuevos son bienvenidas — lo que pidas primero es lo que construiremos.
          </p>
        </div>

        <div>
          <div className="font-semibold text-slate-100 mb-1">🐛 Reportar bugs</div>
          <p className="text-slate-300">
            Para reportar bugs incluye el navegador, sistema operativo y los pasos para reproducir el problema.
            Cuanta más información, mejor.
          </p>
        </div>

        <div>
          <div className="font-semibold text-slate-100 mb-1">⏱️ Tiempo de respuesta</div>
          <p className="text-slate-300">
            Respondemos en 24-48 horas laborables. Gracias por tu paciencia.
          </p>
        </div>
      </div>
    </div>
  );
}
