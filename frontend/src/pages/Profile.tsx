import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, User as UserIcon, Phone, Mail, Loader2, CheckCircle2, Package, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

const Profile = () => {
  const { user, token } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.foto_perfil ? `${import.meta.env.VITE_API_URL}${user.foto_perfil}` : null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);

  const [citas, setCitas] = useState<any[]>([]);
  const [todasLasCitas, setTodasLasCitas] = useState<any[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const url = user?.is_admin ? `${import.meta.env.VITE_API_URL}/pedidos/` : `${import.meta.env.VITE_API_URL}/pedidos/me`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPedidos(data);
        }
      } catch (error) {
        console.error("Error fetching pedidos:", error);
      } finally {
        setLoadingPedidos(false);
      }
    };

    const fetchCitas = async () => {
      try {
        const url = user?.is_admin ? `${import.meta.env.VITE_API_URL}/citas/` : `${import.meta.env.VITE_API_URL}/citas/mis-citas`;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (user?.is_admin) setTodasLasCitas(data);
          else setCitas(data);
        }
      } catch (e) { console.error(e); }
      finally { setLoadingCitas(false); }
    };

    if (token) {
      fetchPedidos();
      fetchCitas();
    }
  }, [token, user?.is_admin]);

  const updateCitaEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/citas/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) {
        // Refresh
        const url = `${import.meta.env.VITE_API_URL}/citas/`;
        const r = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        setTodasLasCitas(await r.json());
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setTelefono(user.telefono || '');
      if (user.foto_perfil) {
        setPreview(`${import.meta.env.VITE_API_URL}${user.foto_perfil}`);
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('telefono', telefono);
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        // En una app real, aquí llamaríamos a un fetchMe() del context para actualizar el estado global
        // Por ahora, el usuario verá el cambio al recargar o si implementamos el refresco manual
        setTimeout(() => window.location.reload(), 1500); 
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto">
        {/* Header Estilo Instagram / Premium */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="relative group">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-[#E08733]/30 p-1 bg-gradient-to-tr from-[#E08733] to-[#ffba7a]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#111] relative">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <UserIcon size={64} />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={32} />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-4 uppercase tracking-tighter italic">
              {user?.nombre || 'Usuario'}
            </h1>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] mb-6">
              Miembro desde {new Date().getFullYear()} · Granada, España
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-[#E08733]">
                 {user?.is_admin ? 'Administrador' : 'Coleccionista'}
               </div>
               <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/50">
                 {user?.email}
               </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E08733]/10 blur-[100px] -z-10"></div>
          
          <h2 className="text-2xl font-serif italic text-white mb-12 flex items-center gap-4">
             Información de la Cuenta
             <div className="h-[1px] flex-1 bg-white/10"></div>
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Nombre Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E08733]" size={18} />
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-sm focus:border-[#E08733]/50 outline-none transition-all"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#E08733]" size={18} />
                <input 
                  type="text" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-sm focus:border-[#E08733]/50 outline-none transition-all"
                  placeholder="+34 000 000 000"
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Correo Electrónico (No editable)</label>
              <div className="relative opacity-50">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              {message && (
                <div className={`flex items-center gap-3 text-sm px-6 py-4 rounded-2xl ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : null}
                  {message.text}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto ml-auto flex items-center justify-center gap-4 px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#E08733] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>

        {/* Mis Pedidos */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl mt-12">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#E08733]/5 blur-[100px] -z-10"></div>
          
          <h2 className="text-2xl font-serif italic text-white mb-12 flex items-center gap-4">
             {user?.is_admin ? 'Gestión de Pedidos (Clientes)' : 'Mis Pedidos'}
             <div className="h-[1px] flex-1 bg-white/10"></div>
          </h2>

          {loadingPedidos ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-[#E08733]" size={32} />
            </div>
          ) : pedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-50" />
              <p className="text-[10px] uppercase tracking-widest">{user?.is_admin ? 'No hay pedidos en el sistema' : 'No has realizado ningún pedido todavía'}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all">
                  <div 
                    className="p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 bg-[#E08733]/10 rounded-full flex items-center justify-center text-[#E08733]">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Pedido #{pedido.id} {user?.is_admin && `· ${pedido.usuario.nombre}`}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {user?.is_admin ? `Cliente: ${pedido.usuario.email}` : `${new Date(pedido.fecha).toLocaleDateString()} a las ${new Date(pedido.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                      <div className="text-left md:text-right">
                        <p className="text-[#E08733] font-black">{pedido.total.toFixed(2)}€</p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">{pedido.metodo_pago}</p>
                      </div>
                      <div className="text-gray-400">
                        {expandedPedido === pedido.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items */}
                  {expandedPedido === pedido.id && (
                    <div className="p-6 border-t border-white/10 bg-black/20">
                      <div className="space-y-4">
                        {pedido.items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <img src={item.imagen_url} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{item.nombre}</p>
                              <p className="text-xs text-gray-500 mt-1">{item.cantidad} x {item.precio_unitario.toFixed(2)}€</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-white">{(item.cantidad * item.precio_unitario).toFixed(2)}€</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis Citas (Para Clientes) */}
        {!user?.is_admin && (
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl mt-12">
            <h2 className="text-2xl font-serif italic text-white mb-12 flex items-center gap-4">
              Mis Citas
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </h2>
            {loadingCitas ? (
              <Loader2 className="animate-spin text-[#E08733] mx-auto" />
            ) : citas.length === 0 ? (
              <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest py-10">No tienes citas solicitadas</p>
            ) : (
              <div className="space-y-4">
                {citas.map(c => (
                  <div key={c.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-sm">{c.idea}</p>
                      <p className="text-gray-500 text-xs mt-1">Solicitada el: {c.fecha_cita}</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.estado === 'confirmada' ? 'bg-green-500/20 text-green-400' : 
                      c.estado === 'cancelada' ? 'bg-red-500/20 text-red-400' : 'bg-[#E08733]/20 text-[#E08733]'
                    }`}>
                      {c.estado}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Gestión de Citas (Para Admins) */}
        {user?.is_admin && (
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl mt-12">
            <h2 className="text-2xl font-serif italic text-white mb-12 flex items-center gap-4">
              Gestión de Citas
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </h2>
            <div className="space-y-6">
              {todasLasCitas.map(c => (
                <div key={c.id} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-black uppercase text-sm">{c.usuario?.nombre}</h4>
                      <p className="text-gray-500 text-xs">{c.usuario?.email} · {c.usuario?.telefono}</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.estado === 'confirmada' ? 'bg-green-500/20 text-green-400' : 
                      c.estado === 'cancelada' ? 'bg-red-500/20 text-red-400' : 'bg-[#E08733]/20 text-[#E08733]'
                    }`}>
                      {c.estado}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm italic">"{c.idea}"</p>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => updateCitaEstado(c.id, 'confirmada')} className="px-6 py-2 bg-green-500 text-black text-[9px] font-black uppercase rounded-full hover:bg-green-400 transition-colors">Confirmar</button>
                    <button onClick={() => updateCitaEstado(c.id, 'cancelada')} className="px-6 py-2 bg-red-500 text-white text-[9px] font-black uppercase rounded-full hover:bg-red-400 transition-colors">Cancelar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
