import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Star, Instagram, MapPin } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { useApi } from '../hooks/useApi';
import { useScrollFx } from '../hooks/useScrollFx';
import { TiltCard } from '../components/TiltCard';
import { Magnetic } from '../components/Magnetic';
import type { Obra, Resena } from '../types/AppContextType';
import { getImageUrl } from '../utils/imageHelper';
import { OBRAS_INSTAGRAM, DEMO_RESENAS } from '../lib/demoData';
import { GRANADA_IMAGES } from '../lib/granadaImages';
import logo from '../assets/logoJose.png';

const PROCESO = [
  { n: '01', t: 'Cuéntame tu idea', d: 'Hablamos de tu proyecto: concepto, tamaño, zona del cuerpo y referencias. Cada tatuaje parte de una conversación.' },
  { n: '02', t: 'Diseño a medida', d: 'Preparo el diseño contigo, adaptado a tu idea, al tamaño y a la zona del cuerpo.' },
  { n: '03', t: 'Sesión y cuidado', d: 'Tatuamos en un entorno limpio y relajado. Te acompaño con todas las indicaciones de cuidado posterior.' },
];

export const Home = () => {
  const { request } = useApi();
  const [obras, setObras] = useState<Obra[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const obrasData = await request<Obra[]>('/obras/');
      if (obrasData) setObras(obrasData);
      const resenasData = await request<Resena[]>('/resenas/');
      if (resenasData) setResenas(resenasData.slice(0, 3));
    } catch (e) {
      console.error('Error cargando datos:', e);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

  const testimonios = resenas.length > 0 ? resenas : DEMO_RESENAS;

  // Si aún no hay obras subidas desde el panel, usamos sus trabajos de Instagram
  const data = obras.length > 0 ? obras : OBRAS_INSTAGRAM;
  const destacadas = data.slice(0, 5);
  const feature = data[0];

  // Intro del hero al montar
  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set('.hero-reveal, .hero-char, .hero-logo', { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.hero-char', { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.06 })
      .fromTo('.hero-logo', { opacity: 0, scale: 0.9, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.3 }, '-=0.6')
      .fromTo('.hero-reveal', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, '-=0.8');
  }, { scope: heroRef });

  // Parallax 3D del hero según el ratón
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const bgX = gsap.quickTo(heroBgRef.current, 'xPercent', { duration: 1, ease: 'power3' });
    const bgY = gsap.quickTo(heroBgRef.current, 'yPercent', { duration: 1, ease: 'power3' });
    const cX = gsap.quickTo(heroContentRef.current, 'x', { duration: 0.9, ease: 'power3' });
    const cY = gsap.quickTo(heroContentRef.current, 'y', { duration: 0.9, ease: 'power3' });
    const rY = gsap.quickTo(heroContentRef.current, 'rotationY', { duration: 0.9, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      bgX(px * -3); bgY(py * -3);
      cX(px * 26); cY(py * 18); rY(px * 6);
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  useScrollFx(containerRef, { deps: [obras, resenas] });

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] text-white font-light relative">
      <div className="grain-overlay" aria-hidden="true" />

      {/* ============== HERO ============== */}
      <section ref={heroRef} className="perspective relative min-h-[100svh] flex flex-col justify-center overflow-hidden px-6">
        {/* Montaje de imágenes que se deslizan lentamente */}
        <div ref={heroBgRef} className="absolute inset-0 -z-10 scale-110">
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 opacity-[0.3]">
            {[0, 1, 2, 3].map((col) => {
              const colImgs = [GRANADA_IMAGES[(col * 2) % GRANADA_IMAGES.length], GRANADA_IMAGES[(col * 2 + 1) % GRANADA_IMAGES.length]];
              const loop = [...colImgs, ...colImgs, ...colImgs];
              return (
                <div key={col} className={`relative overflow-hidden ${col >= 2 ? 'hidden md:block' : ''}`}>
                  <div className={`flex flex-col gap-3 md:gap-4 ${col % 2 === 0 ? 'hero-col-up' : 'hero-col-down'}`}>
                    {loop.map((src, i) => (
                      <img key={i} src={src} alt="" aria-hidden="true" loading="lazy"
                        className="w-full aspect-[3/4] object-cover" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/80 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0A0A_78%)]" />
        </div>

        <div ref={heroContentRef} className="max-w-7xl mx-auto w-full flex flex-col items-center text-center pt-28 md:pt-24" style={{ transformStyle: 'preserve-3d' }}>
          <p className="hero-reveal eyebrow mb-10 flex items-center gap-3">
            <span className="h-px w-8 bg-[#E08733] inline-block" /> Tatuador · Granada
          </p>

          <h1 className="m-0">
            <span className="sr-only">Halconero — Tatuador en Granada</span>
            <img src={logo} alt="" aria-hidden="true" className="hero-logo w-[min(88vw,760px)] drop-shadow-[0_10px_50px_rgba(224,135,51,0.28)]" />
          </h1>

          <p className="hero-reveal text-body max-w-lg text-base md:text-lg text-gray-300 mt-8 mb-10">
            Arte sobre la piel desde Granada. Tatuajes personalizados
            con alma del Albaicín y el oficio de toda una vida dibujando.
          </p>

          <div className="hero-reveal flex flex-wrap gap-4 justify-center">
            <Magnetic>
              <Link to="/portfolio" className="btn btn-primary group">
                Ver portfolio
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contacto" className="btn btn-ghost">Reservar cita</Link>
            </Magnetic>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
          <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ============== MANIFIESTO + PIEZA DESTACADA ============== */}
      <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto perspective">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-8" data-reveal>
            <p className="eyebrow">Visión · Granada</p>
            <h2 className="heading-1 text-4xl md:text-7xl leading-[1.02]">
              Tinta con raíces del <span className="text-[#E08733]">Albaicín</span>
            </h2>
            <p className="text-body text-lg max-w-md">
              Nacido y formado en Granada —dibujo, talla y restauración—, hoy vuelco todo ese
              bagaje en el tatuaje. Del trazo nazarí del Albaicín a la luz de la Alhambra:
              adapto cada diseño a tu cuerpo y a tu idea.
            </p>
            <Link to="/estudio" className="inline-flex items-center gap-3 group cursor-grow">
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold border-b border-[#E08733] pb-1 group-hover:text-[#E08733] transition-colors">Conóceme</span>
              <ArrowRight size={14} className="text-[#E08733] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <TiltCard className="overflow-hidden rounded-[2rem] aspect-[4/5] bg-white/5 border border-white/10" max={9}>
              {feature ? (
                <img src={getImageUrl(feature.imagen_url)} alt={feature.titulo} className="parallax-image w-full h-full object-cover" loading="lazy" decoding="async" />
              ) : (
                <Placeholder label="Pieza destacada" />
              )}
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ============== PORTFOLIO PREVIEW ============== */}
      <section className="py-24 md:py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16" data-reveal>
            <div className="rule mb-8" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-end gap-5">
                <span className="section-index">01</span>
                <div>
                  <p className="eyebrow mb-3">Trabajos recientes</p>
                  <h2 className="display-hero text-4xl md:text-7xl leading-none">Portfolio</h2>
                </div>
              </div>
              <Magnetic>
                <Link to="/portfolio" className="btn btn-ghost group">
                  Ver todo
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Magnetic>
            </div>
          </div>

          {destacadas.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 perspective" data-reveal-stagger>
              {destacadas.slice(0, 1).map((o) => (
                <TiltCard key={o.id} max={7} className="col-span-2 row-span-2 rounded-[1.75rem] border border-white/10 overflow-hidden aspect-square">
                  <Link to="/portfolio" className="group block w-full h-full">
                    <img src={getImageUrl(o.imagen_url)} alt={o.titulo} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <CardLabel titulo={o.titulo} tipo={o.tipo} />
                  </Link>
                </TiltCard>
              ))}
              {destacadas.slice(1, 5).map((o) => (
                <TiltCard key={o.id} max={9} className="rounded-[1.75rem] border border-white/10 overflow-hidden aspect-square">
                  <Link to="/portfolio" className="group block w-full h-full">
                    <img src={getImageUrl(o.imagen_url)} alt={o.titulo} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <CardLabel titulo={o.titulo} tipo={o.tipo} />
                  </Link>
                </TiltCard>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`rounded-[1.75rem] overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-square'}`}>
                  <Placeholder label="Tatuaje" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============== PROCESO ============== */}
      <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24" data-reveal>
          <div className="rule mb-8" />
          <div className="flex items-end gap-5">
            <span className="section-index">02</span>
            <div>
              <p className="eyebrow mb-3">Cómo trabajo</p>
              <h2 className="display-hero text-4xl md:text-7xl leading-none">El proceso</h2>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 perspective" data-reveal-stagger>
          {PROCESO.map((p) => (
            <TiltCard key={p.n} max={8} className="p-8 md:p-10 rounded-[1.75rem] border border-white/10 bg-white/[0.02] hover:border-[#E08733]/30">
              <span className="font-display font-bold text-6xl text-[#E08733]/40 block mb-4 leading-none">{p.n}</span>
              <h3 className="font-display text-2xl font-bold tracking-wide mb-4 tilt-layer">{p.t}</h3>
              <p className="text-body">{p.d}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ============== TESTIMONIOS ============== */}
      <section className="py-24 md:py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-20" data-reveal>
            <div className="rule mb-8" />
            <div className="flex items-end gap-5">
              <span className="section-index">03</span>
              <div>
                <p className="eyebrow mb-3">Testimonios</p>
                <h2 className="display-hero text-4xl md:text-7xl leading-none">Lo que dicen</h2>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 perspective" data-reveal-stagger>
            {testimonios.map((r) => (
              <TiltCard key={r.id} max={7} glare={false} className="p-8 md:p-10 border border-white/10 rounded-[1.75rem] bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="flex gap-1.5 mb-6 text-[#E08733]">
                    {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill={i < r.estrellas ? '#E08733' : 'none'} />))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-display text-gray-100 leading-snug mb-8">"{r.comentario}"</blockquote>
                </div>
                <figcaption className="flex items-center gap-3 pt-6 border-t border-white/5">
                  <span className="w-9 h-9 rounded-full bg-[#E08733]/15 flex items-center justify-center font-bold text-[#E08733] text-sm">{r.usuario.charAt(0).toUpperCase()}</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white/90">{r.usuario}</span>
                    <span className="text-[10px] text-gray-500">{r.fecha}</span>
                  </div>
                </figcaption>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA FINAL ============== */}
      <section className="py-28 md:py-44 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(224,135,51,0.08),transparent_60%)]" />
        <div className="max-w-3xl mx-auto space-y-10" data-reveal>
          <p className="eyebrow">¿Tienes una idea?</p>
          <h2 className="display-hero text-5xl md:text-8xl leading-[1.02]">
            Hagámosla <span className="text-[#E08733]">realidad</span>
          </h2>
          <p className="text-body text-lg max-w-xl mx-auto">
            Cuéntame tu proyecto y reservemos una sesión. Disponible para tatuajes
            personalizados y encargos artísticos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Magnetic strength={0.5}>
              <Link to="/contacto" className="btn btn-primary">Reservar cita</Link>
            </Magnetic>
          </div>
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-[11px] uppercase tracking-[0.25em] text-gray-500">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#E08733]" /> Barrio Fígares, Granada</span>
            <span className="flex items-center gap-2"><Instagram size={14} className="text-[#E08733]" /> @josehalconero</span>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ---------- Subcomponentes ---------- */
const Placeholder = ({ label }: { label: string }) => (
  <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/[0.04] to-transparent text-gray-600">
    <span className="text-[10px] uppercase tracking-[0.35em]">{label}</span>
    <span className="text-[9px] uppercase tracking-[0.2em] text-gray-700">[ imagen pendiente ]</span>
  </div>
);

const CardLabel = ({ titulo, tipo }: { titulo: string; tipo: string }) => (
  <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="text-[9px] uppercase tracking-[0.3em] text-[#E08733] font-black">{tipo}</span>
    <span className="text-sm font-bold text-white truncate">{titulo}</span>
  </div>
);

export default Home;
