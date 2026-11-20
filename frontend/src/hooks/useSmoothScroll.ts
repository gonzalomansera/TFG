import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

/**
 * Smooth-scroll global con Lenis, sincronizado con GSAP ScrollTrigger.
 * Se desactiva automáticamente si el usuario tiene activado
 * `prefers-reduced-motion`, usando el scroll nativo.
 *
 * Debe montarse una sola vez, a nivel de App.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // Mantiene ScrollTrigger en sincronía con el scroll suavizado.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
};
