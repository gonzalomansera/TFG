import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logoJose.png';

const navLinks = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/estudio', label: 'Estudio' },
  { to: '/contacto', label: 'Contacto' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
    <header className="pw-header">
      <div className="pw-wrap pw-bar">
        <button className="pw-logo" onClick={() => navigate('/')} aria-label="Ir al inicio">
          <img src={logo} alt="Halconero — Tatuador en Granada" />
        </button>

        <nav className="pw-nav" aria-label="Principal">
          <ul>
            {navLinks.map((l) => (
              <li key={l.to}><NavLink to={l.to}>{l.label}</NavLink></li>
            ))}
          </ul>
        </nav>

        <div className="pw-actions">
          <Link className="pw-btn pw-btn-primary" to="/contacto">Reservar cita</Link>
        </div>

        <button
          className="pw-burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>

      {/* Menú móvil: fuera de la cabecera, porque su desenfoque (backdrop-filter) atraparía el position: fixed */}
      <div id="menu-movil" className={`pw-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {navLinks.map((l, i) => (
            <li key={l.to}>
              <NavLink to={l.to} tabIndex={menuOpen ? 0 : -1}>
                {l.label} <small>0{i + 1}</small>
              </NavLink>
            </li>
          ))}
        </ul>
        <Link className="pw-btn pw-btn-primary pw-btn-block" to="/contacto" tabIndex={menuOpen ? 0 : -1}>Reservar cita</Link>
      </div>
    </>
  );
};

export default NavBar;
