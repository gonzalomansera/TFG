import { useState } from "react";
import type { Obra } from "../types/AppContextType";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { useTilt } from "../hooks/useTilt";
import { getImageUrl } from "../utils/imageHelper";

export const ArtCard = ({ obra, onLikeToggle }: { obra: Obra, onLikeToggle?: () => void }) => {
  const { ref: cardRef, handleMouseMove, handleMouseLeave } = useTilt(15);
  const { request } = useApi();
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert("Debes iniciar sesión para dar me gusta");
      return;
    }
    setIsLiking(true);
    try {
      await request(`/obras/${obra.id}/like`, { method: 'POST' });
      if (onLikeToggle) onLikeToggle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card bg-[#111] rounded-[2rem] hover:border-[#E08733]/30 transition-all duration-500 group relative"
    >
      <div className="relative overflow-hidden h-[400px]">
        <img 
          src={getImageUrl(obra.imagen_url)} 
          alt={obra.titulo} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 will-change-transform" 
          loading="lazy"
          decoding="async"
        />
        
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-90 ${obra.is_liked ? 'bg-[#E08733] text-black shadow-lg shadow-[#E08733]/20' : 'bg-black/40 text-white hover:bg-black/60'}`}
          >
            <Heart size={18} className={obra.is_liked ? "fill-current" : ""} />
          </button>
        </div>

        <div className="absolute top-6 right-6 font-bold bg-[#0D0D0D]/80 text-[#E08733] px-4 py-1.5 rounded-full uppercase text-caption border border-[#E08733]/30">
          {obra.tipo}
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <h3 className="heading-2 group-hover:text-[#E08733] transition-colors">{obra.titulo}</h3>
          {obra.likes_count ? (
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{obra.likes_count} Likes</span>
          ) : null}
        </div>
        <p className="text-body italic mt-1">{obra.descripcion}</p>
      </div>
    </div>
  );
};