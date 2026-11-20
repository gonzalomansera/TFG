import React, { useRef, useState } from 'react';
import { Send, MapPin, Instagram, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useScrollFx } from '../hooks/useScrollFx';

export const Contacto = () => {
  const { request } = useApi();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  useScrollFx(containerRef);

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
    <section ref={containerRef} className="min-h-screen bg-[#0A0A0A] pt-36 md:pt-44 pb-24 px-6 relative">
      <div className="grain-overlay" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <header className="mb-14 md:mb-20" data-reveal>
          <p className="eyebrow mb-5">Reserva</p>
          <h1 className="font-cinzel font-bold tracking-[0.01em] text-[#EFE7D7] text-5xl md:text-7xl leading-[1.05]">Pide tu cita</h1>
          <p className="text-body max-w-lg mt-6">
            Tatúo en Granada. Cuéntame tu idea y reservemos
            una sesión; cuanto más detalle me des (estilo, tamaño y zona del cuerpo),
            mejor podré preparar tu proyecto.
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Info directa */}
          <aside className="lg:col-span-2 space-y-6" data-reveal>
            <div className="bg-white/[0.03] p-8 rounded-[1.75rem] border border-white/10 space-y-6">
              <InfoRow icon={<MapPin size={18} />} label="Estudio" value="Born Again Tattoo · Barrio Fígares, Granada" />
              <InfoRow icon={<Mail size={18} />} label="Email" value="josehalconero@gmail.com" />
              <InfoRow icon={<Instagram size={18} />} label="Instagram" value="@josehalconero" />
            </div>

            <div className="p-8 bg-[#E08733]/5 border border-[#E08733]/20 rounded-[1.75rem]">
              <div className="flex items-center gap-3 text-[#E08733] mb-4">
                <Calendar size={18} />
                <span className="text-caption">Horarios</span>
              </div>
              <p className="text-body">
                Atiendo solo con cita previa. Te responderé personalmente para
                concretar fecha y presupuesto.
              </p>
            </div>
          </aside>

          {/* Formulario */}
          <div className="lg:col-span-3" data-reveal>
            <div className="bg-white/[0.03] p-8 md:p-10 rounded-[1.75rem] border border-white/10 relative">
              {enviado ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-[#E08733]/15 text-[#E08733] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-cinzel text-2xl font-bold tracking-wider mb-2">Petición recibida</h3>
                  <p className="text-body">Gracias por contactar. Jose revisará tu propuesta pronto.</p>
                  <button onClick={() => setEnviado(false)} className="mt-8 text-[10px] uppercase tracking-widest text-[#E08733] underline">Nueva consulta</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Nombre completo">
                      <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="input-field" placeholder="Tu nombre" />
                    </Field>
                    <Field label="Teléfono">
                      <input type="tel" required value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="input-field" placeholder="600 000 000" />
                    </Field>
                  </div>

                  <Field label="Email de contacto">
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="tu@email.com" />
                  </Field>

                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Tipo de proyecto">
                      <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="input-field">
                        <option>Tatuaje nuevo</option>
                        <option>Ampliación / Cover-up</option>
                        <option>Diseño personalizado</option>
                        <option>Consulta general</option>
                      </select>
                    </Field>
                    <Field label="Preferencia de fecha">
                      <select
                        value={formData.fechaPreferencia === 'A convenir' ? 'A convenir' : 'especifica'}
                        onChange={(e) => setFormData({ ...formData, fechaPreferencia: e.target.value === 'A convenir' ? 'A convenir' : '' })}
                        className="input-field"
                      >
                        <option value="A convenir">A convenir</option>
                        <option value="especifica">Elegir fecha concreta</option>
                      </select>
                    </Field>
                  </div>

                  {formData.fechaPreferencia !== 'A convenir' && (
                    <Field label="Selecciona el día">
                      <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.fechaPreferencia} onChange={(e) => setFormData({ ...formData, fechaPreferencia: e.target.value })} className="input-field" />
                    </Field>
                  )}

                  <Field label="Cuéntame tu idea">
                    <textarea rows={4} required value={formData.idea} onChange={(e) => setFormData({ ...formData, idea: e.target.value })} className="textarea-field" placeholder="Describe tu proyecto: estilo, tamaño, zona del cuerpo..." />
                  </Field>

                  <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
                    {loading ? 'Enviando...' : (<><Send size={14} /> Enviar solicitud</>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <span className="text-[#E08733] shrink-0 mt-0.5">{icon}</span>
    <div>
      <p className="text-caption">{label}</p>
      <p className="text-body mt-1">{value}</p>
    </div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1 block">{label}</label>
    {children}
  </div>
);
