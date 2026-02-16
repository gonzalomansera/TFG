import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Package, BookOpen, ArrowRight, MousePointer2 } from 'lucide-react';

export const Home = () => {
  const [ultimaObra, setUltimaObra] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resObras = await fetch('http://localhost:8000/obras/');
        const obrasData = await resObras.json();
        if (obrasData.length > 0) setUltimaObra(obrasData[obrasData.length - 1]);

        const resProd = await fetch('http://localhost:8000/productos/');
        const prodData = await resProd.json();
        setProductos(prodData.slice(0, 4));
      } catch (e) {
        console.error("Error cargando Home:", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#1a1a1a] text-white font-light selection:bg-[#E08733]/30">
      
      {/* HERO SECTION: ALMA DEL ARTISTA */}
      <section className="h-[80vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        {/* Fondo sutil */}
        <div className="absolute inset-0 bg-[url('/bg-jose.jpg')] bg-cover bg-fixed bg-center opacity-10 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]"></div>

        <div className="relative z-10 max-w-4xl">
          <span className="text-[9px] tracking-[1em] uppercase text-[#E08733] font-bold mb-6 block animate-fade-in">
            Granada · España
          </span>
          
          <h1 className="flex flex-col md:flex-row items-center justify-center mb-8 gap-2 md:gap-6">
            <span className="text-6xl md:text-8xl font-serif italic font-extralight text-white/90">Jose</span>
            <span className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#E08733]">Halconero</span>
          </h1>

          <div className="flex items-center justify-center gap-6 opacity-40 mb-10">
            <div className="h-[1px] w-12 bg-white"></div>
            <div className="w-2 h-2 rotate-45 border border-white"></div>
            <div className="h-[1px] w-12 bg-white"></div>
          </div>

          <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-gray-400 font-medium">
            Imaginería <span className="text-[#E08733] mx-2">·</span> 
            Escultura <span className="text-[#E08733] mx-2">·</span> 
            Tatuaje
          </p>

          <div className="mt-16">
            <Link to="/obras" className="group relative inline-flex items-center gap-3 px-10 py-4 border border-white/10 rounded-full transition-all hover:border-[#E08733]/50">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold group-hover:text-[#E08733] transition-colors">Ver Portafolio</span>
              <ArrowRight size={14} className="text-gray-500 group-hover:text-[#E08733] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN PREVIEW OBRA (Layout Minimalista) */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 relative group">
             <div className="absolute -inset-2 border border-[#E08733]/10 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700"></div>
             <img 
               src={ultimaObra?.imagen_url || "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2070&auto=format&fit=crop"} 
               className="w-full h-[450px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl" 
             />
          </div>
          <div className="md:col-span-5 space-y-6">
            <div className="h-10 w-[1px] bg-[#E08733] mb-4"></div>
            <h2 className="text-3xl font-bold uppercase tracking-tighter leading-none">Visión <br/> Creativa</h2>
            <p className="text-gray-400 text-xs leading-relaxed font-light italic">
              "Mi obra busca capturar la esencia de la tradición granadina, llevándola a nuevos soportes donde el volumen y la sombra cuentan su propia historia."
            </p>
            <Link to="/recorrido" className="inline-block text-[9px] uppercase font-bold tracking-widest text-[#E08733] hover:text-white transition-colors">
              Conocer mi trayectoria —
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN MERCHANDISING (Compacta) */}
      <section className="py-24 bg-[#141414] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-xs uppercase tracking-[0.6em] font-bold text-white/40">Selected Merch</h2>
            <div className="h-[1px] flex-1 bg-white/5 mx-8 hidden md:block"></div>
            <Link to="/merchandising" className="text-[9px] uppercase tracking-widest bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-[#E08733] transition-colors">Tienda Online</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productos.length > 0 ? productos.map(p => (
                <div key={p.id} className="group aspect-[3/4] relative bg-[#1a1a1a] rounded-sm overflow-hidden border border-white/5">
                    <img src={p.imagen_url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-[8px] uppercase font-bold tracking-widest text-[#E08733]">{p.nombre}</p>
                    </div>
                </div>
            )) : (
              [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-[#1a1a1a] animate-pulse border border-white/5"></div>)
            )}
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-32 text-center px-6 relative">
        <div className="max-w-xl mx-auto space-y-8">
            <h2 className="text-4xl font-serif italic">¿Deseas una pieza única?</h2>
            <p className="text-gray-500 text-xs tracking-widest leading-relaxed">
                ESTOY DISPONIBLE PARA ENCARGOS PERSONALIZADOS, TATUAJES Y PROYECTOS DE RESTAURACIÓN.
            </p>
            <div className="pt-4">
                <Link to="/contacto" className="inline-flex items-center gap-4 bg-transparent border border-white/20 px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all group">
                    <Mail size={14} className="group-hover:rotate-12 transition-transform" />
                    Contactar ahora
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
};

// Icono extra para el footer
const Mail = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

export default Home;