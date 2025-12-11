/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimización de imágenes para mejor performance en móviles
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  },
  // Compresión para reducir tamaño de transferencia
  compress: true,
  // Optimizaciones experimentales
  experimental: {
    optimizePackageImports: ['@rainbow-me/rainbowkit', 'wagmi', 'lucide-react'],
  },
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding')
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      encoding: false,
    }
    
    // Ignore optional dependencies not needed for web
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(porto|@gemini-wallet\/core|@react-native-async-storage\/async-storage)$/,
      })
    )
    
    return config
  },
}

export default nextConfig