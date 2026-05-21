# Mejoras futuras

Roadmap categorizado. **No implementado** salvo que se indique en un issue/PR.

## Producto

| Feature | Estado | Notas |
|---------|--------|-------|
| Chat in-app | No existe | Hoy solo WhatsApp tras aprobación |
| Pagos / Mercado Pago | Planificado | Sin código |
| Validación DNI/selfie | Postergado | Requisito legal futuro |
| App nativa | Capacitor en `mobile/` | Wrapper básico |

## Técnico

| Mejora | Beneficio |
|--------|-----------|
| S3 / Cloudinary para imágenes | Menor peso en Mongo, CDN |
| GitHub Actions CI | Tests + lint en cada PR |
| Elasticsearch / índices geo | Búsqueda por proximidad |
| Repository layer | Solo si el equipo crece |
| TypeScript | Evaluar costo/beneficio; hoy JS + JSDoc |
| PWA offline | Service worker para consultas guardadas |

## UX / SEO

- Metadata Open Graph por viaje
- Mapas: API key documentada por entorno
- Accesibilidad WCAG en formularios

## Operaciones

- Staging Render + Preview Vercel obligatorio antes de prod
- Alertas uptime (Better Uptime, etc.)
- Backups Atlas programados

## Limpieza

- Eliminar `interestedUsers` deprecated cuando datos migrados
- Deprecar endpoints `/posts/:id/interest` tras periodo de gracia
