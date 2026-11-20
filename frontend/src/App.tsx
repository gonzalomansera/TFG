import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Páginas y Componentes
import Footer from './components/Footer';
import { Obras } from './pages/Obras';
import { Trayectoria } from './components/Trayectoria';
import NavBar from './components/NavBar';
import { Contacto } from './pages/Contacto';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ScrollToTop } from './components/ScrollToTop';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { AdminApp } from './pages/admin/AdminApp';

function App() {
  useSmoothScroll();
  return (
    <Router>
      <ScrollToTop />
      <Shell />
    </Router>
  );
}

const Shell = () => {
  const { pathname } = useLocation();
  const isGestion = pathname.startsWith('/gestion') || pathname === '/gestor-halconero';

  // App de gestión privada: sin navbar/footer público
  if (isGestion) {
    return (
      <Routes>
        <Route path="/gestion" element={<AdminApp />} />
        <Route path="/gestor-halconero" element={<Navigate to="/gestion" replace />} />
      </Routes>
    );
  }

  // Sitio público
  return (
    <div className="pw">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/estudio" element={<Trayectoria />} />
          <Route path="/portfolio" element={<Obras />} />
          {/* Rutas antiguas redirigidas */}
          <Route path="/obras" element={<Navigate to="/portfolio" replace />} />
          <Route path="/recorrido" element={<Navigate to="/estudio" replace />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
