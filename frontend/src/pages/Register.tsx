import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

import { useApi } from '../hooks/useApi';

export const Register = () => {
  const { request } = useApi();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Registro completado con éxito. Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Error en el registro');
    }
  };

  return (
    <div className="page-container flex-center">
      <form onSubmit={handleRegister} className="modal-content text-center max-w-md w-full">
        <div className="w-16 h-16 bg-[#E08733]/10 text-[#E08733] rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus size={30} />
        </div>
        <h2 className="heading-2 mb-6">Crear Cuenta</h2>
        
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        
        <input
          name="nombre"
          type="text"
          placeholder="Nombre Completo"
          className="input-field mb-4 rounded-xl border border-white/10"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Correo Electrónico"
          className="input-field mb-4 rounded-xl border border-white/10"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="telefono"
          type="text"
          placeholder="Teléfono (Opcional)"
          className="input-field mb-4 rounded-xl border border-white/10"
          value={formData.telefono}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="input-field mb-6 rounded-xl border border-white/10"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit" className="w-full btn btn-primary rounded-xl mb-4">
          Registrarse
        </button>
        
        <p className="text-xs text-gray-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#E08733] hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};
