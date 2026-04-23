import os
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from cloudinary_utils import upload_to_cloudinary

def migrate():
    db: Session = SessionLocal()
    print("🚀 Iniciando migración de imágenes a Cloudinary...")

    # 1. Migrar Obras
    obras = db.query(models.Obra).all()
    for o in obras:
        if o.imagen_url and o.imagen_url.startswith("/uploads/"):
            path = f".{o.imagen_url}" # Ej: ./uploads/imagen.webp
            if os.path.exists(path):
                print(f"Uploading Obra: {o.titulo}...")
                with open(path, "rb") as f:
                    new_url = upload_to_cloudinary(f.read(), folder="halconero/obras")
                    if new_url:
                        o.imagen_url = new_url
                        print(f"✅ Success: {new_url}")

    # 2. Migrar Productos
    productos = db.query(models.Producto).all()
    for p in productos:
        if p.imagen_url and p.imagen_url.startswith("/uploads/"):
            path = f".{p.imagen_url}"
            if os.path.exists(path):
                print(f"Uploading Producto: {p.nombre}...")
                with open(path, "rb") as f:
                    new_url = upload_to_cloudinary(f.read(), folder="halconero/productos")
                    if new_url:
                        p.imagen_url = new_url
                        print(f"✅ Success: {new_url}")

    # 3. Migrar Blog Posts
    posts = db.query(models.Post).all()
    for post in posts:
        if post.imagen_url and post.imagen_url.startswith("/uploads/"):
            path = f".{post.imagen_url}"
            if os.path.exists(path):
                print(f"Uploading Post: {post.titulo}...")
                with open(path, "rb") as f:
                    new_url = upload_to_cloudinary(f.read(), folder="halconero/blog")
                    if new_url:
                        post.imagen_url = new_url
                        print(f"✅ Success: {new_url}")

    # 4. Migrar Fotos de Perfil
    usuarios = db.query(models.Usuario).all()
    for u in usuarios:
        if u.foto_perfil and u.foto_perfil.startswith("/uploads/"):
            path = f".{u.foto_perfil}"
            if os.path.exists(path):
                print(f"Uploading Perfil: {u.nombre}...")
                with open(path, "rb") as f:
                    new_url = upload_to_cloudinary(f.read(), folder="halconero/perfiles")
                    if new_url:
                        u.foto_perfil = new_url
                        print(f"✅ Success: {new_url}")

    db.commit()
    db.close()
    print("\n✨ ¡Migración completada con éxito! Todas tus imágenes están ahora en Cloudinary.")

if __name__ == "__main__":
    migrate()
