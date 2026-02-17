import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

interface Obra {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
}

export const Obras = ({ isAdmin }: { isAdmin: boolean }) => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSeleccionada, setObraSeleccionada] = useState<Obra | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEnEdicion, setIdEnEdicion] = useState<number | null>(null);

  // --- CATEGORÍAS EXCLUSIVAS ---
  const categorias = ['Imaginería', 'Dibujo', 'Tatuaje'];
  const [filtroActivo, setFiltroActivo] = useState('Imaginería'); // Empieza en Imaginería por defecto

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Imaginería');
  const [desc, setDesc] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const fetchObras = async () => {
    try {
      const res = await fetch(`${BASE_URL}/obras/`);
      if (res.ok) {
        const data = await res.json();
        setObras(data);
      } else {
        console.error("Fetch failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error cargando obras:", error);
    }
  };

  useEffect(() => { fetchObras(); }, []);

  // Filtrado: Ahora siempre filtra por uno de los tres tipos
  const obrasFiltradas = obras.filter(obra => obra.tipo === filtroActivo);

  const abrirEdicion = (obra: Obra) => {
    setIdEnEdicion(obra.id);
    setTitulo(obra.titulo);
    setTipo(obra.tipo);
    setDesc(obra.descripcion);
    setArchivo(null);
    setMostrarForm(true);
  };

  const abrirNuevoForm = () => {
    setIdEnEdicion(null);
    setTitulo('');
    setTipo(filtroActivo); // Por defecto la categoría en la que estás
    setDesc('');
    setArchivo(null);
    setMostrarForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', desc);
    formData.append('tipo', tipo);
    if (archivo) formData.append('imagen', archivo);

    const url = idEnEdicion ? `${BASE_URL}/obras/${idEnEdicion}` : `${BASE_URL}/obras/`;
    const metodo = idEnEdicion ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method: metodo, body: formData });
      if (response.ok) {
        setMostrarForm(false);
        fetchObras();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar obra?")) return;
    const response = await fetch(`${BASE_URL}/obras/${id}`, { method: 'DELETE' });
    if (response.ok) setObras(prev => prev.filter(o => o.id !== id));
  };

  return (
    <section className="min-h-screen bg-[#2a2a2a] pt-12 pb-24 px-6">
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-white mb-2">Portfolio</h2>
          <div className="h-[2px] w-12 bg-[#E08733]"></div>
        </div>
        {isAdmin && (
          <button onClick={abrirNuevoForm} className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#E08733] transition-all flex items-center gap-2">
            <Plus size={14} /> Añadir a {filtroActivo}
          </button>
        )}
      </div>

      {/* SELECTOR DE TRES APARTADOS */}
      <div className="max-w-7xl mx-auto mb-16 border-b border-white/5 flex justify-center gap-12">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`pb-4 text-[11px] uppercase tracking-[0.4em] transition-all relative ${filtroActivo === cat ? 'text-[#E08733] font-bold' : 'text-gray-500 hover:text-white'
              }`}
          >
            {cat}
            {filtroActivo === cat && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E08733] animate-in fade-in slide-in-from-left-2"></div>
            )}
          </button>
        ))}
      </div>

      {/* GRILLA DINÁMICA */}
      <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {obrasFiltradas.length > 0 ? (
          obrasFiltradas.map((obra) => (
            <div key={obra.id} className="relative group break-inside-avoid rounded-sm overflow-hidden bg-[#1a1a1a]">
              <img
                src={obra.imagen_url}
                className="w-full grayscale hover:grayscale-0 transition-all duration-700 cursor-crosshair"
                onClick={() => setObraSeleccionada(obra)}
              />
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirEdicion(obra)} className="p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(obra.id)} className="p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-red-600 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
              <div className="p-4 border-t border-white/5">
                <h3 className="text-[10px] uppercase tracking-widest font-bold">{obra.titulo}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-600 uppercase text-[10px] tracking-[0.5em]">
            No hay registros en {filtroActivo}
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-[#111] p-10 w-full max-w-md rounded-lg border border-white/5">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-8 border-b border-[#E08733] pb-2 inline-block">
              Gestionar {tipo}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Título de la obra" className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-[#E08733] text-xs uppercase" value={titulo} onChange={e => setTitulo(e.target.value)} required />

              <select className="w-full bg-[#1a1a1a] border border-white/10 p-3 outline-none text-xs uppercase text-gray-400" value={tipo} onChange={e => setTipo(e.target.value)}>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <textarea placeholder="Descripción..." className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-[#E08733] text-xs h-20 resize-none" value={desc} onChange={e => setDesc(e.target.value)} />

              <input type="file" className="text-[10px] text-gray-500" onChange={(e) => setArchivo(e.target.files?.[0] || null)} required={!idEnEdicion} />

              <button type="submit" className="w-full bg-white text-black py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-[#E08733] transition-all">
                {idEnEdicion ? 'Actualizar Obra' : 'Publicar Obra'}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="w-full text-gray-500 text-[9px] uppercase tracking-widest pt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE */}
      {obraSeleccionada && (
        <div className="fixed inset-0 z-[150] bg-black/98 flex items-center justify-center p-4 md:p-12" onClick={() => setObraSeleccionada(null)}>
          <div className="relative max-w-6xl w-full flex flex-col md:flex-row gap-12" onClick={e => e.stopPropagation()}>
            <img src={obraSeleccionada.imagen_url} className="max-h-[70vh] object-contain shadow-2xl" />
            <div className="flex flex-col justify-center space-y-6 max-w-sm">
              <span className="text-[#E08733] text-[10px] font-bold uppercase tracking-[0.5em]">{obraSeleccionada.tipo}</span>
              <h3 className="text-4xl font-serif italic text-white">{obraSeleccionada.titulo}</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-light">{obraSeleccionada.descripcion}</p>
              <button onClick={() => setObraSeleccionada(null)} className="text-white/30 hover:text-white text-[10px] uppercase tracking-widest text-left pt-8">← Cerrar detalle</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};