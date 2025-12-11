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
    
    // Ignore optional wallet dependencies that may not be installed
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return /^(porto|@gemini-wallet\/core)/.test(resource)
        },
      })
    )
    
    return config
  },
}

export default nextConfig