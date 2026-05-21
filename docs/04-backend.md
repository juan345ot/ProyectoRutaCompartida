# Backend (Express)

## Punto de entrada

`backend/server.js`:

1. Conecta MongoDB (`config/db.js`)
2. Inicia cron (`utils/cronJobs.js`) — completar viajes vencidos, etc.
3. Monta middlewares globales y rutas `/api/*`
4. Manejo centralizado de errores con Winston

## Rutas montadas

| Prefijo | Archivo |
|---------|---------|
| `/api/auth` | `routes/authRoutes.js` |
| `/api/users` | `routes/userRoutes.js` |
| `/api/posts` | `routes/postRoutes.js` |
| `/api/bookings` | `routes/bookingRoutes.js` |
| `/api/vehicles` | `routes/vehicleRoutes.js` |
| `/api/reviews` | `routes/reviewRoutes.js` |
| `/api/reports` | `routes/reportRoutes.js` |
| `/api/notifications` | `routes/notificationRoutes.js` |

## Middlewares

| Middleware | Uso |
|------------|-----|
| `protect` | JWT obligatorio |
| `optionalAuth` | JWT opcional (detalle de post) |
| `validatePost` | express-validator en crear/editar post |
| `logger` | Winston daily rotate |

## Controladores principales

- **postController** — CRUD posts, interés legacy, completar viaje, sanitización de contacto
- **bookingController** — reservas + sync con `interestRequests`
- **userController** — perfil, historial, solicitudes pendientes
- **reviewController** — reseñas conductor/pasajero
- **vehicleController** — vehículos del usuario
- **notificationController** — bandeja de avisos

## Utilidad de sincronización

`utils/bookingSync.js` — `syncInterestFromBooking(postId, userId, status)` mantiene coherencia entre `Booking` e `interestRequests`.

## Logs

- Carpeta `backend/logs/` — ignorada en git
- En tests (`NODE_ENV=test`) no se conecta cron ni BD real (MongoMemoryServer en `tests/setup.js`)
