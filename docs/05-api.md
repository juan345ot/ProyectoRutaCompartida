# API REST

Base URL local: `http://localhost:5000/api`  
Producción: valor de `NEXT_PUBLIC_API_URL` en Vercel (termina en `/api`).

## Salud

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/status` | No | `{ status: 'OK' }` |

## Auth (`/api/auth`)

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/register` | `name, email, password, phone` | `{ token, user }` |
| POST | `/login` | `email, password` | `{ token, user }` |
| POST | `/google` | token Google | `{ token, user }` |
| GET | `/me` | Bearer | Perfil actual |

## Posts (`/api/posts`)

| Método | Ruta | Auth | Notas |
|--------|------|------|-------|
| GET | `/` | No | Query: `origin`, `destination`, `category`, `type`, `date` |
| GET | `/:id` | Opcional | Contacto sanitizado si no aprobado |
| POST | `/` | Sí | Crear publicación |
| PATCH | `/:id` | Sí | Editar (autor) |
| DELETE | `/:id` | Sí | Eliminar (autor) |
| POST | `/:id/interest` | Sí | Legacy — interés simple |
| PATCH | `/:id/interest/:userId` | Sí | Legacy — aprobar/rechazar |
| PATCH | `/:id/complete` | Sí | Marcar completado |

## Bookings (`/api/bookings`) — flujo principal

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/` | `post, type, seatsRequested?, weightRequested?, message?` | Me interesa |
| GET | `/my-requests` | — | Mis solicitudes enviadas |
| GET | `/my-offers` | — | Solicitudes a mis publicaciones |
| PUT/PATCH | `/:id` | `{ status: 'approved' \| 'rejected' }` | Respuesta del conductor |

## Users (`/api/users`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/me/posts` | Mis publicaciones |
| GET | `/me/history` | `{ offered, joined, all }` completados |
| GET | `/me/trip-requests` | Pendientes en mis posts |
| PUT | `/me` | Actualizar perfil |
| GET | `/admin/stats` | Estadísticas (admin) |

## Vehicles, Reviews, Reports, Notifications

Ver controladores en `backend/routes/` — mismos prefijos que en [04-backend.md](04-backend.md).

## Códigos de error habituales

| Código | Significado |
|--------|-------------|
| 400 | Validación o regla de negocio |
| 401 | Token ausente/inválido |
| 403 | Sin permiso (ej. ofrecer sin foto de perfil) |
| 404 | Recurso no encontrado |
| 429 | Rate limit |

## Ejemplo: crear solicitud

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "post": "674abc123...",
  "type": "passenger",
  "seatsRequested": 1,
  "message": "¿Hay lugar?"
}
```
