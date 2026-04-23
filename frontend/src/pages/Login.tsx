import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { request } = useApi();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const data = await request<{ access_token: string, is_admin: boolean }>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });
      
      if (data) {
        login(data.access_token, data.is_admin);
        navigate('/');
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Error de conexión');
    }
  };

  return (
    <div className="page-container flex-center">
      <form onSubmit={handleLogin} className="modal-content text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-[#E08733]/10 text-[#E08733] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={30} />
        </div>
        <h2 className="heading-2 mb-6">Iniciar Sesión</h2>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="input-field mb-4 rounded-xl border border-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="input-field mb-6 rounded-xl border border-white/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full btn btn-primary rounded-xl mb-4">
          Entrar
        </button>
        
        <p className="text-xs text-gray-400">
          ¿No tienes cuenta? <Link to="/register" className="text-[#E08733] hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  );
};