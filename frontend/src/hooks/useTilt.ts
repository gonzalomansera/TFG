import { useRef } from 'react';
import gsap from 'gsap';

export const useTilt = (strength = 15) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const xPct = (x / width - 0.5) * strength;
    const yPct = (y / height - 0.5) * -strength;

    gsap.to(ref.current, {
      rotationY: xPct,
      rotationX: yPct,
      transformPerspective: 1000,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 1,
      ease: "power3.out"
    });
  };

  return { ref, handleMouseMove, handleMouseLeave };
};
