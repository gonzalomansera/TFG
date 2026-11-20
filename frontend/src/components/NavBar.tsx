import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logoJose.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/estudio", label: "Estudio" },
  { to: "/contacto", label: "Contacto" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        {/* LOGO */}
        <button className="flex items-center cursor-pointer group z-50 bg-transparent border-0 p-0" onClick={() => navigate('/')} aria-label="Ir al inicio">
          <img
            src={logo}
            alt="Halconero — Tatuador en Granada"
            className="h-11 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        {/* DESKTOP MENU */}
        <div className="nav-links-container hidden md:flex items-center">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="nav-link relative group">
              {link.label}
            </Link>
          ))}
          <Link to="/contacto" className="nav-cta ml-8">Reservar cita</Link>
        </div>

        {/* MOBILE TRIGGER */}
        <button
          className="md:hidden z-50 text-[#EFE7D7] p-2 -mr-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 z-40 md:hidden bg-[#0A0A0A]/98 backdrop-blur-xl flex flex-col justify-center px-10 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-8">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-4xl font-display font-bold text-[#EFE7D7] hover:text-[#E08733] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-white/10">
          <Link to="/contacto" className="nav-cta">Reservar cita</Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
