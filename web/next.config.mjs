/**
 * Configuración de Next.js para el frontend en Vercel.
 * - turbopack.root: evita warning por varios package-lock en el monorepo.
 * - images.unoptimized: compatible con despliegue estático/híbrido.
 * - output export: desactivado para rutas dinámicas como /travel/[id].
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Raíz del proyecto web para Turbopack en desarrollo
  turbopack: {
    root: __dirname,
  },
  images: {
    // Sin optimizador de Vercel Image (avatares externos y base64)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  // output: 'export', // Desactivado para Vercel y para que el modo dev no tire el error de "missing param in generateStaticParams"
};

export default nextConfig;
