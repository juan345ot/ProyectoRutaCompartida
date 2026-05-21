# Testing

## Backend

```bash
cd backend
npm test
```

- Jest + Supertest + `mongodb-memory-server`
- Setup: `tests/setup.js` (limpia colecciones entre tests)

### Suites actuales

| Archivo | Cubre |
|---------|-------|
| `tests/post.test.js` | Listado y creación de posts |
| `tests/booking.test.js` | Booking + sync interestRequests + PATCH |
| `tests/unit/authMiddleware.test.js` | JWT protect |

### Ampliar cobertura (recomendado)

- Auth: login, token expirado
- Vehicles: CRUD
- Reviews: roles y viaje completado
- Reports: creación autenticada

## Frontend

```bash
cd web
npm test
```

- Jest + Testing Library + jsdom
- Ejemplo: `src/__tests__/PostCard.test.js`

### Tests sugeridos

- `AuthContext` con mock de API
- `SearchPostCard` — enlace a `/travel/[id]`
- Toggle de `ThemeContext`

## Checklist manual (pre-deploy)

Documentar resultados en PR o nota de release:

| Área | Caso |
|------|------|
| Auth | Registro, login, logout, sesión expirada |
| Publicar | Oferta con vehículo; búsqueda simple |
| Buscar | Filtros, Ver detalle |
| Itinerario | Me interesa → aprobar → WhatsApp visible |
| Historial | Tabs ofreciste / buscaste |
| Reseñas | Solo viaje completado |
| Responsive | Mobile + desktop |
| Tema | Claro / oscuro |

## CI (futuro)

No hay pipeline GitHub Actions aún. Script sugerido:

```yaml
- run: cd backend && npm test
- run: cd web && npm test && npm run lint
```
