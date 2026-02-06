import os
import shutil
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import get_db
import models

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
    
    # URL para que React acceda a la imagen
    url_foto = f"http://localhost:8000/{ruta_archivo}"
    
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