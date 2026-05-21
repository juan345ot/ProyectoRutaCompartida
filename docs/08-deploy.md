# Despliegue y operación en producción

## Estado actual (confirmado por el equipo)

| Componente | Servicio | URL / notas |
|------------|----------|-------------|
| Frontend | **Vercel** | https://proyecto-ruta-compartida.vercel.app/ |
| Backend | **Render** | URL en variable `NEXT_PUBLIC_API_URL` |
| Base de datos | **MongoDB Atlas** | Acceso desde Render |

## Arquitectura de tráfico

```
Usuario → Vercel (Next.js)
           ↓ NEXT_PUBLIC_API_URL
         Render (Express)
           ↓ MONGODB_URI
         MongoDB Atlas
```

## Configuración Vercel

- **Root directory:** `web`
- **Build:** `npm run build`
- **Variable:** `NEXT_PUBLIC_API_URL` = `https://<api-render>/api` (con `/api` al final)

## Configuración Render (backend)

- **Root:** `backend`
- **Start:** `npm start`
- **Variables:** `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL=https://proyecto-ruta-compartida.vercel.app`

`FRONTEND_URL` debe coincidir **exactamente** con el origen del navegador (sin barra final inconsistente).

## CORS

En `backend/server.js` están permitidos:

- `http://localhost:3000`
- `process.env.FRONTEND_URL`
- URLs Vercel conocidas del proyecto

Si agregás un dominio custom, actualizá `FRONTEND_URL` o la lista en código y redeployá **solo backend**.

## Checklist: cambio seguro en producción

1. Probar en local (`npm run dev` + `npm run build` en web).
2. Commit pequeño y push a rama o `main`.
3. Esperar deploy Vercel (Preview opcional).
4. Smoke en prod:
   - [ ] Home carga
   - [ ] Login / registro
   - [ ] `/search` lista viajes
   - [ ] `/travel/<id>` abre sin 500
   - [ ] Modo claro/oscuro
5. Si solo cambió API: verificar `GET /api/status` y un flujo autenticado.

## Rollback

- **Vercel:** Deployments → Promover deployment anterior.
- **Render:** Manual Deploy de commit anterior o revert en Git.

## Qué NO hacer sin coordinación

- Cambiar `output: 'export'` en `next.config.mjs` (rompe rutas dinámicas en Vercel).
- Rotar `JWT_SECRET` sin avisar (cierra todas las sesiones).
- Borrar colecciones en Atlas.

## Verificación rápida por terminal

```bash
curl https://<api-render>/api/status
```

Respuesta esperada: `{"status":"OK","message":"API is running"}`
