"""
Envío de correo por SMTP (opcional).

Se configura mediante variables de entorno. Si no están definidas, las funciones
no hacen nada (devuelven False) y la aplicación sigue funcionando con normalidad
(la cita se guarda igualmente en la base de datos).

Variables de entorno:
  SMTP_HOST       Servidor SMTP (p.ej. smtp.ionos.es)
  SMTP_PORT       Puerto (465 SSL · 587 STARTTLS). Por defecto 587.
  SMTP_USER       Usuario / correo de autenticación
  SMTP_PASSWORD   Contraseña
  SMTP_FROM       Remitente (por defecto, SMTP_USER)
  NOTIFY_EMAIL    Correo del estudio donde llegan las solicitudes (por defecto, SMTP_USER)
"""
import os
import smtplib
import ssl
from email.message import EmailMessage


def _cfg():
    host = os.getenv("SMTP_HOST", "").strip()
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    port = int(os.getenv("SMTP_PORT", "587") or "587")
    sender = os.getenv("SMTP_FROM", "").strip() or user
    notify = os.getenv("NOTIFY_EMAIL", "").strip() or user
    return host, port, user, password, sender, notify


def smtp_configurado() -> bool:
    host, _, user, password, _, notify = _cfg()
    return bool(host and user and password and notify)


def enviar_email(asunto: str, cuerpo: str, responder_a: str | None = None) -> bool:
    """Envía un email al correo del estudio (NOTIFY_EMAIL). Devuelve True si se envió."""
    if not smtp_configurado():
        print("[email] SMTP no configurado: se omite el envío (la cita se guardó igualmente).")
        return False

    host, port, user, password, sender, notify = _cfg()

    msg = EmailMessage()
    msg["Subject"] = asunto
    msg["From"] = sender
    msg["To"] = notify
    if responder_a:
        msg["Reply-To"] = responder_a
    msg.set_content(cuerpo)

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=15) as s:
                s.login(user, password)
                s.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=15) as s:
                s.starttls(context=ssl.create_default_context())
                s.login(user, password)
                s.send_message(msg)
        print(f"[email] Enviado a {notify}: {asunto}")
        return True
    except Exception as e:
        print(f"[email] Error enviando correo: {e}")
        return False
