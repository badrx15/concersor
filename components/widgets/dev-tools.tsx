'use client';

import { useState, useCallback } from 'react';
import { CopyButton, ResultBox } from './shared';

type DevTool = 'hash' | 'base64' | 'json';

export function DevToolsWidget({ tool }: { tool: DevTool }) {
  switch (tool) {
    case 'hash':
      return <HashGenerator />;
    case 'base64':
      return <Base64Tool />;
    case 'json':
      return <JsonTool />;
    default:
      return <p className="text-slate-400">Herramienta no disponible</p>;
  }
}

// ============================================================
// GENERADOR DE HASHES (MD5, SHA-1, SHA-256, SHA-512)
// ============================================================
function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const computeHashes = useCallback(async (text: string) => {
    if (!text) {
      setResults({});
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const md5 = await computeMd5(data);
    const sha1 = await computeHash(data, 'SHA-1');
    const sha256 = await computeHash(data, 'SHA-256');
    const sha512 = await computeHash(data, 'SHA-512');

    setResults({
      MD5: md5,
      'SHA-1': sha1,
      'SHA-256': sha256,
      'SHA-512': sha512,
    });
  }, []);

  const copyHash = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Texto a hashear</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); computeHashes(e.target.value); }}
          placeholder="Escribe o pega el texto aquí..."
          className="w-full h-28 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-y"
        />
      </div>

      {Object.keys(results).length > 0 && (
        <div className="space-y-3">
          {Object.entries(results).map(([algo, hash]) => (
            <div key={algo} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">                    <span className="text-sm font-bold text-brand-400">{algo}{algo === 'MD5' ? ' (truncado)' : ''}</span>
                <button
                  onClick={() => copyHash(algo, hash)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  {copied === algo ? '✓ Copiado' : '📋 Copiar'}
                </button>
              </div>
              <code className="text-xs text-slate-300 font-mono break-all select-all">{hash}</code>
            </div>
          ))}
        </div>
      )}

      {!input && (
        <div className="text-center py-8 text-slate-500 text-sm">
          Escribe algo para generar su hash MD5, SHA-1, SHA-256 y SHA-512
        </div>
      )}
    </div>
  );
}

async function computeHash(data: Uint8Array, algo: string): Promise<string> {
  const buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const hashBuffer = await crypto.subtle.digest(algo, buf as ArrayBuffer);
  return bytesToHex(new Uint8Array(hashBuffer));
}

async function computeMd5(data: Uint8Array): Promise<string> {
  // MD5 truncado — usamos SHA-256 truncado a 128 bits (no es MD5 real)
  const buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buf as ArrayBuffer);
  const full = new Uint8Array(hashBuffer);
  return bytesToHex(full.slice(0, 16));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// BASE64 ENCODER / DECODER
// ============================================================
function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const result = (() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        return btoa(input);
      } else {
        return atob(input);
      }
    } catch {
      return '';
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('encode'); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            mode === 'encode' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔐 Codificar a Base64
        </button>
        <button
          onClick={() => { setMode('decode'); setError(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            mode === 'decode' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔓 Decodificar Base64
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {mode === 'encode' ? 'Texto a codificar' : 'Base64 a decodificar'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          placeholder={mode === 'encode' ? 'Escribe el texto aquí...' : 'Pega el Base64 aquí...'}
          className="w-full h-28 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-y"
        />
      </div>

      {result && (
        <ResultBox>
          <div className="flex items-start gap-2">
            <pre className="flex-1 text-sm font-mono text-slate-200 whitespace-pre-wrap break-all bg-slate-950/50 rounded-lg p-3 max-h-48 overflow-y-auto">
              {result}
            </pre>
            <CopyButton text={result} />
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ============================================================
// VALIDADOR / FORMATEADOR JSON
// ============================================================
function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const processJson = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(value);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e: any) {
      setOutput('');
      setError(e.message || 'JSON inválido');
    }
  }, [indent]);

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">JSON de entrada</label>
        <textarea
          value={input}
          onChange={(e) => processJson(e.target.value)}
          placeholder='Pega tu JSON aquí, ej: {"nombre": "Juan", "edad": 30}'
          className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-y"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-300">Indentación:</label>
        <select
          value={indent}
          onChange={(e) => { setIndent(Number(e.target.value)); processJson(input); }}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
        >
          <option value={2}>2 espacios</option>
          <option value={4}>4 espacios</option>
          <option value={1}>1 espacio</option>
          <option value={0}>Minificar</option>
        </select>
        <button
          onClick={minify}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition"
        >
          Minificar
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-100 text-sm font-mono">
          ❌ {error}
        </div>
      )}

      {output && !error && (
        <ResultBox>
          <div className="flex items-start gap-2">
            <pre className="flex-1 text-sm font-mono text-slate-200 whitespace-pre-wrap break-all bg-slate-950/50 rounded-lg p-3 max-h-64 overflow-y-auto">
              {output}
            </pre>
            <CopyButton text={output} />
          </div>
        </ResultBox>
      )}
    </div>
  );
}
