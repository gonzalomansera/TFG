from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Carga variables de entorno
load_dotenv()
load_dotenv("../.env")
from dotenv import load_dotenv

# Carga variables de entorno
load_dotenv()
load_dotenv("../.env")
from database import engine, Base
from routes import productos, obras, blog, auth, resenas, pedidos, citas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jose Halconero API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(productos.router)
app.include_router(obras.router)
app.include_router(blog.router) 
app.include_router(auth.router)
app.include_router(resenas.router)
app.include_router(pedidos.router)
app.include_router(citas.router)

@app.get("/")
def inicio():
    return {"status": "Arquitectura limpia funcionando"}