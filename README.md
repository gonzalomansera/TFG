# Jose Halconero — Portfolio de Tatuaje

Web de portfolio y marca personal de **Jose Halconero**, tatuador y artista en Granada
(estudio *Born Again Tattoo*, Barrio Fígares). El sitio presenta su trabajo, cuenta su
trayectoria y permite a los clientes **solicitar cita**.

> Antes era una plataforma con tienda online (merchandising + pasarela de pago). Se ha
> reconvertido en una **web de portfolio profesional**: se eliminó por completo el
> e-commerce y el proyecto quedó orientado al tatuaje y la captación de clientes.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 · Vite 7 · TypeScript · Tailwind CSS v4 · React Router 7 |
| Animación | GSAP + ScrollTrigger · Lenis (smooth scroll) |
| Backend | FastAPI (Python) · SQLAlchemy |
| Base de datos | SQLite (local) / PostgreSQL (producción) |
| Imágenes | Cloudinary |
| Auth | JWT (python-jose) + bcrypt |

## Estructura

```
TFG/
├─ frontend/        # SPA React (Vite)
│  └─ src/
│     ├─ pages/     # Home, Obras (portfolio), Contacto, Login, Register, Profile, NotFound
│     ├─ components/# NavBar, Footer, Trayectoria, ScrollToTop
│     ├─ hooks/     # useApi, useSmoothScroll, useScrollFx
│     └─ lib/       # gsap (registro central de plugins)
├─ backend/         # API FastAPI
│  └─ routes/       # obras, citas, resenas, blog, auth
├─ docs/            # Memoria del TFG y despliegue
│  ├─ TFG-memoria.md
│  └─ DESPLIEGUE-VPS.md
└─ docker-compose.yml  # Postgres + Adminer para desarrollo
```

## Puesta en marcha (local)

Requisitos: Node 18+, Python 3.11+.

1. **Variables de entorno**: copia `.env.example` a `.env` y rellena Cloudinary.

2. **Backend**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate         # Windows  (source venv/bin/activate en Linux/Mac)
   pip install -r requirements.txt
   python insertar_datos.py      # (opcional) datos de ejemplo
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev                   # http://localhost:5173
   ```

El frontend hace proxy de `/api` y `/uploads` al backend en `:8000` (ver `vite.config.ts`).

## Scripts (frontend)

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`tsc` + `vite build` → `dist/`) |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | ESLint |

## Despliegue

Pensado para una **VPS de IONOS** con dominio propio, sirviendo frontend y backend bajo
el mismo origen con **nginx**. Guía paso a paso en
[`docs/DESPLIEGUE-VPS.md`](docs/DESPLIEGUE-VPS.md).

## Animaciones

- **Smooth scroll** global con Lenis (`useSmoothScroll`), sincronizado con GSAP ScrollTrigger.
- **Parallax editorial** reutilizable: cualquier `<img class="parallax-image">` recibe
  automáticamente el efecto (escala 0.7→1.2, opacidad 0→1, ~600px de recorrido,
  `power2.out`, scrub y deriva vertical). Ver `src/hooks/useScrollFx.ts`.
- Reveals al hacer scroll con `data-reveal` y `data-reveal-stagger`.
- Todo respeta `prefers-reduced-motion`.

## Accesibilidad y SEO

HTML semántico, `alt` en imágenes, foco visible, soporte de teclado, `lang="es"`,
meta description, Open Graph y favicon configurados en `index.html`.
