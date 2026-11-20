import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registro único de los plugins de GSAP para toda la app.
gsap.registerPlugin(ScrollTrigger);

/** True si el usuario ha pedido reducir el movimiento. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
