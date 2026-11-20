from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from email_utils import enviar_email
from pydantic import BaseModel

router = APIRouter(prefix="/citas", tags=["Citas"])

class CitaCreate(BaseModel):
    idea: str
    fecha_cita: str  # Puede ser una fecha sugerida o simplemente el momento de la solicitud

class SolicitudCita(BaseModel):
    nombre: str
    email: str
    telefono: str = ""
    tipo: str = "Tatuaje"
    idea: str
    fecha_cita: str = "A convenir"

class CitaUpdate(BaseModel):
    estado: str


@router.post("/solicitud")
def solicitud_publica(datos: SolicitudCita, db: Session = Depends(get_db)):
    """Solicitud de cita desde el formulario público (sin necesidad de cuenta).
    Guarda la cita y envía un email al estudio si el SMTP está configurado."""
    resumen = (
        f"[{datos.tipo}] {datos.nombre} ({datos.email} · {datos.telefono or 'sin teléfono'})"
        f" — Fecha preferida: {datos.fecha_cita}. Propuesta: {datos.idea}"
    )

    nueva_cita = models.Cita(
        usuario_id=None,
        idea=resumen,
        fecha_cita=datos.fecha_cita,
        estado="pendiente",
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)

    cuerpo = (
        "Nueva solicitud de cita desde la web:\n\n"
        f"Nombre:   {datos.nombre}\n"
        f"Email:    {datos.email}\n"
        f"Teléfono: {datos.telefono or '-'}\n"
        f"Tipo:     {datos.tipo}\n"
        f"Fecha:    {datos.fecha_cita}\n\n"
        f"Idea / propuesta:\n{datos.idea}\n"
    )
    enviado = enviar_email(
        asunto=f"Nueva cita web — {datos.nombre} ({datos.tipo})",
        cuerpo=cuerpo,
        responder_a=str(datos.email),
    )

    return {"mensaje": "Solicitud enviada correctamente", "id": nueva_cita.id, "email_enviado": enviado}

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
