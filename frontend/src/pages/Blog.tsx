import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Heart, MessageCircle, Send, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { type Post, type Comentario } from '../types/AppContextType';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { getImageUrl } from '../utils/imageHelper';

export const Blog = ({ isAdmin }: { isAdmin: boolean }) => {
  const { request } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [postExpandido, setPostExpandido] = useState<Post | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [idEnEdicion, setIdEnEdicion] = useState<number | null>(null);

  // Estados para el formulario de nuevo post
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('Proceso Creativo');
  const [archivo, setArchivo] = useState<File | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    try {
      const data = await request<Post[]>('/blog/');
      if (data) {
        setPosts(data);
        if (postExpandido) {
          const updated = data.find((p: Post) => p.id === postExpandido.id);
          if (updated) setPostExpandido(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComentarios = async (postId: number) => {
    try {
      const data = await request<Comentario[]>(`/blog/${postId}/comments`);
      if (data) setComentarios(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  useGSAP(() => {
    gsap.fromTo('.blog-header-reveal', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    if (posts.length > 0) {
      gsap.fromTo('.blog-post-card',
        { opacity: 0, y: 50, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.blog-grid',
            start: "top 90%"
          }
        }
      );
    }
  }, { scope: containerRef, dependencies: [posts] });

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('categoria', categoria);
    if (archivo) formData.append('imagen', archivo);

    const url = idEnEdicion ? `/blog/${idEnEdicion}` : `/blog/`
    const method = idEnEdicion ? 'PUT' : 'POST'

    try {
      await request(url, { method, body: formData });
      setMostrarForm(false);
      setIdEnEdicion(null);
      fetchPosts();
      setTitulo(''); setContenido(''); setArchivo(null);
    } catch (e) {
      console.error(e);
    }
  };

  const abrirEdicion = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    setIdEnEdicion(post.id);
    setTitulo(post.titulo);
    setContenido(post.contenido);
    setCategoria(post.categoria);
    setArchivo(null);
    setMostrarForm(true);
  };

  const deletePost = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("¿Borrar post?")) return;
    try {
      await request(`/blog/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!user) {
        alert("Debes iniciar sesión para dar me gusta");
        return;
    }
    try {
      await request(`/blog/${id}/like`, { method: 'POST' });
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExpandir = (post: Post) => {
    setPostExpandido(post);
    fetchComentarios(post.id);
  };

  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !postExpandido || !nuevoComentario.trim()) return;

    try {
      await request(`/blog/${postExpandido.id}/comentar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: nuevoComentario })
      });
      setNuevoComentario('');
      fetchComentarios(postExpandido.id);
      fetchPosts(); 
    } catch (e) {
      console.error(e);
    }
  };

  const eliminarComentario = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar este comentario?")) return;
    try {
      await request(`/blog/comments/${id}`, { method: 'DELETE' });
      if (postExpandido) fetchComentarios(postExpandido.id);
      fetchPosts(); 
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section ref={containerRef} className="page-container custom-bg-dark overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera Editorial */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8 blog-header-reveal">
          <div>
            <h2 className="heading-1 text-[#E08733]">El Diario del Taller</h2>
            <p className="text-caption text-gray-400 normal-case tracking-[0.2em]">Pensamientos, procesos y tradición</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setMostrarForm(true)}
              className="btn-icon bg-white text-black hover:bg-[#E08733]"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Grid de Noticias Moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer blog-post-card" onClick={() => handleExpandir(post)}>
              <div className="relative overflow-hidden mb-6 aspect-video">
                <img
                  src={getImageUrl(post.imagen_url)}
                  className="card-image group-hover:scale-110 transition-transform duration-1000"
                  alt={post.titulo}
                />
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={(e) => abrirEdicion(e, post)}
                      className="btn-icon bg-white/80 text-black hover:bg-[#E08733] hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => deletePost(e, post.id)}
                      className="btn-icon bg-red-500/80 backdrop-blur-md opacity-0 group-hover:opacity-100 text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex gap-4 text-[10px] uppercase tracking-widest text-[#E08733] font-bold">
                  <span>{post.categoria}</span>
                  <span className="text-gray-500">—</span>
                  <span className="text-gray-500">{post.fecha}</span>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-[#E08733] transition-colors">{post.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light mb-4">
                  {post.contenido}
                </p>
                
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button 
                        onClick={(e) => handleLike(e, post.id)}
                        className={`flex items-center gap-2 text-[10px] font-bold tracking-widest transition-all ${user ? 'hover:scale-110' : 'opacity-50'}`}
                    >
                        <Heart size={16} className={post.is_liked ? "fill-[#E08733] text-[#E08733]" : "text-gray-400"} />
                        <span className={post.is_liked ? "text-[#E08733]" : "text-gray-400"}>{post.likes_count}</span>
                    </button>
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500">
                        <MessageCircle size={16} />
                        {post.comments_count}
                    </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Expandido (Detalle + Comentarios) */}
      {postExpandido && (
        <div className="modal-overlay z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-[95vw] lg:max-w-7xl bg-[#0a0a0a] border border-white/10 h-[92vh] overflow-hidden flex flex-col p-0 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] relative">
            <button onClick={() => setPostExpandido(null)} className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-md">
              <X size={20} />
            </button>
            
            <div className="flex flex-col lg:flex-row h-full">
                {/* Imagen y Texto (Lado Izquierdo) */}
                <div className="w-full lg:w-[65%] overflow-y-auto no-scrollbar border-r border-white/5 outline-none bg-gradient-to-b from-transparent to-white/[0.02]">
                    <div className="relative">
                      <img src={getImageUrl(postExpandido.imagen_url)} className="w-full aspect-[16/10] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
                    </div>
                    <div className="p-10 md:p-14 space-y-8">
                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-[#E08733] font-black">
                            <span className="bg-[#E08733]/10 px-3 py-1 rounded-full">{postExpandido.categoria}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white/40">{postExpandido.fecha}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black italic text-white uppercase tracking-tighter leading-[1.1]">
                          {postExpandido.titulo}
                        </h2>
                        <p className="text-gray-400 text-lg font-light leading-relaxed whitespace-pre-wrap">
                            {postExpandido.contenido}
                        </p>
                        
                        <div className="flex items-center gap-8 pt-10 border-t border-white/5">
                            <button 
                                onClick={(e) => handleLike(e, postExpandido.id)}
                                className="flex items-center gap-3 transition-transform active:scale-90"
                            >
                                <Heart size={24} className={postExpandido.is_liked ? "fill-[#E08733] text-[#E08733]" : "text-white/30"} />
                                <div className="flex flex-col items-start leading-none">
                                  <span className="text-white font-black text-lg">{postExpandido.likes_count}</span>
                                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Me gusta</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comentarios (Lado Derecho) */}
                <div className="w-full lg:w-[35%] flex flex-col bg-[#0d0d0d] shadow-2xl relative">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#E08733]">Comentarios</h4>
                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-white/30 font-bold">{comentarios.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
                        {comentarios.length > 0 ? comentarios.map((com) => (
                            <div key={com.id} className="space-y-3 group">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E08733] to-[#ffba7a] p-[1px]">
                                        <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-[10px] text-white font-bold">
                                          {com.usuario.charAt(0)}
                                        </div>
                                      </div>
                                      <span className="text-white font-bold text-xs">{com.usuario}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] text-gray-600 uppercase tracking-widest font-medium">{com.fecha}</span>
                                        {isAdmin && (
                                          <button 
                                            onClick={() => eliminarComentario(com.id)}
                                            className="text-red-500/40 hover:text-red-500 transition-all p-1 hover:bg-red-500/10 rounded-md"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        )}
                                    </div>
                                </div>
                                <div className="pl-11">
                                  <p className="text-[13px] text-gray-400 font-light leading-relaxed">
                                      {com.contenido}
                                  </p>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <MessageCircle size={48} className="mb-4" />
                                <p className="text-[10px] uppercase tracking-widest font-bold">Sé el primero en comentar</p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 border-t border-white/5 bg-[#0d0d0d]">
                        {user ? (
                            <form onSubmit={enviarComentario} className="flex flex-col gap-4">
                                <div className="relative w-full">
                                    <textarea 
                                        placeholder="Escribe un comentario..." 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pr-14 text-sm font-light text-white focus:outline-none focus:border-[#E08733]/50 transition-all resize-none h-32 scrollbar-none"
                                        value={nuevoComentario}
                                        onChange={(e) => setNuevoComentario(e.target.value)}
                                    />
                                    <button 
                                      type="submit" 
                                      className="absolute top-4 right-4 p-2 bg-[#E08733] text-black rounded-lg hover:scale-110 transition-transform shadow-lg shadow-[#E08733]/20"
                                      disabled={!nuevoComentario.trim()}
                                    >
                                        <Send size={16} strokeWidth={3} />
                                    </button>
                                </div>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest text-center">Presiona el icono para enviar</p>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-4">Inicia sesión para participar</p>
                                <button 
                                    onClick={() => { setPostExpandido(null); navigate('/login'); }}
                                    className="px-6 py-2 bg-[#E08733] text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors"
                                >
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registro Nuevo Post (Admin) */}
      {mostrarForm && (
        <div className="modal-overlay z-[100]">
          <div className="modal-content max-w-2xl bg-[#111] border-white/10">
            <button onClick={() => { setMostrarForm(false); setIdEnEdicion(null); }} className="absolute top-6 right-6 text-gray-400"><X /></button>
            <h3 className="heading-1 text-xl mb-8">{idEnEdicion ? 'Editar Artículo' : 'Escribir nuevo artículo'}</h3>
            <form onSubmit={handleSubmitPost} className="space-y-6">
              <input type="text" placeholder="TÍTULO DEL ARTÍCULO" className="input-field text-white tracking-widest" value={titulo} onChange={e => setTitulo(e.target.value)} required />
              <select className="input-field border-b text-gray-500" value={categoria} onChange={e => setCategoria(e.target.value)}>
                <option value="Proceso Creativo">Proceso Creativo</option>
                <option value="Eventos">Eventos / Exposiciones</option>
                <option value="Historia">Historia del Arte</option>
              </select>
              <textarea placeholder="ESCRIBE AQUÍ TU HISTORIA..." className="textarea-field h-40 text-sm font-light leading-relaxed" value={contenido} onChange={e => setContenido(e.target.value)} required />
              <div className="flex flex-col gap-2">
                <input type="file" className="text-[10px] text-gray-500" onChange={(e) => setArchivo(e.target.files?.[0] || null)} required={!idEnEdicion} />
                {idEnEdicion && <p className="text-[9px] text-gray-500 italic">Opcional: Sube una imagen solo si quieres cambiarla.</p>}
              </div>
              <button className="w-full btn btn-primary">{idEnEdicion ? 'Guardar Cambios' : 'Publicar Artículo'}</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};