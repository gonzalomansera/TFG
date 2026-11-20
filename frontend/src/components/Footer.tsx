import { Instagram, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="pw-footer">
    <div className="pw-wrap">
      <div className="pw-footer-grid">
        <div>
          <h2>Jose Halconero</h2>
          <p className="pw-footer-quote">
            «Tatuar en Granada es tatuar con su luz: la del Albaicín al atardecer,
            la de la Alhambra enfrente. Convierto esa herencia en tinta sobre la piel.»
          </p>
        </div>
        <div>
          <h2>Explorar</h2>
          <ul>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/estudio">El estudio</Link></li>
            <li><Link to="/contacto">Reservar cita</Link></li>
          </ul>
        </div>
        <div>
          <h2>Granada</h2>
          <ul>
            <li><span><MapPin size={14} /> Barrio Fígares</span></li>
            <li>
              <a href="https://instagram.com/josehalconero" target="_blank" rel="noopener noreferrer">
                <Instagram size={14} /> @josehalconero
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="pw-footer-bottom">
        <span>© {new Date().getFullYear()} Jose Halconero · Granada</span>
        <span className="pw-credit">Web realizada por Gonzalo Mansera Ruiz</span>
      </div>
    </div>
  </footer>
);

export default Footer;
