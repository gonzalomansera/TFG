from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/resenas", tags=["Reseñas"])

class ResenaCreate(BaseModel):
    estrellas: int
    comentario: str

@router.get("/")
def obtener_resenas(db: Session = Depends(get_db)):
    resenas = db.query(models.Resena).order_by(models.Resena.id.desc()).all()
    resultado = []
    for r in resenas:
        resultado.append({
            "id": r.id,
            "estrellas": r.estrellas,
            "comentario": r.comentario,
            "fecha": r.fecha,
            "usuario": r.usuario.nombre if r.usuario else "Anónimo"
        })
    return resultado

@router.post("/")
def crear_resena(resena: ResenaCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    nueva_resena = models.Resena(
        usuario_id=current_user.id,
        estrellas=resena.estrellas,
        comentario=resena.comentario,
        fecha=datetime.now().strftime("%d %b, %Y")
    )
    db.add(nueva_resena)
    db.commit()
    return {"mensaje": "Reseña publicada"}

@router.delete("/{id}")
def eliminar_resena(id: int, db: Session = Depends(get_db), current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    
    resena = db.query(models.Resena).filter(models.Resena.id == id).first()
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    db.delete(resena)
    db.commit()
    return {"mensaje": "Reseña eliminada"}
