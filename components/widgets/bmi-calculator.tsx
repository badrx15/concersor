'use client';

import { useState, useMemo } from 'react';
import { InputGroup } from './shared';

type Units = 'metric' | 'imperial';

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 16) return { label: 'Desnutrición severa', color: '#ef4444' };
  if (bmi < 17) return { label: 'Desnutrición moderada', color: '#f97316' };
  if (bmi < 18.5) return { label: 'Bajo peso', color: '#eab308' };
  if (bmi < 25) return { label: 'Normal', color: '#22c55e' };
  if (bmi < 30) return { label: 'Sobrepeso', color: '#eab308' };
  if (bmi < 35) return { label: 'Obesidad grado I', color: '#f97316' };
  if (bmi < 40) return { label: 'Obesidad grado II', color: '#ef4444' };
  return { label: 'Obesidad grado III', color: '#dc2626' };
}

export function BmiCalculatorWidget() {
  const [units, setUnits] = useState<Units>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  const bmi = useMemo(() => {
    const w = parseFloat(weight);
    if (units === 'metric') {
      const h = parseFloat(height) / 100;
      if (!w || !h || h <= 0) return null;
      return w / (h * h);
    } else {
      const hFt = parseFloat(feet) || 0;
      const hIn = parseFloat(inches) || 0;
      const totalInches = hFt * 12 + hIn;
      if (!w || !totalInches) return null;
      return (w / (totalInches * totalInches)) * 703;
    }
  }, [units, weight, height, feet, inches]);

  const category = bmi ? getBmiCategory(bmi) : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700">
        <button onClick={() => setUnits('metric')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${units === 'metric' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          Métrico (kg/cm)
        </button>
        <button onClick={() => setUnits('imperial')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${units === 'imperial' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          Imperial (lb/ft)
        </button>
      </div>

      <InputGroup label={"Peso (" + (units === 'metric' ? 'kg' : 'libras') + ")"} tooltip="Tu peso corporal actual. En el sistema métrico usa kilogramos (kg), en el imperial usa libras (lb).">
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={units === 'metric' ? 'Ej: 70' : 'Ej: 154'} className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
      </InputGroup>

      {units === 'metric' ? (
        <InputGroup label="Altura (cm)" tooltip="Tu estatura en centímetros. Ejemplo: 175 cm es una altura común.">
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ej: 175" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
        </InputGroup>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <InputGroup label="Pies" tooltip={'La parte entera de tu altura en pies. Ejemplo: 5 pies para una altura de 5\'9".'}>

            <input type="number" value={feet} onChange={e => setFeet(e.target.value)} placeholder="Ej: 5" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </InputGroup>
          <InputGroup label="Pulgadas" tooltip={'Las pulgadas restantes de tu altura. Ejemplo: 9 pulgadas para una altura de 5\'9".'}>

            <input type="number" value={inches} onChange={e => setInches(e.target.value)} placeholder="Ej: 9" className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500" />
          </InputGroup>
        </div>
      )}

      {bmi !== null && bmi > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-center">
            <span className="text-4xl font-bold" style={{ color: category?.color }}>{bmi.toFixed(1)}</span>
            <p className="text-sm text-slate-400 mt-1">Índice de Masa Corporal</p>
          </div>
          {category && (
            <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: category.color + '20', borderColor: category.color + '40', borderWidth: 1 }}>
              <span className="font-semibold" style={{ color: category.color }}>{category.label}</span>
            </div>
          )}
          <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden relative">
            {[{ at: 16, color: '#ef4444' }, { at: 18.5, color: '#eab308' }, { at: 25, color: '#22c55e' }, { at: 30, color: '#eab308' }, { at: 35, color: '#f97316' }].map((s, i) => (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: `${(s.at / 50) * 100}%`, width: '2px', backgroundColor: s.color, zIndex: 1 }} />
            ))}
            <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-yellow-500 to-red-500" />
            <div className="absolute top-0 bottom-0 w-4 h-4 rounded-full bg-white border-2 border-brand-600 -translate-y-1/4 -ml-2 shadow-lg" style={{ left: `${Math.min((bmi / 50) * 100, 100)}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span>
          </div>
        </div>
      )}
    </div>
  );
}
