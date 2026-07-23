'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FileDrop, DownloadButton, ErrorBox, formatBytes } from './shared';

type GifMode = 'video-to-gif' | 'gif-to-video';

export function GifVideoWidget() {
  const [mode, setMode] = useState<GifMode>('video-to-gif');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result]);

  const getAccept = () => mode === 'video-to-gif' ? 'video/mp4,video/webm,video/avi,.mp4,.webm,.avi,.mov,.mkv' : '.gif';

  // ====================================================================
  // Video → GIF (usa gif.js)
  // ====================================================================
  async function videoToGif(file: File): Promise<Blob> {
    const GIF = (await import('gif.js')).default;

    // Crear elemento de video para leer frames
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.currentTime = 0.01; // Forzar carga
        resolve();
      };
      video.onerror = () => reject(new Error('No se pudo cargar el video'));
      // Timeout safety
      setTimeout(() => { if (!video.videoWidth) reject(new Error('Formato de video no soportado')); }, 5000);
      video.load();
    });
    // Esperar a que el video esté listo
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      setTimeout(resolve, 1000);
    });

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) throw new Error('No se pudo determinar las dimensiones del video');

    // Calcular dimensiones (máx 480px de ancho para GIFs manejables)
    const maxW = 480;
    const scale = Math.min(1, maxW / vw);
    const outW = Math.round(vw * scale);
    const outH = Math.round(vh * scale);

    // Capturar frames
    const duration = video.duration;
    const fps = 10; // 10 fps para GIFs fluidos pero no muy pesados
    const totalFrames = Math.min(Math.round(duration * fps), 150); // máx 150 frames
    const interval = duration / totalFrames;

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo crear el contexto');

    // Crear encoder GIF
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: outW,
      height: outH,
      workerScript: '/gif.worker.js',
    });

    for (let i = 0; i < totalFrames; i++) {
      setProgress(`Capturando frame ${i + 1} de ${totalFrames}...`);
      video.currentTime = i * interval;
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
        // Fallback por si el evento no se dispara
        setTimeout(resolve, 200);
      });
      ctx.drawImage(video, 0, 0, outW, outH);
      gif.addFrame(ctx, { copy: true, delay: 1000 / fps });
    }

    try {
      setProgress('Generando GIF...');
      const gifBlob = await new Promise<Blob>((resolve, reject) => {
        gif.on('finished', (blob: Blob) => resolve(blob));
        (gif as any).on('error', (e: Error) => reject(e));
        try { gif.render(); } catch (e) { reject(e); }
      });
      return gifBlob;
    } finally {
      URL.revokeObjectURL(url);
      video.remove();
    }
  }

  // ====================================================================
  // GIF → Video (usa gifuct-js + canvas + MediaRecorder)
  // ====================================================================
  async function gifToVideo(file: File): Promise<Blob> {
    const { parseGIF, decompressFrames } = await import('gifuct-js');

    const data = await file.arrayBuffer();
    const rawGif = parseGIF(data);
    const frames = decompressFrames(rawGif, true); // true = buildPatch

    if (!frames.length) throw new Error('No se encontraron frames en el GIF');

    const fw = frames[0].dims.width;
    const fh = frames[0].dims.height;

    const canvas = document.createElement('canvas');
    canvas.width = fw;
    canvas.height = fh;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo crear el contexto');

    // Verificar soporte de MediaRecorder
    if (typeof MediaRecorder === 'undefined') {
      throw new Error('Tu navegador no soporta la grabación de video. Prueba con Chrome o Firefox.');
    }

    // Crear stream del canvas y grabarlo con MediaRecorder
    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

    const videoBlob = await new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };
      recorder.onerror = () => reject(new Error('Error al grabar el video'));

      recorder.start();

      // Reproducir frames
      let frameIdx = 0;
      let lastTime = performance.now();

      function renderFrame() {
        if (frameIdx >= frames.length || recorder.state === 'inactive') {
          recorder.stop();
          return;
        }

        const frame = frames[frameIdx];
        const delay = frame.delay * 10; // centiseconds → ms

        // Dibujar frame
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        );
        // Si el frame tiene parche, aplicarlo sobre el canvas
        if (frame.disposalType === 2) {
          // Clear to background
          ctx!.clearRect(0, 0, fw, fh);
        }
        ctx!.putImageData(imageData, frame.dims.left, frame.dims.top);

        setProgress(`Procesando frame ${frameIdx + 1} de ${frames.length}...`);

        frameIdx++;
        const elapsed = performance.now() - lastTime;
        const wait = Math.max(0, delay - elapsed);
        setTimeout(renderFrame, wait);
        lastTime = performance.now();
      }

      renderFrame();
    });

    return videoBlob;
  }

  // ====================================================================
  // Main convert
  // ====================================================================
  const convert = useCallback(async () => {
    if (!file) { setError('Selecciona un archivo'); return; }
    setBusy(true); setError(''); setResult(null); setProgress('');

    try {
      let blob: Blob;
      let outputName: string;

      if (mode === 'video-to-gif') {
        blob = await videoToGif(file);
        outputName = file.name.replace(/\.[^.]+$/, '') + '.gif';
      } else {
        blob = await gifToVideo(file);
        outputName = file.name.replace(/\.[^.]+$/, '') + '.webm';
      }

      setResult({ url: URL.createObjectURL(blob), name: outputName, size: blob.size });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'SecurityError') {
        setError('Error de permisos: asegúrate de usar un archivo local y no de otro origen.');
      } else {
        setError(e instanceof Error ? e.message : 'Error al convertir');
      }
    } finally {
      setBusy(false);
      setProgress('');
    }
  }, [mode, file]);

  return (
    <div className="space-y-4">
      {/* Selector de modo */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700">
        <button
          onClick={() => { setMode('video-to-gif'); setResult(null); setError(''); }}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
            mode === 'video-to-gif'
              ? 'bg-brand-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🎬 Video → GIF
        </button>
        <button
          onClick={() => { setMode('gif-to-video'); setResult(null); setError(''); }}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
            mode === 'gif-to-video'
              ? 'bg-brand-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🖼️ GIF → Video
        </button>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
        {mode === 'video-to-gif' ? (
          <>🎬 Convierte tus videos (MP4, WebM, MOV) a GIF animado. 100% local, sin servidores.</>
        ) : (
          <>🖼️ Convierte GIFs animados a video WebM. 100% local, tus archivos no se suben.</>
        )}
      </div>

      <FileDrop
        accept={getAccept()}
        onFiles={(f) => { setFile(f[0]); setResult(null); }}
        label={mode === 'video-to-gif' ? 'Selecciona un video (MP4, WebM, MOV)' : 'Selecciona un GIF animado'}
      />

      {file && (
        <div className="text-sm text-slate-400">
          📎 {file.name} ({formatBytes(file.size)})
        </div>
      )}

      <button
        onClick={convert}
        disabled={busy || !file}
        className="w-full px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-pink-500 text-white disabled:opacity-50 transition hover:shadow-lg hover:shadow-brand-600/25 active:scale-[0.98]"
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {progress || 'Procesando...'}
          </span>
        ) : (
          mode === 'video-to-gif' ? '🎬 Convertir a GIF' : '🖼️ Convertir a Video'
        )}
      </button>

      {error && <ErrorBox message={error} />}

      {result && (
        <div className="mt-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold">Resultado</h3>
          </div>
          {mode === 'gif-to-video' ? (
            <video
              src={result.url}
              controls
              className="max-h-48 rounded-lg border border-slate-700 mb-3 mx-auto"
            />
          ) : (
            <img
              src={result.url}
              alt="Vista previa GIF"
              className="max-h-48 rounded-lg border border-slate-700 mb-3 mx-auto"
            />
          )}
          <div className="text-sm text-slate-400 mb-1">
            📐 {result.name} ({formatBytes(result.size)})
          </div>
          <DownloadButton href={result.url} name={result.name} />
        </div>
      )}
    </div>
  );
}
