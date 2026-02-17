import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Package, X, Plus } from 'lucide-react' 
import { ProductCard } from '../components/ProductCard'
import type { Producto } from '../types/AppContextType'

const BASE_URL = import.meta.env.VITE_API_URL;

export const Merchandising = ({ isAdmin }: { isAdmin: boolean }) => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [idEnEdicion, setIdEnEdicion] = useState<number | null>(null)

  // Estados Formulario
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [desc, setDesc] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)

  const fetchProductos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/productos/`)
      if (res.ok) {
        const data = await res.json()
        setProductos(data)
      }
    } catch (error) {
      console.error("Error cargando productos:", error)
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const abrirEdicion = (p: Producto) => {
    setIdEnEdicion(p.id)
    setNombre(p.nombre)
    setPrecio(p.precio.toString())
    setStock(p.stock.toString())
    setDesc(p.descripcion)
    setArchivo(null)
    setMostrarForm(true)
  }

  const abrirNuevoForm = () => {
    setIdEnEdicion(null)
    setNombre(''); setPrecio(''); setStock(''); setDesc(''); setArchivo(null)
    setMostrarForm(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('nombre', nombre)
    formData.append('descripcion', desc)
    formData.append('precio', precio)
    formData.append('stock', stock)
    if (archivo) formData.append('imagen', archivo)

    const url = idEnEdicion 
      ? `${BASE_URL}/productos/${idEnEdicion}` 
      : `${BASE_URL}/productos/`
    
    const method = idEnEdicion ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, { method, body: formData });
      if (response.ok) {
        setMostrarForm(false)
        setIdEnEdicion(null)
        fetchProductos() 
      }
    } catch (error) {
      console.error("Error al guardar producto:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar este producto de la tienda?")) return
    try {
      const response = await fetch(`${BASE_URL}/productos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  return (
    <section id="merchan" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/5 bg-[#2a2a2a]">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-4">
          <Package className="text-[#E08733]" size={24} />
          <h2 className="text-2xl font-bold tracking-[0.4em] uppercase">Merchandising</h2>
        </div>
        {isAdmin && (
          <button 
            onClick={abrirNuevoForm}
            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#E08733] transition-all"
          >
            <Plus size={14} /> Añadir Producto
          </button>
        )}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map(p => (
          <ProductCard 
            key={p.id} 
            producto={p} 
            isAdmin={isAdmin} 
            onDelete={handleDelete} 
            onEdit={() => abrirEdicion(p)} // Conexión con el botón interno de ProductCard
          />
        ))}
      </div>

      {/* Modal de Formulario */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-[#111] border border-[#E08733]/30 p-10 w-full max-w-lg relative rounded-3xl">
            <button 
              onClick={() => {setMostrarForm(false); setIdEnEdicion(null);}} 
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-[#E08733] text-xs font-bold uppercase mb-6 tracking-widest">
              {idEnEdicion ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <input type="text" placeholder="NOMBRE" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase text-white" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="PRECIO (€)" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase text-white" value={precio} onChange={e => setPrecio(e.target.value)} required />
                <input type="number" placeholder="STOCK" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase text-white" value={stock} onChange={e => setStock(e.target.value)} required />
              </div>
              <textarea placeholder="DESCRIPCIÓN" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase h-24 resize-none text-white" value={desc} onChange={e => setDesc(e.target.value)} required />
              
              <div className="flex flex-col gap-2">
                <input type="file" className="text-[10px] text-gray-500" onChange={(e: ChangeEvent<HTMLInputElement>) => setArchivo(e.target.files?.[0] || null)} required={!idEnEdicion} />
                {idEnEdicion && <p className="text-[9px] text-gray-500 italic font-sans">Opcional: Selecciona una imagen solo si deseas cambiarla.</p>}
              </div>

              <button type="submit" className="w-full bg-[#E08733] text-black py-5 font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-white transition-all">
                {idEnEdicion ? 'Guardar Cambios' : 'Guardar en Tienda'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}