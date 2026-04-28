import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Páginas y Componentes
import { Merchandising } from './pages/Merchandising';
import Footer from './components/Footer';
import { Obras } from './pages/Obras';
import { CarritoView } from './components/CarritoView';
import { Trayectoria } from './components/Trayectoria';
import NavBar from './components/NavBar';
import { Contacto } from './pages/Contacto';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import { NotFound } from './pages/NotFound';

function App() {
  const { user, loading } = useAuth();
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const isAdmin = user?.is_admin || false;

  if (loading) {
    return <div className="h-screen w-screen bg-[#0D0D0D] flex items-center justify-center text-[#E08733] uppercase tracking-widest text-xs">Cargando...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <NavBar
          onOpenCarrito={() => setCarritoAbierto(true)}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recorrido" element={<Trayectoria />} />
            <Route path="/merchandising" element={<Merchandising isAdmin={isAdmin} />} />
            <Route path="/obras" element={<Obras isAdmin={isAdmin} />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog" element={<Blog isAdmin={isAdmin} />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="/perfil" element={user ? <Profile /> : <Navigate to="/login" />} />
            
            <Route path="/gestor-halconero" element={<Navigate to="/login" />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <CarritoView
          isOpen={carritoAbierto}
          onClose={() => setCarritoAbierto(false)}
        />

        <Footer isAdmin={isAdmin} />
      </div>
    </Router>
  );
}

export default App;