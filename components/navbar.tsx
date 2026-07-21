'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORIES, CONVERTERS } from '@/lib/converters';

const POPULAR_SLUGS = [
  'kilometros-a-millas',
  'euros-a-dolares',
  'celsius-a-fahrenheit',
  'png-a-jpg',
  'comprimir-pdf',
  'contador-palabras',
  'mayusculas-a-minusculas',
  'generador-qr',
];

const POPULAR_CONVERTERS = POPULAR_SLUGS
  .map((s) => CONVERTERS.find((c) => c.slug === s))
  .filter(Boolean) as typeof CONVERTERS;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcut: CMD+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll on mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const searchResults = searchQuery.trim()
    ? CONVERTERS.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const closeAll = useCallback(() => {
    setMobileOpen(false);
    setSearchQuery('');
    setSearchFocused(false);
    setOpenDropdown(null);
  }, []);

  const handleDropdownEnter = (id: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // Category converters grouped
  const getCategoryConverters = (catId: string) =>
    CONVERTERS.filter((c) => c.category === catId).slice(0, 6);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={closeAll}>
          <span className="text-2xl group-hover:scale-110 transition-transform">🔧</span>
          <span className="font-bold text-lg tracking-tight hidden sm:inline">ConversorPro</span>
        </Link>

        {/* Search bar - Desktop */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-md relative">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Buscar conversor... (⌘K)"
              aria-label="Buscar conversor"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
              {searchResults.length > 0 ? (
                <div className="py-2 max-h-80 overflow-y-auto">
                  {searchResults.map((c) => {
                    const cat = CATEGORIES.find((cat) => cat.id === c.category);
                    return (
                      <Link
                        key={c.slug}
                        href={`/conversor/${c.slug}`}
                        onClick={closeAll}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/60 transition"
                      >
                        <span className="text-xl shrink-0">{c.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white truncate">{c.name}</div>
                          <div className="text-xs text-slate-400 truncate">{c.metaDescription.slice(0, 60)}...</div>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: c.color + '33', color: c.color }}
                        >
                          {cat?.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No se encontró &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0.5">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          >
            Inicio
          </Link>

          {/* Category dropdowns */}
          {CATEGORIES.map((cat) => {
            const tools = getCategoryConverters(cat.id);
            const isOpen = openDropdown === cat.id;
            return (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(cat.id)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={`/categoria/${cat.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isOpen
                      ? 'text-white bg-slate-800/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Link>

                {isOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                    onMouseEnter={() => handleDropdownEnter(cat.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="p-3 border-b border-slate-800">
                      <Link
                        href={`/categoria/${cat.id}`}
                        onClick={closeAll}
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{ color: cat.color }}
                      >
                        {cat.icon} Ver todos los de {cat.name}
                        <span className="text-xs ml-auto">→</span>
                      </Link>
                    </div>
                    <div className="py-2">
                      {tools.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/conversor/${c.slug}`}
                          onClick={closeAll}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800/60 transition"
                        >
                          <span className="text-lg shrink-0">{c.icon}</span>
                          <span className="text-sm text-slate-200 truncate">{c.name}</span>
                        </Link>
                      ))}
                      {CONVERTERS.filter((c) => c.category === cat.id).length > 6 && (
                        <Link
                          href={`/categoria/${cat.id}`}
                          onClick={closeAll}
                          className="block px-4 py-2 text-xs text-brand-400 hover:bg-slate-800/60 transition"
                        >
                          +{CONVERTERS.filter((c) => c.category === cat.id).length - 6} más...
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* All converters link */}
          <Link
            href="/conversores"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          >
            Todos
          </Link>
        </div>

        {/* Mobile: Search icon + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          {/* Mobile search toggle */}
          <button
            onClick={() => {
              if (!searchFocused) {
                setSearchFocused(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              } else {
                setSearchFocused(false);
                setSearchQuery('');
              }
            }}
            className="p-2 hover:bg-slate-800/60 rounded-lg"
            aria-label="Buscar"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          <button
            className="p-2 hover:bg-slate-800/60 rounded-lg"
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
      </div>

      {/* Mobile search bar (inline) */}
      {searchFocused && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-800/60 bg-slate-950/95">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-brand-500 outline-none transition"
              autoFocus
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {/* Search results inline */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((c) => {
                  const cat = CATEGORIES.find((cat) => cat.id === c.category);
                  return (
                    <Link
                      key={c.slug}
                      href={`/conversor/${c.slug}`}
                      onClick={closeAll}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 transition"
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-sm text-white truncate flex-1">{c.name}</span>
                      {cat && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: cat.color + '33', color: cat.color }}
                        >
                          {cat.name}
                        </span>
                      )}
                    </Link>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-400">
                  No se encontró &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile full menu overlay */}
      {mobileOpen && !searchFocused && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-950/98 backdrop-blur-md z-40 overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile search inside menu */}
            <button
              onClick={() => {
                setMobileOpen(false);
                setSearchFocused(true);
                setTimeout(() => searchInputRef.current?.focus(), 200);
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 text-sm mb-3 hover:border-brand-500 transition"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Buscar conversor...
            </button>

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60 transition"
              onClick={() => setMobileOpen(false)}
            >
              <span className="w-6 text-center">🏠</span>
              Inicio
            </Link>
            <Link
              href="/conversores"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60 transition"
              onClick={() => setMobileOpen(false)}
            >
              <span className="w-6 text-center">📋</span>
              Todos los conversores
            </Link>

            {/* Category sections with converters */}
            <div className="mt-2 space-y-3">
              {CATEGORIES.map((cat) => {
                const tools = CONVERTERS.filter((c) => c.category === cat.id);
                return (
                  <div key={cat.id}>
                    <Link
                      href={`/categoria/${cat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition"
                      style={{ color: cat.color, background: cat.color + '11' }}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                      <span className="ml-auto text-xs opacity-60">{tools.length}</span>
                    </Link>
                    <div className="ml-4 mt-1 space-y-0.5">
                      {tools.slice(0, 5).map((c) => (
                        <Link
                          key={c.slug}
                          href={`/conversor/${c.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60 transition"
                        >
                          <span>{c.icon}</span>
                          <span className="truncate">{c.name}</span>
                        </Link>
                      ))}
                      {tools.length > 5 && (
                        <Link
                          href={`/categoria/${cat.id}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-xs text-brand-400 hover:bg-slate-800/60 transition rounded-lg"
                        >
                          +{tools.length - 5} más...
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer links */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex gap-4 text-xs text-slate-500">
              <Link href="/sobre-nosotros" onClick={() => setMobileOpen(false)} className="hover:text-white transition">
                Sobre nosotros
              </Link>
              <Link href="/privacidad" onClick={() => setMobileOpen(false)} className="hover:text-white transition">
                Privacidad
              </Link>
              <Link href="/contacto" onClick={() => setMobileOpen(false)} className="hover:text-white transition">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
