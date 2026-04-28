import { Link } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#E08733]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 blur-[150px] rounded-full" />
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]" />

      <div className="max-w-xl w-full text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          <h1 className="text-[15vw] md:text-[12rem] font-serif font-black text-white/5 leading-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Ghost size={80} strokeWidth={1} className="text-[#E08733] animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-serif italic text-white tracking-wide">
            Página Extraviada
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto uppercase tracking-widest">
            Parece que la obra que buscas aún no ha sido esculpida o ha cambiado de galería.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#E08733] transition-all group shadow-2xl"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};
