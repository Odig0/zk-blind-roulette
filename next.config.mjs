/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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