import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary_url = os.getenv("CLOUDINARY_URL")

if cloudinary_url:
    # Si existe la URL completa, la usamos directamente
    cloudinary.config(cloudinary_url=cloudinary_url, secure=True)
else:
    # Si no, usamos las piezas sueltas
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

def upload_to_cloudinary(file_content: bytes, folder: str = "halconero") -> str:
    """
    Sube el contenido de un archivo a Cloudinary y devuelve la URL segura.
    """
    try:
        response = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="auto"
        )
        return response.get("secure_url")
    except Exception as e:
        print(f"Error subiendo a Cloudinary: {e}")
        return None

def delete_from_cloudinary(public_url: str):
    """
    Intenta borrar una imagen de Cloudinary a partir de su URL.
    """
    try:
        # Extraer el public_id de la URL
        # Ejemplo: https://res.cloudinary.com/demo/image/upload/v12345678/halconero/nombre_imagen.webp
        if "cloudinary" in public_url:
            parts = public_url.split("/")
            # El ID suele ser lo que va después de /upload/v12345678/
            # Pero es más seguro buscar la carpeta 'halconero'
            for i, part in enumerate(parts):
                if part == "halconero":
                    public_id = "/".join(parts[i:])
                    # Quitar la extensión
                    public_id = os.path.splitext(public_id)[0]
                    cloudinary.uploader.destroy(public_id)
                    break
    except Exception as e:
        print(f"Error borrando de Cloudinary: {e}")
