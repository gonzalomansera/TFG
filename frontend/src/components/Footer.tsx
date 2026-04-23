import { Instagram, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  isAdmin: boolean;
}

const Footer = ({ isAdmin }: FooterProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

          {/* SOBRE EL ARTISTA */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="footer-column-title tracking-[0.5em] mb-4">JOSE HALCONERO</h3>
            <p className="text-gray-500 text-sm leading-[1.8] max-w-sm font-light italic font-serif opacity-80">
              "Mi misión es trascender la técnica, convirtiendo la tradición granadina en una expresión universal que habite tanto en el espacio físico como en la piel."
            </p>
          </div>

          {/* ENLACES RÁPIDOS */}
          <div className="space-y-6">
            <h3 className="text-caption text-white/50 tracking-[0.4em]">Explorar</h3>
            <div className="flex flex-col gap-4 text-[11px] text-gray-400 uppercase tracking-widest font-medium">
              <Link to="/recorrido" className="footer-link">Trayectoria</Link>
              <Link to="/obras" className="footer-link">Galería</Link>
              <Link to="/merchandising" className="footer-link">Tienda</Link>
              <Link to="/contacto" className="footer-link">Contacto</Link>
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
              <div className="flex items-center gap-4 group">
                <Instagram size={16} className="text-[#E08733] opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:text-white transition-colors">@josehalconero</span>
              </div>
            </div>
          </div>
        </div>

        {/* LÍNEA FINAL */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Jose Halconero. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[9px] text-gray-700 uppercase tracking-widest italic">
              Web realizada por Gonzalo Mansera Ruiz
            </span>

            {/* BOTÓN DE LOGOUT DISCRETO */}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="btn text-[9px] bg-[#E08733]/10 text-[#E08733] border border-[#E08733]/20 hover:bg-[#E08733] hover:text-black font-bold uppercase tracking-tighter"
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