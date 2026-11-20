from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    email = Column(String, unique=True, index=True)
    telefono = Column(String)
    hashed_password = Column(String)
    is_admin = Column(Integer, default=0)
    foto_perfil = Column(String, nullable=True)

class Obra(Base):
    __tablename__ = "obras"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    descripcion = Column(Text)
    tipo = Column(String)
    imagen_url = Column(String)
    likes = relationship("LikeObra", back_populates="obra", cascade="all, delete-orphan")

class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    idea = Column(Text)
    fecha_cita = Column(String)
    estado = Column(String, default="pendiente")
    usuario = relationship("Usuario")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    contenido = Column(Text)
    categoria = Column(String)
    imagen_url = Column(String)
    fecha = Column(String) 
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comentarios = relationship("Comentario", back_populates="post", cascade="all, delete-orphan")
    
class Resena(Base):
    __tablename__ = "resenas"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    estrellas = Column(Integer) 
    comentario = Column(Text)
    fecha = Column(String) 
    usuario = relationship("Usuario")

class Comentario(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    contenido = Column(Text)
    fecha = Column(String)
    usuario = relationship("Usuario")
    post = relationship("Post", back_populates="comentarios")

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    post = relationship("Post", back_populates="likes")
class LikeObra(Base):
    __tablename__ = "likes_obras"
    id = Column(Integer, primary_key=True, index=True)
    obra_id = Column(Integer, ForeignKey("obras.id"))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    obra = relationship("Obra", back_populates="likes")