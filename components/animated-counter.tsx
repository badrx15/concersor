'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  label: string;
  icon: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2000,
  label,
  icon,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * end);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const displayValue = hasAnimated
    ? count.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : '0';

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-sm ${className}`}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {prefix}{displayValue}{suffix}
      </span>
      <span className="text-sm text-slate-400 mt-1 text-center">{label}</span>
    </div>
  );
}
