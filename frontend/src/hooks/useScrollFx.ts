import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import type { RefObject } from 'react';

interface ScrollFxOptions {
  /** Dependencias que fuerzan recrear las animaciones (datos async, etc.). */
  deps?: unknown[];
}

/**
 * Efectos de scroll reutilizables, aplicados automáticamente dentro del `scope`.
 *
 * Detecta por sí solo:
 *  - `.parallax-image`  → parallax editorial/cinematográfico (ver spec abajo).
 *  - `[data-reveal]`    → aparición suave al entrar en viewport.
 *  - `[data-reveal-stagger]` hijos → aparición escalonada.
 *
 * Parallax (`.parallax-image`):
 *   scale 0.7 → 1.2 · opacity 0 → 1 · ~600px de recorrido ·
 *   ease "power2.out" · ScrollTrigger con scrub ·
 *   desplazamiento vertical ~20% más lento que el scroll (sensación de profundidad).
 *
 * Respeta `prefers-reduced-motion`: deja el contenido visible sin animar.
 */
export const useScrollFx = (
  scope: RefObject<HTMLElement | null>,
  { deps = [] }: ScrollFxOptions = {},
) => {
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // --- 1. PARALLAX EN IMÁGENES (.parallax-image) ---
      gsap.utils.toArray<HTMLElement>('.parallax-image').forEach((img) => {
        if (reduced) {
          gsap.set(img, { opacity: 1, scale: 1, yPercent: 0 });
          return;
        }
        // Un único tween con scrub: escala + opacidad + deriva vertical.
        // yPercent 12 → -12 hace que la imagen avance ~20% más lenta que el scroll.
        gsap.fromTo(
          img,
          { scale: 0.7, opacity: 0, yPercent: 12 },
          {
            scale: 1.2,
            opacity: 1,
            yPercent: -12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: '+=600',
              scrub: true,
            },
          },
        );
      });

      // --- 2. REVEAL SIMPLE ([data-reveal]) ---
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        if (reduced) {
          gsap.set(el, { opacity: 1, y: 0, clipPath: 'none' });
          return;
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        );
      });

      // --- 3. REVEAL ESCALONADO ([data-reveal-stagger] -> hijos) ---
      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        const children = Array.from(group.children) as HTMLElement[];
        if (reduced) {
          gsap.set(children, { opacity: 1, y: 0, scale: 1 });
          return;
        }
        gsap.fromTo(
          children,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 82%',
            },
          },
        );
      });

      // Recalcula posiciones tras el primer render de imágenes.
      ScrollTrigger.refresh();
    },
    { scope, dependencies: deps },
  );
};
