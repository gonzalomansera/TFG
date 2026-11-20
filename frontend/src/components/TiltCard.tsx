import type { ReactNode } from 'react';
import { useTilt3D } from '../hooks/useTilt3D';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
}

/**
 * Tarjeta con inclinación 3D según el ratón. El contenedor padre debería tener
 * la clase `perspective`. Añade un brillo opcional que sigue al cursor.
 */
export const TiltCard = ({ children, className = '', max = 10, scale = 1.03, glare = true }: TiltCardProps) => {
  const ref = useTilt3D<HTMLDivElement>({ max, scale, glare });
  return (
    <div ref={ref} className={`tilt-3d relative ${className}`}>
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  );
};
