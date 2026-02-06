import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Producto } from '../types/AppContextType';

interface CarritoItem extends Producto {
  cantidad: number;
}

interface CarritoContextType {
  Carrito: CarritoItem[];
  addToCarrito: (producto: Producto) => void;
  removeFromCarrito: (id: number) => void;
  updateCantidad: (id: number, cambio: number) => void; // Para +1 o -1
  totalItems: number;
  precioTotal: number; 
  setCarrito: React.Dispatch<React.SetStateAction<CarritoItem[]>>;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [Carrito, setCarrito] = useState<CarritoItem[]>([]);

  // Añadir producto (o incrementar si ya existe)
  const addToCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const exists = prev.find(item => item.id === producto.id);
      if (exists) {
        return prev.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Función específica para los botones + y -
  const updateCantidad = (id: number, cambio: number) => {
    setCarrito(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          // Si es menor que 1, lo dejamos en 1 (o podrías llamar a removeFromCarrito)
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
        }
        return item;
      });
    });
  };

  const removeFromCarrito = (id: number) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = Carrito.reduce((acc, item) => acc + item.cantidad, 0);
  
  const precioTotal = Carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CarritoContext.Provider value={{ 
      Carrito, 
      addToCarrito, 
      removeFromCarrito, 
      updateCantidad, 
      totalItems,
      precioTotal,
      setCarrito
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};