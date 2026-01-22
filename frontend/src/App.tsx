import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import './index.css'
import { X, Instagram, Twitter, Music2, MapPin, } from 'lucide-react'

interface Obra {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
}

function App() {
  const [obras, setObras] = useState<Obra[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('tatuaje')
  const [archivo, setArchivo] = useState<File | null>(null)

  const cargarDatos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8000/obras/');
      setObras(respuesta.data);
    } catch (error) {
      console.error("Error cargando obras:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') setIsAdmin(true);
  }, []);

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    if (!archivo) return;
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('tipo', tipo);
    formData.append('imagen', archivo);

    try {
      await axios.post('http://localhost:8000/obras/', formData);
      setTitulo(''); setDescripcion(''); setArchivo(null);
      setMostrarForm(false);
      cargarDatos();
    } catch (error) {
      alert("Error en la subida");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#E08733] selection:text-black font-light">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="fixed top-0 w-full z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#E08733]/20">
        <div className="max-w-7xl mx-auto px-8 h-24 flex justify-between items-center">
          <h1 className="text-xl tracking-[0.4em] uppercase font-bold text-[#E08733]">Halconero</h1>
          
          <div className="hidden md:flex gap-10 text-[10px] tracking-[0.25em] uppercase text-gray-400">
            <a href="#blog" className="hover:text-[#E08733] transition-colors">Blog</a>
            <a href="#recorrido" className="hover:text-[#E08733] transition-colors">Recorrido</a>
            <a href="#obras" className="hover:text-[#E08733] transition-colors">Obras</a>
            <a href="#citas" className="text-[#E08733] font-bold italic underline decoration-1 underline-offset-8">Citas</a>
            <a href="#contacto" className="hover:text-[#E08733] transition-colors">Contacto</a>
            {isAdmin && (
              <button 
                onClick={() => setMostrarForm(true)}
                className="text-[#E08733] border border-[#E08733]/40 px-3 py-1 -mt-1 hover:bg-[#E08733] hover:text-black transition-all"
              >
                ADMIN
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="h-24"></div>

      {/* CABECERA PRINCIPAL */}
      <header className="py-20 text-center relative">
        <h2 className="text-7xl font-black text-white uppercase tracking-tighter mb-2 italic">Jose Halconero</h2>
        <div className="flex justify-center items-center gap-4 text-[#E08733] tracking-[0.5em] uppercase text-[10px] font-bold">
            <span>Granada</span>
            <span className="w-1 h-1 bg-[#E08733] rounded-full"></span>
            <span>Fine Art</span>
            <span className="w-1 h-1 bg-[#E08733] rounded-full"></span>
            <span>Tattoo</span>
        </div>
      </header>

      {/* MODAL ADMIN */}
      {isAdmin && mostrarForm && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-[#111] border border-[#E08733]/30 p-10 w-full max-w-lg relative shadow-2xl rounded-3xl">
            <button onClick={() => setMostrarForm(false)} className="absolute top-6 right-6 text-gray-500 hover:text-[#E08733]">
              <X size={24} />
            </button>
            <h2 className="text-xs tracking-[0.3em] uppercase mb-10 border-b border-[#E08733]/20 pb-4 text-[#E08733] font-bold">Nueva Obra</h2>
            <form onSubmit={manejarEnvio} className="space-y-6">
              <input 
                type="text" placeholder="TÍTULO" 
                className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition tracking-widest uppercase text-xs"
                value={titulo} onChange={(e) => setTitulo(e.target.value)} required
              />
              <textarea 
                placeholder="HISTORIA / DESCRIPCIÓN" 
                className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition tracking-widest uppercase text-xs h-24 resize-none"
                value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required
              />
              <select 
                className="w-full bg-white/5 border-none p-4 outline-none text-[10px] tracking-widest uppercase text-[#E08733]"
                value={tipo} onChange={(e) => setTipo(e.target.value)}
              >
                <option value="tatuaje">Tatuaje</option>
                <option value="restauracion">Restauración</option>
                <option value="escultura">Escultura</option>
              </select>
              <input 
                type="file" 
                className="text-[10px] text-gray-500 cursor-pointer"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setArchivo(e.target.files?.[0] || null)}
              />
              <button className="w-full bg-[#E08733] text-black py-5 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-orange-500 transition-all rounded-xl shadow-lg">
                Publicar Obra
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GALERÍA (TARJETAS RECUPERADAS) */}
      <main id="obras" className="max-w-7xl mx-auto px-6 md:px-12 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {obras.map((obra) => (
            <div key={obra.id} className="bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#E08733]/30 transition-all duration-500 group shadow-2xl">
              <div className="relative overflow-hidden h-[400px]">
                <img 
                  src={obra.imagen_url} 
                  alt={obra.titulo} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6">
                  <span className="text-[9px] font-bold bg-[#0D0D0D]/80 backdrop-blur-md text-[#E08733] px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#E08733]/30 shadow-xl">
                    {obra.tipo}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                
                <h3 className="text-2xl font-bold tracking-tight mb-3 uppercase group-hover:text-[#E08733] transition-colors">{obra.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light italic line-clamp-3">
                  {obra.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER COMPLETO */}
      <footer className="mt-20 border-t border-[#E08733]/20 bg-[#080808] px-8 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          
          {/* Copyright y Autor */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-[#E08733] font-bold underline underline-offset-4 decoration-[#E08733]/30">Jose Halconero</h4>
            <p className="text-[10px] tracking-[0.2em] text-gray-500 leading-loose uppercase">
              © {new Date().getFullYear()} Todos los derechos reservados.<br />
              Hecho en Granada por <span className="text-gray-300 font-bold tracking-normal">Gonzalo Mansera</span>.
            </p>
          </div>

          {/* Enlaces Legales */}
          <div className="flex flex-col gap-4 text-[10px] tracking-[0.3em] uppercase text-gray-500">
            <a href="#aviso" className="hover:text-[#E08733] transition">Aviso Legal</a>
            <a href="#privacidad" className="hover:text-[#E08733] transition">Privacidad</a>
            <a href="#cookies" className="hover:text-[#E08733] transition">Política de Cookies</a>
          </div>

          {/* Redes Sociales con TikTok */}
          <div className="flex md:justify-end gap-8 text-gray-500">
            <a href="https://instagram.com" target="_blank" className="hover:text-[#E08733] transition-all scale-110"><Instagram size={20} /></a>
            <a href="https://tiktok.com" target="_blank" className="hover:text-[#E08733] transition-all scale-110"><Music2 size={20} /></a>
            <a href="#" className="hover:text-[#E08733] transition-all scale-110"><Twitter size={20} /></a>
          </div>

        </div>
        
      </footer>
    </div>
  )
}

export default App