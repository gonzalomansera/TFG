import os
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from cloudinary_utils import upload_to_cloudinary, delete_from_cloudinary
from image_utils import process_image

router = APIRouter(prefix="/blog", tags=["Blog"])

class ComentarioCreate(BaseModel):
    contenido: str

@router.get("/")
def obtener_posts(db: Session = Depends(get_db), user: Optional[models.Usuario] = Depends(auth_utils.get_current_user_optional)):
    posts = db.query(models.Post).order_by(models.Post.id.desc()).all()
    resultado = []
    for p in posts:
        is_liked = False
        if user:
            is_liked = any(like.usuario_id == user.id for like in p.likes)
        
        resultado.append({
            "id": p.id,
            "titulo": p.titulo,
            "contenido": p.contenido,
            "categoria": p.categoria,
            "imagen_url": p.imagen_url,
            "fecha": p.fecha,
            "likes_count": len(p.likes),
            "comments_count": len(p.comentarios),
            "is_liked": is_liked
        })
    return resultado

@router.post("/{post_id}/like")
def toggle_like(post_id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    like = db.query(models.Like).filter(models.Like.post_id == post_id, models.Like.usuario_id == current_user.id).first()
    if like:
        db.delete(like)
        db.commit()
        return {"liked": False}
    else:
        nuevo_like = models.Like(post_id=post_id, usuario_id=current_user.id)
        db.add(nuevo_like)
        db.commit()
        return {"liked": True}

@router.post("/{post_id}/comentar")
def comentar(post_id: int, comment: ComentarioCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    nuevo = models.Comentario(
        post_id=post_id,
        usuario_id=current_user.id,
        contenido=comment.contenido,
        fecha=datetime.now().strftime("%d %b, %Y")
    )
    db.add(nuevo)
    db.commit()
    return {"mensaje": "Comentario añadido"}

@router.get("/{id}/comments")
def get_comments(id: int, db: Session = Depends(get_db)):
    comentarios = db.query(models.Comentario).filter(models.Comentario.post_id == id).order_by(models.Comentario.id.asc()).all()
    resultado = []
    for c in comentarios:
        resultado.append({
            "id": c.id,
            "contenido": c.contenido,
            "fecha": c.fecha,
            "usuario": c.usuario.nombre
        })
    return resultado

@router.post("/")
async def crear_post(
    titulo: str = Form(...),
    contenido: str = Form(...),
    categoria: str = Form(...),
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")

    # Optimizar imagen en memoria
    contenido_optimizado, _ = process_image(await imagen.read(), imagen.filename)
    
    # Subir a Cloudinary
    url_imagen = upload_to_cloudinary(contenido_optimizado, folder="halconero/blog")
    
    if not url_imagen:
        raise HTTPException(status_code=500, detail="Error al subir la imagen del post")
        
    fecha_actual = datetime.now().strftime("%d %b, %Y")

    nuevo_post = models.Post(
        titulo=titulo, contenido=contenido, categoria=categoria,
        imagen_url=url_imagen, fecha=fecha_actual
    )
    db.add(nuevo_post)
    db.commit()
    db.refresh(nuevo_post)
    return nuevo_post

@router.delete("/{id}")
def eliminar_post(id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")

    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    if post.imagen_url:
        delete_from_cloudinary(post.imagen_url)

    db.delete(post)
    db.commit()
    return {"mensaje": "Post eliminado"}

@router.put("/{id}")
async def actualizar_post(
    id: int,
    titulo: str = Form(...),
    contenido: str = Form(...),
    categoria: str = Form(...),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")

    post.titulo = titulo
    post.contenido = contenido
    post.categoria = categoria

    if imagen:
        # Borrar antigua de Cloudinary
        if post.imagen_url:
            delete_from_cloudinary(post.imagen_url)

        # Optimizar y subir nueva
        contenido_optimizado, _ = process_image(await imagen.read(), imagen.filename)
        nueva_url = upload_to_cloudinary(contenido_optimizado, folder="halconero/blog")
        if nueva_url:
            post.imagen_url = nueva_url

    db.commit()
    db.refresh(post)
    return post

@router.delete("/comments/{id}")
def eliminar_comentario(id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    
    comentario = db.query(models.Comentario).filter(models.Comentario.id == id).first()
    if not comentario:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    
    db.delete(comentario)
    db.commit()
    return {"mensaje": "Comentario eliminado"}