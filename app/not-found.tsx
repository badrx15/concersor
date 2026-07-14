import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="view-fade max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-slate-400 text-lg mb-8">
        La página que buscas no existe o fue movida. Quizás el conversor que buscas está en nuestra lista.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold transition hover:scale-105"
        >
          ← Volver al inicio
        </Link>
        <Link
          href="/conversores"
          className="px-6 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-white font-semibold transition"
        >
          Ver todos los conversores
        </Link>
      </div>
    </div>
  );
}
