import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Smartphone, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import axios from 'axios';

interface CarritoViewProps {
  isOpen: boolean;
  onClose: () => void;
}

type PasoCarrito = 'LISTA' | 'PAGO' | 'EXITO';

export const CarritoView = ({ isOpen, onClose }: CarritoViewProps) => {
  const { Carrito, addToCarrito, removeFromCarrito, totalItems, updateCantidad, precioTotal, setCarrito } = useCarrito();
  const [paso, setPaso] = useState<PasoCarrito>('LISTA');
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [cargando, setCargando] = useState(false);

  const handleConfirmarCompra = async () => {
    if (!metodoPago) return;
    setCargando(true);

    try {
      // 1. Reducimos el stock en la base de datos para cada producto
      // Usamos Promise.all para que todas las peticiones se ejecuten en paralelo
      await Promise.all(
        Carrito.map((item) =>
          axios.put(`http://localhost:8000/productos/${item.id}/reducir-stock?cantidad=${item.cantidad}`)
        )
      );

      // 2. Si las peticiones tienen éxito, mostramos pantalla de éxito
      setPaso('EXITO');
      
      // 3. Limpiamos el carrito localmente
      setCarrito([]); 

      // Cerramos automáticamente después de 3 segundos
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setPaso('LISTA');
          setMetodoPago('');
          setCargando(false);
        }, 500);
      }, 3000);

    } catch (error) {
      console.error("Error al procesar la compra o actualizar stock:", error);
      alert("Hubo un error al procesar tu pedido. Es posible que no quede stock suficiente de algún producto.");
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#0D0D0D] border-l border-[#E08733]/20 shadow-2xl flex flex-col">
          
          {/* Cabecera */}
          {paso !== 'EXITO' && (
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {paso === 'PAGO' && (
                  <button onClick={() => setPaso('LISTA')} className="mr-2 hover:text-[#E08733] transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 className="text-sm font-bold tracking-[0.3em] uppercase">
                  {paso === 'LISTA' ? `Tu Carrito (${totalItems})` : 'Método de Pago'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {paso === 'LISTA' && (
              <div className="space-y-6">
                {Carrito.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="text-[10px] tracking-widest uppercase">El carrito está vacío</p>
                  </div>
                ) : (
                  Carrito.map((item) => (
                    <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-right-2">
                      <div className="w-20 h-20 bg-[#141414] rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                        <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[11px] font-bold uppercase tracking-wider">{item.nombre}</h4>
                          <p className="text-[#E08733] text-xs font-bold mt-1">{item.precio}€</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                            <button onClick={() => updateCantidad(item.id, -1)} className="p-1 px-3 hover:bg-white/10 transition-colors"><Minus size={12} /></button>
                            <span className="px-2 text-[10px] font-bold">{item.cantidad}</span>
                            <button onClick={() => addToCarrito(item)} className="p-1 px-3 hover:bg-white/10 transition-colors"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCarrito(item.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {paso === 'PAGO' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                {[
                  { id: 'visa', nombre: 'Tarjeta VISA / Mastercard', icon: <CreditCard size={18} /> },
                  { id: 'bizum', nombre: 'Bizum', icon: <Smartphone size={18} /> },
                  { id: 'contrareembolso', nombre: 'Contra-reembolso', icon: <Truck size={18} /> }
                ].map((metodo) => (
                  <button
                    key={metodo.id}
                    onClick={() => setMetodoPago(metodo.nombre)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                      metodoPago === metodo.nombre 
                      ? 'border-[#E08733] bg-[#E08733]/10 text-white' 
                      : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className={metodoPago === metodo.nombre ? 'text-[#E08733]' : 'text-gray-500'}>
                      {metodo.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{metodo.nombre}</span>
                  </button>
                ))}
              </div>
            )}

            {paso === 'EXITO' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-90">
                <div className="w-20 h-20 bg-[#E08733]/20 rounded-full flex items-center justify-center text-[#E08733]">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-2">¡Compra con éxito!</h3>
                  <p className="text-gray-400 text-[10px] tracking-widest uppercase leading-loose">
                    Gracias por tu confianza.<br/>El stock ha sido actualizado.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="border border-white/10 px-8 py-3 rounded-full text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>

          {/* Footer dinámico */}
          {Carrito.length > 0 && paso !== 'EXITO' && (
            <div className="p-6 border-t border-white/5 bg-[#0a0a0a] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Total</span>
                <span className="text-xl font-bold text-[#E08733]">{precioTotal.toFixed(2)}€</span>
              </div>
              
              {paso === 'LISTA' ? (
                <button 
                  onClick={() => setPaso('PAGO')}
                  className="w-full bg-[#E08733] text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  Continuar al pago
                </button>
              ) : (
                <button 
                  onClick={handleConfirmarCompra}
                  disabled={!metodoPago || cargando}
                  className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 ${
                    metodoPago && !cargando
                    ? 'bg-white text-black hover:bg-[#E08733]' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {cargando ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};