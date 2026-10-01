# Cómo ejecutar el proyecto (Quickstart)

Este documento te guía para correr backend y frontend según lo que se exige por sprint.

## Requisitos

- Tener instalado `Node.js` (versión estable).
- Tener `MongoDB` local o usar `MongoDB Atlas`.

## 1) Configurar Backend

1. Entrar a `backend/`
2. Crear archivo `backend/.env` usando `backend/.env.example`:
   - `PORT` (el frontend espera la API en `http://localhost:3000/api`, ver `frontend/frontend-vanilla/js/api.js`)
   - `MONGO_URI`
   - `JWT_SECRET` (firma los tokens del login)
3. Ejecutar:
```bash
cd backend
npm install
npm run seed   # opcional: carga 10 productos de prueba (borra los existentes)
npm run dev
```

## 2) Frontend Vanilla (HTML/CSS/JS)

En `frontend/frontend-vanilla/` la recomendación es usar:

- `Live Server` (VS Code) para correr `index.html`

Para correr la demo:
1. Abrí la carpeta `frontend/frontend-vanilla` en VS Code
2. Abrí `index.html` con Live Server

## 3) Frontend React (Vite)

En `frontend/frontend-react/`:
```bash
cd frontend/frontend-react
npm install
npm run dev
```

## 4) Integración (Sprint 3/4) - CORS

Si el frontend corre en un puerto distinto al backend:

- El navegador puede bloquear por CORS
- Solución: configurar `cors` en el backend para permitir el origen del frontend

## 5) Configurar Git Hooks (Conventional Commits)

Para que los alumnos usen commits con estándar:
```bash
node scripts/install-git-hooks.mjs
```

Luego, al hacer `git commit`, el hook valida el formato del mensaje.

## 6) Guía para alumnos: commits y PRs

### Commits (Conventional Commits)

El proyecto valida el mensaje de commit con un hook local (`.githooks/commit-msg`).
Si el mensaje no cumple formato, el commit se rechaza.

Formato obligatorio:

```text
type(scope)!: subject
```

- `type`: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`
- `scope`: en minúscula, usando letras, números y guiones (por ejemplo: `api-auth`, `ui-home`)
- `!`: opcional, solo si hay un cambio incompatible (breaking change)
- `subject`: descripción breve en presente

Ejemplos válidos:

- `feat(ui-home): agrega banner principal`
- `fix(api-auth): corrige validacion de token`
- `docs(readme): actualiza instrucciones de instalacion`

Pasos recomendados para commitear:

1. Crear una rama desde `main` (por ejemplo: `feat/login-alumno`)
2. Hacer cambios pequeños y relacionados entre si
3. Ejecutar pruebas/lint del modulo modificado
4. Commit con formato Conventional Commits
5. Push de la rama y apertura de PR

### Protecciones de Pull Request (PR)

Antes de mergear un PR a `main`, se deben cumplir estas reglas:

- Minimo 2 aprobaciones de companeros/docentes
- PR asociado a una Issue del tablero
- No mergear con conflictos sin resolver
- No mergear si hay checks obligatorios fallando (cuando esten configurados)

Recomendaciones para aprobar mas rapido:

- PRs chicos (un objetivo por PR)
- Titulo y descripcion claros (que problema resuelve y como probar)
- Adjuntar evidencia cuando corresponda (capturas/video)

