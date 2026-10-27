# Frontend React (Vite) - TECNO X

SPA de la tienda construida con React 18, Vite y React Router DOM. Consume la misma API del backend que `frontend-vanilla` (que se mantiene como referencia del Sprint 3).

## Ejecución

```bash
cd frontend/frontend-react
npm install
cp .env.example .env   # y ajustar VITE_API_URL
npm run dev            # http://localhost:5173
npm run build          # genera dist/
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API (incluye `/api`, sin barra final) | `http://localhost:3000/api` |

Vite incrusta la variable **al compilar**: si la cambiás en Vercel hay que volver a desplegar.

## Estructura

- `src/main.jsx`: punto de entrada, providers globales (`AuthProvider`, `CartProvider`).
- `src/App.jsx`: rutas públicas y protegidas.
- `src/components/`: `Navbar`, `Footer`, `Layout`, `ProductCard`, `CartItem`, `ProtectedRoute`, `ProductFormModal`, etc.
- `src/pages/`: `Home`, `Catalog`, `ProductDetail`, `Login`, `Register`, `Cart`, `Checkout`, `Admin`, `NotFound`.
- `src/context/`: `AuthContext` (sesión y rol) y `CartContext` (carrito global persistido en `localStorage`).
- `src/services/api.js`: cliente HTTP (token JWT, errores).
- `src/hooks/`: `useProducts`, `useAddToCart`.

## Rutas

| Ruta | Acceso |
| --- | --- |
| `/`, `/catalogo`, `/producto/:id`, `/carrito`, `/checkout` | Público |
| `/login`, `/registro` | Público |
| `/admin` | Solo usuarios con rol `admin` (`ProtectedRoute requireAdmin`) |

El rol viene del backend (`user.role` en la respuesta de `POST /api/auth/login`). La protección de la ruta en el front es solo de experiencia de usuario: el backend valida el rol en cada escritura de productos.

## Deploy (Vercel o Netlify)

- Root directory: `frontend/frontend-react`, build `npm run build`, output `dist`.
- Variable: `VITE_API_URL=https://<tu-backend>.onrender.com/api`.
- `vercel.json` y `public/_redirects` ya incluyen el rewrite para que React Router resuelva rutas al recargar.
