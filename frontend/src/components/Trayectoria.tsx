import { Link } from 'react-router-dom';
import { Instagram, ArrowRight, MapPin } from 'lucide-react';
import fotoJose from '../assets/fotoJose.jpeg';

const hitos = [
  { fecha: '1997', titulo: 'Mis comienzos en Granada', descripcion: 'Nací en esta ciudad que tanto me inspira. Desde los dos años, el dibujo fue mi lenguaje natural, creciendo de forma autodidacta.' },
  { fecha: '2013', titulo: 'Escuela de Artes y Oficios', descripcion: 'Inicié mi formación reglada en la Escuela de Artes de Granada, donde mi vocación empezó a tomar una base técnica sólida.' },
  { fecha: '2015 – 2020', titulo: 'Grado en Restauración', descripcion: 'Cinco años en la Universidad de Granada aprendiendo a preservar el legado artístico y a entender la materia y el color.' },
  { fecha: '2020 – 2022', titulo: 'Maestría en Talla', descripcion: 'Regresé a la Escuela de Artes para especializarme en la talla en madera, conectando con la escultura y el volumen.' },
  { fecha: '2025', titulo: 'Tatuaje profesional', descripcion: 'Llevé todo mi bagaje artístico a la piel. Hoy el tatuaje es mi lenguaje y mi profesión en el estudio Born Again Tattoo.' },
];

export const Trayectoria = () => (
  <>
    <header className="pw-page-head">
      <div className="pw-wrap">
        <p className="pw-eyebrow">El artista</p>
        <h1>El estudio</h1>
      </div>
    </header>

    <section className="pw-section">
      <div className="pw-wrap pw-artist">
        {/* Retrato */}
        <div className="pw-portrait">
          <figure className="pw-photo">
            <img src={fotoJose} alt="Jose Halconero, tatuador en Granada" />
          </figure>
          <div className="pw-portrait-name">
            <b>Jose <span>Halconero</span></b>
            <small>Tatuador · Artista multidisciplinar</small>
          </div>
        </div>

        {/* Trayectoria */}
        <div>
          <span className="pw-index">Trayectoria /</span>
          <ol className="pw-timeline">
            {hitos.map((h) => (
              <li key={h.fecha}>
                <time>{h.fecha}</time>
                <div>
                  <h3>{h.titulo}</h3>
                  <p>{h.descripcion}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="pw-studio">
            <span className="pw-index"><MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 8 }} />Born Again Tattoo · Granada</span>
            <p className="pw-body">
              Tatúo con cita previa en el Barrio Fígares, a un paseo del Albaicín y
              con la Alhambra de fondo. Un espacio tranquilo donde cada proyecto
              recibe el tiempo y el cuidado que merece.
            </p>
            <div className="pw-actions">
              <Link className="pw-btn pw-btn-primary" to="/contacto">Reservar cita <ArrowRight size={16} /></Link>
              <a className="pw-btn pw-btn-ghost" href="https://instagram.com/josehalconero" target="_blank" rel="noopener noreferrer">
                <Instagram size={16} /> @josehalconero
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);
