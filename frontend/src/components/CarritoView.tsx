import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Smartphone, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from './StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BASE_URL = import.meta.env.VITE_API_URL;
interface CarritoViewProps {
  isOpen: boolean;
  onClose: () => void;
}

type PasoCarrito = 'LISTA' | 'PAGO' | 'PASARELA' | 'EXITO';

export const CarritoView = ({ isOpen, onClose }: CarritoViewProps) => {
  const { Carrito, addToCarrito, removeFromCarrito, totalItems, updateCantidad, precioTotal, setCarrito } = useCarrito();
  const { token } = useAuth();
  const [paso, setPaso] = useState<PasoCarrito>('LISTA');
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [cargando, setCargando] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  const handleSeleccionarMetodo = async (nombre: string) => {
    setMetodoPago(nombre);
    if (nombre === 'Tarjeta VISA / Mastercard') {
      try {
        const response = await axios.post(`${BASE_URL}/pedidos/create-payment-intent`, {
          amount: precioTotal
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error al crear PaymentIntent:", error);
      }
    } else {
      setClientSecret('');
    }
  };

  const handleConfirmarCompra = async () => {
    if (!metodoPago) return;
    setCargando(true);

    try {
      await axios.post(`${BASE_URL}/pedidos/`, {
        items: Carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        })),
        metodo_pago: metodoPago,
        total: precioTotal
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPaso('EXITO');
      setCarrito([]);

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
                {paso !== 'LISTA' && paso !== 'EXITO' && (
                  <button 
                    onClick={() => setPaso(paso === 'PASARELA' ? 'PAGO' : 'LISTA')} 
                    className="mr-2 hover:text-[#E08733] transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 className="text-caption tracking-[0.3em]">
                  {paso === 'LISTA' ? `Tu Carrito (${totalItems})` : paso === 'PAGO' ? 'Método de Pago' : 'Información de Pago'}
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
                    <p className="text-caption">El carrito está vacío</p>
                  </div>
                ) : (
                  Carrito.map((item) => (
                    <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-right-2">
                      <div className="cart-item-image">
                        <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[11px] font-bold uppercase tracking-wider">{item.nombre}</h4>
                          <p className="text-[#E08733] text-xs font-bold mt-1">{item.precio}€</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                            <button onClick={() => updateCantidad(item.id, -1)} className="cart-quantity-btn"><Minus size={12} /></button>
                            <span className="px-2 text-[10px] font-bold">{item.cantidad}</span>
                            <button onClick={() => addToCarrito(item)} className="cart-quantity-btn"><Plus size={12} /></button>
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
                  { id: 'contrareembolso', nombre: 'Contra-reembolso', icon: <Truck size={18} /> }
                ].map((metodo) => (
                  <button
                    key={metodo.id}
                    onClick={() => handleSeleccionarMetodo(metodo.nombre)}
                    className={`payment-method-btn ${metodoPago === metodo.nombre
                        ? 'border-[#E08733] bg-[#E08733]/10 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                  >
                    <div className={metodoPago === metodo.nombre ? 'text-[#E08733]' : 'text-gray-500'}>
                      {metodo.icon}
                    </div>
                    <span className="text-caption">{metodo.nombre}</span>
                  </button>
                ))}
              </div>
            )}

            {paso === 'PASARELA' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                  <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-2">
                    <span className="text-gray-400">Pedido para:</span>
                    <span className="text-white font-bold">{metodoPago}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total a pagar:</span>
                    <span className="text-[#E08733] font-bold">{precioTotal.toFixed(2)}€</span>
                  </div>
                </div>

                {!clientSecret ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
                    <div className="w-8 h-8 border-2 border-[#E08733] border-t-transparent rounded-full animate-spin" />
                    <p className="text-caption">Iniciando pasarela de pago segura...</p>
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                    <StripePaymentForm 
                      total={precioTotal} 
                      onSuccess={handleConfirmarCompra} 
                    />
                  </Elements>
                )}
              </div>
            )}

            {paso === 'EXITO' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-90">
                <div className="w-20 h-20 bg-[#E08733]/20 rounded-full flex items-center justify-center text-[#E08733]">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="heading-2 uppercase tracking-[0.2em] mb-2 text-xl">¡Compra con éxito!</h3>
                  <p className="text-caption uppercase leading-loose text-gray-400">
                    Gracias por tu confianza.<br />El stock ha sido actualizado.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="border border-white/10 px-8 py-3 rounded-full text-caption hover:bg-white hover:text-black transition-all"
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
                <span className="text-caption text-gray-400">Total</span>
                <span className="text-xl font-bold text-[#E08733]">{precioTotal.toFixed(2)}€</span>
              </div>

              {paso === 'LISTA' ? (
                <button
                  onClick={() => setPaso('PAGO')}
                  className="w-full bg-[#E08733] text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  Continuar al pago
                </button>
              ) : paso === 'PAGO' ? (
                <button
                  onClick={() => {
                    if (metodoPago === 'Tarjeta VISA / Mastercard') {
                      setPaso('PASARELA');
                    } else {
                      handleConfirmarCompra();
                    }
                  }}
                  disabled={!metodoPago || cargando}
                  className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 ${metodoPago && !cargando
                      ? 'bg-white text-black hover:bg-[#E08733]'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {cargando ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              ) : paso === 'PASARELA' ? (
                <button
                  form="stripe-payment-form"
                  type="submit"
                  disabled={!clientSecret || cargando}
                  className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 ${clientSecret && !cargando
                      ? 'bg-[#E08733] text-black hover:bg-white'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {cargando ? 'Procesando...' : `Pagar ${precioTotal.toFixed(2)}€`}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};