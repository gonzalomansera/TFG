import os
import shutil
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import get_db
import models
# Cargamos las variables de entorno
from dotenv import load_dotenv
load_dotenv()

BASE_URL = os.getenv("API_URL", "http://localhost:8000")

router = APIRouter(prefix="/obras", tags=["Obras"])

@router.get("/")
def obtener_obras(db: Session = Depends(get_db)):
    return db.query(models.Obra).all()

@router.post("/")
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
    
    url_foto = f"{BASE_URL}/{ruta_archivo}"
    
    nueva_obra = models.Obra(
        titulo=titulo, 
        descripcion=descripcion, 
        tipo=tipo, 
        imagen_url=url_foto
    )
    db.add(nueva_obra)
    db.commit()
    db.refresh(nueva_obra)
    
    return {"mensaje": "Obra guardada correctamente", "id": nueva_obra.id, "url_imagen": url_foto}

@router.delete("/{id}")
def eliminar_obra(id: int, db: Session = Depends(get_db)):
    obra = db.query(models.Obra).filter(models.Obra.id == id).first()
    
    if not obra:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Obra no encontrada")

    try:
        ruta_foto = obra.imagen_url.replace(BASE_URL, "")
        if os.path.exists(ruta_foto):
            os.remove(ruta_foto)
    except Exception as e:
        print(f"No se pudo borrar el archivo físico: {e}")

    db.delete(obra)
    db.commit()
    
    return {"mensaje": "Obra eliminada correctamente"}



@router.put("/{id}")
def actualizar_obra(
    id: int,
    titulo: str = Form(...),
    descripcion: str = Form(...),
    tipo: str = Form(...),
    imagen: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    obra = db.query(models.Obra).filter(models.Obra.id == id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")

    obra.titulo = titulo
    obra.descripcion = descripcion
    obra.tipo = tipo

    if imagen:
        ruta_archivo = f"uploads/{imagen.filename}"
        with open(ruta_archivo, "wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)
        obra.imagen_url = f"{BASE_URL}/{ruta_archivo}"

    db.commit()
    return {"mensaje": "Obra actualizada correctamente"}