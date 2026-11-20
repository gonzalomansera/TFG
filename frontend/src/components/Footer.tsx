import { Instagram, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

          {/* SOBRE EL ARTISTA */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="footer-column-title tracking-[0.5em] mb-4">JOSE HALCONERO</h3>
            <p className="text-gray-500 text-sm leading-[1.8] max-w-sm font-light italic opacity-80">
              "Tatuar en Granada es tatuar con su luz: la del Albaicín al atardecer,
              la de la Alhambra enfrente. Convierto esa herencia en tinta sobre la piel."
            </p>
          </div>

          {/* ENLACES RÁPIDOS */}
          <div className="space-y-6">
            <h3 className="text-caption text-white/50 tracking-[0.4em]">Explorar</h3>
            <div className="flex flex-col gap-4 text-[11px] text-gray-400 uppercase tracking-widest font-medium">
              <Link to="/portfolio" className="footer-link">Portfolio</Link>
              <Link to="/estudio" className="footer-link">El Estudio</Link>
              <Link to="/contacto" className="footer-link">Reservar cita</Link>
            </div>
          </div>

          {/* CONTACTO RÁPIDO */}
          <div className="space-y-6">
            <h3 className="text-caption text-white/50 tracking-[0.4em]">Granada</h3>
            <div className="space-y-5 text-[11px] text-gray-400 font-medium tracking-widest">
              <div className="flex items-center gap-4 group">
                <MapPin size={16} className="text-[#E08733] opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:text-white transition-colors">Barrio Fígares, Granada</span>
              </div>
              <a href="https://instagram.com/josehalconero" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <Instagram size={16} className="text-[#E08733] opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:text-white transition-colors">@josehalconero</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Jose Halconero · Granada. Todos los derechos reservados.
          </p>
          <span className="text-[9px] text-gray-700 uppercase tracking-widest italic">
            Web realizada por Gonzalo Mansera Ruiz
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
