import React, { useState } from 'react';
import { Send, MapPin, Instagram, Mail, Calendar, MessageSquare } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

export const Contacto = () => {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'Cita Tatuaje',
    idea: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Usamos la URL de Formspree que me has pasado
      const response = await fetch('https://formspree.io/f/xjgerbjv', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Nombre: formData.nombre,
          Email: formData.email,
          Telefono: formData.telefono,
          Motivo: formData.tipo,
          Propuesta: formData.idea
        })
      });

      if (response.ok) {
        setEnviado(true);
        // Limpiamos el formulario
        setFormData({ nombre: '', email: '', telefono: '', tipo: 'Cita Tatuaje', idea: '' });
      } else {
        alert("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#2a2a2a] pt-12 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-[0.4em] uppercase mb-4">Citas & Contacto</h2>
          <div className="h-1 w-20 bg-[#E08733] mx-auto"></div>
          <p className="mt-6 text-gray-400 text-xs uppercase tracking-[0.2em] italic">
            Reserva tu sesión o solicita presupuesto para obras personalizadas
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Columna Izquierda: Info Directa */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5">
              <h3 className="text-[#E08733] text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <MessageSquare size={14} /> Información Directa
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#E08733] shrink-0" size={18} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Estudio</p>
                    <p className="text-gray-400 text-xs mt-1 font-light">Born Again Tattoo, Barrio Fígares, Granada</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-[#E08733] shrink-0" size={18} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Email</p>
                    <p className="text-gray-400 text-xs mt-1 font-light">josehalconero@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Instagram className="text-[#E08733] shrink-0" size={18} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Instagram</p>
                    <p className="text-gray-400 text-xs mt-1 font-light">@josehalconero</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#E08733]/5 border border-[#E08733]/20 rounded-2xl">
              <div className="flex items-center gap-3 text-[#E08733] mb-4">
                <Calendar size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Horarios</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
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
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all text-white" 
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
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all text-white" 
                      placeholder="TU@EMAIL.COM"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">Asunto / Motivo</label>
                    <select 
                      name="motivo"
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-4 py-4 text-xs focus:border-[#E08733] outline-none transition-all text-gray-300"
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
                      onChange={(e) => setFormData({...formData, idea: e.target.value})}
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