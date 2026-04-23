import os
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from dotenv import load_dotenv
load_dotenv()

BASE_URL = os.getenv("API_URL", "http://localhost:8000")

router = APIRouter(prefix="/obras", tags=["Obras"])

@router.get("/")
def obtener_obras(db: Session = Depends(get_db), user: Optional[models.Usuario] = Depends(auth_utils.get_current_user_optional)):
    obras = db.query(models.Obra).all()
    resultado = []
    for o in obras:
        is_liked = False
        if user:
            is_liked = any(like.usuario_id == user.id for like in o.likes)
        resultado.append({
            "id": o.id,
            "titulo": o.titulo,
            "descripcion": o.descripcion,
            "tipo": o.tipo,
            "imagen_url": o.imagen_url,
            "likes_count": len(o.likes),
            "is_liked": is_liked
        })
    return resultado

@router.post("/{obra_id}/like")
def toggle_like_obra(obra_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    like = db.query(models.LikeObra).filter(models.LikeObra.obra_id == obra_id, models.LikeObra.usuario_id == current_user.id).first()
    if like:
        db.delete(like)
        db.commit()
        return {"liked": False}
    else:
        nueva_like = models.LikeObra(obra_id=obra_id, usuario_id=current_user.id)
        db.add(nueva_like)
        db.commit()
        return {"liked": True}

@router.post("/")
def crear_obra(
    titulo: str = Form(...), 
    descripcion: str = Form(...), 
    tipo: str = Form(...), 
    imagen: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    # Sanitizar el nombre del archivo
    nombre_seguro = "".join([c if c.isalnum() or c in ".-" else "_" for c in imagen.filename])
    ruta_archivo = f"uploads/{nombre_seguro}"
    
    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(imagen.file, buffer)
    
    url_foto = f"{BASE_URL}/uploads/{nombre_seguro}"
    
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
def eliminar_obra(id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    obra = db.query(models.Obra).filter(models.Obra.id == id).first()
    if not obra:
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
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    obra = db.query(models.Obra).filter(models.Obra.id == id).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")

    obra.titulo = titulo
    obra.descripcion = descripcion
    obra.tipo = tipo

    if imagen:
        # Sanitizar el nombre del archivo
        nombre_seguro = "".join([c if c.isalnum() or c in ".-" else "_" for c in imagen.filename])
        ruta_archivo = f"uploads/{nombre_seguro}"
        with open(ruta_archivo, "wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)
        obra.imagen_url = f"{BASE_URL}/uploads/{nombre_seguro}"

    db.commit()
    return {"mensaje": "Obra actualizada correctamente"}