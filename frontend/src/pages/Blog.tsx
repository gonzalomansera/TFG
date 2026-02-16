import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, X } from 'lucide-react';

interface Post {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  imagen_url: string;
  fecha: string;
}

export const Blog = ({ isAdmin }: { isAdmin: boolean }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  
  // Estados para el formulario
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('Proceso Creativo');
  const [archivo, setArchivo] = useState<File | null>(null);

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:8000/blog/');
    if (res.ok) setPosts(await res.json());
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('categoria', categoria);
    if (archivo) formData.append('imagen', archivo);

    const res = await fetch('http://localhost:8000/blog/', { method: 'POST', body: formData });
    if (res.ok) {
      setMostrarForm(false);
      fetchPosts();
    }
  };

  const deletePost = async (id: number) => {
    if (!window.confirm("¿Borrar post?")) return;
    await fetch(`http://localhost:8000/blog/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <section className="min-h-screen bg-[#1a1a1a] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera Editorial */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-5xl font-serif italic mb-2 text-[#E08733]">El Diario del Taller</h2>
            <p className="text-gray-400 tracking-[0.2em] uppercase text-xs">Pensamientos, procesos y tradición</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setMostrarForm(true)}
              className="bg-white text-black p-4 rounded-full hover:bg-[#E08733] transition-all"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Grid de Noticias Moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-6 aspect-video">
                <img 
                  src={post.imagen_url} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {isAdmin && (
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="absolute top-4 right-4 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex gap-4 text-[10px] uppercase tracking-widest text-[#E08733] font-bold">
                  <span>{post.categoria}</span>
                  <span className="text-gray-500">—</span>
                  <span className="text-gray-500">{post.fecha}</span>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-[#E08733] transition-colors">{post.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">
                  {post.contenido}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Formulario (Similar al de Obras) */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/98 z-[200] flex items-center justify-center p-6 backdrop-blur-md">
           <div className="max-w-2xl w-full bg-[#111] p-10 rounded-2xl border border-white/10 relative">
             <button onClick={() => setMostrarForm(false)} className="absolute top-6 right-6 text-gray-400"><X /></button>
             <h3 className="text-xl mb-8 font-serif italic">Escribir nuevo artículo</h3>
             <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" placeholder="TÍTULO DEL ARTÍCULO" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] uppercase text-xs tracking-widest" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                <select className="w-full bg-transparent border-b border-white/10 py-3 text-xs text-gray-500" value={categoria} onChange={e => setCategoria(e.target.value)}>
                  <option value="Proceso Creativo">Proceso Creativo</option>
                  <option value="Eventos">Eventos / Exposiciones</option>
                  <option value="Historia">Historia del Arte</option>
                </select>
                <textarea placeholder="ESCRIBE AQUÍ TU HISTORIA..." className="w-full bg-transparent border-b border-white/10 py-3 outline-none h-40 resize-none text-sm font-light leading-relaxed" value={contenido} onChange={e => setContenido(e.target.value)} required />
                <input type="file" className="text-[10px] text-gray-500" onChange={(e) => setArchivo(e.target.files?.[0] || null)} required />
                <button className="w-full bg-white text-black py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-[#E08733] transition-all">Publicar Artículo</button>
             </form>
           </div>
        </div>
      )}
    </section>
  );
};