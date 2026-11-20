import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Plus, Trash2, Edit3, X, Loader2, ExternalLink, Image as ImageIcon, CalendarCheck, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { GranadaMark } from '../../components/GranadaMark';
import { GoogleLoginButton } from '../../components/GoogleLoginButton';
import { getImageUrl } from '../../utils/imageHelper';
import type { Obra, Cita, Resena } from '../../types/AppContextType';

type Tab = 'obras' | 'citas' | 'resenas';

/**
 * App de gestión PRIVADA (ruta /gestion, no enlazada desde el sitio público).
 * Logo: la granada (emblema nazarí). Permite subir/editar obras, gestionar
 * citas y moderar reseñas. Acceso solo para administradores.
 */
export const AdminApp = () => {
  const { user, token, loading, logout } = useAuth();

  if (loading) {
    return <Centered><Loader2 className="animate-spin text-[#E08733]" size={28} /></Centered>;
  }
  if (!token || !user) return <AdminLogin />;
  if (!user.is_admin) {
    return (
      <Centered>
        <div className="text-center space-y-6">
          <GranadaMark size={56} className="text-[#E08733] mx-auto" />
          <p className="text-sm text-gray-400">Esta cuenta no tiene permisos de administración.</p>
          <button onClick={logout} className="btn btn-ghost">Cerrar sesión</button>
        </div>
      </Centered>
    );
  }
  return <Dashboard />;
};

