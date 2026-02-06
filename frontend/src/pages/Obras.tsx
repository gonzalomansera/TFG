import { useState, useEffect } from 'react';
import axios from 'axios';
import { Palette, Maximize2, X } from 'lucide-react';

interface Obra {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
}

export const Obras = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra | null>(null);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await axios.get('http://localhost:8000/obras/');
        setObras(res.data);
      } catch (error) {
        console.error("Error cargando obras:", error);
      }
    };
    fetchObras();
  }, []);

  return (
    <section className="min-h-screen bg-[#2a2a2a] pt-12 pb-24 px-6 md:px-12">
      {/* Título Artístico */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-4">
          <Palette className="text-[#E08733]" size={24} />
          <h2 className="text-2xl font-bold tracking-[0.4em] uppercase">Galería de Arte</h2>
        </div>
        <div className="h-1 w-20 bg-[#E08733]"></div>
        <p className="text-gray-400 text-xs mt-6 uppercase tracking-widest italic">
          Explora mi trabajo en imaginería, pintura y diseño.
        </p>
      </div>

      {/* Grid Masonry */}
      <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {obras.map((obra) => (
          <div 
            key={obra.id} 
            className="relative group overflow-hidden rounded-sm cursor-pointer bg-[#1a1a1a] border border-white/5 break-inside-avoid"
            onClick={() => setObraSeleccionada(obra)}
          >
            <img 
              src={obra.imagen_url} 
              alt={obra.titulo} 
              className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            />
            
            {/* Overlay elegante */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center p-8 text-center">
              <Maximize2 className="text-[#E08733] mb-4" size={24} strokeWidth={1} />
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white">{obra.titulo}</h3>
              <p className="text-[10px] text-[#E08733] mt-2 uppercase font-mono">{obra.tipo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX (Vista ampliada) */}
      {obraSeleccionada && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setObraSeleccionada(null)}>
          <button className="absolute top-10 right-10 text-white/50 hover:text-[#E08733] transition-colors">
            <X size={32} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center md:items-start" onClick={e => e.stopPropagation()}>
            <img 
              src={obraSeleccionada.imagen_url} 
              alt={obraSeleccionada.titulo} 
              className="max-h-[80vh] w-auto object-contain rounded-sm shadow-2xl border border-white/10"
            />
            <div className="flex-1 text-left space-y-4">
              <span className="text-[#E08733] text-[10px] tracking-[0.3em] uppercase font-bold">{obraSeleccionada.tipo}</span>
              <h3 className="text-3xl font-bold uppercase tracking-tighter text-white">{obraSeleccionada.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">{obraSeleccionada.descripcion}</p>
              <div className="pt-8">
                <button 
                  onClick={() => setObraSeleccionada(null)}
                  className="text-[10px] border border-white/20 px-6 py-3 uppercase tracking-widest hover:bg-[#E08733] hover:text-black hover:border-[#E08733] transition-all"
                >
                  Volver a la galería
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};