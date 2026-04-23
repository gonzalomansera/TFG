from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import models, auth_utils
from database import get_db
from datetime import datetime
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

class PaymentIntentCreate(BaseModel):
    amount: float

class PedidoItemCreate(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float

class PedidoCreate(BaseModel):
    items: List[PedidoItemCreate]
    metodo_pago: str
    total: float

@router.post("/create-payment-intent")
def create_payment(payment: PaymentIntentCreate):
    try:
        # Stripe necesita el monto en céntimos (mínimo 50 céntimos)
        intent = stripe.PaymentIntent.create(
            amount=int(payment.amount * 100),
            currency="eur",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/")
def crear_pedido(
    pedido: PedidoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    # 1. Crear el Pedido
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    nuevo_pedido = models.Pedido(
        usuario_id=current_user.id,
        metodo_pago=pedido.metodo_pago,
        total=pedido.total,
        fecha=fecha_actual,
        estado="completado"
    )
    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)

    # 2. Agregar los items y reducir el stock
    for item in pedido.items:
        producto = db.query(models.Producto).filter(models.Producto.id == item.producto_id).first()
        if not producto:
            raise HTTPException(status_code=404, detail=f"Producto {item.producto_id} no encontrado")
        if producto.stock < item.cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para producto {producto.nombre}")
        
        producto.stock -= item.cantidad

        nuevo_item = models.PedidoItem(
            pedido_id=nuevo_pedido.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.precio_unitario
        )
        db.add(nuevo_item)
    
    db.commit()
    return {"message": "Pedido creado correctamente", "pedido_id": nuevo_pedido.id}

@router.get("/me")
def obtener_mis_pedidos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    pedidos = db.query(models.Pedido).filter(models.Pedido.usuario_id == current_user.id).order_by(models.Pedido.id.desc()).all()
    
    # Formatear la respuesta para incluir los detalles de los productos
    resultado = []
    for pedido in pedidos:
        items = []
        for item in pedido.items:
            items.append({
                "id": item.id,
                "producto_id": item.producto_id,
                "nombre": item.producto.nombre,
                "imagen_url": item.producto.imagen_url,
                "cantidad": item.cantidad,
                "precio_unitario": item.precio_unitario
            })
        resultado.append({
            "id": pedido.id,
            "fecha": pedido.fecha,
            "total": pedido.total,
            "metodo_pago": pedido.metodo_pago,
            "estado": pedido.estado,
            "items": items
        })
    
    return resultado

@router.get("/")
def obtener_todos_los_pedidos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    pedidos = db.query(models.Pedido).order_by(models.Pedido.id.desc()).all()
    resultado = []
    for pedido in pedidos:
        items = []
        for item in pedido.items:
            items.append({
                "id": item.id,
                "producto_id": item.producto_id,
                "nombre": item.producto.nombre,
                "imagen_url": item.producto.imagen_url,
                "cantidad": item.cantidad,
                "precio_unitario": item.precio_unitario
            })
        resultado.append({
            "id": pedido.id,
            "fecha": pedido.fecha,
            "total": pedido.total,
            "metodo_pago": pedido.metodo_pago,
            "estado": pedido.estado,
            "items": items,
            "usuario": {
                "nombre": pedido.usuario.nombre if pedido.usuario else "Desconocido",
                "email": pedido.usuario.email if pedido.usuario else "N/A"
            }
        })
    return resultado
