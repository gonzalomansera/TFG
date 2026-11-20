# Despliegue en VPS (IONOS)

Guía para publicar la web en una VPS de IONOS con **Ubuntu 22.04+**, un **dominio propio**
y HTTPS. Frontend y backend se sirven bajo el mismo dominio con **nginx** como proxy inverso;
el backend FastAPI corre con **uvicorn** gestionado por **systemd**.

```
Internet ──▶ nginx (443/80) ──┬─▶ archivos estáticos  (frontend/dist)
                              ├─▶ /api      ──▶ uvicorn 127.0.0.1:8000
                              └─▶ /uploads  ──▶ uvicorn 127.0.0.1:8000
```

---

## 1. Preparar el servidor

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-venv python3-pip nginx git postgresql
# Node LTS (para construir el frontend)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. Base de datos PostgreSQL

```bash
sudo -u postgres psql -c "CREATE USER halconero WITH PASSWORD 'CAMBIA_ESTO';"
sudo -u postgres psql -c "CREATE DATABASE halconero_db OWNER halconero;"
```

## 3. Clonar el proyecto

```bash
cd /var/www
sudo git clone <URL_DEL_REPO> halconero
sudo chown -R $USER:$USER halconero
cd halconero
```

Crea el `.env` (a partir de `.env.example`):

```env
API_URL=/api
VITE_API_URL=/api
DATABASE_URL=postgresql+psycopg2://halconero:CAMBIA_ESTO@localhost:5432/halconero_db
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> `VITE_API_URL=/api` hace que el frontend use rutas relativas: al estar en el mismo
> dominio no hay problemas de CORS.

## 4. Backend

```bash
cd /var/www/halconero/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python insertar_datos.py   # (opcional) datos de ejemplo
```

Servicio **systemd** en `/etc/systemd/system/halconero.service`:

```ini
[Unit]
Description=Halconero API (FastAPI/uvicorn)
After=network.target postgresql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/halconero/backend
Environment="PATH=/var/www/halconero/backend/venv/bin"
ExecStart=/var/www/halconero/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now halconero
sudo systemctl status halconero
```

## 5. Frontend (build)

```bash
cd /var/www/halconero/frontend
npm ci
npm run build          # genera frontend/dist/
```

## 6. nginx

`/etc/nginx/sites-available/halconero`:

```nginx
server {
    listen 80;
    server_name josehalconero.com www.josehalconero.com;

    root /var/www/halconero/frontend/dist;
    index index.html;

    # SPA: todas las rutas al index
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API y archivos subidos → backend
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /uploads {
        proxy_pass http://127.0.0.1:8000;
    }

    # Caché de assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/halconero /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 7. HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d josehalconero.com -d www.josehalconero.com
```

Certbot configura la redirección a HTTPS y la renovación automática.

## 8. Actualizar la web (despliegues posteriores)

```bash
cd /var/www/halconero
git pull
# backend (si cambió)
source backend/venv/bin/activate && pip install -r backend/requirements.txt
sudo systemctl restart halconero
# frontend
cd frontend && npm ci && npm run build
sudo systemctl reload nginx
```

## Notas de seguridad

- En `backend/main.py`, el CORS está en `allow_origins=["*"]`. En producción, al servir
  todo bajo el mismo dominio no es necesario; puedes restringirlo a tu dominio.
- No subas nunca el `.env` al repositorio (ya está en `.gitignore`).
- Cambia las contraseñas de ejemplo de PostgreSQL.
