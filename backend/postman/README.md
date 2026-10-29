# Colección de Postman - TecnoX API

Colección para probar todos los endpoints de la API (Sprint 2), con tests automáticos de status code y respuesta.

## Archivos

| Archivo | Para qué |
| --- | --- |
| `TecnoX-API.postman_collection.json` | Los 24 requests, ordenados en 5 carpetas para correrlos en secuencia |
| `TecnoX-Local.postman_environment.json` | `baseUrl` = `http://localhost:3000/api` |
| `TecnoX-Produccion.postman_environment.json` | `baseUrl` = `https://tecnox-api.onrender.com/api` |

## Cómo usarla

1. En Postman: **Import** y arrastrar los tres archivos.
2. Elegir el environment (arriba a la derecha): `TecnoX - Local` o `TecnoX - Producción`.
3. En el environment, completar `adminPassword` en la columna **Current value** con la contraseña del admin del seed (`ADMIN_PASSWORD`). El Current value queda solo en tu Postman y no se exporta: así la clave real nunca llega al repo.
4. Para local: backend corriendo (`npm run dev`) y base cargada (`npm run seed`).
5. Click derecho en la colección → **Run collection** → **Run**. Todos los tests tienen que quedar en verde.

Los requests se encadenan con variables de colección: el login guarda el token, el listado guarda un `productId`, y la creación guarda `createdProductId`, que es el único producto que después se edita y se borra.

> En producción, cada corrida crea un usuario `postman.<timestamp>@tecnox.com` y crea y borra un producto de prueba. Para la demo conviene correrla en local.

## Endpoints

| Método | Ruta | Auth | Respuestas |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | 201 creado · 400 datos inválidos o email repetido |
| POST | `/api/auth/login` | — | 200 `{ token, user }` · 400 faltan datos · 401 credenciales inválidas |
| GET | `/api/products` (`?category=`) | — | 200 array de productos |
| GET | `/api/products/:id` | — | 200 · 400 id inválido · 404 no existe |
| POST | `/api/products` | admin | 201 · 400 faltan datos · 401 sin token · 403 no es admin |
| PUT | `/api/products/:id` | admin | 200 · 400 · 401 · 403 · 404 |
| DELETE | `/api/products/:id` | admin | 200 · 400 · 401 · 403 · 404 |
| GET | `/api/cart` | usuario | 200 carrito con productos (populate) · 401 |
| POST | `/api/cart` | usuario | 200 carrito actualizado · 401 |
| DELETE | `/api/cart/:productId` | usuario | 200 · 401 · 404 sin carrito |

Auth = header `Authorization: Bearer <token>` del login.
