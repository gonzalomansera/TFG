from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles
import os
from database import engine, Base
# 1. IMPORTAMOS EL NUEVO ROUTER
from routes import productos, obras, citas, blog 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jose Halconero API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 2. REGISTRAMOS EL ROUTER DEL BLOG
app.include_router(productos.router)
app.include_router(obras.router)
app.include_router(citas.router)
app.include_router(blog.router) 

@app.get("/")
def inicio():
    return {"status": "Arquitectura limpia funcionando"}