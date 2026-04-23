import { useEffect, useState } from 'react';
import { Trash2, X, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ArtCard } from '../components/ArtCard';
import type { Obra } from '../types/AppContextType';

const BASE_URL = import.meta.env.VITE_API_URL;

export const Obras = ({ isAdmin }: { isAdmin: boolean }) => {
  const { token } = useAuth();
  const [obras, setObras] = useState<Obra[]>([]);
  const [filtro, setFiltro] = useState('Todos');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEnEdicion, setIdEnEdicion] = useState<number | null>(null);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);

  // Estados Formulario
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [tipo, setTipo] = useState('Imaginería');
  const [archivo, setArchivo] = useState<File | null>(null);

  const fetchObras = async () => {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${BASE_URL}/obras/`, { headers });
    if (res.ok) setObras(await res.json());
  };

  useEffect(() => { fetchObras(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', desc);
    formData.append('tipo', tipo);
    if (archivo) formData.append('imagen', archivo);

    const url = idEnEdicion ? `${BASE_URL}/obras/${idEnEdicion}` : `${BASE_URL}/obras/`;
    const method = idEnEdicion ? 'PUT' : 'POST';

    const res = await fetch(url, { 
      method, 
      body: formData,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setMostrarForm(false);
      setIdEnEdicion(null);
      fetchObras();
    }
  };

  const deleteObra = async (id: number) => {
    if (!window.confirm("¿Borrar obra?")) return;
    await fetch(`${BASE_URL}/obras/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setObras(obras.filter(o => o.id !== id));
  };

  const abrirEdicion = (o: Obra) => {
    setIdEnEdicion(o.id);
    setTitulo(o.titulo);
    setDesc(o.descripcion);
    setTipo(o.tipo);
    setArchivo(null);
    setMostrarForm(true);
  };

  const tipologias = ['Todos', 'Imaginería', 'Dibujo', 'Tatuaje'];
  const filtradas = filtro === 'Todos' ? obras : obras.filter(o => o.tipo === filtro);

  return (
    <section className="min-h-screen bg-[#0A0A0A] pt-40 pb-20 relative overflow-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="max-w-7xl mx-auto px-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="space-y-4">
            <span className="text-caption font-black text-[#E08733]">Archivo Visual</span>
            <h2 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">Galería de <br /> Obras</h2>
          </div>

          <div className="flex flex-wrap gap-8 items-center bg-white/5 backdrop-blur-3xl px-10 py-5 rounded-full border border-white/10">
            {tipologias.map(t => (
              <button
                key={t}
                onClick={() => setFiltro(t)}
                className={`text-[10px] uppercase tracking-[0.4em] transition-all whitespace-nowrap font-black ${filtro === t ? 'text-[#E08733]' : 'text-gray-500 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {isAdmin && (
            <button
              onClick={() => { setIdEnEdicion(null); setTitulo(''); setDesc(''); setTipo('Imaginería'); setArchivo(null); setMostrarForm(true); }}
              className="bg-[#E08733] text-black px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl"
            >
              Nueva Obra
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filtradas.map((obra) => (
            <div key={obra.id} className="space-y-4 cursor-pointer" onClick={() => setSelectedObra(obra)}>
              <ArtCard obra={obra} onLikeToggle={fetchObras} />
              {isAdmin && (
                <div className="flex gap-6 border-t border-white/10 pt-6 px-4">
                  <button onClick={(e) => { e.stopPropagation(); deleteObra(obra.id); }} className="text-red-500/70 hover:text-red-400 transition-colors flex items-center gap-2 text-[9px] uppercase font-black tracking-widest"><Trash2 size={12}/> Borrar</button>
                  <button onClick={(e) => { e.stopPropagation(); abrirEdicion(obra); }} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-[9px] uppercase font-black tracking-widest"><Edit3 size={12}/> Editar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {mostrarForm && (
        <div className="modal-overlay z-[150]">
          <div className="modal-content max-w-2xl bg-[#111] border-white/10 p-12">
            <button onClick={() => setMostrarForm(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={30}/></button>
            <h3 className="heading-1 text-2xl mb-12">{idEnEdicion ? 'Editar Obra' : 'Nueva Obra'}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <input type="text" placeholder="TÍTULO DE LA OBRA" className="input-field" value={titulo} onChange={e => setTitulo(e.target.value)} required />
              <select className="input-field border-b" value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="Imaginería">Imaginería</option>
                <option value="Dibujo">Dibujo</option>
                <option value="Tatuaje">Tatuaje</option>
              </select>
              <textarea placeholder="DESCRIPCIÓN Y DETALLES" className="textarea-field h-32" value={desc} onChange={e => setDesc(e.target.value)} required />
              <div className="flex flex-col gap-2">
                <input type="file" className="text-[10px] text-gray-500" onChange={(e) => setArchivo(e.target.files?.[0] || null)} required={!idEnEdicion} />
              </div>
              <button className="w-full btn btn-primary py-6 text-xs">{idEnEdicion ? 'Guardar Cambios' : 'Publicar Obra'}</button>
            </form>
          </div>
        </div>
      )}

      {selectedObra && (
        <div className="modal-overlay z-[100]" onClick={() => setSelectedObra(null)}>
          <div className="modal-content max-w-7xl h-[85vh] p-0 overflow-hidden bg-[#0D0D0D] border-white/5 flex flex-col lg:flex-row" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedObra(null)} className="absolute top-8 right-8 z-10 text-white/50 hover:text-white transition-colors">
              <X size={32} strokeWidth={1} />
            </button>
            
            <div className="lg:w-[60%] h-[500px] lg:h-full overflow-hidden">
              <img src={selectedObra.imagen_url} alt={selectedObra.titulo} className="w-full h-full object-cover" />
            </div>
            <div className="lg:w-[40%] p-12 lg:p-20 flex flex-col justify-center bg-[#111] overflow-y-auto">
              <span className="text-[#E08733] text-[10px] uppercase tracking-[0.4em] font-black mb-4">{selectedObra.tipo}</span>
              <h2 className="text-4xl lg:text-6xl font-serif italic text-white leading-tight mb-8">{selectedObra.titulo}</h2>
              <div className="h-[1px] w-12 bg-[#E08733] mb-8"></div>
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-10">{selectedObra.descripcion}</p>
              
              <div className="flex items-center gap-4 text-white/40 text-[9px] uppercase tracking-widest font-black pt-8 border-t border-white/5">
                 <span>Archivado en Galería</span>
                 <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                 <span>Halconero Studio</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};