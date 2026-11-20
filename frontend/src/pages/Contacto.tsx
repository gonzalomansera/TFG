import React, { useState } from 'react';
import { Send, MapPin, Instagram, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export const Contacto = () => {
  const { request } = useApi();
  const { user } = useAuth();
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    tipo: 'Tatuaje nuevo',
    idea: '',
    fechaPreferencia: 'A convenir',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await request('/citas/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          tipo: formData.tipo,
          idea: formData.idea,
          fecha_cita: formData.fechaPreferencia,
        }),
      });
      setEnviado(true);
      setFormData({ nombre: user?.nombre || '', email: user?.email || '', telefono: user?.telefono || '', tipo: 'Tatuaje nuevo', idea: '', fechaPreferencia: 'A convenir' });
    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar la solicitud. Inténtalo de nuevo o escríbeme por Instagram.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="pw-page-head">
        <div className="pw-wrap">
          <p className="pw-eyebrow">Reserva</p>
          <h1>Pide tu cita</h1>
          <p className="pw-lead">
            Tatúo en Granada. Cuéntame tu idea y reservemos una sesión; cuanto más
            detalle me des (estilo, tamaño y zona del cuerpo), mejor podré preparar tu proyecto.
          </p>
        </div>
      </header>

      <section className="pw-section">
        <div className="pw-wrap">
          <div className="pw-contact-grid">
            {/* Datos directos */}
            <aside>
              <ul className="pw-info">
                <InfoRow icon={<MapPin size={18} />} label="Estudio" value="Born Again Tattoo · Barrio Fígares, Granada" />
                <InfoRow icon={<Mail size={18} />} label="Email" value="josehalconero@gmail.com" />
                <InfoRow icon={<Instagram size={18} />} label="Instagram" value="@josehalconero" />
                <li>
                  <Calendar size={18} />
                  <div>
                    <small>Horarios</small>
                    <p>Atiendo solo con cita previa. Te responderé personalmente para concretar fecha y presupuesto.</p>
                  </div>
                </li>
              </ul>
            </aside>

            {/* Formulario */}
            <div>
              {enviado ? (
                <div className="pw-done">
                  <CheckCircle2 size={40} strokeWidth={1.5} />
                  <h3>Petición recibida</h3>
                  <p>Gracias por contactar. Jose revisará tu propuesta pronto.</p>
                  <button onClick={() => setEnviado(false)} className="pw-link">Nueva consulta</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="pw-form">
                  <div className="pw-form-row">
                    <Field label="Nombre completo" id="nombre">
                      <input id="nombre" type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="pw-input" placeholder="Tu nombre" autoComplete="name" />
                    </Field>
                    <Field label="Teléfono" id="telefono">
                      <input id="telefono" type="tel" required value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="pw-input" placeholder="600 000 000" autoComplete="tel" />
                    </Field>
                  </div>

                  <Field label="Email de contacto" id="email">
                    <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pw-input" placeholder="tu@email.com" autoComplete="email" />
                  </Field>

                  <div className="pw-form-row">
                    <Field label="Tipo de proyecto" id="tipo">
                      <select id="tipo" value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="pw-input">
                        <option>Tatuaje nuevo</option>
                        <option>Ampliación / Cover-up</option>
                        <option>Diseño personalizado</option>
                        <option>Consulta general</option>
                      </select>
                    </Field>
                    <Field label="Preferencia de fecha" id="pref">
                      <select
                        id="pref"
                        value={formData.fechaPreferencia === 'A convenir' ? 'A convenir' : 'especifica'}
                        onChange={(e) => setFormData({ ...formData, fechaPreferencia: e.target.value === 'A convenir' ? 'A convenir' : '' })}
                        className="pw-input"
                      >
                        <option value="A convenir">A convenir</option>
                        <option value="especifica">Elegir fecha concreta</option>
                      </select>
                    </Field>
                  </div>

                  {formData.fechaPreferencia !== 'A convenir' && (
                    <Field label="Selecciona el día" id="dia">
                      <input id="dia" type="date" required min={new Date().toISOString().split('T')[0]} value={formData.fechaPreferencia} onChange={(e) => setFormData({ ...formData, fechaPreferencia: e.target.value })} className="pw-input" />
                    </Field>
                  )}

                  <Field label="Cuéntame tu idea" id="idea">
                    <textarea id="idea" rows={5} required value={formData.idea} onChange={(e) => setFormData({ ...formData, idea: e.target.value })} className="pw-input" placeholder="Describe tu proyecto: estilo, tamaño, zona del cuerpo..." />
                  </Field>

                  <button type="submit" disabled={loading} className="pw-btn pw-btn-primary pw-btn-block">
                    {loading ? 'Enviando...' : (<><Send size={14} /> Enviar solicitud</>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <li>
    {icon}
    <div>
      <small>{label}</small>
      <span>{value}</span>
    </div>
  </li>
);

const Field = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div className="pw-field">
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);
