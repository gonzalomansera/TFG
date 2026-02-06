import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import axios from 'axios'
import { Package, X, Plus } from 'lucide-react'

import { ProductCard } from '../components/ProductCard'
import type { Producto } from '../types/AppContextType'

export const Merchandising = ({ isAdmin }: { isAdmin: boolean }) => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

  // Estados Formulario
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [desc, setDesc] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)

  const fetchProductos = async () => {
    const res = await axios.get('http://localhost:8000/productos/')
    setProductos(res.data)
  }

  useEffect(() => { fetchProductos() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('nombre', nombre)
    formData.append('descripcion', desc)
    formData.append('precio', precio)
    formData.append('stock', stock)
    if (archivo) formData.append('imagen', archivo)

    try {
      await axios.post('http://localhost:8000/productos/', formData)
      setMostrarForm(false)
      fetchProductos()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro?")) return
    await axios.delete(`http://localhost:8000/productos/${id}`)
    fetchProductos()
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
            onClick={() => setMostrarForm(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#E08733] transition-all"
          >
            <Plus size={14} /> Añadir Producto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map(p => (
          <ProductCard key={p.id} producto={p} isAdmin={isAdmin} onDelete={handleDelete} />
        ))}
      </div>

      {/* MODAL ADMIN */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-[#111] border border-[#E08733]/30 p-10 w-full max-w-lg relative rounded-3xl">
            <button onClick={() => setMostrarForm(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X size={24} />
            </button>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <input type="text" placeholder="NOMBRE" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="PRECIO (€)" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase" value={precio} onChange={e => setPrecio(e.target.value)} required />
                <input type="number" placeholder="STOCK" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase" value={stock} onChange={e => setStock(e.target.value)} required />
              </div>
              <textarea placeholder="DESCRIPCIÓN" className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-[#E08733] transition text-xs uppercase h-24 resize-none" value={desc} onChange={e => setDesc(e.target.value)} required />
              <input type="file" className="text-[10px] text-gray-500" onChange={(e: ChangeEvent<HTMLInputElement>) => setArchivo(e.target.files?.[0] || null)} />
              <button className="w-full bg-[#E08733] text-black py-5 font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl">Guardar en Tienda</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}