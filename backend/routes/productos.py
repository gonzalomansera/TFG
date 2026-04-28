import os
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from cloudinary_utils import upload_to_cloudinary, delete_from_cloudinary
from image_utils import process_image

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/")
def obtener_productos(db: Session = Depends(get_db)):
    return db.query(models.Producto).all()

@router.post("/")
async def crear_producto(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    stock: int = Form(...),
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")

    # Optimizar imagen en memoria
    contenido_optimizado, _ = process_image(await imagen.read(), imagen.filename)
    
    # Subir a Cloudinary
    url_imagen = upload_to_cloudinary(contenido_optimizado, folder="halconero/productos")
    
    if not url_imagen:
        raise HTTPException(status_code=500, detail="Error al subir la imagen del producto")
    
    nuevo_producto = models.Producto(
        nombre=nombre, descripcion=descripcion, precio=precio,
        stock=stock, imagen_url=url_imagen
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@router.put("/{producto_id}/reducir-stock")
def reducir_stock(producto_id: int, cantidad: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if producto.stock < cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
    
    producto.stock -= cantidad
    db.commit()
    return {"message": "Stock actualizado", "nuevo_stock": producto.stock}

@router.put("/{id}")
async def actualizar_producto(
    id: int,
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    stock: int = Form(...),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")

    producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    producto.nombre = nombre
    producto.descripcion = descripcion
    producto.precio = precio
    producto.stock = stock

    if imagen:
        # Borrar imagen antigua de Cloudinary
        if producto.imagen_url:
            delete_from_cloudinary(producto.imagen_url)

        # Optimizar y subir nueva
        contenido_optimizado, _ = process_image(await imagen.read(), imagen.filename)
        nueva_url = upload_to_cloudinary(contenido_optimizado, folder="halconero/productos")
        if nueva_url:
            producto.imagen_url = nueva_url

    db.commit()
    db.refresh(producto)
    return producto

@router.delete("/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")

    producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Primero borramos las referencias en los pedidos para evitar errores de clave foránea
    db.query(models.PedidoItem).filter(models.PedidoItem.producto_id == id).delete()

    if producto.imagen_url:
        delete_from_cloudinary(producto.imagen_url)

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado correctamente (y sus referencias en pedidos)"}