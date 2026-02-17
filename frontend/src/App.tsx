import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
import { Home } from './pages/Home';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('halconero_admin') === 'true';
  });

  const [carritoAbierto, setCarritoAbierto] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
      localStorage.setItem('halconero_admin', 'true');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#2a2a2a] text-white font-light">
        <NavBar 
          isAdmin={isAdmin} 
          onOpenCarrito={() => setCarritoAbierto(true)} 
          // 2. IMPORTANTE: Estos setters solo funcionarán si el NavBar 
          // los llama, pero ahora las páginas tienen sus propios botones internos.
          setMostrarForm={() => {}} 
          setMostrarFormMerch={() => {}}
        />
        
        <main className="pt-20"> 
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin} />} />
            <Route path="/recorrido" element={<Trayectoria />} />
            <Route path="/merchandising" element={<Merchandising isAdmin={isAdmin} />} />
            
            {/* 3. ¡ESTO FALTABA! Añadir isAdmin aquí para que aparezca el botón de Añadir Obra */}
            <Route path="/obras" element={<Obras isAdmin={isAdmin} />} />
            
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog" element={<Blog isAdmin={isAdmin} />} />
            
            <Route path="/gestor-halconero" element={<Login setIsAdmin={setIsAdmin} />} />
            
            <Route path="*" element={<Home isAdmin={isAdmin} />} />
          </Routes>
        </main>

        <CarritoView 
          isOpen={carritoAbierto} 
          onClose={() => setCarritoAbierto(false)} 
        />

        <Footer isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      </div>
    </Router>
  );
}

export default App;