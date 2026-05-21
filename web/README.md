# Web — Ruta Compartida

Frontend Next.js 16 (App Router) + React 19 + Tailwind 4.

## Desarrollo

```bash
npm install
# Crear .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

http://localhost:3000

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción (igual que Vercel) |
| `npm run start` | Servir build |
| `npm run lint` | ESLint |
| `npm test` | Jest + Testing Library |

## Producción

Desplegado en **Vercel**: https://proyecto-ruta-compartida.vercel.app/

Variable requerida en panel Vercel: `NEXT_PUBLIC_API_URL`.

## Documentación

Ver [../docs/03-frontend.md](../docs/03-frontend.md) y [../docs/README.md](../docs/README.md).