/* ============ LOGIN ============ */
const AdminLogin = () => {
  const { request } = useApi();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append('username', email);
      body.append('password', password);
      const data = await request<{ access_token: string; is_admin: boolean }>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (data) login(data.access_token, data.is_admin);
    } catch (err) {
      setError((err as Error).message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (accessToken: string) => {
    setError(''); setLoading(true);
    try {
      const data = await request<{ access_token: string; is_admin: boolean }>('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken }),
      });
      if (data) login(data.access_token, data.is_admin);
    } catch (err) {
      setError((err as Error).message || 'Tu cuenta de Google no tiene acceso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Centered>
      <form onSubmit={handleLogin} className="w-full max-w-sm text-center space-y-6">
        <GranadaMark size={64} className="text-[#E08733] mx-auto" />
        <div>
          <h1 className="font-display font-bold text-4xl text-[#EFE7D7] leading-none">Gestión Halconero</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 mt-2">Acceso privado</p>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <input type="email" placeholder="Correo" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <><Lock size={14} /> Entrar</>}
        </button>

        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-600">o</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleLoginButton onToken={handleGoogle} disabled={loading} />

        <Link to="/" className="inline-block text-[10px] uppercase tracking-widest text-gray-600 hover:text-[#E08733]">← Volver a la web</Link>
      </form>
    </Centered>
  );
};

/* ============ DASHBOARD ============ */
const Dashboard = () => {
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>('obras');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'obras', label: 'Portfolio', icon: <ImageIcon size={15} /> },
    { id: 'citas', label: 'Citas', icon: <CalendarCheck size={15} /> },
    { id: 'resenas', label: 'Reseñas', icon: <Star size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EFE7D7]">
      {/* Cabecera */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GranadaMark size={38} className="text-[#E08733]" />
            <div>
              <p className="font-display font-bold text-xl leading-none">Gestión Halconero</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500">Panel privado</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="btn btn-ghost text-[10px] hidden sm:inline-flex">
              Ver web <ExternalLink size={13} />
            </Link>
            <button onClick={logout} className="btn btn-ghost text-[10px]"><LogOut size={13} /> Salir</button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-widest font-bold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? 'border-[#E08733] text-[#E08733]' : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {tab === 'obras' && <ObrasManager />}
        {tab === 'citas' && <CitasManager />}
        {tab === 'resenas' && <ResenasManager />}
      </main>
    </div>
  );
};

/* ============ OBRAS ============ */
const ObrasManager = () => {
  const { request } = useApi();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [tipo, setTipo] = useState('Tatuaje');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const d = await request<Obra[]>('/obras/'); if (d) setObras(d); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setTitulo(''); setDesc(''); setTipo('Tatuaje'); setArchivo(null); setForm(true); };
  const openEdit = (o: Obra) => { setEditId(o.id); setTitulo(o.titulo); setDesc(o.descripcion); setTipo(o.tipo || 'Tatuaje'); setArchivo(null); setForm(true); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('titulo', titulo);
    fd.append('descripcion', desc);
    fd.append('tipo', tipo);
    if (archivo) fd.append('imagen', archivo);
    try {
      await request(editId ? `/obras/${editId}` : '/obras/', { method: editId ? 'PUT' : 'POST', body: fd });
      setForm(false); setEditId(null); load();
    } catch (err) { alert('Error al guardar: ' + (err as Error).message); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!window.confirm('¿Borrar esta pieza?')) return;
    try { await request(`/obras/${id}`, { method: 'DELETE' }); setObras((p) => p.filter((o) => o.id !== id)); }
    catch (e) { console.error(e); }
  };

  return (
    <section>
      <Header title="Portfolio" count={obras.length} action={<button onClick={openNew} className="btn btn-accent"><Plus size={14} /> Nueva pieza</button>} />
      {loading ? <Loading /> : obras.length === 0 ? (
        <Empty text="Aún no has subido ninguna pieza." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {obras.map((o) => (
            <div key={o.id} className="rounded-xl overflow-hidden border border-white/10 bg-white/5 group">
              <div className="aspect-square overflow-hidden">
                <img src={getImageUrl(o.imagen_url)} alt={o.titulo} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold truncate">{o.titulo}</p>
                <p className="text-[9px] uppercase tracking-widest text-[#E08733] mt-1">{o.tipo}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => openEdit(o)} className="text-[9px] uppercase font-black tracking-widest text-white/60 hover:text-white flex items-center gap-1"><Edit3 size={11} /> Editar</button>
                  <button onClick={() => remove(o.id)} className="text-[9px] uppercase font-black tracking-widest text-red-500/70 hover:text-red-400 flex items-center gap-1"><Trash2 size={11} /> Borrar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <Modal onClose={() => setForm(false)} title={editId ? 'Editar pieza' : 'Nueva pieza'}>
          <form onSubmit={submit} className="space-y-4">
            <input type="text" placeholder="Título" className="input-field" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            <select className="input-field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Tatuaje">Tatuaje</option>
              <option value="Dibujo">Dibujo / Diseño</option>
              <option value="Imaginería">Imaginería</option>
              <option value="Otro">Otro</option>
            </select>
            <textarea placeholder="Descripción" className="textarea-field h-24" value={desc} onChange={(e) => setDesc(e.target.value)} required />
            <input type="file" accept="image/*" className="text-[11px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#E08733] file:text-black file:text-[10px] file:uppercase file:font-black" onChange={(e) => setArchivo(e.target.files?.[0] || null)} required={!editId} />
            <button disabled={saving} className="btn btn-primary w-full disabled:opacity-50">{saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Publicar pieza'}</button>
          </form>
        </Modal>
      )}
    </section>
  );
};

/* ============ CITAS ============ */
const CitasManager = () => {
  const { request } = useApi();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const d = await request<Cita[]>('/citas/'); if (d) setCitas(d); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const setEstado = async (id: number, estado: string) => {
    try {
      await request(`/citas/${id}/estado`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) });
      load();
    } catch (e) { console.error(e); }
  };

  const color = (e: string) => e === 'confirmada' ? 'bg-green-500/20 text-green-400' : e === 'cancelada' ? 'bg-red-500/20 text-red-400' : 'bg-[#E08733]/20 text-[#E08733]';

  return (
    <section>
      <Header title="Solicitudes de cita" count={citas.length} />
      {loading ? <Loading /> : citas.length === 0 ? <Empty text="No hay solicitudes todavía." /> : (
        <div className="space-y-4">
          {citas.map((c) => (
            <div key={c.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  {c.usuario && <p className="text-xs font-black uppercase">{c.usuario.nombre} · {c.usuario.email} · {c.usuario.telefono}</p>}
                  <p className="text-sm text-gray-300 mt-1 break-words">{c.idea}</p>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Fecha: {c.fecha_cita}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${color(c.estado)}`}>{c.estado}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setEstado(c.id, 'confirmada')} className="px-4 py-1.5 bg-green-500 text-black text-[9px] font-black uppercase rounded-full hover:bg-green-400">Confirmar</button>
                <button onClick={() => setEstado(c.id, 'cancelada')} className="px-4 py-1.5 bg-red-500 text-white text-[9px] font-black uppercase rounded-full hover:bg-red-400">Cancelar</button>
                <button onClick={() => setEstado(c.id, 'pendiente')} className="px-4 py-1.5 bg-white/10 text-white text-[9px] font-black uppercase rounded-full hover:bg-white/20">Pendiente</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/* ============ RESEÑAS ============ */
const ResenasManager = () => {
  const { request } = useApi();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const d = await request<Resena[]>('/resenas/'); if (d) setResenas(d); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;
    try { await request(`/resenas/${id}`, { method: 'DELETE' }); setResenas((p) => p.filter((r) => r.id !== id)); }
    catch (e) { console.error(e); }
  };

  return (
    <section>
      <Header title="Reseñas" count={resenas.length} />
      {loading ? <Loading /> : resenas.length === 0 ? <Empty text="No hay reseñas todavía." /> : (
        <div className="grid md:grid-cols-2 gap-4">
          {resenas.map((r) => (
            <div key={r.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex gap-1 text-[#E08733] mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.estrellas ? '#E08733' : 'none'} />)}</div>
                  <p className="text-sm text-gray-300 italic">"{r.comentario}"</p>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">{r.usuario} · {r.fecha}</p>
                </div>
                <button onClick={() => remove(r.id)} className="text-red-500/60 hover:text-red-500 shrink-0"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/* ============ UI helpers ============ */
const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">{children}</div>
);
const Header = ({ title, count, action }: { title: string; count: number; action?: React.ReactNode }) => (
  <div className="flex items-end justify-between mb-8">
    <h2 className="font-display font-bold text-4xl text-[#EFE7D7] leading-none">{title} <span className="text-[#E08733]/50 text-2xl">({count})</span></h2>
    {action}
  </div>
);
const Loading = () => <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#E08733]" size={28} /></div>;
const Empty = ({ text }: { text: string }) => <p className="text-center text-gray-500 text-[11px] uppercase tracking-[0.3em] py-16">{text}</p>;
const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="modal-overlay z-[150]">
    <div className="modal-content max-w-lg">
      <button onClick={onClose} aria-label="Cerrar" className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
      <h3 className="font-display font-bold text-3xl mb-6 text-[#EFE7D7]">{title}</h3>
      {children}
    </div>
  </div>
);

export default AdminApp;
