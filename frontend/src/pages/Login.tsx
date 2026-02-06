import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const Login = ({ setIsAdmin }: { setIsAdmin: (val: boolean) => void }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí pondrás la contraseña real de Jose
    if (password === 'Halconero2026') { 
      setIsAdmin(true);
      localStorage.setItem('is_admin', 'true'); // Para que no se borre al refrescar
      navigate('/');
    } else {
      alert('Acceso denegado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2a2a2a]">
      <form onSubmit={handleLogin} className="bg-[#1a1a1a] p-10 rounded-2xl border border-white/5 shadow-2xl w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-[#E08733]/10 text-[#E08733] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={30} />
        </div>
        <h2 className="text-white font-bold uppercase tracking-widest mb-6">Panel de Gestión</h2>
        <input 
          type="password" 
          placeholder="Contraseña Maestra"
          className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#E08733] mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-[#E08733] text-black font-bold py-3 rounded-xl uppercase tracking-widest text-[10px]">
          Entrar
        </button>
      </form>
    </div>
  );
};