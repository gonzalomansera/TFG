import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound = () => (
  <section className="pw-404">
    <div className="pw-wrap">
      <p className="pw-404-num" aria-hidden="true">404</p>
      <p className="pw-eyebrow">Error 404</p>
      <h1>Página extraviada</h1>
      <p className="pw-lead">La página que buscas no existe o ha cambiado de sitio.</p>
      <div className="pw-actions">
        <Link className="pw-btn pw-btn-primary" to="/"><ArrowLeft size={16} /> Volver al inicio</Link>
        <Link className="pw-btn pw-btn-ghost" to="/portfolio">Ver portfolio</Link>
      </div>
    </div>
  </section>
);
