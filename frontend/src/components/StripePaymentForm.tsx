import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';

interface StripePaymentFormProps {
  onSuccess: () => void;
  total: number;
}

export const StripePaymentForm = ({ onSuccess, total }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Ocurrió un error al procesar el pago.');
      setProcessing(false);
    } else {
      // Pago confirmado con éxito en Stripe
      onSuccess();
    }
  };

  return (
    <form id="stripe-payment-form" onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 mb-4 text-[#E08733]">
          <CreditCard size={18} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Detalles de la tarjeta</span>
        </div>
        
        <div className="min-h-[200px]">
          <PaymentElement 
            options={{
              layout: 'accordion',
            }} 
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] uppercase font-medium">
          {error}
        </div>
      )}

      {/* El botón ahora se controla desde el footer del CarritoView para mayor consistencia */}
      <button type="submit" className="hidden">Pagar</button>
    </form>
  );
};
