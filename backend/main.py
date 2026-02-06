# main.py actualizado
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles
import os
from database import engine, Base
from routes import productos, obras, citas # Importamos todos los routers

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jose Halconero API")

# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Registro de rutas (Endpoints)
app.include_router(productos.router)
app.include_router(obras.router)
app.include_router(citas.router)

@app.get("/")
def inicio():
    return {"status": "Arquitectura limpia funcionando"}