import { ShoppingCart } from 'lucide-react' 
import logo from '../assets/logoJose.png' 
import { useCarrito } from '../context/CarritoContext'
import { Link, useNavigate } from 'react-router-dom' // Importamos Link y useNavigate

interface NavbarProps {
  isAdmin: boolean;
  setMostrarForm: (val: boolean) => void;
  setMostrarFormMerch: (val: boolean) => void;
  onOpenCarrito: () => void;
}

const NavBar = ({ isAdmin, setMostrarForm, setMostrarFormMerch, onOpenCarrito }: NavbarProps) => {
  const { totalItems } = useCarrito();
  const navigate = useNavigate(); // Hook para navegar programáticamente
  
  const irAHome = () => {
    navigate('/'); // Navega a la raíz
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#E08733]/20">
      <div className="max-w-7xl mx-auto px-8 h-24 flex justify-between items-center">
        
        {/* LOGO */}
        <div className="flex items-center cursor-pointer group" onClick={irAHome}>
          <img 
            src={logo} 
            alt="Jose Halconero Logo" 
            className="h-25 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="hidden md:flex gap-10 text-[10px] tracking-[0.25em] uppercase text-gray-400 items-center">
          {/* Cambiamos <a> por <Link> y href por to */}
          <Link to="/blog" className="hover:text-[#E08733] transition-colors">Blog</Link>
          <Link to="/recorrido" className="hover:text-[#E08733] transition-colors">Recorrido</Link>
          <Link to="/obras" className="hover:text-[#E08733] transition-colors">Obras</Link>
          <Link to="/merchandising" className="hover:text-[#E08733] transition-colors">Merchandising</Link>
          <Link to="/contacto" className="hover:text-[#E08733] transition-colors">Contacto</Link>

          <button 
            onClick={onOpenCarrito} 
            className="relative p-2 text-gray-400 hover:text-[#E08733] transition-all group flex items-center justify-center"
          >
            <ShoppingCart size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#E08733] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0D0D0D]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;