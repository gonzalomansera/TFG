import { useState, useEffect } from 'react';
import axios from 'axios';
import { Palette, Maximize2 } from 'lucide-react';
import type { Obra } from '../types/AppContextType'; // Asegúrate de tener este tipo

export const Obras = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra | null>(null);

  const fetchObras = async () => {
    try {
      const res = await axios.get('http://localhost:8000/obras/');
      setObras(res.data);
    } catch (error) {
      console.error("Error cargando obras:", error);
    }
  };

  useEffect(() => { fetchObras(); }, []);

  return (
    <section id="obras" className="max-w-7xl mx-auto px-6 md:px-12 py-24 bg-[#2a2a2a]">
      {/* Título de Sección */}
      <div className="flex items-center gap-4 mb-16">
        <Palette className="text-[#E08733]" size={24} />
        <h2 className="text-2xl font-bold tracking-[0.4em] uppercase">Galería de Obras</h2>
      </div>

      {/* Grid de Obras */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {obras.map((obra) => (
          <div 
            key={obra.id} 
            className="relative group overflow-hidden rounded-xl cursor-pointer bg-[#1a1a1a]"
            onClick={() => setObraSeleccionada(obra)}
          >
            <img 
              src={obra.imagen_url} 
              alt={obra.titulo} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <Maximize2 className="text-[#E08733] mb-4" size={20} />
              <h3 className="text-sm font-bold tracking-widest uppercase">{obra.titulo}</h3>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">{obra.tecnica}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL LIGHTBOX (Para ver la obra en grande) */}
      {obraSeleccionada && (
        <div 
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={() => setObraSeleccionada(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center">
            <img 
              src={obraSeleccionada.imagen_url} 
              alt={obraSeleccionada.titulo} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold tracking-[0.3em] uppercase text-[#E08733]">{obraSeleccionada.titulo}</h3>
              <p className="text-gray-400 text-xs mt-2 italic">{obraSeleccionada.descripcion}</p>
              <p className="text-[9px] text-gray-500 mt-4 tracking-[0.2em] uppercase">{obraSeleccionada.dimensiones}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};