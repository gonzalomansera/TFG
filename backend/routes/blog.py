from fastapi import APIRouter, Depends, Form, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
import models
import shutil

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.get("/")
def obtener_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).all()

@router.post("/")
async def crear_post(
    titulo: str = Form(...),
    contenido: str = Form(...),
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ruta_archivo = f"uploads/{imagen.filename}"
    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(imagen.file, buffer)
    
    url_foto = f"http://localhost:8000/{ruta_archivo}"
    
    nuevo_post = models.Post(titulo=titulo, contenido=contenido, imagen_url=url_foto)
    db.add(nuevo_post)
    db.commit()
    db.refresh(nuevo_post)
    return nuevo_post