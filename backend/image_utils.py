import os
from PIL import Image
from io import BytesIO

def process_image(file_content: bytes, filename: str, quality=75) -> tuple[bytes, str]:
    """
    Optimiza la imagen, la redimensiona si es muy grande y la convierte a WebP.
    """
    try:
        img = Image.open(BytesIO(file_content))
        
        # Convertir a RGB si es necesario (para evitar errores con formatos raros)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Redimensionar si es mayor a 1920px de ancho
        max_width = 1920
        if img.width > max_width:
            ratio = max_width / float(img.width)
            new_height = int(float(img.height) * float(ratio))
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Guardar como WebP
        output = BytesIO()
        img.save(output, format="WEBP", quality=quality, method=6)
        
        # Cambiar extensión al nombre
        name_without_ext = os.path.splitext(filename)[0]
        new_filename = f"{name_without_ext}.webp"
        
        return output.getvalue(), new_filename
    except Exception as e:
        print(f"Error procesando imagen: {e}")
        return file_content, filename
