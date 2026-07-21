'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from './shared';

// All IANA timezone names
const TIMEZONES = (() => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    // Fallback for older browsers
    return [
      'UTC',
      'Europe/Madrid',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Mexico_City',
      'America/Argentina/Buenos_Aires',
      'America/Sao_Paulo',
      'America/Bogota',
      'America/Lima',
      'America/Santiago',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Seoul',
      'Asia/Singapore',
      'Australia/Sydney',
      'Pacific/Auckland',
      'Africa/Cairo',
      'Africa/Johannesburg',
      'Africa/Casablanca',
      'Atlantic/Canary',
    ];
  }
})();

// Group timezones by region
function getRegion(tz: string): string {
  const parts = tz.split('/');
  return parts.length > 1 ? parts[0] : 'Otros';
}

function formatTimezoneOffset(tz: string, now: Date): string {
  const formatter = new Intl.DateTimeFormat('es', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
    minute: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const tzPart = parts.find((p) => p.type === 'timeZoneName');
  return tzPart?.value || '';
}

function getTimeInTimezone(tz: string, date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function getDateInTimezone(tz: string, date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getOffsetMinutes(tz: string, date: Date): number {
  const utc = date.getTime();
  const local = new Date(
    new Intl.DateTimeFormat('es', { timeZone: tz, hour12: false }).format(date)
  ).getTime();
  // More reliable approach
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  return Math.round((tzDate.getTime() - utc) / 60000);
}

export function TimezoneConverterWidget() {
  const [fromTz, setFromTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [toTz, setToTz] = useState('Europe/London');
  const [timeStr, setTimeStr] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  });

  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const tz of TIMEZONES) {
      const region = getRegion(tz);
      if (!groups[region]) groups[region] = [];
      groups[region].push(tz);
    }
    return groups;
  }, []);

  const regionOrder = useMemo(() => {
    // Prioritize common regions
    const priority = ['Europe', 'America', 'Asia', 'Pacific', 'Australia', 'Africa', 'Atlantic'];
    const regions = Object.keys(grouped);
    return [
      ...priority.filter((r) => regions.includes(r)),
      ...regions.filter((r) => !priority.includes(r)),
    ];
  }, [grouped]);

  const referenceDate = useMemo(() => {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    return d;
  }, [dateStr, timeStr]);

  const fromTime = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '—';
    return getTimeInTimezone(fromTz, referenceDate);
  }, [fromTz, referenceDate]);

  const fromDate = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '—';
    return getDateInTimezone(fromTz, referenceDate);
  }, [fromTz, referenceDate]);

  const toTime = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '—';
    return getTimeInTimezone(toTz, referenceDate);
  }, [toTz, referenceDate]);

  const toDate = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '—';
    return getDateInTimezone(toTz, referenceDate);
  }, [toTz, referenceDate]);

  const fromOffset = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '';
    const offset = getOffsetMinutes(fromTz, referenceDate);
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    return `UTC${offset >= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [fromTz, referenceDate]);

  const toOffset = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '';
    const offset = getOffsetMinutes(toTz, referenceDate);
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    return `UTC${offset >= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [toTz, referenceDate]);

  const diffText = useMemo(() => {
    if (isNaN(referenceDate.getTime())) return '';
    const fromOff = getOffsetMinutes(fromTz, referenceDate);
    const toOff = getOffsetMinutes(toTz, referenceDate);
    const diff = toOff - fromOff;
    if (diff === 0) return 'Misma hora';
    const hours = Math.floor(Math.abs(diff) / 60);
    const mins = Math.abs(diff) % 60;
    const sign = diff > 0 ? '+' : '-';
    return `${sign}${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  }, [fromTz, toTz, referenceDate]);

  const swapZones = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  const resultText = `${toTime} ${toTz}`;

  return (
    <div className="space-y-5">
      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Fecha</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Hora</label>
          <input
            type="time"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
          />
        </div>
      </div>

      {/* From zone */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          🕐 Zona origen
        </label>
        <select
          value={fromTz}
          onChange={(e) => setFromTz(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-500 outline-none transition"
        >
          {regionOrder.map((region) => (
            <optgroup key={region} label={region}>
              {grouped[region].map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')} ({formatTimezoneOffset(tz, referenceDate)})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Swap button */}
      <div className="flex justify-center -my-1">
        <button
          onClick={swapZones}
          className="p-2 rounded-full bg-slate-800 border border-slate-700 hover:border-brand-500 hover:bg-slate-700 transition"
          title="Intercambiar zonas"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* To zone */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          🎯 Zona destino
        </label>
        <select
          value={toTz}
          onChange={(e) => setToTz(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-brand-500 outline-none transition"
        >
          {regionOrder.map((region) => (
            <optgroup key={region} label={region}>
              {grouped[region].map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')} ({formatTimezoneOffset(tz, referenceDate)})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Bad result? */}
      {isNaN(referenceDate.getTime()) && (
        <p className="text-amber-400 text-sm">⚠️ Fecha u hora no válida.</p>
      )}

      {/* Result cards */}
      {!isNaN(referenceDate.getTime()) && (
        <div className="grid grid-cols-2 gap-4">
          {/* From card */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">{fromTz.split('/').pop()?.replace(/_/g, ' ')}</div>
            <div className="text-xs text-slate-500">{fromOffset}</div>
            <div className="text-xl sm:text-2xl font-bold text-brand-400 mt-1 tabular-nums">{fromTime}</div>
            <div className="text-xs text-slate-400 mt-1 capitalize">{fromDate}</div>
          </div>

          {/* Diff indicator */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="text-xs text-slate-400 mb-1">{toTz.split('/').pop()?.replace(/_/g, ' ')}</div>
            <div className="text-xs text-slate-500">{toOffset}</div>
            <div className="text-xl sm:text-2xl font-bold text-pink-400 mt-1 tabular-nums">{toTime}</div>
            <div className="text-xs text-slate-400 mt-1 capitalize">{toDate}</div>
          </div>
        </div>
      )}

      {/* Difference badge */}
      {diffText && diffText !== 'Misma hora' && (
        <div className="flex items-center justify-between gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3">
          <span className="text-sm text-slate-300">
            Diferencia horaria: <strong className="text-indigo-300">{diffText}</strong>
          </span>
          <CopyButton text={`${toTime} - ${toTz}`} />
        </div>
      )}
      {diffText === 'Misma hora' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-center text-sm text-green-300">
          Ambas zonas tienen la misma hora 🟢
        </div>
      )}

      {/* Quick comparisons */}
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">🇪🇸 Comparaciones rápidas (con España)</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Nueva York', tz: 'America/New_York' },
            { label: 'Londres', tz: 'Europe/London' },
            { label: 'Tokio', tz: 'Asia/Tokyo' },
            { label: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
            { label: 'México DF', tz: 'America/Mexico_City' },
            { label: 'Sídney', tz: 'Australia/Sydney' },
            { label: 'Dubái', tz: 'Asia/Dubai' },
            { label: 'Canarias', tz: 'Atlantic/Canary' },
          ].map((city) => {
            const time = getTimeInTimezone(city.tz, referenceDate);
            return (
              <button
                key={city.tz}
                onClick={() => {
                  setFromTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
                  setToTz(city.tz);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs font-medium text-slate-300 hover:border-brand-500 transition flex items-center gap-1.5"
              >
                {city.label}
                <span className="text-brand-400 font-semibold tabular-nums">{time}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
