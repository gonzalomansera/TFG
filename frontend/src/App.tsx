import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Páginas y Componentes
import { Merchandising } from './pages/Merchandising';
import Home from './pages/Home';
import Footer from './components/Footer';
import { Obras } from './pages/Obras'; 
import { CarritoView } from './components/CarritoView';
import { Trayectoria } from './components/Trayectoria';
import NavBar from './components/NavBar';
import { Contacto } from './pages/Contacto';
import { Blog } from './components/Blog';
import { Login } from './pages/Login'; // Importamos el nuevo componente de Login

function App() {
  // Inicializamos isAdmin consultando localStorage para que la sesión no se pierda al recargar
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('halconero_admin') === 'true';
  });

  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [mostrarFormObra, setMostrarFormObra] = useState(false);
  const [mostrarFormMerch, setMostrarFormMerch] = useState(false);

  // Mantenemos el soporte para ?admin=true por si acaso, pero priorizamos el login
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
          setMostrarForm={setMostrarFormObra}
          setMostrarFormMerch={setMostrarFormMerch}
        />
        
        <main className="pt-20"> 
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin} />} />
            <Route path="/recorrido" element={<Trayectoria />} />
            <Route path="/merchandising" element={<Merchandising isAdmin={isAdmin} />} />
            <Route path="/obras" element={<Obras />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog" element={<Blog isAdmin={isAdmin} />} />
            
            {/* RUTA SECRETA DE LOGIN: No aparece en el NavBar */}
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