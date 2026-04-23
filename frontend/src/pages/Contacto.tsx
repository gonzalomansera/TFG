import React, { useState } from 'react';
import { Send, MapPin, Instagram, Mail, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL;


export const Contacto = () => {
  const { user, token } = useAuth();
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    tipo: 'Cita para Tatuaje',
    idea: '',
    fechaPreferencia: 'A convenir'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Por favor, inicia sesión para solicitar una cita.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/citas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idea: `[${formData.tipo}] - Propuesta: ${formData.idea}`,
          fecha_cita: formData.fechaPreferencia
        })
      });

      if (response.ok) {
        setEnviado(true);
        setFormData({ nombre: user.nombre, email: user.email, telefono: user.telefono || '', tipo: 'Cita Tatuaje', idea: '' });
      } else {
        alert("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container custom-bg-dark animate-smoke-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">Citas & Contacto</h2>
          <div className="h-1 w-20 bg-[#E08733] mx-auto"></div>
          <p className="mt-6 text-caption text-gray-400 italic">
            Reserva tu sesión o solicita presupuesto para obras personalizadas
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Columna Izquierda: Info Directa */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5">
              <h3 className="text-caption text-[#E08733] mb-6 flex items-center gap-2">
                <MessageSquare size={14} /> Información Directa
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#E08733] shrink-0" size={18} />
                  <div>
                    <p className="text-caption">Estudio</p>
                    <p className="text-body mt-1">Born Again Tattoo, Barrio Fígares, Granada</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-[#E08733] shrink-0" size={18} />
                  <div>
                    <p className="text-caption">Email</p>
                    <p className="text-body mt-1">josehalconero@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Instagram className="text-[#E08733] shrink-0" size={18} />
                  <div>
                    <p className="text-caption">Instagram</p>
                    <p className="text-body mt-1">@josehalconero</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#E08733]/5 border border-[#E08733]/20 rounded-2xl">
              <div className="flex items-center gap-3 text-[#E08733] mb-4">
                <Calendar size={20} />
                <span className="text-caption">Horarios</span>
              </div>
              <p className="text-body leading-relaxed">
                Atiendo bajo cita previa. Escríbeme detallando tu idea (tamaño, zona del cuerpo o dimensiones de la obra) para agilizar el proceso.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="lg:col-span-3">
            <div className="bg-[#1a1a1a] p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
              {enviado ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-[#E08733]/20 text-[#E08733] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={30} />
                  </div>
                  <h3 className="text-xl font-bold uppercase mb-2">Petición recibida</h3>
                  <p className="text-gray-400 text-sm">Gracias por contactar, Jose revisará tu propuesta pronto.</p>
                  <button onClick={() => setEnviado(false)} className="mt-8 text-[10px] uppercase tracking-widest text-[#E08733] underline">Nueva consulta</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Nombre Completo</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="input-field bg-[#2a2a2a] rounded-xl px-4 py-4 border-white/5"
                        placeholder="EJ. JUAN PÉREZ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all text-white"
                        placeholder="600 000 000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Email de contacto</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all text-white"
                      placeholder="TU@EMAIL.COM"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Preferencia de Fecha</label>
                      <select
                        value={formData.fechaPreferencia === 'A convenir' ? 'A convenir' : 'especifica'}
                        onChange={(e) => setFormData({ ...formData, fechaPreferencia: e.target.value === 'A convenir' ? 'A convenir' : '' })}
                        className="input-field bg-[#2a2a2a] rounded-xl px-4 py-4 border-white/5"
                      >
                        <option value="A convenir">A convenir con Jose</option>
                        <option value="especifica">Elegir fecha específica</option>
                      </select>
                    </div>

                    {formData.fechaPreferencia !== 'A convenir' && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Selecciona el día</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.fechaPreferencia}
                          onChange={(e) => setFormData({ ...formData, fechaPreferencia: e.target.value })}
                          className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all text-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Asunto / Motivo</label>
                    <select
                      name="motivo"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="input-field bg-[#2a2a2a] rounded-xl px-4 py-4 border-white/5"
                    >
                      <option>Cita para Tatuaje</option>
                      <option>Encargo de Imaginería / Talla</option>
                      <option>Restauración de Obra</option>
                      <option>Pintura o Diseño</option>
                      <option>Consulta General</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Cuéntame tu idea</label>
                    <textarea
                      name="mensaje"
                      rows={4}
                      required
                      value={formData.idea}
                      onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all resize-none text-white"
                      placeholder="DESCRIBE TU PROYECTO, TAMAÑO, ZONA..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-5 rounded-xl uppercase tracking-[0.3em] text-[10px] hover:bg-[#E08733] transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    {loading ? 'Enviando...' : <><Send size={14} /> Enviar Solicitud</>}
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