# Variables de entorno

**Nunca** subir valores reales a Git. Usar paneles de Render/Vercel o archivos locales ignorados.

## Backend (`backend/.env`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `MONGODB_URI` | Sí | Connection string Atlas |
| `JWT_SECRET` | Sí | Firma de tokens |
| `PORT` | No | Default 5000 |
| `NODE_ENV` | No | `development` \| `production` \| `test` |
| `FRONTEND_URL` | Prod | URL exacta del front para CORS (ej. `https://proyecto-ruta-compartida.vercel.app`) |

## Frontend (`web/.env.local`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | Sí | Base API, ej. `https://tu-api.onrender.com/api` |

Variables `NEXT_PUBLIC_*` se embeben en el build del cliente.

## Tests

`backend/tests/setup.js` define `JWT_SECRET` de prueba. `NODE_ENV=test` desactiva conexión real y cron.

## Local apuntando a producción

Podés usar la API de Render en local:

```
NEXT_PUBLIC_API_URL=https://<tu-servicio>.onrender.com/api
```

Cuidado: modificás datos reales de Atlas. Preferí BD de desarrollo cuando pruebes escrituras.

## Checklist al agregar una variable

1. Documentar aquí el nombre y propósito.
2. Configurar en Render/Vercel sin pegar secretos en issues/chat.
3. Redeploy backend si afecta CORS; rebuild web si es `NEXT_PUBLIC_*`.
