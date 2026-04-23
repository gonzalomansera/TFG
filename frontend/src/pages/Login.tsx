import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Usamos x-www-form-urlencoded para el Login de OAuth2PasswordRequestForm
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI usa 'username'
      formData.append('password', password);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.is_admin);
        navigate('/');
      } else {
        setError(data.detail || 'Credenciales inválidas');
      }
    } catch (e) {
      setError('Error de conexión con el servidor');
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