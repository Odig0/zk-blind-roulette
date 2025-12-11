/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
      '@react-native-async-storage/async-storage': false,
      'porto/internal': false,
    }
    
    // External modules that should not be bundled
    config.externals.push(
      'pino-pretty', 
      'lokijs', 
      'encoding',
      '@gemini-wallet/core',
      'porto',
      'porto/internal',
      '@react-native-async-storage/async-storage'
    )
    
    // Ignore pino and related packages on client side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pino': false,
        'pino-pretty': false,
        'thread-stream': false,
      }
    }
    
    return config
  },
}

export default nextConfig