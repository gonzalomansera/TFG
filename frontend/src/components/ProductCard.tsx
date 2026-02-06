import { ShoppingCart, Trash2, Edit3 } from 'lucide-react'
import type { Producto } from '../types/AppContextType';
import { useCarrito } from '../context/CarritoContext'; // 1. Importamos tu hook

interface Props {
  producto: Producto;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

export const ProductCard = ({ producto, isAdmin, onDelete }: Props) => {
  // 2. Extraemos la función de añadir de tu contexto
  const { addToCarrito } = useCarrito();

  return (
    <div className="bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-[#E08733]/40 transition-all group flex flex-col shadow-2xl">
      <div className="relative h-72 overflow-hidden bg-[#0a0a0a]">
        <img 
          src={producto.imagen_url} 
          alt={producto.nombre} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-2">
            <button 
              onClick={() => onDelete(producto.id)}
              className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <button className="bg-white/80 text-black p-2 rounded-full hover:bg-white transition-colors">
              <Edit3 size={14} />
            </button>
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-[#E08733] text-black px-4 py-1 rounded-lg font-bold text-sm shadow-lg">
          {producto.precio}€
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-sm font-bold tracking-widest uppercase mb-2">{producto.nombre}</h3>
        <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2 mb-6 italic">
          {producto.descripcion}
        </p>
        
        {/* 3. AÑADIMOS EL ONCLICK AQUÍ */}
        <button 
          onClick={() => addToCarrito(producto)} 
          className="mt-auto w-full border border-[#E08733] text-[#E08733] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E08733] hover:text-black transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={14} /> Añadir al carrito
        </button>
      </div>
    </div>
  )
}