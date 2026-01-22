import os
import shutil
from fastapi import FastAPI, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware # <--- NUEVA IMPORTACIÓN
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# 1. Datos de conexión
DATABASE_URL = "postgresql://gonzalo:gonzalo@localhost:5432/halconero_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Modelo de la Base de Datos
class Obra(Base):
    __tablename__ = "obras"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    descripcion = Column(Text)
    tipo = Column(String)
    imagen_url = Column(String)

# Crear tablas
Base.metadata.create_all(bind=engine)

# 3. Configuración de FastAPI
app = FastAPI()

# --- CONFIGURACIÓN DE CORS (FUNDAMENTAL PARA REACT) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que cualquier cliente (React) se conecte
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear carpeta uploads si no existe
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Dependencia para la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- RUTAS ---

@app.get("/")
def inicio():
    return {"mensaje": "API de Gonzalo funcionando con subida de archivos"}

# RUTA PARA CREAR OBRA SUBIENDO IMAGEN
@app.post("/obras/")
def crear_obra(
    titulo: str = Form(...), 
    descripcion: str = Form(...), 
    tipo: str = Form(...), 
    imagen: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    ruta_archivo = f"uploads/{imagen.filename}"
    
    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(imagen.file, buffer)
    
    url_foto = f"http://localhost:8000/{ruta_archivo}"
    
    nueva_obra = Obra(titulo=titulo, descripcion=descripcion, tipo=tipo, imagen_url=url_foto)
    db.add(nueva_obra)
    db.commit()
    db.refresh(nueva_obra)
    
    return {"mensaje": "Obra guardada correctamente", "id": nueva_obra.id, "url_imagen": url_foto}

# RUTA PARA VER TODAS LAS OBRAS
@app.get("/obras/")
def obtener_obras(db: Session = Depends(get_db)):
    return db.query(Obra).all()