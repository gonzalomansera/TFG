import { ShoppingCart, Trash2, Edit3 } from 'lucide-react'
import type { Producto } from '../types/AppContextType';
import { useCarrito } from '../context/CarritoContext';

interface Props {
  producto: Producto;
  isAdmin: boolean;
  onDelete: (id: number) => void;
  onEdit: () => void; // 1. Añadimos la prop para editar
}

export const ProductCard = ({ producto, isAdmin, onDelete, onEdit }: Props) => {
  const { addToCarrito } = useCarrito();

  return (
    <div className="bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-[#E08733]/40 transition-all group flex flex-col shadow-2xl h-full">
      <div className="relative h-72 overflow-hidden bg-[#0a0a0a]">
        <img 
          src={producto.imagen_url} 
          alt={producto.nombre} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-2">
            {/* Botón Borrar */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Evita clics accidentales
                onDelete(producto.id);
              }}
              className="bg-red-500/80 p-2 rounded-full hover:bg-red-600 transition-colors text-white"
            >
              <Trash2 size={14} />
            </button>

            {/* 2. Botón Editar (Ahora con función onEdit) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/80 text-black p-2 rounded-full hover:bg-[#E08733] hover:text-white transition-colors"
            >
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