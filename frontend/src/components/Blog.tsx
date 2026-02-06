import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Calendar, ArrowRight, Plus, X, Image as ImageIcon } from 'lucide-react';

interface Post {
  id: number;
  titulo: string;
  contenido: string;
  imagen_url: string;
  fecha?: string;
}

export const Blog = ({ isAdmin }: { isAdmin: boolean }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  
  // Estados para el nuevo post
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/blog/');
      setPosts(res.data);
    } catch (error) {
      console.error("Error cargando el blog:", error);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCrearPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen) return;

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('imagen', imagen);

    try {
      await axios.post('http://localhost:8000/blog/', formData);
      setMostrarForm(false);
      setTitulo('');
      setContenido('');
      setImagen(null);
      fetchPosts(); // Recargamos la lista
    } catch (error) {
      alert("Error al crear la entrada");
    }
  };

  return (
    <section className="min-h-screen bg-[#2a2a2a] pt-12 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera y Botón Admin */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <BookOpen className="text-[#E08733]" size={24} />
              <h2 className="text-2xl font-bold tracking-[0.4em] uppercase">Bitácora Creativa</h2>
            </div>
            <div className="h-1 w-20 bg-[#E08733]"></div>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setMostrarForm(true)}
              className="bg-[#E08733] text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg"
            >
              <Plus size={16} /> Nueva Entrada
            </button>
          )}
        </div>

        {/* Modal de Formulario Admin */}
        {mostrarForm && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] w-full max-w-2xl p-8 rounded-2xl border border-white/10 relative">
              <button onClick={() => setMostrarForm(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X size={24} />
              </button>
              
              <h3 className="text-[#E08733] text-sm font-bold uppercase tracking-[0.3em] mb-8">Redactar Post</h3>
              
              <form onSubmit={handleCrearPost} className="space-y-6">
                <input 
                  type="text" 
                  placeholder="TÍTULO DE LA ENTRADA"
                  className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-5 py-4 text-xs outline-none focus:border-[#E08733] transition-all"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
                
                <textarea 
                  placeholder="CONTENIDO DEL ARTÍCULO..."
                  rows={8}
                  className="w-full bg-[#2a2a2a] border border-white/5 rounded-xl px-5 py-4 text-xs outline-none focus:border-[#E08733] transition-all resize-none"
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  required
                ></textarea>

                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
                    className="hidden" 
                    id="post-image"
                    required
                  />
                  <label 
                    htmlFor="post-image"
                    className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-white/10 rounded-xl cursor-pointer group-hover:border-[#E08733]/50 transition-all"
                  >
                    <ImageIcon className="text-gray-500 mb-2 group-hover:text-[#E08733]" size={24} />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {imagen ? imagen.name : 'Subir Imagen de Portada'}
                    </span>
                  </label>
                </div>

                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E08733] transition-all">
                  Publicar en el Blog
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Grid de Posts (El mismo que teníamos antes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <div className="relative aspect-video overflow-hidden rounded-xl mb-6 border border-white/5">
                <img src={post.imagen_url} alt={post.titulo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="space-y-3">
                <span className="text-[#E08733] text-[9px] font-bold uppercase tracking-widest">Blog</span>
                <h3 className="text-lg font-bold uppercase leading-tight">{post.titulo}</h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{post.contenido}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};