# Auditoría técnica

Fecha de referencia: mayo 2026. Proyecto en producción en Vercel + Render.

## Resumen ejecutivo

| Área | Antes | Después de auditoría |
|------|-------|----------------------|
| Docs | Sin carpeta `docs/` | 12 documentos en español |
| `/travel/[id]` dev | Error `generateStaticParams` | Ruta `force-dynamic`, sin SSG placeholder |
| Booking vs interest | Desincronizados | Sync en `bookingSync.js` |
| Tests backend | 2 suites | + booking, post corregido (11 tests OK) |
| CORS prod | URL antigua posible | `proyecto-ruta-compartida.vercel.app` incluida |
| Itinerario UI | `patch` vs PUT, `post.bookings` | PUT/PATCH, `my-requests`, `requester` |

## Hallazgos cerrados en Fase 0

1. **Ruta dinámica itinerario** — Eliminado `generateStaticParams`; `dynamic = 'force-dynamic'`.
2. **Doble flujo reservas** — Booking + sincronización a `interestRequests` para historial/reseñas.
3. **Bug cliente** — Estado de solicitud desde API; nombres `requester` en lista del conductor.
4. **CORS** — Origen de producción actual en lista blanca.

## Deuda técnica restante

| Prioridad | Item |
|-----------|------|
| Media | Migrar fotos base64 a object storage |
| Media | CI con `npm test` + lint en PR |
| Baja | Unificar rutas legacy `/posts/:id/interest` cuando no haya tráfico |
| Baja | Chat interno (no existe hoy) |
| Baja | TypeScript (decisión: mantener JS + JSDoc) |

## Métricas tests

- Backend: **11 tests**, 3 suites, todos pasan con MongoMemoryServer.
- Frontend: 1 test componente; ampliar en iteraciones futuras.

## Seguridad

- JWT, Helmet, rate limit: OK
- Secrets en `.env`: OK si no se commitean
- Admin por email hardcodeado en `userController`: revisar para prod

## Archivos tocados (auditoría)

Ver [CHANGELOG.md](../CHANGELOG.md) en raíz del repo.
