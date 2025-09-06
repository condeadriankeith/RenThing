import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add outputFileTracingRoot to resolve workspace root warning
  outputFileTracingRoot: __dirname,
  // Add experimental features for better module resolution
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-skeleton'
    ]
  }
}

export default nextConfig