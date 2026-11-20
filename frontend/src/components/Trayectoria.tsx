import { useRef } from 'react';
import { GraduationCap, PenTool, Brush, MapPin, Heart, Instagram, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import fotoJose from '../assets/fotoJose.jpeg';
import { useScrollFx } from '../hooks/useScrollFx';

const hitos = [
  { fecha: '1997', titulo: 'Mis comienzos en Granada', descripcion: 'Nací en esta ciudad que tanto me inspira. Desde los dos años, el dibujo fue mi lenguaje natural, creciendo de forma autodidacta.', icon: <Brush size={16} /> },
  { fecha: '2013', titulo: 'Escuela de Artes y Oficios', descripcion: 'Inicié mi formación reglada en la Escuela de Artes de Granada, donde mi vocación empezó a tomar una base técnica sólida.', icon: <GraduationCap size={16} /> },
  { fecha: '2015 – 2020', titulo: 'Grado en Restauración', descripcion: 'Cinco años en la Universidad de Granada aprendiendo a preservar el legado artístico y a entender la materia y el color.', icon: <Heart size={16} /> },
  { fecha: '2020 – 2022', titulo: 'Maestría en Talla', descripcion: 'Regresé a la Escuela de Artes para especializarme en la talla en madera, conectando con la escultura y el volumen.', icon: <PenTool size={16} /> },
  { fecha: '2025', titulo: 'Tatuaje profesional', descripcion: 'Llevé todo mi bagaje artístico a la piel. Hoy el tatuaje es mi lenguaje y mi profesión en el estudio Born Again Tattoo.', icon: <PenTool size={16} /> },
];

export const Trayectoria = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollFx(containerRef);

  return (
    <section ref={containerRef} className="min-h-screen bg-[#0A0A0A] pt-36 md:pt-44 pb-24 text-white relative">
      <div className="grain-overlay" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-16 md:mb-24" data-reveal>
          <p className="eyebrow mb-5">El artista</p>
          <h1 className="display-hero text-5xl md:text-7xl">El estudio</h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">
          {/* Retrato */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32" data-reveal>
            <div className="relative group">
              <div className="absolute -inset-4 border border-[#E08733]/20 rounded-sm translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 overflow-hidden rounded-sm aspect-[3/4]">
                <img
                  src={fotoJose}
                  alt="Jose Halconero, tatuador en Granada"
                  className="parallax-image w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="mt-8 space-y-3">
                <h2 className="font-display text-3xl font-semibold tracking-[0.06em] text-[#E08733]">
                  Jose <span className="font-bold text-white">Halconero</span>
                </h2>
                <p className="text-caption tracking-[0.3em]">Tatuador · Artista multidisciplinar</p>
              </div>
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="w-full lg:w-3/5">
            <div className="relative border-l border-white/10 pl-8 space-y-14" data-reveal-stagger>
              {hitos.map((hito, index) => (
                <div key={index} className="relative group">
                  <span className="absolute -left-[48px] top-0 w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#E08733]/50 flex items-center justify-center text-[#E08733] group-hover:scale-110 group-hover:border-[#E08733] transition-all duration-500">{hito.icon}</span>
                  <div className="space-y-3">
                    <span className="timeline-date">{hito.fecha}</span>
                    <h3 className="font-display text-xl font-bold tracking-wide text-white/90 group-hover:text-[#E08733] transition-colors">{hito.titulo}</h3>
                    <p className="text-body max-w-lg">{hito.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Estudio */}
            <div className="mt-16 pt-10 border-t border-white/10 space-y-6" data-reveal>
              <div className="flex items-center gap-3 text-[#E08733]">
                <MapPin size={18} />
                <span className="text-caption tracking-[0.35em]">Born Again Tattoo · Granada</span>
              </div>
              <p className="text-body max-w-lg">
                Tatúo con cita previa en el Barrio Fígares, a un paseo del Albaicín y
                con la Alhambra de fondo. Un espacio tranquilo donde cada proyecto
                recibe el tiempo y el cuidado que merece.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/contacto" className="btn btn-primary group">
                  Reservar cita
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="https://instagram.com/josehalconero" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <Instagram size={16} /> @josehalconero
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
