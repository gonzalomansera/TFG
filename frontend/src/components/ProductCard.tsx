import { useRef } from 'react';
import { ShoppingCart, Trash2, Edit3 } from 'lucide-react'
import type { Producto } from '../types/AppContextType';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTilt } from '../hooks/useTilt';

interface Props {
  producto: Producto;
  isAdmin: boolean;
  onDelete: (id: number) => void;
  onEdit: () => void; 
}

import { getImageUrl } from '../utils/imageHelper';

export const ProductCard = ({ producto, isAdmin, onDelete, onEdit }: Props) => {
  const { addToCarrito } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ref: cardRef, handleMouseMove, handleMouseLeave } = useTilt(20);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate('/login');
      return;
    }
    addToCarrito(producto);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card rounded-3xl hover:border-[#E08733]/40 flex flex-col shadow-2xl h-full transition-colors duration-500"
    >
      <div className="relative h-72 overflow-hidden bg-[#0a0a0a]">
        <img
          src={getImageUrl(producto.imagen_url)}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {isAdmin && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onDelete(producto.id);
              }}
              className="btn-icon bg-red-500/80 hover:bg-red-600 text-white"
            >
              <Trash2 size={14} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="btn-icon bg-white/80 text-black hover:bg-[#E08733] hover:text-white"
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
        <p className="text-caption leading-relaxed line-clamp-2 mb-6 italic text-gray-400">
          {producto.descripcion}
        </p>

        <button
          onClick={(e) => handleAddToCart(e)}
          className={`mt-auto w-full border border-[#E08733] text-[#E08733] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!user ? 'opacity-50' : 'hover:bg-[#E08733] hover:text-black'}`}
        >
          <ShoppingCart size={14} /> {user ? 'Añadir al carrito' : 'Identifícate para comprar'}
        </button>
      </div>
    </div>
  )
}