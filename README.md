Tablero de GitHub Projects: [Ping - Proyecto Integrador](https://github.com/orgs/UCSE-Programacion-2/projects/30)

# [Nombre del Proyecto / Equipo] - Programación II 2026

## 👥 Integrantes
* **Sadir, Martín** - [GitHub Profile](https://github.com/martinSadir21)
* **Aguirre, Matías** - [GitHub Profile](https://github.com/Matias1099)
* **Campos, Matias** - [GitHub Profile](https://github.com/mat1asz)

## 🏢 Cliente Real Elegido
* **Nombre:** TECNO X
* **Rubro:** TECNOLOGÍA
* **Redes sociales:** [Instagram](https://www.instagram.com/tecno_x?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==) [Facebook](https://www.facebook.com/share/1AwqrLMqFf/)
* **Justificación:** Elegimos *Tecno X* porque es un comercio real de Jujuy, con local físico y actividad en redes sociales. Vende productos tecnológicos variados como celulares, parlantes, auriculares, fundas, accesorios, etc. El catálogo es apto para un CRUD porque cada producto puede cargarse con nombre, categoría, marca, precio, stock, descripción e imagen. Además, se pueden administrar altas, consultas, modificaciones y bajas de productos.

## 📝 Reglas de Contribución
* Uso de Git Flow.
* PRs requieren 2 aprobaciones.
* No se acepta código sin Issue asociada.
* Guía para alumnos (commits y protecciones de PR): [docs/como-ejecutar.md](docs/como-ejecutar.md) (sección "Guía para alumnos: commits y PRs").

## 📹 Sprint Review (todos los sprints)
* Guía unificada: [docs/sprint-review/README.md](docs/sprint-review/README.md)
* Plantilla para equipos: [docs/sprint-review/sprint-review-template.md](docs/sprint-review/sprint-review-template.md)
* Rúbrica de evaluación: [docs/sprint-review/sprint-review-rubrica.md](docs/sprint-review/sprint-review-rubrica.md)
* Checklist estudiantes: [docs/sprint-review/sprint-review-checklist-estudiantes.md](docs/sprint-review/sprint-review-checklist-estudiantes.md)
* Checklist docentes: [docs/sprint-review/sprint-review-checklist-docentes.md](docs/sprint-review/sprint-review-checklist-docentes.md)

## 🚀 Deploy y evidencias (Sprint 4)
* **URL de Producción Frontend:** *Próximamente*
* **URL de Producción Backend:** *Próximamente*
* **Video de respaldo:** *Link (Loom/Youtube/Drive)*

## 🧰 Stack final
* **Frontend:** React 18 + Vite + React Router DOM + Bootstrap 5 (`frontend/frontend-react`). La versión del Sprint 3 se conserva en `frontend/frontend-vanilla`.
* **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT (`backend`), con roles `user` / `admin`.
* **Deploy:** Frontend en Vercel (o Netlify), backend en Render (`render.yaml`), base de datos en MongoDB Atlas.

## ▶️ Cómo ejecutar en local
1. **Backend:** `cd backend && npm install`, copiar `.env.example` a `.env`, completar `MONGO_URI` y `JWT_SECRET` y ejecutar `npm run seed` (carga productos y el usuario admin definido en `ADMIN_EMAIL`/`ADMIN_PASSWORD`) y luego `npm run dev`.
2. **Frontend:** `cd frontend/frontend-react && npm install`, copiar `.env.example` a `.env` y ejecutar `npm run dev`.

## ☁️ Pasos de deploy
1. **MongoDB Atlas:** crear un cluster gratuito, un usuario de base de datos y permitir acceso de red (`0.0.0.0/0`). Copiar la URI en `MONGO_URI`.
2. **Backend en Render:** nuevo *Blueprint* apuntando a este repo (usa `render.yaml`). Cargar `MONGO_URI` y `CORS_ORIGINS` (URL del frontend, sin barra final). Para crear datos iniciales, ejecutar `npm run seed` en la Shell de Render con `ADMIN_EMAIL` y `ADMIN_PASSWORD` definidos.
3. **Frontend en Vercel:** importar el repo con *Root Directory* `frontend/frontend-react` y variable `VITE_API_URL=https://<backend>.onrender.com/api`.
4. Volver a Render y completar `CORS_ORIGINS` con la URL final de Vercel. Ver [docs/sprint-4/deploy-checklist.md](docs/sprint-4/deploy-checklist.md).
