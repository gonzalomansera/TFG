from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True, index=True)
    telefono = Column(String)

class Obra(Base):
    __tablename__ = "obras"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    descripcion = Column(Text)
    tipo = Column(String)
    imagen_url = Column(String)

class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    idea = Column(Text)
    fecha_cita = Column(String)
    estado = Column(String, default="pendiente")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    contenido = Column(Text)
    categoria = Column(String)
    imagen_url = Column(String)
    fecha = Column(String) 
    
class Producto(Base):
    __tablename__ = "merchandising"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(Text)
    precio = Column(Float) 
    stock = Column(Integer)
    imagen_url = Column(String)

class Resena(Base):
    __tablename__ = "resenas"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    estrellas = Column(Integer) 
    comentario = Column(Text)
    fecha = Column(String) 
    usuario = relationship("Usuario")