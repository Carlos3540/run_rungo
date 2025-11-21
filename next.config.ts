import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // evita problemas con el optimizador de imágenes
  },
};

export default nextConfig;