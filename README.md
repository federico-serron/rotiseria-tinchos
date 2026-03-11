# 🚀 Fullstack Flask + React (Vite) — Guía de Inicio Rápido

![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=FFD62E)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

---

Este proyecto es una aplicación fullstack que utiliza Flask para el backend y React (con Vite) para el frontend. Puedes iniciar ambos proyectos por separado en modo desarrollo o usar Docker Compose para levantar todo el stack.

## 🛠️ Requisitos previos

- 🐍 Python 3.11+
- 🟦 Node.js 18+ y npm
- 🐳 (Opcional) Docker y Docker Compose

---

## 📦 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

## 🐍 2. Inicializar el Backend (Flask)

1. Crear y activar un entorno virtual (recomendado):

   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   **Linux/Mac:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Instalar las dependencias:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. Iniciar el backend:

   ```bash
   python backend/app/app.py
   ```

   El backend estará disponible en: [http://localhost:5000](http://localhost:5000)

---

## ⚛️ 3. Inicializar el Frontend (React + Vite)

1. Entrar a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el frontend:

   ```bash
   npm run dev
   ```

   El frontend estará disponible en: [http://localhost:5173](http://localhost:5173)

---

## 🔑 4. Variables de entorno

Asegúrate de tener los archivos `.env` necesarios en cada carpeta (`backend` y `frontend`). Puedes usar los archivos `.env.example` como guía para crear tu propio `.env`, o simplemente renombrarlos a `.env` en cada carpeta.

📋 **Ejemplo:**

### backend/.env
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///app.db
PAYPAL_CLIENT_ID=tu-client-id-sandbox
PAYPAL_CLIENT_SECRET=tu-secret-sandbox
# Opcional: PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

### frontend/.env
```
VITE_BACKEND_URL=http://localhost:5000
VITE_BASENAME=/
VITE_PAYPAL_CLIENT_ID=tu-client-id-sandbox
```

---

## 🐳 5. (Opcional) Usar Docker Compose

Si prefieres levantar todo con Docker Compose:

```bash
docker-compose up --build
```

Esto levantará el backend en `localhost:5000` y el frontend en `localhost:5173`.

---

## 🗂️ 6. Estructura del proyecto

```
backend/
  app/
    app.py
    ...
  requirements.txt
frontend/
  src/
    ...
  package.json
  ...
docker-compose.yml
README.md
```

---

## 💡 7. Notas
- ⚠️ Si tienes problemas de CORS, asegúrate de que el backend tenga habilitado CORS.
- 🔄 Si cambias las variables de entorno, reinicia el servidor correspondiente.
- 🚀 Para producción, considera construir el frontend (`npm run build`) y servir los archivos estáticos con un servidor web.

---

🎉 ¡Listo! Ahora puedes desarrollar y probar tu aplicación fullstack Flask + React.

---

<p align="center" style="font-size:1.2em;">
  <b>✨ Hecho con ❤️ por Fede</b> <br/>
  <sub>Con una mención especial a <b>[David Cunha](https://www.youtube.com/telodigoencodigo)</b> 🙌</sub>
</p>
