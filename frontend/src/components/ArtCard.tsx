import type { Obra } from "../types/AppContextType";


export const ArtCard = ({ obra }: { obra: Obra }) => (
  <div className="bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#E08733]/30 transition-all duration-500 group">
    <div className="relative overflow-hidden h-[400px]">
      <img src={obra.imagen_url} alt={obra.titulo} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-6 right-6 font-bold bg-[#0D0D0D]/80 text-[#E08733] px-4 py-1.5 rounded-full uppercase text-[9px] border border-[#E08733]/30">
        {obra.tipo}
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-bold uppercase group-hover:text-[#E08733] transition-colors">{obra.titulo}</h3>
      <p className="text-gray-500 text-sm font-light italic mt-3">{obra.descripcion}</p>
    </div>
  </div>
);  