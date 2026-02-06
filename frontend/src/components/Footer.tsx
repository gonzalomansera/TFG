import { Instagram, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const Footer = ({ isAdmin, setIsAdmin }: FooterProps) => {
  
  const handleLogout = () => {
    localStorage.removeItem('halconero_admin');
    setIsAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1a1a] text-white py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* SOBRE EL ARTISTA */}
          <div className="space-y-4">
            <h3 className="text-[#E08733] text-[10px] font-bold uppercase tracking-[0.3em]">H4LCONERO</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed max-w-xs font-light">
              Fusión de técnicas clásicas de restauración e imaginería con la expresión contemporánea del tatuaje.
            </p>
          </div>

          {/* ENLACES RÁPIDOS */}
          <div className="space-y-4">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Explorar</h3>
            <div className="flex flex-col gap-2 text-[11px] text-gray-500 uppercase tracking-widest font-light">
              <Link to="/recorrido" className="hover:text-[#E08733] transition-colors w-fit">Trayectoria</Link>
              <Link to="/obras" className="hover:text-[#E08733] transition-colors w-fit">Galería</Link>
              <Link to="/merchandising" className="hover:text-[#E08733] transition-colors w-fit">Tienda</Link>
              <Link to="/contacto" className="hover:text-[#E08733] transition-colors w-fit">Contacto</Link>
            </div>
          </div>

          {/* CONTACTO RÁPIDO */}
          <div className="space-y-4">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Granada</h3>
            <div className="space-y-3 text-[11px] text-gray-500 font-light">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-[#E08733]" />
                <span>Barrio Fígares, Granada</span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram size={14} className="text-[#E08733]" />
                <span>@josehalconero</span>
              </div>
            </div>
          </div>
        </div>

        {/* LÍNEA FINAL */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Jose Halconero. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-[9px] text-gray-700 uppercase tracking-widest italic">
              Ars longa, vita brevis
            </span>
            
            {/* BOTÓN DE LOGOUT DISCRETO */}
            {isAdmin && (
              <button 
                onClick={handleLogout}
                className="text-[9px] bg-[#E08733]/10 text-[#E08733] px-3 py-1 rounded border border-[#E08733]/20 hover:bg-[#E08733] hover:text-black transition-all font-bold uppercase tracking-tighter"
              >
                Cerrar Sesión Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;