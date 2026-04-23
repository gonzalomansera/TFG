import { GraduationCap, PenTool, Brush, MapPin, Heart } from 'lucide-react';
import fotoJose from '../assets/fotoJose.jpeg';

const hitos = [
  {
    fecha: "1997",
    titulo: "Mis comienzos en Granada",
    descripcion: "Nací en esta ciudad que tanto me inspira. Desde los dos años, el dibujo fue mi lenguaje natural, creciendo de forma autodidacta.",
    icon: <Brush size={18} />,
  },
  {
    fecha: "2013",
    titulo: "Escuela de Artes y Oficios",
    descripcion: "Inicié mi formación reglada en la Escuela de Artes de Granada, donde mi vocación empezó a tomar una base técnica sólida.",
    icon: <GraduationCap size={18} />,
  },
  {
    fecha: "2015 - 2020",
    titulo: "Grado en Restauración",
    descripcion: "Cinco años en la Universidad de Granada aprendiendo a preservar el legado artístico y entender la química del arte.",
    icon: <Heart size={18} />,
  },
  {
    fecha: "2020 - 2022",
    titulo: "Maestría en Talla",
    descripcion: "Regresé a la Escuela de Artes para especializarme en la talla en madera, conectando con la escultura y la imaginería.",
    icon: <PenTool size={18} />,
  },
  {
    fecha: "2025",
    titulo: "Tatuaje Profesional",
    descripcion: "Llevé mi bagaje artístico a la piel, convirtiendo el tatuaje en mi lenguaje actual y mi profesión.",
    icon: <PenTool size={18} />,
  },
];

export const Trayectoria = () => {
  return (
    <section id="recorrido" className="py-32 bg-[#2a2a2a] text-white animate-smoke-in">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* LADO IZQUIERDO: Imagen Fija / Escultural */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32">
            <div className="relative group">
              {/* Marco minimalista */}
              <div className="absolute -inset-4 border border-[#E08733]/20 rounded-sm translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>

              <img
                src={fotoJose}
                alt="Jose Halconero"
                className="relative z-10 w-full aspect-[3/4] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              />

              <div className="mt-8 space-y-4">
                <h2 className="text-4xl font-light tracking-[0.2em] uppercase italic text-[#E08733]">
                  Jose <br /> <span className="font-bold text-white not-italic">Halconero</span>
                </h2>
                <p className="text-caption tracking-[0.3em]">Artista Multidisciplinar</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/5">
            <div className="relative border-l border-white/5 pl-8 space-y-16">
              {hitos.map((hito, index) => (
                <div key={index} className="relative group">
                  <div className="timeline-dot"></div>

                  <div className="space-y-3">
                    <span className="timeline-date">
                      {hito.fecha}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white/90 group-hover:text-[#E08733] transition-colors">
                      {hito.titulo}
                    </h3>
                    <p className="text-body max-w-lg">
                      {hito.descripcion}
                    </p>
                  </div>
                </div>
              ))}

              {/* Presente */}
              <div className="pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 text-[#E08733]">
                  <MapPin size={18} />
                  <span className="text-caption tracking-[0.4em]">Born Again Tattoo, Granada</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};