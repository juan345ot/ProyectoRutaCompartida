/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
