import { useEffect, useState } from 'react';
import { X, ArrowRight, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { OBRAS_INSTAGRAM } from '../lib/demoData';
import { type Obra } from '../types/AppContextType';
import { getImageUrl } from '../utils/imageHelper';

export const Obras = () => {
  const { request } = useApi();
  const [obras, setObras] = useState<Obra[]>([]);
  const [selected, setSelected] = useState<Obra | null>(null);

  useEffect(() => {
    request<Obra[]>('/obras/').then((d) => Array.isArray(d) && setObras(d)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cerrar el visor con Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selected]);

  // Si aún no hay obras subidas desde el panel, se muestran sus trabajos de Instagram
  const display = obras.length > 0 ? obras : OBRAS_INSTAGRAM;

  return (
    <>
      <header className="pw-page-head">
        <div className="pw-wrap">
          <p className="pw-eyebrow">Archivo visual · Granada</p>
          <h1>Portfolio</h1>
          <p className="pw-lead">
            Una selección de tatuajes realizados en Granada.
            Toca cualquier pieza para verla en grande.
          </p>
        </div>
      </header>

      <section className="pw-section">
        <div className="pw-wrap">
          <div className="pw-gallery">
            {display.map((obra, i) => (
              <button key={obra.id} className="pw-tile" onClick={() => setSelected(obra)} aria-label={`Ampliar ${obra.titulo}`}>
                <img src={getImageUrl(obra.imagen_url)} alt={obra.titulo} loading="lazy" decoding="async" />
                <span className="pw-tile-label">
                  <small>{String(i + 1).padStart(2, '0')} · {obra.tipo}</small>
                  {obra.titulo}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pw-section pw-cta">
        <div className="pw-wrap pw-sec-head">
          <h2 className="pw-sec-title">¿Te gusta lo que ves?</h2>
          <div className="pw-actions">
            <Link className="pw-btn pw-btn-primary" to="/contacto">Reservar cita <ArrowRight size={16} /></Link>
            <a className="pw-btn pw-btn-ghost" href="https://www.instagram.com/josehalconero/" target="_blank" rel="noopener noreferrer">
              <Instagram size={16} /> Más en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Visor */}
      {selected && (
        <div className="pw-modal" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label={selected.titulo}>
          <div className="pw-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="pw-close" onClick={() => setSelected(null)} aria-label="Cerrar" autoFocus>
              <X size={24} strokeWidth={1.5} />
            </button>
            <div className="pw-modal-img">
              <img src={getImageUrl(selected.imagen_url)} alt={selected.titulo} decoding="async" />
            </div>
            <div className="pw-modal-info">
              <span className="pw-index">{selected.tipo}</span>
              <h2>{selected.titulo}</h2>
              <p>{selected.descripcion}</p>
              <div className="pw-actions">
                <Link className="pw-btn pw-btn-primary" to="/contacto" onClick={() => setSelected(null)}>Quiero algo así</Link>
                {selected.enlace && (
                  <a className="pw-btn pw-btn-ghost" href={selected.enlace} target="_blank" rel="noopener noreferrer">
                    <Instagram size={16} /> Ver vídeo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
