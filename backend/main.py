# TFG Production Deployment - Final Version
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

# Carga variables de entorno
load_dotenv()
load_dotenv("../.env")

from database import engine, Base
from routes import obras, blog, auth, resenas, citas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jose Halconero API")

# Orígenes permitidos (CORS). En producción define ALLOWED_ORIGINS en el .env,
# p.ej. "https://josehalconero.com,https://www.josehalconero.com".
# En local, por defecto, se permite todo.
_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = ["*"] if _origins_env.strip() == "*" else [o.strip() for o in _origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(obras.router, prefix="/api")
app.include_router(blog.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(resenas.router, prefix="/api")
app.include_router(citas.router, prefix="/api")

# Servir Frontend
from fastapi.responses import FileResponse

frontend_path = "../frontend/dist"
if os.path.exists(frontend_path):
    app.mount("/assets", StaticFiles(directory=f"{frontend_path}/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Si la ruta empieza por api o uploads, dejar que FastAPI la maneje normal (no debería llegar aquí)
        if full_path.startswith("api") or full_path.startswith("uploads"):
            raise HTTPException(status_code=404)
        
        # Para el resto de rutas (SPA), servir index.html
        index_path = os.path.join(frontend_path, "index.html")
        return FileResponse(index_path)

@app.get("/")
def inicio():
    frontend_path = "../frontend/dist"
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"status": "Arquitectura limpia funcionando, pero no se encontró index.html"}