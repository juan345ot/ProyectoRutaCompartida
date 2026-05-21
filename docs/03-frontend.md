# Frontend (Next.js)

## App Router

Rutas principales en `web/src/app/`:

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `page.js` | Landing |
| `/search` | `search/page.js` | Búsqueda de viajes |
| `/travel/[id]` | `travel/[id]/` | Itinerario (dinámico, `force-dynamic`) |
| `/publish` | `publish/page.js` | Crear oferta o búsqueda |
| `/profile` | `profile/page.js` | Datos del usuario |
| `/history` | `history/page.js` | Viajes completados + reseñas |
| `/reviews` | `reviews/page.js` | Calificaciones recibidas / emitidas |
| `/my-posts` | `my-posts/page.js` | Publicaciones propias |
| `/my-bookings` | `my-bookings/page.js` | Solicitudes enviadas |
| `/my-vehicles` | `my-vehicles/page.js` | Vehículos |

## Cliente HTTP

`web/src/lib/api.js` — instancia Axios con:

- `baseURL`: `process.env.NEXT_PUBLIC_API_URL`
- Interceptor que adjunta `Authorization: Bearer` desde `localStorage`

## Contextos

| Contexto | Archivo | Rol |
|----------|---------|-----|
| `AuthContext` | `context/AuthContext.js` | Usuario, login, logout, registro |
| `ThemeContext` | `context/ThemeContext.js` | Modo claro/oscuro |

## Componentes destacados

- `components/Navbar.js` — navegación + botón Inicio + campana
- `components/SearchPostCard.js` — tarjeta en búsqueda (enlace a itinerario)
- `components/ThemeWrapper.js` — variables CSS tema
- `components/NotificationBell.js` — alertas

## Itinerario (`TravelDetailClient`)

- Carga post con `GET /api/posts/:id`
- Estado de **mi solicitud** vía `GET /api/bookings/my-requests`
- Conductor gestiona solicitudes con `GET /api/bookings/my-offers`
- Aprobar/rechazar: `PUT /api/bookings/:id`

## Build y deploy

- `web/next.config.mjs`: sin `output: 'export'` (Vercel SSR/estático híbrido).
- `turbopack.root` apunta a carpeta `web/` para evitar warning de lockfiles múltiples.

## Convención de estilos

- Clases utilitarias Tailwind + clases semánticas (`theme-card`, `theme-text`, `primary-button`).
- Detalle en [10-estilos-y-temas.md](10-estilos-y-temas.md).

## Comentarios en código

- JSDoc en funciones exportadas y lógica no obvia.
- No comentar cada línea de JSX con Tailwind.
