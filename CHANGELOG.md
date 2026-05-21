# Changelog — Auditoría integral Ruta Compartida

Registro por fases de la profesionalización del proyecto (mayo 2026).  
Producción activa: https://proyecto-ruta-compartida.vercel.app/

---

## Fase 0 — Estabilización local/prod

**Motivo:** Corregir error `/travel/[id]` en dev, alinear reservas con historial/reseñas, no romper Vercel.

| Archivo | Cambio |
|---------|--------|
| `web/src/app/travel/[id]/page.js` | `force-dynamic`; eliminado `generateStaticParams` |
| `web/next.config.mjs` | `turbopack.root` para warning de lockfiles |
| `backend/utils/bookingSync.js` | **Nuevo** — sync Booking → interestRequests |
| `backend/controllers/bookingController.js` | Sync en crear/aprobar/rechazar |
| `backend/controllers/postController.js` | Sync legacy al leer post con booking aprobado |
| `backend/routes/bookingRoutes.js` | PATCH además de PUT |
| `backend/server.js` | CORS: `proyecto-ruta-compartida.vercel.app` |
| `web/.../TravelDetailClient.js` | `my-requests`, PUT, `requester`, campo `type` en POST |

**Impacto:** Itinerario dinámico en build; contacto e historial coherentes con solicitudes reales.

---

## Fase 1 — Documentación

**Motivo:** Onboarding y operación sin leer todo el código.

| Archivo | Cambio |
|---------|--------|
| `README.md` (raíz) | **Nuevo** — inicio rápido y enlaces |
| `docs/*` | **12 documentos** en español (arquitectura, API, deploy, auditoría, etc.) |
| `web/README.md` | Reemplazado template Next por guía del proyecto |
| `backend/.env.example`, `web/.env.example` | Plantillas de variables |

**Impacto:** Sin cambios en runtime de producción.

---

## Fase 2 — JSDoc y limpieza de logs

| Archivo | Cambio |
|---------|--------|
| `web/src/lib/api.js` | Cabecera de módulo |
| `web/src/context/AuthContext.js` | JSDoc; menos `console.error` |
| `backend/server.js`, `bookingController.js`, `postController.js` | Comentarios JSDoc |
| `backend/middleware/authMiddleware.js` | Winston en lugar de `console.error` en prod |

---

## Fase 3 — Tests

| Archivo | Cambio |
|---------|--------|
| `backend/tests/booking.test.js` | **Nuevo** — sync y PATCH |
| `backend/tests/auth.test.js` | **Nuevo** — registro, login, me |
| `backend/tests/post.test.js` | Ajustado payload y perfil |
| `web/src/__tests__/SearchPostCard.test.js` | **Nuevo** |
| `web/src/__tests__/ThemeContext.test.js` | **Nuevo** |

**Métricas:** Backend 15 tests / 4 suites; Frontend 5 tests / 3 suites — todos OK.

---

## Fase 4 — ESLint y gitignore

| Archivo | Cambio |
|---------|--------|
| `.gitignore` | `backend/logs/`, artefactos debug, `web/.next/` |
| `web/src/__tests__/SearchPostCard.test.js` | Mocks con displayName |
| `web/src/app/my-vehicles/page.js`, `publish/page.js` | Comillas escapadas para ESLint |

**Verificación:** `npm run lint` (0 errores), `npm run build` OK, `/travel/[id]` marcada como dinámica (ƒ).

---

## Fase 5 — Operación en producción

Documentado en `docs/08-deploy.md`: arquitectura Vercel → Render → Atlas, checklist post-deploy, rollback. Sin cambios en paneles de hosting.

---

## Fase 6 — Cierre

- Este `CHANGELOG.md`
- `docs/AUDITORIA-TECNICA.md` actualizado con antes/después

---

## Deuda restante (ver `docs/MEJORAS-FUTURAS.md`)

- CI en GitHub Actions
- Storage externo para imágenes
- Chat in-app, pagos
- Deprecar rutas `/posts/:id/interest` cuando no haya uso
