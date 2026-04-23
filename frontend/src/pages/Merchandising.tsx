import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Package, X, Plus } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import type { Producto } from '../types/AppContextType'
import { useAuth } from '../context/AuthContext'

const BASE_URL = import.meta.env.VITE_API_URL;

export const Merchandising = ({ isAdmin }: { isAdmin: boolean }) => {
  const { token } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [idEnEdicion, setIdEnEdicion] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)

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
      const response = await fetch(url, { 
        method, 
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
      const response = await fetch(`${BASE_URL}/productos/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setProductos(prevProductos => prevProductos.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  return (
    <section id="merchan" className="page-container bg-[#141414] animate-smoke-in border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <Package className="text-[#E08733]" size={24} />
            <h2 className="heading-2">Merchandising</h2>
          </div>
          {isAdmin && (
            <button
              onClick={abrirNuevoForm}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={14} /> Añadir Producto
            </button>
          )}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productos.map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
              <ProductCard
                producto={p}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onEdit={(e) => { e.stopPropagation(); abrirEdicion(p); }}
              />
            </div>
          ))}
        </div>
      </div>

       {mostrarForm && (
        <div className="modal-overlay z-[150]">
          <div className="modal-content max-w-lg relative rounded-3xl border-[#E08733]/30">
            <button
              onClick={() => { setMostrarForm(false); setIdEnEdicion(null); }}
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              <X size={24} />
            </button>

            <h3 className="text-caption text-[#E08733] mb-6">
              {idEnEdicion ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <input type="text" placeholder="NOMBRE" className="input-field text-white" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="PRECIO (€)" className="input-field text-white" value={precio} onChange={e => setPrecio(e.target.value)} required />
                <input type="number" placeholder="STOCK" className="input-field text-white" value={stock} onChange={e => setStock(e.target.value)} required />
              </div>
              <textarea placeholder="DESCRIPCIÓN" className="textarea-field h-24 text-white" value={desc} onChange={e => setDesc(e.target.value)} required />

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

      {selectedProduct && (
        <div className="modal-overlay z-[100]" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content max-w-6xl h-[80vh] p-0 overflow-hidden bg-[#0D0D0D] border-white/5 flex flex-col lg:flex-row" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors">
              <X size={32} strokeWidth={1} />
            </button>
            
            <div className="lg:w-1/2 h-[400px] lg:h-full overflow-hidden">
              <img src={selectedProduct.imagen_url} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center overflow-y-auto">
              <span className="text-[#E08733] text-[10px] uppercase tracking-[0.4em] font-black mb-4">Pieza Exclusiva</span>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight mb-8">{selectedProduct.nombre}</h2>
              <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-10">{selectedProduct.descripcion}</p>
              <div className="flex items-center justify-between pt-10 border-t border-white/5">
                <div>
                  <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Precio Final</p>
                  <p className="text-4xl text-white font-black">{selectedProduct.precio.toFixed(2)}€</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Disponibilidad</p>
                  <p className={`text-base font-bold ${selectedProduct.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} Unidades` : 'Agotado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}