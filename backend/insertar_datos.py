import datetime
from database import SessionLocal, engine, Base
from models import Usuario, Obra, Cita, Post, Resena, Comentario, Like, LikeObra
from auth_utils import get_password_hash

# Asegurarse de que las tablas existan
Base.metadata.create_all(bind=engine)

TIPOS_TATUAJE = ["Tatuaje", "Dibujo", "Tatuaje", "Imaginería"]


def seed_data():
    db = SessionLocal()
    try:
        print("Limpiando datos antiguos...")
        db.query(LikeObra).delete()
        db.query(Like).delete()
        db.query(Comentario).delete()
        db.query(Resena).delete()
        db.query(Cita).delete()
        db.query(Post).delete()
        db.query(Obra).delete()
        db.query(Usuario).delete()
        db.commit()

        print("Iniciando inserción de datos...")

        # 1. Usuarios (15)
        password_clara = "password123"
        hashed = get_password_hash(password_clara)

        usuarios = []
        for i in range(1, 16):
            u = Usuario(
                nombre=f"Usuario {i}",
                email=f"usuario{i}@example.com",
                telefono=f"6000000{i:02d}",
                hashed_password=hashed,
                is_admin=1 if i == 1 else 0,
                foto_perfil=f"https://i.pravatar.cc/150?u={i}"
            )
            db.add(u)
            usuarios.append(u)
        db.commit()
        print(f"Inserción completa: {len(usuarios)} usuarios.")

        # 2. Obras del portfolio (15) — tatuajes y diseños
        obras = []
        for i in range(1, 16):
            o = Obra(
                titulo=f"Pieza {i}",
                descripcion=f"Tatuaje realizado a mano alzada. Proyecto número {i}, trabajo original de Jose Halconero.",
                tipo=TIPOS_TATUAJE[i % len(TIPOS_TATUAJE)],
                imagen_url=f"https://picsum.photos/seed/tattoo{i}/800/1000"
            )
            db.add(o)
            obras.append(o)
        db.commit()
        print(f"Inserción completa: {len(obras)} obras.")

        # 3. Posts del diario (15) — se conservan en backend
        posts = []
        for i in range(1, 16):
            p = Post(
                titulo=f"Entrada del diario {i}",
                contenido=f"Notas de taller número {i}: proceso creativo, bocetos y novedades del estudio.",
                categoria="Proceso Creativo" if i % 2 == 0 else "Eventos",
                imagen_url=f"https://picsum.photos/seed/post{i}/1200/400",
                fecha=datetime.date.today().isoformat()
            )
            db.add(p)
            posts.append(p)
        db.commit()
        print(f"Inserción completa: {len(posts)} posts.")

        # 4. Citas (15)
        for i in range(1, 16):
            c = Cita(
                usuario_id=usuarios[i-1].id,
                idea=f"Idea para tatuaje número {i}. Estilo neotradicional, antebrazo.",
                fecha_cita=(datetime.datetime.now() + datetime.timedelta(days=i)).strftime("%Y-%m-%dT%H:%M"),
                estado="pendiente" if i % 3 != 0 else "confirmada"
            )
            db.add(c)
        print("Inserción completa: 15 citas.")

        # 5. Reseñas (15)
        for i in range(1, 16):
            r = Resena(
                usuario_id=usuarios[i-1].id,
                estrellas=5 if i % 2 == 0 else 4,
                comentario=f"Experiencia increíble en el estudio. Trabajo impecable ({i}).",
                fecha=datetime.date.today().isoformat()
            )
            db.add(r)
        print("Inserción completa: 15 reseñas.")

        # 6. Comentarios (15)
        for i in range(1, 16):
            com = Comentario(
                post_id=posts[i-1].id,
                usuario_id=usuarios[i-1].id,
                contenido=f"Muy interesante esta entrada número {i}. ¡Gracias por compartir!",
                fecha=datetime.date.today().isoformat()
            )
            db.add(com)
        print("Inserción completa: 15 comentarios.")

        # 7. Likes (15)
        for i in range(1, 16):
            lk = Like(post_id=posts[i-1].id, usuario_id=usuarios[i-1].id)
            db.add(lk)
        print("Inserción completa: 15 likes en posts.")

        # 8. Likes Obras (15)
        for i in range(1, 16):
            lko = LikeObra(obra_id=obras[i-1].id, usuario_id=usuarios[i-1].id)
            db.add(lko)
        print("Inserción completa: 15 likes en obras.")

        db.commit()
        print("\n¡ÉXITO! Datos de ejemplo insertados.")

    except Exception as e:
        db.rollback()
        print(f"Error durante la inserción: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
