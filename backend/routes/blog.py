from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, shutil
from datetime import datetime
import os
from dotenv import load_dotenv


# Variables de entorno 
load_dotenv()
BASE_URL = os.getenv("API_URL", "http://localhost:8000")

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.get("/")
def obtener_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.id.desc()).all()

@router.post("/")
def crear_post(
    titulo: str = Form(...),
    contenido: str = Form(...),
    categoria: str = Form(...),
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ruta = f"uploads/{imagen.filename}"
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(imagen.file, buffer)
    
    nuevo_post = models.Post(
        titulo=titulo,
        contenido=contenido,
        categoria=categoria,
        imagen_url=f"{BASE_URL}/{ruta}",
        fecha=datetime.now().strftime("%d %b, %Y")
    )
    db.add(nuevo_post)
    db.commit()
    return {"mensaje": "Post publicado"}

@router.delete("/{id}")
def eliminar_post(id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post: raise HTTPException(status_code=404)
    db.delete(post)
    db.commit()
    return {"mensaje": "Eliminado"}