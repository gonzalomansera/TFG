from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/citas", tags=["Citas"])

@router.post("/")
def solicitar_cita(
    nombre: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(...),
    idea: str = Form(...),
    fecha_sugerida: str = Form(...),
    db: Session = Depends(get_db)
):
    # 1. Verificar si el usuario ya existe
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()

    if not usuario:
        usuario = models.Usuario(nombre=nombre, email=email, telefono=telefono)
        db.add(usuario)
        db.commit()
        db.refresh(usuario)

    # 2. Crear la cita vinculada
    nueva_cita = models.Cita(
        usuario_id=usuario.id,
        idea=idea,
        fecha_cita=fecha_sugerida,
        estado="pendiente"
    )
    
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)

    return {
        "mensaje": "Cita solicitada con éxito",
        "usuario": usuario.nombre,
        "cita_id": nueva_cita.id
    }

@router.get("/admin")
def obtener_todas_las_citas(db: Session = Depends(get_db)):
    return db.query(models.Cita).all()