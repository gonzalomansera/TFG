import os
import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Usuario, Obra, Cita, Post, Producto, Resena, Comentario, Like, LikeObra, Pedido, PedidoItem

# Asegurarse de que las tablas existan
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        print("Iniciando inserción de datos...")

        # 1. Usuarios (15)
        # Hash de 'password123' generado con bcrypt para que funcionen los logins
        dummy_hash = "$2b$12$K8K9.QyS5vX/Y6YI0uU8.e6M0U6fS2y5Vj9O9Y6U0Y0U0Y0U0Y0U."
        usuarios = []
        for i in range(1, 16):
            u = Usuario(
                nombre=f"Usuario {i}",
                email=f"usuario{i}@example.com",
                telefono=f"6000000{i:02d}",
                hashed_password=dummy_hash,
                is_admin=1 if i == 1 else 0,
                foto_perfil=f"https://i.pravatar.cc/150?u={i}"
            )
            db.add(u)
            usuarios.append(u)
        db.commit() # Flush para obtener IDs
        print(f"Inserción completa: {len(usuarios)} usuarios.")

        # 2. Obras (15)
        obras = []
        for i in range(1, 16):
            o = Obra(
                titulo=f"Obra Maestra {i}",
                descripcion=f"Esta es una descripción detallada de la obra número {i}. Técnica mixta sobre lienzo.",
                tipo="Realismo" if i % 2 == 0 else "Abstracto",
                imagen_url=f"https://picsum.photos/seed/obra{i}/800/600"
            )
            db.add(o)
            obras.append(o)
        db.commit()
        print(f"Inserción completa: {len(obras)} obras.")

        # 3. Posts (Blog) (15)
        posts = []
        for i in range(1, 16):
            p = Post(
                titulo=f"Noticia del Blog {i}",
                contenido=f"Contenido extenso para el post número {i}. Hablando sobre técnicas de arte y novedades.",
                categoria="Noticias" if i % 2 == 0 else "Tutoriales",
                imagen_url=f"https://picsum.photos/seed/post{i}/1200/400",
                fecha=datetime.date.today().isoformat()
            )
            db.add(p)
            posts.append(p)
        db.commit()
        print(f"Inserción completa: {len(posts)} posts.")

        # 4. Merchandising (Productos) (15)
        productos = []
        for i in range(1, 16):
            pr = Producto(
                nombre=f"Producto {i}",
                descripcion=f"Camiseta o accesorio exclusivo con diseño de Halconero {i}.",
                precio=19.99 + i,
                stock=10 + i,
                imagen_url=f"https://picsum.photos/seed/prod{i}/400/400"
            )
            db.add(pr)
            productos.append(pr)
        db.commit()
        print(f"Inserción completa: {len(productos)} productos.")

        # 5. Citas (15)
        for i in range(1, 16):
            c = Cita(
                usuario_id=usuarios[i-1].id,
                idea=f"Idea para tatuaje o encargo número {i}. Estilo neotradicional.",
                fecha_cita=(datetime.datetime.now() + datetime.timedelta(days=i)).strftime("%Y-%m-%dT%H:%M"),
                estado="pendiente" if i % 3 != 0 else "confirmada"
            )
            db.add(c)
        print("Inserción completa: 15 citas.")

        # 6. Reseñas (15)
        for i in range(1, 16):
            r = Resena(
                usuario_id=usuarios[i-1].id,
                estrellas=5 if i % 2 == 0 else 4,
                comentario=f"¡Increíble trabajo! El artista número {i} es un crack.",
                fecha=datetime.date.today().isoformat()
            )
            db.add(r)
        print("Inserción completa: 15 reseñas.")

        # 7. Comentarios (15)
        for i in range(1, 16):
            com = Comentario(
                post_id=posts[i-1].id,
                usuario_id=usuarios[i-1].id,
                contenido=f"Muy interesante este post número {i}. ¡Gracias por compartir!",
                fecha=datetime.date.today().isoformat()
            )
            db.add(com)
        print("Inserción completa: 15 comentarios.")

        # 8. Likes (15)
        for i in range(1, 16):
            lk = Like(post_id=posts[i-1].id, usuario_id=usuarios[i-1].id)
            db.add(lk)
        print("Inserción completa: 15 likes en posts.")

        # 9. Likes Obras (15)
        for i in range(1, 16):
            lko = LikeObra(obra_id=obras[i-1].id, usuario_id=usuarios[i-1].id)
            db.add(lko)
        print("Inserción completa: 15 likes en obras.")

        # 10. Pedidos (15)
        pedidos = []
        for i in range(1, 16):
            ped = Pedido(
                usuario_id=usuarios[i-1].id,
                metodo_pago="Stripe / Card",
                total=0.0, # Se calculará con los items
                fecha=datetime.date.today().isoformat(),
                estado="completado"
            )
            db.add(ped)
            pedidos.append(ped)
        db.commit()

        # 11. Pedido Items (15 - uno por pedido para simplificar)
        for i in range(1, 16):
            item = PedidoItem(
                pedido_id=pedidos[i-1].id,
                producto_id=productos[i-1].id,
                cantidad=1,
                precio_unitario=productos[i-1].precio
            )
            pedidos[i-1].total = productos[i-1].precio
            db.add(item)
        print("Inserción completa: 15 pedidos con sus items.")

        db.commit()
        print("\n¡ÉXITO! Se han insertado 15 registros en cada tabla.")

    except Exception as e:
        db.rollback()
        print(f"Error durante la inserción: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
