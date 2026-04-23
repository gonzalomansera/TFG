from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/citas", tags=["Citas"])

class CitaCreate(BaseModel):
    idea: str
    fecha_cita: str  # Puede ser una fecha sugerida o simplemente el momento de la solicitud

class CitaUpdate(BaseModel):
    estado: str

@router.post("/")
def solicitar_cita(cita: CitaCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    nueva_cita = models.Cita(
        usuario_id=current_user.id,
        idea=cita.idea,
        fecha_cita=cita.fecha_cita,
        estado="pendiente"
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    return {"mensaje": "Solicitud de cita enviada correctamente", "id": nueva_cita.id}

@router.get("/mis-citas")
def obtener_mis_citas(db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    citas = db.query(models.Cita).filter(models.Cita.usuario_id == current_user.id).order_by(models.Cita.id.desc()).all()
    return citas

@router.get("/")
def obtener_todas_las_citas(db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    
    citas = db.query(models.Cita).order_by(models.Cita.id.desc()).all()
    resultado = []
    for c in citas:
        resultado.append({
            "id": c.id,
            "idea": c.idea,
            "fecha_cita": c.fecha_cita,
            "estado": c.estado,
            "usuario": {
                "nombre": c.usuario.nombre,
                "email": c.usuario.email,
                "telefono": c.usuario.telefono
            } if c.usuario else None
        })
    return resultado

@router.put("/{id}/estado")
def cambiar_estado_cita(id: int, update: CitaUpdate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if current_user.is_admin != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    cita.estado = update.estado
    db.commit()
    return {"mensaje": f"Estado de la cita actualizado a {update.estado}"}
