import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsap';

interface Tilt3DOptions {
  /** Inclinación máxima en grados. */
  max?: number;
  /** Escala al pasar el ratón. */
  scale?: number;
  /** Mostrar brillo que sigue al cursor (requiere un hijo .tilt-glare). */
  glare?: boolean;
}

/**
 * Efecto 3D de inclinación según la posición del ratón (perspectiva).
 * El elemento devuelto debe tener la clase `.tilt-3d`. Opcionalmente un hijo
 * `.tilt-glare` recibe un brillo que sigue al cursor.
 *
 * Se desactiva en punteros gruesos (táctil) y con prefers-reduced-motion.
 */
export const useTilt3D = <T extends HTMLElement = HTMLDivElement>({
  max = 12,
  scale = 1.03,
  glare = false,
}: Tilt3DOptions = {}) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const xTo = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
    const sTo = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3' });
    const glareEl = glare ? el.querySelector<HTMLElement>('.tilt-glare') : null;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      xTo(gsap.utils.interpolate(-max, max, px));
      yTo(gsap.utils.interpolate(max, -max, py));
      if (glareEl) {
        glareEl.style.setProperty('--gx', `${px * 100}%`);
        glareEl.style.setProperty('--gy', `${py * 100}%`);
        glareEl.style.opacity = '1';
      }
    };
    const onEnter = () => sTo(scale);
    const onLeave = () => {
      xTo(0); yTo(0); sTo(1);
      if (glareEl) glareEl.style.opacity = '0';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [max, scale, glare]);

  return ref;
};
