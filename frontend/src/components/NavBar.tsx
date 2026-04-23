import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react'
import logo from '../assets/logoJose.png'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

interface NavbarProps {
  onOpenCarrito: () => void;
}

const NavBar = ({ onOpenCarrito }: NavbarProps) => {
  const { totalItems } = useCarrito();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const irAHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { to: "/blog", label: "Blog" },
    { to: "/recorrido", label: "Recorrido" },
    { to: "/obras", label: "Obras" },
    { to: "/merchandising", label: "Merchandising" },
    { to: "/contacto", label: "Contacto" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div className="flex items-center cursor-pointer group z-50" onClick={irAHome}>
          <img
            src={logo}
            alt="Jose Halconero Logo"
            className="h-16 md:h-25 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* DESKTOP MENU */}
        <div className="nav-links-container hidden md:flex items-center">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="nav-link relative group">
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/10">
              <Link to="/perfil" className="flex items-center gap-3 group">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#E08733] uppercase font-black tracking-widest group-hover:text-white transition-colors">{user.nombre}</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-tighter">Mi Cuenta</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#E08733]/50 p-0.5 overflow-hidden group-hover:border-[#E08733] transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                    {user.foto_perfil ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL}${user.foto_perfil}`} 
                        alt={user.nombre} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserIcon size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              <button 
                onClick={logout} 
                className="btn-icon bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all border border-white/5 ml-2"
                title="Cerrar Sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link ml-6 text-[#E08733] font-black border border-[#E08733]/20 px-6 py-2 rounded-full hover:bg-[#E08733] hover:text-black transition-all">Iniciar Sesión</Link>
          )}

          <button
            onClick={onOpenCarrito}
            className="btn-icon text-gray-400 hover:text-[#E08733] relative p-0 h-10 w-10 ml-2"
          >
            <ShoppingCart size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#E08733] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0D0D0D]">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-4 md:hidden z-50">
          {user ? (
             <div className="flex items-center gap-4">
               <Link to="/perfil" className="w-8 h-8 rounded-full border border-[#E08733]/50 overflow-hidden bg-white/5">
                 {user.foto_perfil ? (
                   <img 
                     src={`${import.meta.env.VITE_API_URL}${user.foto_perfil}`} 
                     alt={user.nombre} 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">
                     <UserIcon size={14} />
                   </div>
                 )}
               </Link>
               <button onClick={logout} className="text-gray-400"><LogOut size={18} /></button>
             </div>
          ) : (
             <Link to="/login" className="text-[#E08733]"><UserIcon size={20} /></Link>
          )}
          <button
            onClick={onOpenCarrito}
            className="btn-icon text-gray-400 hover:text-[#E08733] relative"
          >
            <ShoppingCart size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E08733] text-black text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#0D0D0D]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SCROLL MENU (Horizontal) */}
      <div className="md:hidden border-t border-white/5 bg-[#0D0D0D]/95 backdrop-blur-md">
        <div className="flex overflow-x-auto no-scrollbar py-3 px-6 gap-6 items-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-[#E08733] whitespace-nowrap transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar;