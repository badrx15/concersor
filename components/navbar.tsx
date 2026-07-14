'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/converters';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <span className="text-2xl group-hover:scale-110 transition-transform">🔧</span>
          <span className="font-bold text-lg tracking-tight">ConversorPro</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
            Inicio
          </Link>
          <Link href="/conversores" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
            Conversores
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.id}`}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 hover:bg-slate-800/60 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800/60 bg-slate-950/95">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60" onClick={() => setMobileOpen(false)}>
              Inicio
            </Link>
            <Link href="/conversores" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60" onClick={() => setMobileOpen(false)}>
              Conversores
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.id}`}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60"
                onClick={() => setMobileOpen(false)}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
