import { useEffect, useState, useRef } from 'react';
import { X, ArrowRight, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useScrollFx } from '../hooks/useScrollFx';
import { TiltCard } from '../components/TiltCard';
import { OBRAS_INSTAGRAM } from '../lib/demoData';
import { type Obra } from '../types/AppContextType';
import { getImageUrl } from '../utils/imageHelper';

export const Obras = () => {
  const { request } = useApi();
  const containerRef = useRef<HTMLDivElement>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);

  const fetchObras = async () => {
    try {
      const data = await request<Obra[]>('/obras/');
      if (data) setObras(data);
    } catch (e) {
      console.error(e);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchObras(); }, []);

  // Si aún no hay obras subidas desde el panel, mostramos sus trabajos de Instagram
  const display = obras.length > 0 ? obras : OBRAS_INSTAGRAM;
  useScrollFx(containerRef, { deps: [display] });

  return (
    <section ref={containerRef} className="min-h-screen bg-[#0A0A0A] pt-36 md:pt-44 pb-24 relative">
      <div className="grain-overlay" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Cabecera */}
        <header className="mb-14 md:mb-20" data-reveal>
          <div className="rule mb-8" />
          <p className="eyebrow">Archivo visual · Granada</p>
          <h1 className="display-hero text-5xl md:text-8xl mt-4">Portfolio</h1>
          <p className="text-body max-w-md mt-6">
            Una selección de tatuajes realizados en Granada.
            Toca cualquier pieza para verla en grande.
          </p>
        </header>


        {/* Galería masonry editorial */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-8 [&>*]:mb-8 md:[&>*]:mb-10 perspective" data-reveal-stagger>
          {display.map((obra, i) => (
            <article key={obra.id} className="break-inside-avoid group relative">
              <TiltCard max={8} className="rounded-[1.25rem] border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => setSelectedObra(obra)}
                  className="block w-full relative"
                  aria-label={`Ampliar ${obra.titulo}`}
                >
                  <img
                    src={getImageUrl(obra.imagen_url)}
                    alt={obra.titulo}
                    loading="lazy"
                    decoding="async"
                    className="parallax-image w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              </TiltCard>

              {/* Rótulo de catálogo (estilo museo) */}
              <div className="flex items-baseline justify-between gap-4 px-1 pt-4">
                <span className="text-[13px] font-medium text-[#EFE7D7] truncate">
                  <span className="text-[#E08733]/60 mr-2 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {obra.titulo}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#E08733] shrink-0">{obra.tipo}</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center" data-reveal>
          <p className="text-body mb-6">¿Te gusta lo que ves?</p>
          <Link to="/contacto" className="btn btn-primary group">
            Reservar cita
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {selectedObra && (
        <div className="modal-overlay z-[100]" onClick={() => setSelectedObra(null)} role="dialog" aria-modal="true" aria-label={selectedObra.titulo}>
          <div className="modal-content max-w-6xl h-[85vh] p-0 overflow-hidden bg-[#0D0D0D] flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedObra(null)} aria-label="Cerrar" className="absolute top-6 right-6 z-10 text-white/60 hover:text-white transition-colors">
              <X size={30} strokeWidth={1.2} />
            </button>
            <div className="lg:w-[62%] h-[45vh] lg:h-full overflow-hidden bg-black flex items-center justify-center">
              <img src={getImageUrl(selectedObra.imagen_url)} alt={selectedObra.titulo} className="w-full h-full object-contain" decoding="async" />
            </div>
            <div className="lg:w-[38%] p-10 lg:p-16 flex flex-col justify-center bg-[#111] overflow-y-auto">
              <span className="text-[#E08733] text-[10px] uppercase tracking-[0.4em] font-black mb-4">{selectedObra.tipo}</span>
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">{selectedObra.titulo}</h2>
              <div className="h-px w-12 bg-[#E08733] mb-6" />
              <p className="text-body mb-10">{selectedObra.descripcion}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contacto" onClick={() => setSelectedObra(null)} className="btn btn-ghost">Quiero algo así</Link>
                {selectedObra.enlace && (
                  <a href={selectedObra.enlace} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <Instagram size={16} /> Ver vídeo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
