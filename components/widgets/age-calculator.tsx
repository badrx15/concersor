'use client';

import { useState, useEffect, useCallback } from 'react';
import { CopyButton } from './shared';

function formatUnit(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

function calculateAge(birthDate: Date, now: Date): AgeResult {
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = now.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { years, months, days, hours, minutes, seconds, totalDays, totalHours, totalMinutes };
}

function getZodiacSign(day: number, month: number): string {
  const signs = [
    { name: '♑ Capricornio', start: [1, 1], end: [1, 19] },
    { name: '♒ Acuario', start: [1, 20], end: [2, 18] },
    { name: '♓ Piscis', start: [2, 19], end: [3, 20] },
    { name: '♈ Aries', start: [3, 21], end: [4, 19] },
    { name: '♉ Tauro', start: [4, 20], end: [5, 20] },
    { name: '♊ Géminis', start: [5, 21], end: [6, 20] },
    { name: '♋ Cáncer', start: [6, 21], end: [7, 22] },
    { name: '♌ Leo', start: [7, 23], end: [8, 22] },
    { name: '♍ Virgo', start: [8, 23], end: [9, 22] },
    { name: '♎ Libra', start: [9, 23], end: [10, 22] },
    { name: '♏ Escorpio', start: [10, 23], end: [11, 21] },
    { name: '♐ Sagitario', start: [11, 22], end: [12, 21] },
    { name: '♑ Capricornio', start: [12, 22], end: [12, 31] },
  ];
  for (const sign of signs) {
    const [sM, sD] = sign.start;
    const [eM, eD] = sign.end;
    if ((month === sM && day >= sD) || (month === eM && day <= eD) || (month > sM && month < eM)) {
      return sign.name;
    }
  }
  return '';
}

function getGeneration(year: number): string {
  if (year >= 2013) return 'Generación Alpha';
  if (year >= 1997) return 'Generación Z (Centennial)';
  if (year >= 1981) return 'Millennial (Gen Y)';
  if (year >= 1965) return 'Generación X';
  if (year >= 1946) return 'Baby Boomer';
  if (year >= 1928) return 'Generación Silenciosa';
  return 'Greatest Generation';
}

function nextBirthday(birthDate: Date, now: Date): { daysUntil: number; nextAge: number } {
  const currentYear = now.getFullYear();
  const nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  if (nextBday <= now) {
    nextBday.setFullYear(currentYear + 1);
  }
  const diff = nextBday.getTime() - now.getTime();
  const daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const nextAge = nextBday.getFullYear() - birthDate.getFullYear();
  return { daysUntil, nextAge };
}

export function AgeCalculatorWidget() {
  const [birthDateStr, setBirthDateStr] = useState('1990-01-01');
  const [now, setNow] = useState(new Date());

  // Tick each second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const birthDate = new Date(birthDateStr + 'T00:00:00');
  const valid = !isNaN(birthDate.getTime()) && birthDate < now;

  const age = valid ? calculateAge(birthDate, now) : null;
  const zodiac = valid ? getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1) : '';
  const generation = valid ? getGeneration(birthDate.getFullYear()) : '';
  const birthday = valid ? nextBirthday(birthDate, now) : null;

  const summary = valid
    ? `${age!.years} años, ${age!.months} meses, ${age!.days} días, ${age!.hours} horas, ${age!.minutes} minutos y ${age!.seconds} segundos`
    : '';

  return (
    <div className="space-y-5">
      {/* Date picker */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          🎂 Fecha de nacimiento
        </label>
        <input
          type="date"
          value={birthDateStr}
          onChange={(e) => setBirthDateStr(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
        />
      </div>

      {!valid && (
        <p className="text-amber-400 text-sm">⚠️ La fecha debe ser anterior a hoy.</p>
      )}

      {valid && age && (
        <>
          {/* Live counter */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { label: 'Años', value: age.years },
              { label: 'Meses', value: age.months },
              { label: 'Días', value: age.days },
              { label: 'Horas', value: age.hours },
              { label: 'Min', value: age.minutes },
              { label: 'Seg', value: age.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-brand-400 tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Summary with copy */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-slate-300 leading-relaxed">
                Tienes <strong className="text-white">{formatUnit(age.years, 'año', 'años')}</strong>,{' '}
                {formatUnit(age.months, 'mes', 'meses')} y {formatUnit(age.days, 'día', 'días')} de edad.
              </div>
              <CopyButton text={summary} className="shrink-0" />
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-cyan-400 tabular-nums">
                {age.totalDays.toLocaleString('es-ES')}
              </div>
              <div className="text-xs text-slate-400">días totales</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-pink-400 tabular-nums">
                {age.totalHours.toLocaleString('es-ES')}
              </div>
              <div className="text-xs text-slate-400">horas totales</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-amber-400 tabular-nums">
                {age.totalMinutes.toLocaleString('es-ES')}
              </div>
              <div className="text-xs text-slate-400">minutos totales</div>
            </div>
          </div>

          {/* Fun facts */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300">
              {zodiac}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-xs font-semibold text-green-300">
              {generation}
            </span>
            {birthday && (
              <span className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
                🎉 Próximo cumple: {birthday.daysUntil === 0 ? '¡Hoy!' : `en ${birthday.daysUntil} días (${birthday.nextAge} años)`}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
