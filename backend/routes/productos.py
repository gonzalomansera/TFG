import os
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from dotenv import load_dotenv

router = APIRouter(prefix="/productos", tags=["Productos"])
# Variables de entorno 
load_dotenv()
BASE_URL = os.getenv("API_URL", "http://localhost:8000")

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

    # Sanitizar el nombre del archivo para evitar problemas con espacios o caracteres especiales
    nombre_seguro = "".join([c if c.isalnum() or c in ".-" else "_" for c in imagen.filename])
    ruta_archivo = f"uploads/{nombre_seguro}"
    
    with open(ruta_archivo, "wb") as buffer:
        buffer.write(await imagen.read())
    
    url_imagen = f"{BASE_URL}/uploads/{nombre_seguro}"
    
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
    # Nota: Este endpoint podría ser llamado por el sistema de pagos o el carrito
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
        # Borrar imagen antigua si existe
        try:
            ruta_antigua = producto.imagen_url.replace(BASE_URL, "").lstrip("/")
            if os.path.exists(ruta_antigua):
                os.remove(ruta_antigua)
        except Exception as e:
            print(f"Error borrando imagen antigua: {e}")

        # Guardar nueva imagen
        nombre_seguro = "".join([c if c.isalnum() or c in ".-" else "_" for c in imagen.filename])
        ruta_archivo = f"uploads/{nombre_seguro}"
        with open(ruta_archivo, "wb") as buffer:
            buffer.write(await imagen.read())
        producto.imagen_url = f"{BASE_URL}/uploads/{nombre_seguro}"

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
    
    try:
        ruta_foto = producto.imagen_url.replace(BASE_URL, "")
        if os.path.exists(ruta_foto):
            os.remove(ruta_foto)
    except Exception as e:
        print(f"Error al borrar archivo físico: {e}")

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado correctamente"}