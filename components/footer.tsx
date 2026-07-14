import Link from 'next/link';
import { CATEGORIES } from '@/lib/converters';
import { siteConfig } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="bg-slate-900/60 border-t border-slate-800/60 py-10 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔧</span>
              <span className="font-bold">ConversorPro</span>
            </Link>
            <p className="text-xs text-slate-500">
              Conversores online gratis y privados. Sin registro, sin subidas.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 text-slate-300">Categorías</h4>
            <ul className="space-y-1 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categoria/${cat.id}`} className="text-slate-400 hover:text-white transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 text-slate-300">Web</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/conversores" className="text-slate-400 hover:text-white transition">Todos los conversores</Link></li>
              <li><Link href="/sobre-nosotros" className="text-slate-400 hover:text-white transition">Sobre nosotros</Link></li>
              <li><Link href="/privacidad" className="text-slate-400 hover:text-white transition">Privacidad</Link></li>
              <li><Link href="/contacto" className="text-slate-400 hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 text-slate-300">Info</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-slate-400">Esta web usa Google AdSense.</li>
              <li>
                <a href="https://adssettings.google.com/" target="_blank" rel="noopener" className="text-brand-400 hover:underline">
                  Gestionar anuncios
                </a>
              </li>
              <li className="text-slate-500 text-xs mt-2">📧 {siteConfig.contactEmail}</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-800/60 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} {siteConfig.name} · Hecho con cariño · Privacidad primero
        </div>
      </div>
    </footer>
  );
}
