import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Mail, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

gsap.registerPlugin(ScrollTrigger);

import type { Obra, Producto, Resena } from '../types/AppContextType';

import { getImageUrl } from '../utils/imageHelper';

export const Home = () => {
  const { request } = useApi();
  const { user } = useAuth();
  const [ultimaObra, setUltimaObra] = useState<Obra | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados para nueva reseña
  const [nuevaEstrellas, setNuevaEstrellas] = useState(5);
  const [nuevoComentarioResena, setNuevoComentarioResena] = useState('');

  const fetchData = async () => {
    try {
      const obrasData = await request<Obra[]>('/obras/');
      if (obrasData && obrasData.length > 0) setUltimaObra(obrasData[obrasData.length - 1]);

      const prodData = await request<Producto[]>('/productos/');
      if (prodData) setProductos(prodData.slice(0, 4));

      const resenasData = await request<Resena[]>('/resenas/');
      if (resenasData) setResenas(resenasData.slice(0, 3));
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const enviarResena = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !nuevoComentarioResena.trim()) return;

    try {
      await request('/resenas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estrellas: nuevaEstrellas,
          comentario: nuevoComentarioResena
        })
      });
      setNuevoComentarioResena('');
      setNuevaEstrellas(5);
      fetchData();
      alert("¡Gracias por tu valoración!");
    } catch (e) {
      console.error("Error enviando reseña:", e);
    }
  };

  const eliminarResena = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar esta reseña?")) return;
    try {
      await request(`/resenas/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error("Error eliminando reseña:", e);
    }
  };

  useGSAP(() => {
    // 1. ADVANCED HERO REVEAL
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.fromTo('.hero-text-char',
      { yPercent: 120, skewX: 20, opacity: 0 },
      { yPercent: 0, skewX: 0, opacity: 1, duration: 1.5, stagger: 0.04 }
    );

    tl.fromTo('.hero-sep-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "expo.out" },
      "-=0.8"
    );

    tl.fromTo('.hero-blur-in',
      { filter: 'blur(20px)', opacity: 0, y: 20 },
      { filter: 'blur(0px)', opacity: 1, y: 0, duration: 2, stagger: 0.2 },
      "-=1"
    );

    // 2. MAGNETIC BUTTONS (SUBTLE)
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach((el) => {
      const btn = el as HTMLElement;
      const moveBtn = (e: MouseEvent) => {
        const { left, top, width, height } = btn.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: "power2.out" });
      };

      btn.addEventListener('mousemove', moveBtn);
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
      });
    });

    // 3. PARALLAX EFFECT ON IMAGES
    gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
      gsap.to(img, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // 4. MASK REVEAL FOR SECTIONS
    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 30 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 5. STAGGERED GRID REVEAL
    gsap.fromTo('.stagger-grid-item',
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: '.merch-grid',
          start: "top 80%"
        }
      }
    );

  }, { scope: containerRef, dependencies: [ultimaObra, productos, resenas] });

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] text-white font-light selection:bg-[#E08733]/30 relative">
      {/* Noise Overlay - Fixed URL */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-jose.jpg')] bg-cover bg-fixed bg-center opacity-[0.05] grayscale parallax-bg scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]"></div>

        <div className="relative z-10 max-w-6xl w-full translate-y-[-5vh]">
          <div className="mb-12 hero-blur-in">
            <span className="text-[10px] tracking-[0.8em] uppercase text-[#E08733] font-black border border-[#E08733]/20 px-6 py-2 rounded-full inline-block backdrop-blur-md">
              Granada · España
            </span>
          </div>

          <h1 className="flex flex-col items-center justify-center mb-16 leading-[0.9] px-4 w-full text-center">
            <SplitText className="text-[9vw] md:text-[7vw] font-serif italic font-light text-white/95 tracking-tight mix-blend-difference whitespace-nowrap">Jose</SplitText>
            <SplitText className="text-[10vw] md:text-[9vw] font-serif font-black uppercase tracking-tight text-[#E08733] mt-[-2vw] whitespace-nowrap">Halconero</SplitText>
          </h1>

          <div className="flex flex-col items-center justify-center hero-blur-in">
            <Link to="/obras" className="btn-magnetic group flex items-center gap-6 px-12 py-6 bg-white text-black rounded-full transition-all hover:bg-[#E08733] shadow-[0_20px_50px_rgba(224,135,51,0.2)]">
              <span className="text-[11px] uppercase tracking-[0.4em] font-black">Explorar Portafolio</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-all" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 hero-blur-in">
           <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* SECCIÓN PREVIEW OBRA */}
      <section className="py-32 px-6 max-w-7xl mx-auto reveal-section">
        <div className="grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-1 hidden md:block">
             <div className="text-[10px] rotate-90 origin-left uppercase tracking-[1em] text-gray-600 whitespace-nowrap mb-20 translate-y-32">
                Última Creación
             </div>
          </div>
          <div className="md:col-span-6 relative group">
            <div className="absolute -inset-4 border border-[#E08733]/5 translate-x-8 translate-y-8 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000 border-dashed"></div>
            <div className="overflow-hidden rounded-[2.5rem] h-[550px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              <img
                src={getImageUrl(ultimaObra?.imagen_url) || "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2070&auto=format&fit=crop"}
                className="card-image w-full h-full object-cover parallax-img scale-110 will-change-transform"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="md:col-span-5 space-y-10 pl-4">
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-[#E08733]"></div>
               <span className="text-caption font-black uppercase tracking-[0.3em]">Visión Creativa</span>
            </div>
            <h2 className="heading-1 text-5xl md:text-7xl leading-[0.9] tracking-tight">Tradición <br /> Reimaginda</h2>
            <p className="text-body text-lg italic leading-relaxed text-gray-400 max-w-md">
              "En la intersección entre el volumen sagrado y la línea contemporánea, busco dar vida a historias que han habitado los muros de Granada por siglos."
            </p>
            <div className="pt-4">
              <Link to="/recorrido" className="inline-flex items-center gap-4 group">
                <span className="text-[11px] uppercase tracking-[0.4em] font-bold border-b border-[#E08733] pb-1 group-hover:text-[#E08733] transition-colors">Mi Trayectoria</span>
                <ArrowRight size={14} className="text-[#E08733] group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN MERCHANDISING (BENTO GRID) */}
      <section className="py-32 bg-[#050505] border-y border-white/5 reveal-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-4">
            <div>
               <h2 className="heading-2 text-sm text-white/50 mb-2">Exclusive Collectibles</h2>
               <h3 className="text-4xl font-serif italic opacity-90">Merchandising</h3>
            </div>
            <div className="h-[1px] flex-1 bg-white/5 mx-12 hidden md:block"></div>
            <Link to="/merchandising" className="group flex items-center gap-6 bg-white text-black px-10 py-5 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-[#E08733] transition-all overflow-hidden relative">
               <span className="relative z-10 text-nowrap">Tienda Online</span>
               <ArrowRight size={16} className="relative z-10" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[600px] gap-6 merch-grid">
            {productos.length > 0 ? (
              <>
                <div className="md:col-span-2 md:row-span-2 stagger-grid-item group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 aspect-[4/5] md:aspect-auto">
                  <img src={getImageUrl(productos[0]?.imagen_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 will-change-transform" loading="lazy" decoding="async" />
                  <div className="absolute inset-x-8 bottom-8 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                     <p className="text-[#E08733] text-[9px] uppercase font-black mb-2">Destacado</p>
                     <h4 className="text-xl font-bold uppercase tracking-widest">{productos[0]?.nombre}</h4>
                  </div>
                </div>
                {productos.length > 1 && (
                  <div className="md:col-span-1 md:row-span-1 stagger-grid-item group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 aspect-[4/5] md:aspect-auto">
                    <img src={getImageUrl(productos[1]?.imagen_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 will-change-transform" loading="lazy" decoding="async" />
                  </div>
                )}
                {productos.length > 2 && (
                  <div className="md:col-span-1 md:row-span-2 stagger-grid-item group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 aspect-[4/5] md:aspect-auto">
                    <img src={getImageUrl(productos[2]?.imagen_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 will-change-transform" loading="lazy" decoding="async" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#E08733]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}
                {productos.length > 3 && (
                  <div className="md:col-span-1 md:row-span-1 stagger-grid-item group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 aspect-[4/5] md:aspect-auto">
                    <img src={getImageUrl(productos[3]?.imagen_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 will-change-transform" loading="lazy" decoding="async" />
                  </div>
                )}
              </>
            ) : (
              [1, 2, 3, 4].map(i => <div key={i} className="bg-white/5 rounded-[2rem] animate-pulse aspect-[4/5] md:aspect-auto"></div>)
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN RESEÑAS */}
      <section className="py-32 bg-[#0A0A0A] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] reveal-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[11px] uppercase tracking-[0.5em] text-[#E08733] font-black block mb-4">Testimonios</span>
            <h2 className="text-5xl md:text-6xl font-serif italic opacity-95">Lo que dicen sobre <br /> mi trabajo</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {resenas.length > 0 ? resenas.map((r) => (
              <div key={r.id} className="bg-white/5 backdrop-blur-3xl p-10 border border-white/10 rounded-[2.5rem] stagger-grid-item hover:bg-white/10 transition-colors shadow-2xl flex flex-col justify-between h-full">
                <div>
                  <div className="flex gap-2 mb-8 text-[#E08733]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < r.estrellas ? "#E08733" : "none"} />
                    ))}
                  </div>
                  <p className="text-xl font-light italic text-gray-300 mb-10 leading-relaxed font-serif">"{r.comentario}"</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E08733]/20 flex items-center justify-center font-bold text-[#E08733]">
                      {r.usuario.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-wider text-white/90">{r.usuario}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{r.fecha}</span>
                    </div>
                  </div>
                  {!!user?.is_admin && (
                    <button 
                      onClick={() => eliminarResena(r.id)}
                      className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                      title="Eliminar reseña"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-600 text-[10px] uppercase tracking-widest italic pt-10">Sin valoraciones aún...</p>
            )}
          </div>
          
          {user && (
              <div className="mt-24 max-w-2xl mx-auto bg-white/5 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-center mb-10 text-[#E08733]">Comparte tu experiencia</h3>
                  <form onSubmit={enviarResena} className="space-y-6">
                      <div className="flex justify-center gap-6 mb-8">
                          {[1,2,3,4,5].map(nu => (
                              <button type="button" key={nu} onClick={() => setNuevaEstrellas(nu)} className="hover:scale-125 transition-transform">
                                  <Star size={28} fill={nu <= nuevaEstrellas ? "#E08733" : "none"} className={nu <= nuevaEstrellas ? "text-[#E08733]" : "text-gray-700"} />
                              </button>
                          ))}
                      </div>
                      <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-gray-300 focus:outline-none focus:border-[#E08733]/50 transition-all h-32 resize-none" 
                          placeholder="Tu comentario sobre mi trabajo..." 
                          value={nuevoComentarioResena}
                          onChange={e => setNuevoComentarioResena(e.target.value)}
                          required
                      />
                      <button className="w-full py-5 bg-[#E08733] text-black rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white transition-all shadow-xl btn-magnetic">Publicar Reseña</button>
                  </form>
              </div>
          )}
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-40 text-center px-6 relative overflow-hidden reveal-section">
        <div className="absolute inset-0 bg-[#E08733]/5 blur-[150px] rounded-full scale-150 -z-10"></div>
        <div className="max-w-3xl mx-auto space-y-12">
          <span className="text-caption font-black text-[#E08733]">Proyecto Personalizado</span>
          <h2 className="heading-1 text-7xl md:text-8xl tracking-tight leading-none group">¿Deseas una <br /> pieza <span className="text-[#E08733] font-serif italic">única?</span></h2>
          <p className="text-body text-xl max-w-xl mx-auto border-l border-[#E08733]/30 pl-8">
            DISPONIBLE PARA ENCARGOS PERSONALIZADOS, TATUAJES EXCLUSIVOS Y RESTAURACIÓN DE IMAGINERÍA.
          </p>
          <div className="pt-8">
            <Link to="/contacto" className="btn-magnetic inline-flex items-center gap-6 bg-white text-black px-16 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#E08733] transition-all group scale-110">
              <Mail size={16} className="group-hover:rotate-12 transition-transform" />
              Empieza el proceso
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

const SplitText = ({ children, className }: { children: string, className?: string }) => {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {children.split('').map((char, i) => (
        <span key={i} className="hero-text-char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default Home;