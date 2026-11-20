import granada from '../assets/granada.png';

interface GranadaMarkProps {
  size?: number;
  className?: string;
}

/**
 * Emblema de la marca: la granada (estrella octogonal nazarí) recortada
 * directamente del logo real de Halconero. Es el logotipo de la app de gestión.
 */
export const GranadaMark = ({ size = 40, className = '' }: GranadaMarkProps) => (
  <img
    src={granada}
    width={size}
    height={size}
    className={`object-contain ${className}`}
    alt="Emblema Halconero — Granada"
    draggable={false}
  />
);
