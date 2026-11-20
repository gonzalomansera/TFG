import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Instagram, MapPin, Star } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { Obra, Resena } from '../types/AppContextType';
import { getImageUrl } from '../utils/imageHelper';
import { OBRAS_INSTAGRAM, DEMO_RESENAS } from '../lib/demoData';
import { GRANADA_IMAGES } from '../lib/granadaImages';

const PROCESO = [
  { n: '01', t: 'Cuéntame tu idea', d: 'Hablamos de tu proyecto: concepto, tamaño, zona del cuerpo y referencias. Cada tatuaje parte de una conversación.' },
  { n: '02', t: 'Diseño a medida', d: 'Preparo el diseño contigo, adaptado a tu idea, al tamaño y a la zona del cuerpo.' },
  { n: '03', t: 'Sesión y cuidado', d: 'Tatuamos en un entorno limpio y relajado. Te acompaño con todas las indicaciones de cuidado posterior.' },
];

export const Home = () => {
  const { request } = useApi();
  const [obras, setObras] = useState<Obra[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);

  useEffect(() => {
    request<Obra[]>('/obras/').then((d) => Array.isArray(d) && setObras(d)).catch(() => {});
    request<Resena[]>('/resenas/').then((d) => Array.isArray(d) && setResenas(d.slice(0, 3))).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si aún no hay obras subidas desde el panel, se muestran sus trabajos de Instagram
  const data = obras.length > 0 ? obras : OBRAS_INSTAGRAM;
  const recientes = data.slice(0, 3);
  const destacadas = data.slice(0, 9);
  const testimonios = resenas.length > 0 ? resenas : DEMO_RESENAS;

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="pw-hero">
        <div className="pw-wrap">
          <p className="pw-eyebrow">Tatuador · Granada</p>
          <h1>Arte sobre la piel <span>desde Granada</span></h1>
          <div className="pw-hero-grid">
            <div>
              <p className="pw-lead">
                Tatuajes personalizados con alma del Albaicín y el oficio
                de toda una vida dibujando.
              </p>
              <div className="pw-actions">
                <Link className="pw-btn pw-btn-primary" to="/portfolio">
                  Ver portfolio <ArrowRight size={16} />
                </Link>
                <Link className="pw-btn pw-btn-ghost" to="/contacto">Reservar cita</Link>
              </div>
            </div>

            <figure className="pw-panel" aria-label="Trabajos recientes">
              <figcaption className="pw-panel-head">
                <span>Trabajos recientes</span>
                <small>Realismo · B/N</small>
              </figcaption>
              <div className="pw-panel-strip">
                {recientes.map((o) => (
                  <img key={o.id} src={getImageUrl(o.imagen_url)} alt={o.titulo} />
                ))}
              </div>
              <div className="pw-panel-foot">
                <span className="pw-who">@josehalconero</span>
                <a className="pw-tag" href="https://www.instagram.com/josehalconero/" target="_blank" rel="noopener noreferrer">Ver en Instagram</a>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ============== SELLOS ============== */}
      <div className="pw-wrap">
        <section className="pw-stats" aria-label="Sellos del estudio">
          <div className="pw-stat"><b>Granada</b><span>Barrio Fígares</span></div>
          <div className="pw-stat"><b>Albaicín</b><span>inspiración nazarí</span></div>
          <div className="pw-stat"><b>A medida</b><span>tatuajes y encargos</span></div>
        </section>
      </div>

      {/* ============== MANIFIESTO ============== */}
      <section className="pw-section">
        <div className="pw-wrap pw-two">
          <div>
            <p className="pw-eyebrow">Visión · Granada</p>
            <h2 className="pw-sec-title">Tinta con raíces del <em>Albaicín</em></h2>
            <p className="pw-body">
              Nacido y formado en Granada —dibujo, talla y restauración—, hoy vuelco todo ese
              bagaje en el tatuaje. Del trazo nazarí del Albaicín a la luz de la Alhambra:
              adapto cada diseño a tu cuerpo y a tu idea.
            </p>
            <Link className="pw-link" to="/estudio">Conóceme <ArrowRight size={14} /></Link>
          </div>
          <figure className="pw-photo">
            <img src={GRANADA_IMAGES[0]} alt="Granada, vista del Albaicín" loading="lazy" />
          </figure>
        </div>
      </section>

      {/* ============== PORTFOLIO ============== */}
      <section className="pw-section">
        <div className="pw-wrap">
          <div className="pw-sec-head">
            <div>
              <span className="pw-index">01 /</span>
              <h2 className="pw-sec-title">Portfolio</h2>
            </div>
            <Link className="pw-btn pw-btn-ghost" to="/portfolio">
              Ver todo <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="pw-gallery">
            {destacadas.map((o, i) => (
              <Link key={o.id} to="/portfolio" className="pw-tile">
                <img src={getImageUrl(o.imagen_url)} alt={o.titulo} loading="lazy" decoding="async" />
                <span className="pw-tile-label">
                  <small>{String(i + 1).padStart(2, '0')} · {o.tipo}</small>
                  {o.titulo}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PROCESO ============== */}
      <section className="pw-section">
        <div className="pw-wrap">
          <span className="pw-index">02 /</span>
          <h2 className="pw-sec-title">El proceso</h2>
          <div className="pw-features">
            {PROCESO.map((p) => (
              <article key={p.n} className="pw-card">
                <span className="pw-n">{p.n} /</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIOS ============== */}
      <section className="pw-section">
        <div className="pw-wrap">
          <span className="pw-index">03 /</span>
          <h2 className="pw-sec-title">Lo que dicen</h2>
          <div className="pw-features">
            {testimonios.map((r) => (
              <figure key={r.id} className="pw-card pw-quote">
                <div className="pw-stars" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < r.estrellas ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <blockquote>«{r.comentario}»</blockquote>
                <figcaption>{r.usuario} — {r.fecha}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA FINAL ============== */}
      <section className="pw-section pw-cta">
        <div className="pw-wrap pw-two">
          <div>
            <p className="pw-eyebrow">¿Tienes una idea?</p>
            <h2 className="pw-giant">Hagámosla <span>realidad</span></h2>
          </div>
          <div>
            <p className="pw-lead">
              Cuéntame tu proyecto y reservemos una sesión. Disponible para tatuajes
              personalizados y encargos artísticos.
            </p>
            <div className="pw-actions">
              <Link className="pw-btn pw-btn-primary" to="/contacto">Reservar cita</Link>
            </div>
            <ul className="pw-contact">
              <li><MapPin size={14} /> Barrio Fígares, Granada</li>
              <li>
                <a href="https://instagram.com/josehalconero" target="_blank" rel="noopener noreferrer">
                  <Instagram size={14} /> @josehalconero
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
