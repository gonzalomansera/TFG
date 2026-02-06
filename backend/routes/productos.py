import os
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

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
    db: Session = Depends(get_db)
):
    ruta_archivo = f"uploads/{imagen.filename}"
    with open(ruta_archivo, "wb") as buffer:
        buffer.write(await imagen.read())
    
    url_imagen = f"http://localhost:8000/uploads/{imagen.filename}"
    
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