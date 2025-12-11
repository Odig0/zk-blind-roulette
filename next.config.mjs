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
    // Ignore optional wallet dependencies
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(@gemini-wallet\/core|porto)$/,
      })
    )
    return config
  },
}

export default nextConfig