# Documentación — Ruta Compartida

Guía para desarrolladores y operadores del proyecto.

## Índice

| Documento | Contenido |
|-----------|-----------|
| [01-arquitectura.md](01-arquitectura.md) | Capas, diagramas, decisiones |
| [02-flujo-sistema.md](02-flujo-sistema.md) | Auth, publicaciones, reservas, reseñas |
| [03-frontend.md](03-frontend.md) | Next.js App Router, contextos, temas |
| [04-backend.md](04-backend.md) | Express, middlewares, controladores |
| [05-api.md](05-api.md) | Endpoints y ejemplos |
| [06-base-datos.md](06-base-datos.md) | Modelos Mongoose |
| [07-variables-entorno.md](07-variables-entorno.md) | Local vs producción |
| [08-deploy.md](08-deploy.md) | Vercel + Render (estado actual) |
| [09-testing.md](09-testing.md) | Cómo correr y ampliar tests |
| [10-estilos-y-temas.md](10-estilos-y-temas.md) | Modo claro/oscuro |
| [AUDITORIA-TECNICA.md](AUDITORIA-TECNICA.md) | Diagnóstico y deuda técnica |
| [MEJORAS-FUTURAS.md](MEJORAS-FUTURAS.md) | Roadmap |

## Primer día en el proyecto

1. Cloná el repo y leé el [README raíz](../README.md).
2. Configurá `.env` en `backend/` y `.env.local` en `web/` ([07-variables-entorno.md](07-variables-entorno.md)).
3. Corré backend y web en paralelo.
4. Revisá el flujo de negocio en [02-flujo-sistema.md](02-flujo-sistema.md).
5. Antes de tocar producción, leé [08-deploy.md](08-deploy.md).

## Convenciones

- **UI:** textos en español (Argentina).
- **Código:** nombres de variables y rutas API en inglés (`Post`, `Booking`, `/api/posts`).
- **Commits:** mensajes en español, imperativo breve (`fix:`, `docs:`, `test:`).
