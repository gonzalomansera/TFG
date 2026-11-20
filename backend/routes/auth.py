import os
import json
import urllib.request
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import models, auth_utils
from pydantic import BaseModel
from cloudinary_utils import upload_to_cloudinary, delete_from_cloudinary
from image_utils import process_image

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserRegister(BaseModel):
    nombre: str
    email: str
    password: str
    telefono: str = ""

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(models.Usuario).filter(models.Usuario.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    hashed_pw = auth_utils.get_password_hash(user.password)
    nuevo_usuario = models.Usuario(
        nombre=user.nombre,
        email=user.email,
        hashed_password=hashed_pw,
        telefono=user.telefono
    )
    db.add(nuevo_usuario)
    db.commit()
    return {"mensaje": "Usuario creado correctamente"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_utils.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "is_admin": user.is_admin == 1}


class GoogleAuth(BaseModel):
    access_token: str


@router.post("/google")
def google_login(data: GoogleAuth, db: Session = Depends(get_db)):
    """Login con Google (solo administración). Verifica el access_token contra
    Google, y concede acceso si el email es un admin existente o coincide con
    ADMIN_EMAIL del entorno."""
    try:
        req = urllib.request.Request(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {data.access_token}"},
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            info = json.loads(r.read().decode())
    except Exception:
        raise HTTPException(status_code=401, detail="No se pudo verificar el acceso con Google")

    email = (info.get("email") or "").strip().lower()
    if not email or info.get("email_verified") is False:
        raise HTTPException(status_code=401, detail="Email de Google no verificado")

    admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()

    # Alta/promoción automática del administrador definido en ADMIN_EMAIL
    if admin_email and email == admin_email:
        if user is None:
            user = models.Usuario(
                nombre=info.get("name", "Administrador"),
                email=email,
                hashed_password="",
                telefono="",
                is_admin=1,
                foto_perfil=info.get("picture"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        elif user.is_admin != 1:
            user.is_admin = 1
            db.commit()

    if user is None or user.is_admin != 1:
        raise HTTPException(status_code=403, detail="Esta cuenta de Google no tiene acceso de administración")

    access_token = auth_utils.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "is_admin": True}


@router.get("/me")
def get_me(current_user: models.Usuario = Depends(auth_utils.get_current_user)):
    return {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "email": current_user.email,
        "telefono": current_user.telefono,
        "foto_perfil": current_user.foto_perfil,
        "is_admin": current_user.is_admin == 1
    }

@router.put("/me")
async def update_me(
    nombre: str = Form(...),
    telefono: str = Form(""),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(auth_utils.get_current_user)
):
    current_user.nombre = nombre
    current_user.telefono = telefono
    
    if foto:
        # Borrar antigua si existe
        if current_user.foto_perfil:
            delete_from_cloudinary(current_user.foto_perfil)

        # Optimizar y subir nueva
        contenido_optimizado, _ = process_image(await foto.read(), foto.filename)
        url_foto = upload_to_cloudinary(contenido_optimizado, folder="halconero/perfiles")
        if url_foto:
            current_user.foto_perfil = url_foto
        
    db.commit()
    return {"mensaje": "Perfil actualizado", "foto_perfil": current_user.foto_perfil}
