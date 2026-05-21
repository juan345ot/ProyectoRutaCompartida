# Estilos y temas

## Sistema de diseño

- **Tailwind CSS 4** con PostCSS en `web/`
- Variables CSS para tema claro/oscuro en `globals.css` y `ThemeWrapper`

## Clases semánticas habituales

| Clase | Uso |
|-------|-----|
| `theme-card` | Tarjetas con fondo según tema |
| `theme-text` | Texto principal adaptable |
| `primary-button` | CTA principal (brand) |
| `accent-button` | Acciones secundarias (naranja) |

## ThemeContext

- Persiste preferencia en `localStorage`
- Respeta `prefers-color-scheme` en primera visita
- Toggle desde navbar

## Páginas legales

Texto con mayor contraste en modo oscuro (clases específicas en páginas `terminos-*`, `politica-*`).

## Iconos

`lucide-react` en componentes y páginas.

## Buenas prácticas

- Evitar colores hardcodeados que no respeten tema.
- Probar contraste en ambos modos antes de merge a producción.
