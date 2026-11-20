import type { ReactNode } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Envuelve un CTA para darle efecto magnético (sigue al cursor). */
export const Magnetic = ({ children, className = '', strength = 0.35 }: MagneticProps) => {
  const ref = useMagnetic<HTMLDivElement>(strength);
  return (
    <div ref={ref} className={`inline-flex ${className}`}>
      {children}
    </div>
  );
};
