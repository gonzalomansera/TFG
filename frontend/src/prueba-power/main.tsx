import React from 'react';
import ReactDOM from 'react-dom/client';
import { PowerHome } from './PowerHome';
import './power.css';

// Entrada independiente para la prueba de estilo «Power».
// Se abre en /prueba-power.html y no toca la web actual (index.html, App, estilos).
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PowerHome />
  </React.StrictMode>,
);
