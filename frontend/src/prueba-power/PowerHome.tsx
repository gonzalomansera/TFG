import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Instagram, MapPin, Star } from 'lucide-react';
import type { Resena } from '../types/AppContextType';
import { DEMO_RESENAS } from '../lib/demoData';
import { GRANADA_IMAGES } from '../lib/granadaImages';
import logo from '../assets/logoJose.png';
import { TRABAJOS } from '../lib/trabajosInstagram';

/**
 * PRUEBA DE ESTILO «POWER» (Catálogo de estilos Persone · persone-skills:design-power)
 * Mismo contenido y secciones que Home.tsx, con la estructura de Power:
 * rejilla de filetes de 1px, titulares enormes en Cinzel, texto en Oswald, etiquetas mono, esquinas rectas.
 * Colores de la marca: tinta #0A0A0A, crema #EFE7D7 y naranja Alhambra #E08733.
 */

const API = import.meta.env.VITE_API_URL || '';

const PROCESO = [
  { n: '01', t: 'Cuéntame tu idea', d: 'Hablamos de tu proyecto: concepto, tamaño, zona del cuerpo y referencias. Cada tatuaje parte de una conversación.' },
  { n: '02', t: 'Diseño a medida', d: 'Preparo el diseño contigo, adaptado a tu idea, al tamaño y a la zona del cuerpo.' },
  { n: '03', t: 'Sesión y cuidado', d: 'Tatuamos en un entorno limpio y relajado. Te acompaño con todas las indicaciones de cuidado posterior.' },
];

const NAV = [
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#proceso', label: 'Estudio' },
  { href: '#contacto', label: 'Contacto' },
];

export const PowerHome = () => {
  const [resenas, setResenas] = useState<Resena[]>([]);

  // Reseñas: API si responde, si no las de ejemplo. Los trabajos son los reales de Instagram.
  useEffect(() => {
    fetch(`${API}/resenas/`).then((r) => (r.ok ? r.json() : [])).then((d) => Array.isArray(d) && setResenas(d.slice(0, 3))).catch(() => {});
  }, []);

  const recientes = TRABAJOS.slice(0, 3);
  const testimonios = resenas.length > 0 ? resenas : DEMO_RESENAS;

  return (
    <div className="pw">
      <div className="pw-strip">Prueba de estilo «Power» · tu web actual sigue intacta en /</div>

      {/* ============== CABECERA ============== */}
      <header className="pw-header">
        <div className="pw-wrap pw-bar">
          <a className="pw-logo" href="#" aria-label="Halconero, inicio">
            <img src={logo} alt="Halconero — Tatuador en Granada" />
          </a>
          <nav aria-label="Principal">
            <ul>
              {NAV.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="pw-actions">
            <a className="pw-btn pw-btn-primary" href="#contacto">Reservar cita</a>
          </div>
        </div>
      </header>

      <main>
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
                  <a className="pw-btn pw-btn-primary" href="#portfolio">
                    Ver portfolio <ArrowRight size={16} />
                  </a>
                  <a className="pw-btn pw-btn-ghost" href="#contacto">Reservar cita</a>
                </div>
              </div>

              <figure className="pw-panel" aria-label="Trabajos recientes">
                <figcaption className="pw-panel-head">
                  <span>Trabajos recientes</span>
                  <small>Realismo · B/N</small>
                </figcaption>
                <div className="pw-panel-strip">
                  {recientes.map((t) => (
                    <img key={t.reel} src={t.src} alt={`${t.titulo}, tatuaje en ${t.zona.toLowerCase()}`} loading="eager" />
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

        {/* ============== CIFRAS / SELLOS ============== */}
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
              <a className="pw-link" href="#proceso">Conóceme <ArrowRight size={14} /></a>
            </div>
            <div className="pw-photo">
              <img src={GRANADA_IMAGES[0]} alt="Granada, vista del Albaicín" loading="lazy" />
            </div>
          </div>
        </section>

        {/* ============== PORTFOLIO ============== */}
        <section className="pw-section" id="portfolio">
          <div className="pw-wrap">
            <div className="pw-sec-head">
              <div>
                <span className="pw-index">01 /</span>
                <h2 className="pw-sec-title">Portfolio</h2>
              </div>
              <a className="pw-btn pw-btn-ghost" href="https://www.instagram.com/josehalconero/" target="_blank" rel="noopener noreferrer">
                Ver más en Instagram <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="pw-gallery">
              {TRABAJOS.map((t, i) => (
                <a key={t.reel} href={t.reel} target="_blank" rel="noopener noreferrer" className="pw-tile">
                  <img src={t.src} alt={`${t.titulo}, tatuaje en ${t.zona.toLowerCase()}`} loading="lazy" decoding="async" />
                  <span className="pw-tile-label">
                    <small>{String(i + 1).padStart(2, '0')} · {t.zona}</small>
                    {t.titulo}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ============== PROCESO ============== */}
        <section className="pw-section" id="proceso">
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
                  <div className="pw-stars" aria-label={`${r.estrellas} de 5 estrellas`}>
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
        <section className="pw-section pw-cta" id="contacto">
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
                <a className="pw-btn pw-btn-primary" href="/contacto">Reservar cita</a>
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
      </main>

      {/* ============== PIE ============== */}
      <footer className="pw-footer">
        <div className="pw-wrap">
          <ul>
            <li>© {new Date().getFullYear()} Jose Halconero · Granada</li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#proceso">El estudio</a></li>
            <li><a href="#contacto">Reservar cita</a></li>
            <li className="pw-credit">Web realizada por Gonzalo Mansera Ruiz</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default PowerHome;
