/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    // No hay configuración de ESLint instalada en el proyecto; deshabilitar
    // el lint durante `next build` evita que quede esperando una respuesta
    // interactiva (que nunca llega en entornos sin TTY) para instalarlo.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
